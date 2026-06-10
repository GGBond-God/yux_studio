const express = require('express');
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');
const { EMAIL_CONFIG, ADMIN_EMAIL } = require('../config/email');

const router = express.Router();
const submissionsPath = path.join(__dirname, '..', 'data', 'submissions.json');

// Prefer env var for SMTP auth code, fall back to config
const transporter = nodemailer.createTransport({
  ...EMAIL_CONFIG,
  auth: {
    user: process.env.EMAIL_USER || EMAIL_CONFIG.auth.user,
    pass: process.env.EMAIL_PASS || EMAIL_CONFIG.auth.pass,
  },
});

function getSubmissions() {
  if (!fs.existsSync(submissionsPath)) return [];
  return JSON.parse(fs.readFileSync(submissionsPath, 'utf-8'));
}

function saveSubmission(submission) {
  const list = getSubmissions();
  list.push(submission);
  fs.writeFileSync(submissionsPath, JSON.stringify(list, null, 2));
}

// POST /api/contact — submit booking form
router.post('/', (req, res) => {
  const { name, wechat, grade, course, message } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ error: '请填写学生姓名' });
  }
  if (!wechat || !wechat.trim()) {
    return res.status(400).json({ error: '请填写微信或手机号' });
  }

  const GRADE_LABELS = {
    'G6-G8': '初中 (G6-G8)',
    'G9': '初三 / G9',
    'G10': '高一 / G10',
    'G11': '高二 / G11',
    'G12': '高三 / G12',
    'other': '其他',
  };

  const COURSE_LABELS = {
    'zhongkao': '中考数学',
    'gaokao': '高考数学',
    'alevel': 'A-Level 数学',
    'ib': 'IB 数学',
    'unsure': '暂未确定，需要建议',
  };

  const submission = {
    id: String(Date.now()),
    name: name.trim(),
    wechat: wechat.trim(),
    grade: grade || '',
    gradeLabel: GRADE_LABELS[grade] || grade,
    course: course || '',
    courseLabel: COURSE_LABELS[course] || course,
    message: (message || '').trim(),
    submittedAt: new Date().toISOString(),
  };

  // Always save locally
  saveSubmission(submission);

  // Try to send email
  const mailOptions = {
    from: `"誉学坊预约系统" <${EMAIL_CONFIG.auth.user}>`,
    to: ADMIN_EMAIL,
    subject: '【誉学坊】新的试听课预约',
    html: `
      <div style="font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif; max-width: 500px; margin: 0 auto; padding: 24px; background: #F5F0E8; border-radius: 12px;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h2 style="color: #0F2440; margin: 0;">📩 新的试听课预约</h2>
          <p style="color: #7B8D9E; font-size: 14px;">${submission.submittedAt}</p>
        </div>
        <table style="width: 100%; border-collapse: collapse; background: #fff; border-radius: 8px; overflow: hidden;">
          <tr><td style="padding: 14px 18px; color: #7B8D9E; font-size: 14px; border-bottom: 1px solid #E8ECF0;">学生姓名</td><td style="padding: 14px 18px; color: #0F2440; font-weight: 600; border-bottom: 1px solid #E8ECF0;">${submission.name}</td></tr>
          <tr><td style="padding: 14px 18px; color: #7B8D9E; font-size: 14px; border-bottom: 1px solid #E8ECF0; background: #F8FAFB;">微信 / 手机</td><td style="padding: 14px 18px; color: #0F2440; font-weight: 600; border-bottom: 1px solid #E8ECF0; background: #F8FAFB;">${submission.wechat}</td></tr>
          <tr><td style="padding: 14px 18px; color: #7B8D9E; font-size: 14px; border-bottom: 1px solid #E8ECF0;">所在年级</td><td style="padding: 14px 18px; color: #0F2440; font-weight: 600; border-bottom: 1px solid #E8ECF0;">${submission.gradeLabel}</td></tr>
          <tr><td style="padding: 14px 18px; color: #7B8D9E; font-size: 14px; border-bottom: 1px solid #E8ECF0; background: #F8FAFB;">意向课程</td><td style="padding: 14px 18px; color: #0F2440; font-weight: 600; border-bottom: 1px solid #E8ECF0; background: #F8FAFB;">${submission.courseLabel}</td></tr>
          ${submission.message ? `<tr><td style="padding: 14px 18px; color: #7B8D9E; font-size: 14px;">备注</td><td style="padding: 14px 18px; color: #0F2440; border-bottom: none;">${submission.message}</td></tr>` : ''}
        </table>
        <div style="margin-top: 20px; padding: 16px; background: rgba(196,162,101,0.1); border-radius: 8px; text-align: center;">
          <p style="margin: 0; color: #0F2440; font-size: 14px;">请在 <strong>24 小时内</strong> 通过微信联系家长，确认试听时间。</p>
        </div>
      </div>
    `,
  };

  transporter.sendMail(mailOptions)
    .then(() => {
      console.log(`📧 预约邮件已发送至 ${ADMIN_EMAIL}`);
    })
    .catch(err => {
      console.warn('⚠️ 邮件发送失败:', err.message, '| 错误码:', err.code);
    });

  // Respond immediately (don't wait for email)
  res.status(201).json({ message: '预约提交成功', id: submission.id });
});

module.exports = router;

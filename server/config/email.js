const nodemailer = require('nodemailer');

// SMTP configuration for 163.com
// 163邮箱需要开启 SMTP 服务并获取授权码（不是登录密码）
// 获取方式：登录 163 邮箱 → 设置 → POP3/SMTP/IMAP → 开启 SMTP 服务 → 获取授权码
const EMAIL_CONFIG = {
  host: 'smtp.163.com',
  port: 465,
  secure: true, // use SSL
  auth: {
    user: process.env.EMAIL_USER || 'frankaso@163.com',
    pass: process.env.EMAIL_PASS || 'TLbUnrVG3sXUz4Jj', // 163邮箱的SMTP授权码
  },
};

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'frankaso@163.com';

function createTransporter() {
  return nodemailer.createTransport(EMAIL_CONFIG);
}

// Verify SMTP connection
async function verifyConnection() {
  try {
    const transporter = nodemailer.createTransport(EMAIL_CONFIG);
    await transporter.verify();
    console.log('✅ SMTP 邮件服务连接成功');
    return true;
  } catch (err) {
    console.warn('⚠️ SMTP 连接失败，邮件功能不可用:', err.message);
    console.warn('请确保已配置正确的邮箱授权码（EMAIL_PASS 环境变量）');
    return false;
  }
}

module.exports = { EMAIL_CONFIG, ADMIN_EMAIL, createTransporter, verifyConnection };

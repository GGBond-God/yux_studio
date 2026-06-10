import { useState } from 'react'
import axios from 'axios'

export default function ContactPage() {
  const [form, setForm] = useState({ name:'', wechat:'', grade:'', course:'', message:'' })
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitErr, setSubmitErr] = useState('')

  const validate = () => {
    const errs = {}
    if (!form.name.trim()) errs.name = '请填写学生姓名'
    if (!form.wechat.trim()) errs.wechat = '请填写微信号或手机号'
    if (!form.grade) errs.grade = '请选择所在年级'
    if (!form.course) errs.course = '请选择意向课程'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitErr('')
    if (!validate()) return
    setSubmitting(true)
    try {
      await axios.post('/api/contact', {
        name: form.name.trim(),
        wechat: form.wechat.trim(),
        grade: form.grade,
        course: form.course,
        message: form.message.trim(),
      })
      setSubmitted(true)
    } catch (err) {
      setSubmitErr(err.response?.data?.error || '提交失败，请稍后重试')
    } finally {
      setSubmitting(false)
    }
  }

  const update = (field) => (e) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }))
    if (errors[field]) setErrors(prev => { const n = {...prev}; delete n[field]; return n })
  }

  return (
    <div>
      <section className="page-header">
        <div className="container"><h1>预约联系</h1><p>预约免费试听课，我将在 24 小时内与你联系</p></div>
      </section>

      <section className="section">
        <div className="container">
          <div className="contact-grid">

            {/* Booking Form */}
            <div>
              <div className="contact-form-card" id="form-container">
                {!submitted ? (
                  <>
                    <h2>预约免费试听课</h2>
                    <p>填写以下信息，我会在 24 小时内与你联系确认试听时间</p>
                    <form onSubmit={handleSubmit} noValidate>
                      <div className="form-group">
                        <label htmlFor="name">学生姓名 <span style={{color:'#D1523E'}}>*</span></label>
                        <input id="name" type="text" placeholder="请输入学生姓名" value={form.name} onChange={update('name')} className={errors.name?'input-error':''} />
                        {errors.name && <div className="form-error">{errors.name}</div>}
                      </div>
                      <div className="form-group">
                        <label htmlFor="wechat">微信 / 手机号 <span style={{color:'#D1523E'}}>*</span></label>
                        <input id="wechat" type="text" placeholder="请输入微信号或手机号码" value={form.wechat} onChange={update('wechat')} className={errors.wechat?'input-error':''} />
                        {errors.wechat && <div className="form-error">{errors.wechat}</div>}
                      </div>
                      <div className="form-group">
                        <label htmlFor="grade">所在年级 <span style={{color:'#D1523E'}}>*</span></label>
                        <select id="grade" value={form.grade} onChange={update('grade')} className={errors.grade?'input-error':''}>
                          <option value="">请选择年级</option>
                          <option value="G6-G8">初中 (G6-G8)</option>
                          <option value="G9">初三 / G9</option>
                          <option value="G10">高一 / G10</option>
                          <option value="G11">高二 / G11</option>
                          <option value="G12">高三 / G12</option>
                          <option value="other">其他</option>
                        </select>
                        {errors.grade && <div className="form-error">{errors.grade}</div>}
                      </div>
                      <div className="form-group">
                        <label htmlFor="course">意向课程 <span style={{color:'#D1523E'}}>*</span></label>
                        <select id="course" value={form.course} onChange={update('course')} className={errors.course?'input-error':''}>
                          <option value="">请选择意向课程</option>
                          <option value="ib">IB 数学</option>
                          <option value="alevel">A-Level 数学</option>
                          <option value="zhongkao">中考数学</option>
                          <option value="gaokao">高考数学</option>
                          <option value="unsure">暂未确定，需要建议</option>
                        </select>
                        {errors.course && <div className="form-error">{errors.course}</div>}
                      </div>
                      <div className="form-group">
                        <label htmlFor="message">备注信息</label>
                        <textarea id="message" rows="4" placeholder="可以简单介绍学生的学习情况、目标或特殊需求（选填）" value={form.message} onChange={update('message')} style={{width:'100%',padding:'12px 16px',fontSize:'0.95rem',color:'var(--color-primary)',background:'var(--color-gray-bg)',border:'1.5px solid var(--color-gray-light)',borderRadius:'var(--radius)',outline:'none',resize:'vertical'}} />
                      </div>
                      {submitErr && (
                        <div style={{marginBottom:16,padding:'10px 16px',background:'#FEF2F2',color:'#D1523E',borderRadius:8,fontSize:'0.9rem'}}>
                          {submitErr}
                        </div>
                      )}
                      <button type="submit" className="btn btn-primary btn-lg" style={{width:'100%'}} disabled={submitting}>
                        {submitting ? '提交中...' : '提交预约申请'}
                      </button>
                    </form>
                  </>
                ) : (
                  <div className="form-success show">
                    <div className="success-icon">✅</div>
                    <h3>预约提交成功！</h3>
                    <p>感谢你的信任，我会在 24 小时内通过微信与你联系，确认试听课的具体时间。请留意微信好友申请。</p>
                  </div>
                )}
              </div>
            </div>

            {/* Contact Info Sidebar */}
            <div>
              <div style={{marginBottom:36}}>
                <h3 style={{marginBottom:16}}>联系方式</h3>
                <div className="contact-methods">
                  <div className="contact-method">
                    <div className="contact-method-icon">💬</div>
                    <div className="contact-method-text">
                      <strong>微信</strong>
                      <span>Math_Frankie</span>
                    </div>
                  </div>
                  <div className="contact-method">
                    <div className="contact-method-icon">📧</div>
                    <div className="contact-method-text">
                      <strong>邮箱</strong>
                      <span>frankaso@163.com</span>
                    </div>
                  </div>
                  <div className="contact-method">
                    <div className="contact-method-icon">📱</div>
                    <div className="contact-method-text">
                      <strong>小红书</strong>
                      <span>ID：94395892252 / 搜索：Frank老师</span>
                    </div>
                  </div>
                </div>
              </div>

              <div style={{marginBottom:36}}>
                <h3 style={{marginBottom:16}}>微信二维码</h3>
                <img src="/images/WeChat.jpg" alt="微信二维码" className="qr-image" />
                <p style={{fontSize:'0.85rem',color:'var(--color-gray)',marginTop:12}}>扫码添加微信，直接沟通</p>
              </div>

            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

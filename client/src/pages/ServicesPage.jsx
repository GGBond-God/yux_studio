import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'

const features = [
  { icon:'✏️', title:'实时同步板书', desc:'师生同屏书写，公式推导、几何作图一目了然，如同面对面教学。' },
  { icon:'📹', title:'高清视频互动', desc:'双向高清视频，确保师生实时交流，捕捉每一个表情与反馈。' },
  { icon:'📚', title:'课堂自动录制', desc:'每节课自动云端录制，支持课后随时回看复习，不错过任何细节。' },
  { icon:'📊', title:'学习数据追踪', desc:'出勤、答题、作业完成情况一目了然，阶段报告反馈学习进度。' },
  { icon:'📁', title:'云端资料管理', desc:'课件、笔记、作业全部云端存储，随时查看，永不丢失。' },
  { icon:'🎯', title:'互动答题工具', desc:'随堂选择题、抢答、计时挑战等互动功能，让数学课不再枯燥。' },
]

const steps = [
  { num:'1', title:'课前准备', items:['发送预习资料与本节目标','学生完成课前自测题','教师根据自测调整授课重点','设备调试与网络检测'] },
  { num:'2', title:'课中互动', items:['知识点精讲 + 板书推导','典型例题同步演练','学生独立解题 + 即时纠错','本节小结与课后任务布置'] },
  { num:'3', title:'课后跟进', items:['作业批改 + 详细评语','微信群随时答疑','阶段测评与学习报告','定期家长沟通反馈'] },
]

const faqs = [
  { q:'试听课收费吗？有什么需要注意的？', a:'试听课完全免费，时长为40分钟。试听课上我会了解学生的基础水平、学习痛点，并展示我的教学风格。试听后我会给出针对性的课程规划建议，没有任何强制报名要求。' },
  { q:'线上课和线下课相比效果如何？', a:'ClassIn 平台的实时板书、互动答题和视频连线功能已经非常成熟。而且省去了通勤时间，学生状态更好。多年教学实践证明，线上课和线下课的提分效果没有显著差异。' },
  { q:'上课频率和时间怎么安排？', a:'根据学生的基础和目标灵活安排。通常建议每周 1-3 次课，每次 60-120分钟。具体排课我们会根据学生的学校课表和空闲时段来协调，时间弹性很大，包括周末和寒暑假。' },
  { q:'中途可以请假或调整课程吗？', a:'当然可以。如需请假请提前 24 小时告知，我们会协调补课时间。课程计划也会根据学生的学习进展动态调整，确保始终匹配当前的学习需求。' },
  { q:'如何收费？有没有课程套餐？', a:'课程按照课时包进行收费，有不同规格的套餐可供选择（20 课时 / 30 课时 / 40+ 课时），课时包越大单课时费用越低。具体价格请在试听课后详询，我会根据学生的年级和课程类型给出明细报价。' },
]

export default function ServicesPage() {
  const [activeFaq, setActiveFaq] = useState(null)

  return (
    <div>
      <section className="page-header">
        <div className="container"><h1>教学服务</h1><p>ClassIn 专业在线教室，还原真实课堂体验</p></div>
      </section>

      {/* Platform Features */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">ClassIn 专业在线教室</h2>
          <p className="section-subtitle">全球领先的在线互动教学平台</p>
          <div className="features-grid">
            {features.map((f,i) => (
              <div key={i} className="feature-card">
                <div className="feature-icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Teaching Flow */}
      <section className="section section-gray">
        <div className="container">
          <h2 className="section-title">上课流程</h2>
          <p className="section-subtitle">标准化教学流程，确保每一节课都扎实有效</p>
          <div className="flow-steps">
            {steps.map((s,i) => (
              <div key={i} className="flow-step">
                <div className="flow-step-num">{s.num}</div>
                <h3>{s.title}</h3>
                <ul>{s.items.map((item,j) => <li key={j}>{item}</li>)}</ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Equipment */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">设备要求</h2>
          <p className="section-subtitle">简单准备，即可开启高效线上学习</p>
          <ul className="checklist">
            <li>一台电脑或平板（推荐 iPad + Apple Pencil 书写体验最佳）</li>
            <li>稳定网络连接（建议带宽 ≥ 10Mbps）</li>
            <li>摄像头与麦克风（笔记本自带即可）</li>
            <li>安静的学习环境</li>
            <li>提前安装 ClassIn 客户端（Windows / Mac / iOS / Android 全平台支持）</li>
          </ul>
        </div>
      </section>

      {/* FAQ */}
      <section className="section section-gray">
        <div className="container">
          <h2 className="section-title">常见问题</h2>
          <p className="section-subtitle">关于线上课程，你可能关心的问题都在这里</p>
          <div className="faq-list">
            {faqs.map((f,i) => (
              <div key={i} className={`faq-item ${activeFaq===i?'active':''}`}>
                <button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>
                  {f.q}<span className="faq-icon">+</span>
                </button>
                <div className="faq-answer"><p>{f.a}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="footer-cta">
        <div className="container">
          <h2>体验一节线上课，感受不一样的数学课堂</h2>
          <p>免费试听课，零成本了解我的教学风格与实力</p>
          <Link to="/contact" className="btn btn-primary btn-lg">预约免费试听</Link>
        </div>
      </section>
    </div>
  )
}

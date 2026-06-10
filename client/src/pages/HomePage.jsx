import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'

function useFadeUp() {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      (entries) => { entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); obs.unobserve(entry.target) } }) },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    )
    el.querySelectorAll('.fade-up').forEach(c => obs.observe(c))
    return () => obs.disconnect()
  }, [])
  return ref
}

export default function HomePage() {
  const ref = useFadeUp()

  return (
    <div ref={ref}>
      {/* Hero */}
      <section className="hero">
        <div className="container">
          <div className="hero-content fade-up">
            <span className="hero-tag">十年一线教学 · 千名学子见证</span>
            <img src="/images/title.png" alt="足不出户 高效提分" className="hero-title-img" />
            <p>专注中考 / 高考 / A-Level / IB 数学的精准辅导</p>
            <p>用专业与经验为每一位学生定制高分路径</p>
            <div className="hero-actions">
              <Link to="/contact" className="btn btn-primary btn-lg">预约免费试听</Link>
              <Link to="/courses" className="btn btn-outline-white btn-lg">了解课程体系</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <div className="stats-bar">
        <div className="container">
          <div className="stats-grid fade-up">
            <div className="stat-item"><span className="stat-number">8+</span><span className="stat-label">年教学经验</span></div>
            <div className="stat-item"><span className="stat-number">900+</span><span className="stat-label">累计授课学生</span></div>
            <div className="stat-item"><span className="stat-number">95%</span><span className="stat-label">学生提分率</span></div>
            <div className="stat-item"><span className="stat-number">300+</span><span className="stat-label">名校录取学员</span></div>
          </div>
        </div>
      </div>

      {/* Course Directions */}
      <section className="section section-gray">
        <div className="container">
          <h2 className="section-title fade-up">四大课程方向</h2>
          <p className="section-subtitle fade-up">覆盖国际课程与国内升学，精准匹配你的学习需求</p>
          <div className="course-cards">
            {[
              { icon:'中', title:'中考数学', desc:'基础巩固 + 压轴突破，直击本地中考命题方向' },
              { icon:'高', title:'高考数学', desc:'全国卷 / 新高考专项，构建完整知识体系与应试技巧' },
              { icon:'AL', title:'A-Level 数学', desc:'Pure Math / Further Math / Statistics 系统强化' },
              { icon:'IB', title:'IB 数学', desc:'AA / AI 全覆盖，7 分冲刺策略' },
            ].map((c,i) => (
              <Link to="/courses" key={i} className="course-card fade-up">
                <div className="course-card-icon">{c.icon}</div>
                <h3>{c.title}</h3>
                <p>{c.desc}</p>
                <span className="btn btn-outline-dark" style={{padding:'8px 20px',fontSize:'0.85rem'}}>了解详情</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Advantages */}
      <section className="section">
        <div className="container">
          <h2 className="section-title fade-up">为什么选择我</h2>
          <p className="section-subtitle fade-up">不只是授课，更是全程陪伴式的学习引导</p>
          <div className="features-grid">
            {[
              { icon:'🎓', title:'顶尖名师', desc:'名校数学专业背景，深谙各课程体系的核心考点与提分策略。' },
              { icon:'💻', title:'ClassIn 互动平台', desc:'实时板书，互动答题，直播回放，超越线下课堂体验，让线上学习更加高效。' },
              { icon:'📋', title:'全程陪伴答疑', desc:'课后作业批改、微信答疑、阶段测评反馈，确保每一个知识点都扎实掌握。' },
            ].map((f,i) => (
              <div key={i} className="feature-card fade-up">
                <div className="feature-icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="footer-cta">
        <div className="container fade-up">
          <h2>准备好开启高分之旅了吗？</h2>
          <p>预约一节免费试听课，感受不一样的数学课堂</p>
          <Link to="/contact" className="btn btn-primary btn-lg">立即预约试听</Link>
        </div>
      </section>
    </div>
  )
}

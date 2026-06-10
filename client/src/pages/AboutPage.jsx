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

export default function AboutPage() {
  const ref = useFadeUp()

  return (
    <div ref={ref}>
      <section className="page-header">
        <div className="container"><h1>关于我</h1><p>了解我的教学背景与理念</p></div>
      </section>

      <section className="section">
        <div className="container">
          <div className="about-intro">
            <img className="about-photo fade-up" src="/images/photo.jpg" alt="个人照片" />
            <div className="about-text fade-up">
              <h2>你好，我是你的数学老师</h2>

              <div className="about-section">
                <h3>🎓 教育背景</h3>
                <ul className="about-list">
                  <li><strong>初中 / 高中：</strong>深圳市高级中学</li>
                  <li><strong>本科：</strong>暨南大学</li>
                  <li><strong>硕士：</strong>香港中文大学</li>
                </ul>
              </div>

              <div className="about-section">
                <h3>📜 个人资质</h3>
                <ul className="about-list">
                  <li>深圳中考数学满分</li>
                  <li>高考数学 135+</li>
                  <li>高考英语 130+</li>
                  <li>GRE 数学满分 &nbsp;|&nbsp; 雅思 7.5 分</li>
                  <li>誉学网创始人</li>
                  <li>高中数学教师资格证 &nbsp;|&nbsp; 高中英语教师资格证</li>
                </ul>
              </div>

              <div className="about-section">
                <h3>🌟 特色服务</h3>
                <ul className="about-list">
                  <li>提供中文 / 双语 / 全英教学</li>
                  <li>提供上课内容全程回放</li>
                  <li>提供誉学网终生会员（可下载考试真题秘卷）</li>
                  <li>提供高漫数位板 / iPad 电容笔</li>
                  <li>为孩子和家长提供心理疏导和教育指导</li>
                  <li>为孩子提供课后答疑</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-gray">
        <div className="container">
          <h2 className="section-title fade-up">教学理念</h2>
          <p className="section-subtitle fade-up">我始终相信，每一位学生都有学好数学的潜力</p>
          <div className="philosophy-quote fade-up">
            <blockquote>
              数学不是天赋的筛选器，而是思维的训练场。好的数学教育，不是教会学生解多少道题，而是帮助他们在面对陌生问题时，有勇气、有方法、有逻辑地去思考。
            </blockquote>
            <cite>—— 这是我每一天站上讲台时，提醒自己的第一句话</cite>
          </div>
        </div>
      </section>

      <section className="footer-cta">
        <div className="container fade-up">
          <h2>让专业的老师，为你打开数学的大门</h2>
          <p>预约一节免费试听课，亲身感受教学风格与实力</p>
          <Link to="/contact" className="btn btn-primary btn-lg">预约免费试听</Link>
        </div>
      </section>
    </div>
  )
}

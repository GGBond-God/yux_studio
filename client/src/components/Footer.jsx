import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <h3>誉学坊 Yux Academy</h3>
            <p>专业数学辅导<br/>让每一个孩子都能爱上数学、学好数学</p>
          </div>
          <div className="footer-links">
            <h4>快速导航</h4>
            <ul>
              <li><Link to="/about">关于我</Link></li>
              <li><Link to="/courses">课程体系</Link></li>
              <li><Link to="/services">教学服务</Link></li>
            </ul>
          </div>
          <div className="footer-links">
            <h4>更多</h4>
            <ul>
              <li><Link to="/resources">学习资料</Link></li>
              <li><Link to="/contact">预约联系</Link></li>
              <li><Link to="/contact">小红书</Link></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          &copy; {new Date().getFullYear()} 誉学坊 Yux Academy. All rights reserved.
        </div>
      </div>
    </footer>
  )
}

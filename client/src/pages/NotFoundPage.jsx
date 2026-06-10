import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="not-found">
      <div className="nf-code">404</div>
      <h2>页面不存在</h2>
      <p>你访问的页面可能已被移除或地址有误</p>
      <Link to="/" className="btn btn-primary">返回首页</Link>
    </div>
  )
}

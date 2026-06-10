import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { isLoggedIn, isAdmin, user, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    setMenuOpen(false)
    navigate('/')
  }

  const closeMenu = () => setMenuOpen(false)

  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="nav-brand" onClick={closeMenu}>
          <div className="brand-zh">誉学坊</div>
          <div className="brand-en">Yux Academy</div>
        </Link>

        <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
          <NavLink to="/" end onClick={closeMenu}>首页</NavLink>
          <NavLink to="/about" onClick={closeMenu}>关于我</NavLink>
          <NavLink to="/courses" onClick={closeMenu}>课程体系</NavLink>
          <NavLink to="/services" onClick={closeMenu}>教学服务</NavLink>
          <NavLink to="/resources" onClick={closeMenu}>学习资料</NavLink>
          <NavLink to="/contact" onClick={closeMenu}>预约联系</NavLink>

          {isAdmin && (
            <NavLink to="/admin" onClick={closeMenu} style={{color:'var(--color-gold)'}}>管理</NavLink>
          )}

          {isLoggedIn ? (
            <>
              <span className="nav-user">{user?.displayName || user?.username}</span>
              <button className="btn btn-outline-dark btn-sm" onClick={handleLogout}>退出</button>
            </>
          ) : (
            <Link to="/login" onClick={closeMenu} className="nav-login-btn">
              <button className="btn btn-primary btn-sm">登录</button>
            </Link>
          )}
        </div>

        <button
          className={`nav-toggle ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="菜单"
        >
          <span /><span /><span />
        </button>
      </div>
    </nav>
  )
}

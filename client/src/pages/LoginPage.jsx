import { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const { isLoggedIn, login } = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})
  const [globalError, setGlobalError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()

  if (isLoggedIn) {
    return <Navigate to="/resources" replace />
  }

  const validate = () => {
    const errs = {}
    if (!username.trim()) errs.username = '请输入账号'
    if (!password.trim()) errs.password = '请输入密码'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setGlobalError('')
    if (!validate()) return
    setSubmitting(true)
    try {
      await login(username.trim(), password)
      navigate('/resources')
    } catch (err) {
      setGlobalError(err.response?.data?.error || '登录失败，请重试')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <section className="page-header">
        <div className="container"><h1>登录</h1><p>登录后即可下载全部数学资料</p></div>
      </section>

      <section className="section">
        <div className="container">
          <div className="login-container">
            <div className="login-card">
              <h2>欢迎来到誉学坊</h2>
              <p className="login-sub">请输入账号密码登录</p>

              {globalError && <div className="form-error-global">{globalError}</div>}

              <form className="login-form" onSubmit={handleSubmit} noValidate>
                <div className="form-group">
                  <label htmlFor="username">账号</label>
                  <input id="username" type="text" placeholder="请输入账号" value={username}
                    onChange={e => { setUsername(e.target.value); setErrors({}) }}
                    className={errors.username ? 'input-error' : ''} autoFocus />
                  {errors.username && <div className="form-error">{errors.username}</div>}
                </div>
                <div className="form-group">
                  <label htmlFor="password">密码</label>
                  <input id="password" type="password" placeholder="请输入密码" value={password}
                    onChange={e => { setPassword(e.target.value); setErrors({}) }}
                    className={errors.password ? 'input-error' : ''} />
                  {errors.password && <div className="form-error">{errors.password}</div>}
                </div>
                <button type="submit" className="btn btn-primary btn-lg" disabled={submitting}>
                  {submitting ? '登录中...' : '登录'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import FileList from '../components/FileList'
import { useAuth } from '../context/AuthContext'

const CATEGORIES = [
  { key: 'zhongkao', label: '中考数学' },
  { key: 'gaokao', label: '高考数学' },
  { key: 'alevel', label: 'A-Level 数学' },
  { key: 'ib', label: 'IB 数学' },
]

const SUB_CATEGORIES = {
  zhongkao: [
    { key: '', label: '全部' },
    { key: 'chuyi', label: '初一' },
    { key: 'chuer', label: '初二' },
    { key: 'chusan', label: '初三' },
  ],
  gaokao: [
    { key: '', label: '全部' },
    { key: 'gaoyi', label: '高一' },
    { key: 'gaoer', label: '高二' },
    { key: 'gaosan', label: '高三' },
  ],
}

export default function ResourcesPage() {
  const [files, setFiles] = useState([])
  const [category, setCategory] = useState('zhongkao')
  const [subCategory, setSubCategory] = useState('')
  const [loading, setLoading] = useState(true)
  const { isLoggedIn } = useAuth()

  // Reset sub-category when parent category changes
  useEffect(() => {
    setSubCategory('')
  }, [category])

  useEffect(() => {
    setLoading(true)
    const params = { category }
    if (subCategory) {
      params.subCategory = subCategory
    }
    axios.get('/api/files', { params })
      .then(res => setFiles(res.data))
      .catch(() => setFiles([]))
      .finally(() => setLoading(false))
  }, [category, subCategory])

  return (
    <div>
      <section className="page-header">
        <div className="container">
          <h1>学习资料</h1>
          <p>中考 / 高考 / A-Level / IB 数学资料下载</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="category-tabs">
            {CATEGORIES.map(cat => (
              <button
                key={cat.key}
                className={`cat-tab ${category === cat.key ? 'active' : ''}`}
                onClick={() => setCategory(cat.key)}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {SUB_CATEGORIES[category] && (
            <div className="sub-category-tabs">
              {SUB_CATEGORIES[category].map(sub => (
                <button
                  key={sub.key || 'all'}
                  className={`sub-tab ${subCategory === sub.key ? 'active' : ''}`}
                  onClick={() => setSubCategory(sub.key)}
                >
                  {sub.label}
                </button>
              ))}
            </div>
          )}

          {!isLoggedIn && (
            <div className="auth-banner">
              <span style={{color:'var(--color-gray)'}}>🔒 登录后即可下载全部资料 </span>
              <Link to="/login" className="btn btn-primary btn-sm" style={{marginLeft:12}}>立即登录</Link>
            </div>
          )}

          {loading ? (
            <div className="loading">加载中...</div>
          ) : (
            <FileList files={files} />
          )}
        </div>
      </section>

      {!isLoggedIn && (
        <section className="footer-cta">
          <div className="container">
            <h2>海量数学备考资料，登录即可下载</h2>
            <p>涵盖 IB / A-Level / 中考 / 高考的真题、讲义、公式手册</p>
            <Link to="/login" className="btn btn-primary btn-lg">登录获取资料</Link>
          </div>
        </section>
      )}
    </div>
  )
}

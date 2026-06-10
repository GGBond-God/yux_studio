import { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
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
    { key: '', label: '无（不区分年级）' },
    { key: 'chuyi', label: '初一' },
    { key: 'chuer', label: '初二' },
    { key: 'chusan', label: '初三' },
  ],
  gaokao: [
    { key: '', label: '无（不区分年级）' },
    { key: 'gaoyi', label: '高一' },
    { key: 'gaoer', label: '高二' },
    { key: 'gaosan', label: '高三' },
  ],
}

function UserManager() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingUser, setEditingUser] = useState(null)
  const [editForm, setEditForm] = useState({ displayName: '', password: '', permissions: [] })
  const [saving, setSaving] = useState(false)
  const [showCreate, setShowCreate] = useState(false)
  const [createForm, setCreateForm] = useState({ username: '', password: '', displayName: '', permissions: [] })
  const [creating, setCreating] = useState(false)
  const [createErrors, setCreateErrors] = useState({})
  const [createMsg, setCreateMsg] = useState('')

  const fetchUsers = () => {
    axios.get('/api/users')
      .then(res => setUsers(res.data))
      .catch(() => setUsers([]))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchUsers() }, [])

  const togglePermission = (setForm, permKey) => {
    setForm(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permKey)
        ? prev.permissions.filter(p => p !== permKey)
        : [...prev.permissions, permKey]
    }))
  }

  const startEdit = (user) => {
    setEditingUser(user.username)
    setEditForm({
      displayName: user.displayName || '',
      password: '',
      permissions: [...(user.permissions || [])],
    })
  }

  const cancelEdit = () => {
    setEditingUser(null)
    setEditForm({ displayName: '', password: '', permissions: [] })
  }

  const saveEdit = async (username) => {
    setSaving(true)
    try {
      const body = {
        displayName: editForm.displayName.trim(),
        permissions: editForm.permissions,
      }
      if (editForm.password.trim()) {
        body.password = editForm.password.trim()
      }
      await axios.put(`/api/users/${username}`, body)
      cancelEdit()
      fetchUsers()
    } catch (err) {
      alert('保存失败：' + (err.response?.data?.error || err.message))
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (username) => {
    if (!window.confirm(`确定要删除用户「${username}」吗？此操作不可恢复。`)) return
    try {
      await axios.delete(`/api/users/${username}`)
      setUsers(prev => prev.filter(u => u.username !== username))
    } catch (err) {
      alert('删除失败：' + (err.response?.data?.error || err.message))
    }
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    setCreateMsg('')
    const errs = {}
    if (!createForm.username.trim()) errs.username = '请输入用户名'
    if (!createForm.password.trim()) errs.password = '请输入密码'
    setCreateErrors(errs)
    if (Object.keys(errs).length > 0) return

    setCreating(true)
    try {
      await axios.post('/api/users', {
        username: createForm.username.trim(),
        password: createForm.password.trim(),
        displayName: createForm.displayName.trim() || createForm.username.trim(),
        permissions: createForm.permissions,
      })
      setCreateMsg('✅ 用户创建成功！')
      setCreateForm({ username: '', password: '', displayName: '', permissions: [] })
      setShowCreate(false)
      fetchUsers()
    } catch (err) {
      setCreateMsg('❌ ' + (err.response?.data?.error || '创建失败'))
    } finally {
      setCreating(false)
    }
  }

  const CAT_LABELS = { zhongkao: '中考', gaokao: '高考', alevel: 'A-Level', ib: 'IB' }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h3 style={{ margin: 0 }}>👥 用户管理（{users.length}）</h3>
        <button className="btn btn-primary btn-sm" onClick={() => setShowCreate(!showCreate)}>
          {showCreate ? '收起' : '＋ 新建用户'}
        </button>
      </div>

      {/* Create user form */}
      {showCreate && (
        <div className="upload-card" style={{ marginBottom: 24 }}>
          <h3>新建用户</h3>
          <form onSubmit={handleCreate} noValidate>
            <div className="form-group">
              <label>用户名 *</label>
              <input type="text" placeholder="例如：zhangsan" value={createForm.username}
                onChange={e => { setCreateForm(prev => ({ ...prev, username: e.target.value })); setCreateErrors({}) }}
                className={createErrors.username ? 'input-error' : ''} />
              {createErrors.username && <div className="form-error">{createErrors.username}</div>}
            </div>
            <div className="form-group">
              <label>密码 *</label>
              <input type="text" placeholder="初始密码" value={createForm.password}
                onChange={e => { setCreateForm(prev => ({ ...prev, password: e.target.value })); setCreateErrors({}) }}
                className={createErrors.password ? 'input-error' : ''} />
              {createErrors.password && <div className="form-error">{createErrors.password}</div>}
            </div>
            <div className="form-group">
              <label>显示名称</label>
              <input type="text" placeholder="例如：张三同学" value={createForm.displayName}
                onChange={e => setCreateForm(prev => ({ ...prev, displayName: e.target.value }))} />
            </div>
            <div className="form-group">
              <label>下载权限</label>
              <div className="perm-checkboxes">
                {CATEGORIES.map(cat => (
                  <label key={cat.key} className="perm-checkbox">
                    <input type="checkbox" checked={createForm.permissions.includes(cat.key)}
                      onChange={() => togglePermission(setCreateForm, cat.key)} />
                    {cat.label}
                  </label>
                ))}
              </div>
            </div>
            <button type="submit" className="btn btn-primary" disabled={creating}>
              {creating ? '创建中...' : '创建用户'}
            </button>
            {createMsg && (
              <div className="upload-success" style={createMsg.startsWith('❌') ? { color: 'var(--color-red)', background: 'var(--color-red-light)' } : {}}>
                {createMsg}
              </div>
            )}
          </form>
        </div>
      )}

      {/* User list */}
      {loading ? (
        <div className="loading">加载中...</div>
      ) : users.length === 0 ? (
        <div className="empty-state"><div className="empty-icon">👤</div><h3>暂无用户</h3></div>
      ) : (
        <div className="user-list">
          {users.map(u => (
            <div key={u.username} className={`user-card ${editingUser === u.username ? 'editing' : ''}`}>
              <div className="user-card-main">
                <div className="user-card-info">
                  <div className="user-card-name">
                    <strong>{u.displayName || u.username}</strong>
                    {u.role === 'admin' && <span className="user-role-tag admin">管理员</span>}
                    <span className="user-id">@{u.username}</span>
                  </div>
                  <div className="user-perms">
                    {CATEGORIES.map(cat => (
                      <span key={cat.key}
                        className={`perm-tag ${(u.permissions || []).includes(cat.key) ? 'active' : ''}`}>
                        {CAT_LABELS[cat.key]}
                      </span>
                    ))}
                  </div>
                </div>
                {u.role !== 'admin' && (
                  <div className="user-card-actions">
                    <button className="btn btn-outline-dark btn-sm" onClick={() => startEdit(u)}>编辑</button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(u.username)}>删除</button>
                  </div>
                )}
              </div>

              {/* Inline edit panel */}
              {editingUser === u.username && (
                <div className="user-edit-panel">
                  <div className="form-group">
                    <label>显示名称</label>
                    <input type="text" value={editForm.displayName}
                      onChange={e => setEditForm(prev => ({ ...prev, displayName: e.target.value }))} />
                  </div>
                  <div className="form-group">
                    <label>新密码（留空则不修改）</label>
                    <input type="text" value={editForm.password} placeholder="输入新密码"
                      onChange={e => setEditForm(prev => ({ ...prev, password: e.target.value }))} />
                  </div>
                  <div className="form-group">
                    <label>下载权限</label>
                    <div className="perm-checkboxes">
                      {CATEGORIES.map(cat => (
                        <label key={cat.key} className="perm-checkbox">
                          <input type="checkbox" checked={editForm.permissions.includes(cat.key)}
                            onChange={() => togglePermission(setEditForm, cat.key)} />
                          {cat.label}
                        </label>
                      ))}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="btn btn-primary btn-sm" onClick={() => saveEdit(u.username)} disabled={saving}>
                      {saving ? '保存中...' : '保存'}
                    </button>
                    <button className="btn btn-outline-dark btn-sm" onClick={cancelEdit}>取消</button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function AdminPage() {
  const { isLoggedIn, isAdmin, loading: authLoading } = useAuth()
  const [tab, setTab] = useState('files')
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [displayName, setDisplayName] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('zhongkao')
  const [subCategory, setSubCategory] = useState('')
  const [selectedFile, setSelectedFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [uploadMsg, setUploadMsg] = useState('')
  const [errors, setErrors] = useState({})

  const fetchFiles = () => {
    axios.get('/api/files')
      .then(res => setFiles(res.data))
      .catch(() => setFiles([]))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchFiles() }, [])

  if (authLoading) return null
  if (!isLoggedIn || !isAdmin) {
    return <Navigate to="/login" replace />
  }

  const validate = () => {
    const errs = {}
    if (!displayName.trim()) errs.displayName = '请填写文件名称'
    if (!selectedFile) errs.file = '请选择要上传的文件'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleUpload = async (e) => {
    e.preventDefault()
    setUploadMsg('')
    if (!validate()) return

    const formData = new FormData()
    formData.append('file', selectedFile)
    formData.append('displayName', displayName.trim())
    formData.append('description', description.trim())
    formData.append('category', category)
    formData.append('subCategory', subCategory)

    setUploading(true)
    try {
      await axios.post('/api/files/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      setUploadMsg('✅ 文件上传成功！')
      setDisplayName('')
      setDescription('')
      setSelectedFile(null)
      const fileInput = document.getElementById('file-input')
      if (fileInput) fileInput.value = ''
      fetchFiles()
    } catch (err) {
      setUploadMsg('❌ ' + (err.response?.data?.error || '上传失败'))
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (fileId) => {
    try {
      await axios.delete(`/api/files/${fileId}`)
      setFiles(prev => prev.filter(f => f.id !== fileId))
    } catch (err) {
      alert('删除失败：' + (err.response?.data?.error || err.message))
    }
  }

  return (
    <div>
      <section className="page-header">
        <div className="container"><h1>管理后台</h1><p>管理学习资料与用户账号</p></div>
      </section>

      <section className="section">
        <div className="container">
          {/* Tabs */}
          <div className="admin-tabs">
            <button className={`admin-tab ${tab === 'files' ? 'active' : ''}`} onClick={() => setTab('files')}>
              📂 文件管理
            </button>
            <button className={`admin-tab ${tab === 'users' ? 'active' : ''}`} onClick={() => setTab('users')}>
              👥 用户管理
            </button>
          </div>

          {tab === 'files' ? (
            <div className="admin-grid" style={{ marginTop: 32 }}>
              {/* Upload form */}
              <div>
                <div className="upload-card">
                  <h3>📤 上传新文件</h3>
                  <form onSubmit={handleUpload} noValidate>
                    <div className="form-group">
                      <label htmlFor="displayName">文件名称 *</label>
                      <input id="displayName" type="text" placeholder="例如：IB Math AA HL 历年真题精选"
                        value={displayName} onChange={e => { setDisplayName(e.target.value); setErrors({}) }}
                        className={errors.displayName ? 'input-error' : ''} />
                      {errors.displayName && <div className="form-error">{errors.displayName}</div>}
                    </div>
                    <div className="form-group">
                      <label htmlFor="desc">文件简介</label>
                      <input id="desc" type="text" placeholder="简要描述文件内容（选填）"
                        value={description} onChange={e => setDescription(e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label htmlFor="cat">分类 *</label>
                      <select id="cat" value={category} onChange={e => { setCategory(e.target.value); setSubCategory(''); }}>
                        {CATEGORIES.map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
                      </select>
                    </div>

                    {SUB_CATEGORIES[category] && (
                      <div className="form-group">
                        <label htmlFor="subCat">年级（可选）</label>
                        <select id="subCat" value={subCategory} onChange={e => setSubCategory(e.target.value)}>
                          {SUB_CATEGORIES[category].map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
                        </select>
                      </div>
                    )}

                    <div className="form-group">
                      <label>选择文件 *</label>
                      <div className="file-input-wrap">
                        <input id="file-input" type="file"
                          accept=".pdf,.doc,.docx,.ppt,.pptx,.xlsx,.xls,.zip,.rar,.txt,.jpg,.png"
                          onChange={e => { setSelectedFile(e.target.files[0]); setErrors({}) }} />
                        <div className="file-input-label">
                          📁 {selectedFile ? selectedFile.name : '点击选择文件（最大 50MB）'}
                        </div>
                      </div>
                      {selectedFile && (
                        <div className="file-selected">
                          已选择：{selectedFile.name}（{(selectedFile.size / 1024 / 1024).toFixed(1)} MB）
                        </div>
                      )}
                      {errors.file && <div className="form-error">{errors.file}</div>}
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={uploading}>
                      {uploading ? '上传中...' : '上传文件'}
                    </button>
                    {uploadMsg && (
                      <div className="upload-success" style={uploadMsg.startsWith('❌') ? { color: 'var(--color-red)', background: 'var(--color-red-light)' } : {}}>
                        {uploadMsg}
                      </div>
                    )}
                  </form>
                </div>
              </div>

              {/* File list */}
              <div>
                <h3 style={{ marginBottom: 20 }}>📋 已有文件（{files.length}）</h3>
                {loading ? (
                  <div className="loading">加载中...</div>
                ) : (
                  <FileList files={files} isAdmin onDelete={handleDelete} onRename={fetchFiles} />
                )}
              </div>
            </div>
          ) : (
            <div style={{ marginTop: 32 }}>
              <UserManager />
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

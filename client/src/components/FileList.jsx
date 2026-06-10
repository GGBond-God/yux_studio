import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'

const CATEGORY_LABELS = {
  ib: 'IB 数学',
  alevel: 'A-Level 数学',
  zhongkao: '中考数学',
  gaokao: '高考数学',
}

const SUB_CATEGORY_LABELS = {
  chuyi: '初一',
  chuer: '初二',
  chusan: '初三',
  gaoyi: '高一',
  gaoer: '高二',
  gaosan: '高三',
}

const GRADE_OPTIONS = {
  zhongkao: [
    { key: '', label: '不区分年级' },
    { key: 'chuyi', label: '初一' },
    { key: 'chuer', label: '初二' },
    { key: 'chusan', label: '初三' },
  ],
  gaokao: [
    { key: '', label: '不区分年级' },
    { key: 'gaoyi', label: '高一' },
    { key: 'gaoer', label: '高二' },
    { key: 'gaosan', label: '高三' },
  ],
}

function formatSize(bytes) {
  if (!bytes) return ''
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}


export default function FileList({ files, isAdmin = false, onDelete, onRename }) {
  const { isLoggedIn, canDownload } = useAuth()
  const [renamingId, setRenamingId] = useState(null)
  const [renameName, setRenameName] = useState('')
  const [renameDesc, setRenameDesc] = useState('')
  const [renameSubCategory, setRenameSubCategory] = useState('')
  const [saving, setSaving] = useState(false)

  const startRename = (file) => {
    setRenamingId(file.id)
    setRenameName(file.displayName)
    setRenameDesc(file.description || '')
    setRenameSubCategory(file.subCategory || '')
  }

  const cancelRename = () => {
    setRenamingId(null)
    setRenameName('')
    setRenameDesc('')
    setRenameSubCategory('')
  }

  const submitRename = async (fileId) => {
    if (!renameName.trim()) {
      alert('文件名称不能为空')
      return
    }
    setSaving(true)
    try {
      await axios.put(`/api/files/${fileId}`, {
        displayName: renameName.trim(),
        description: renameDesc.trim(),
        subCategory: renameSubCategory,
      })
      cancelRename()
      if (onRename) onRename()
    } catch (err) {
      alert('重命名失败：' + (err.response?.data?.error || err.message))
    } finally {
      setSaving(false)
    }
  }

  const handleDownload = async (file) => {
    try {
      const token = localStorage.getItem('token')
      const res = await axios.get(`/api/files/${file.id}/download`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob',
      })

      const url = window.URL.createObjectURL(new Blob([res.data]))
      const link = document.createElement('a')
      link.href = url

      // Extract filename from Content-Disposition or build from displayName + original extension
      const disposition = res.headers['content-disposition']
      let filename = file.displayName
      if (disposition) {
        const match = disposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/)
        if (match && match[1]) {
          filename = decodeURIComponent(match[1].replace(/['"]/g, ''))
        }
      }
      // Fallback: append original file extension if displayName has no extension
      if (!filename.includes('.')) {
        const origExt = (file.originalName || '').match(/\.[^.]*$/)?.[0] || ''
        filename = filename + origExt
      }
      link.setAttribute('download', filename)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        alert('请先登录后再下载文件')
      } else {
        alert('下载失败：' + (err.response?.data?.error || err.message))
      }
    }
  }

  if (!files || files.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">📭</div>
        <h3>暂无资料</h3>
        <p>该分类下还没有上传文件</p>
      </div>
    )
  }

  return (
    <div className="file-grid">
      {files.map(file => {
        const isRenaming = renamingId === file.id
        return (
          <div key={file.id} className={`file-card ${isAdmin ? 'admin' : ''} ${isRenaming ? 'renaming' : ''}`}>
            <div className="file-icon">📄</div>
            <div className="file-info">
              {isRenaming ? (
                <>
                  <input
                    className="rename-input"
                    value={renameName}
                    onChange={e => setRenameName(e.target.value)}
                    placeholder="文件名称"
                    autoFocus
                    onKeyDown={e => { if (e.key === 'Enter') submitRename(file.id) }}
                  />
                  <input
                    className="rename-input rename-input-desc"
                    value={renameDesc}
                    onChange={e => setRenameDesc(e.target.value)}
                    placeholder="文件简介（选填）"
                    onKeyDown={e => { if (e.key === 'Enter') submitRename(file.id) }}
                  />
                  {GRADE_OPTIONS[file.category] && (
                    <select
                      className="rename-input rename-input-grade"
                      value={renameSubCategory}
                      onChange={e => setRenameSubCategory(e.target.value)}
                    >
                      {GRADE_OPTIONS[file.category].map(g => (
                        <option key={g.key} value={g.key}>{g.label}</option>
                      ))}
                    </select>
                  )}
                  <div className="file-meta">
                    <span className="file-cat-tag">{CATEGORY_LABELS[file.category] || file.category}{file.subCategory && SUB_CATEGORY_LABELS[file.subCategory] && <> · {SUB_CATEGORY_LABELS[file.subCategory]}</>}</span>
                    <span>{formatSize(file.size)}</span>
                  </div>
                </>
              ) : (
                <>
                  <h3 title={file.displayName}>{file.displayName}</h3>
                  {file.description && <p>{file.description}</p>}
                  <div className="file-meta">
                    <span className="file-cat-tag">{CATEGORY_LABELS[file.category] || file.category}{file.subCategory && SUB_CATEGORY_LABELS[file.subCategory] && <> · {SUB_CATEGORY_LABELS[file.subCategory]}</>}</span>
                    <span>{formatSize(file.size)}</span>
                  </div>
                </>
              )}
            </div>
            <div className="file-actions">
              {isAdmin ? (
                isRenaming ? (
                  <>
                    <button className="btn btn-primary btn-sm" onClick={() => submitRename(file.id)} disabled={saving}>
                      {saving ? '保存中...' : '保存'}
                    </button>
                    <button className="btn btn-outline-dark btn-sm" onClick={cancelRename} disabled={saving}>
                      取消
                    </button>
                  </>
                ) : (
                  <>
                    <button className="btn btn-outline-dark btn-sm" onClick={() => startRename(file)}>
                      重命名
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => {
                        if (window.confirm(`确定要删除「${file.displayName}」吗？此操作不可恢复。`)) {
                          onDelete(file.id)
                        }
                      }}
                    >
                      删除
                    </button>
                  </>
                )
              ) : isLoggedIn ? (
                canDownload(file.category) ? (
                  <button className="btn btn-primary btn-sm" onClick={() => handleDownload(file)}>
                    下载
                  </button>
                ) : (
                  <button className="btn btn-primary btn-sm" disabled title="你没有该分类的下载权限">
                    无权限
                  </button>
                )
              ) : (
                <button className="btn btn-primary btn-sm" disabled title="请先登录后下载">
                  请登录
                </button>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

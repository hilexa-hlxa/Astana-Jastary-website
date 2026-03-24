import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAdmin } from '../context/AdminContext'

const USERNAME = 'admin'
const PASSWORD = 'admin1234'

const isAuthed  = () => sessionStorage.getItem('aj_auth') === 'true'
const setAuthed = () => sessionStorage.setItem('aj_auth', 'true')
const clearAuth = () => sessionStorage.removeItem('aj_auth')

// ─── Image input: file upload (→ base64) or manual URL/path ─────────────────
function ImageInput({ value, onChange, label = 'Image' }) {
  const handleFile = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onloadend = () => onChange(reader.result)
    reader.readAsDataURL(file)
  }
  const isBase64 = value?.startsWith('data:')
  return (
    <div className="image-input-group">
      <label>{label}</label>
      <input type="file" accept="image/*" onChange={handleFile} />
      <input
        type="text"
        placeholder="Or paste image URL / path (e.g. /images/photo.jpg)"
        value={isBase64 ? '' : (value || '')}
        onChange={(e) => onChange(e.target.value)}
      />
      {value && <img src={value} alt="preview" className="image-preview" />}
    </div>
  )
}

// ─── Login ────────────────────────────────────────────────────────────────────
function LoginForm({ onLogin }) {
  const [creds, setCreds] = useState({ username: '', password: '' })
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (creds.username === USERNAME && creds.password === PASSWORD) {
      onLogin()
    } else {
      setError('Invalid username or password.')
    }
  }

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <h2>Admin Login</h2>
        {error && <p className="admin-error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              autoComplete="username"
              value={creds.username}
              onChange={(e) => setCreds({ ...creds, username: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              autoComplete="current-password"
              value={creds.password}
              onChange={(e) => setCreds({ ...creds, password: e.target.value })}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
            Login
          </button>
        </form>
      </div>
    </div>
  )
}

// ─── Team tab ─────────────────────────────────────────────────────────────────
function TeamTab() {
  const { team, setTeam } = useAdmin()
  const empty = { name: '', role: '', img: '' }
  const [form, setForm] = useState(null)

  const save = () => {
    if (!form.name.trim()) return
    if (form.id) {
      setTeam(team.map((m) => (m.id === form.id ? form : m)))
    } else {
      setTeam([...team, { ...form, id: Date.now() }])
    }
    setForm(null)
  }

  const remove = (id) => {
    if (window.confirm('Delete this team member?')) setTeam(team.filter((m) => m.id !== id))
  }

  return (
    <div>
      <div className="admin-section-header">
        <h2>Team Members</h2>
        <button className="admin-btn" onClick={() => setForm({ ...empty })}>+ Add Member</button>
      </div>

      <div className="admin-list">
        {team.map((member) => (
          <div key={member.id} className="admin-list-item">
            <img src={member.img} alt={member.name} className="admin-avatar" />
            <div className="admin-list-info">
              <strong>{member.name}</strong>
              <span>{member.role}</span>
            </div>
            <div className="admin-list-actions">
              <button className="admin-btn-secondary" onClick={() => setForm({ ...member })}>Edit</button>
              <button className="admin-btn-danger"    onClick={() => remove(member.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      {form !== null && (
        <div className="admin-form-card">
          <h3>{form.id ? 'Edit Member' : 'Add Member'}</h3>
          <div className="form-group">
            <label>Name</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Role</label>
            <input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} />
          </div>
          <ImageInput value={form.img} onChange={(img) => setForm({ ...form, img })} label="Photo" />
          <div className="admin-form-actions">
            <button className="admin-btn"           onClick={save}>Save</button>
            <button className="admin-btn-secondary" onClick={() => setForm(null)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Catalogue tab ────────────────────────────────────────────────────────────
function CatalogueTab() {
  const { projects, setProjects } = useAdmin()
  const empty = { title: '', img: '' }
  const [form, setForm] = useState(null)

  const save = () => {
    if (!form.title.trim() || !form.img) return
    if (form.id) {
      setProjects(projects.map((p) => (p.id === form.id ? form : p)))
    } else {
      setProjects([...projects, { ...form, id: Date.now() }])
    }
    setForm(null)
  }

  const remove = (id) => {
    if (window.confirm('Delete this project?')) setProjects(projects.filter((p) => p.id !== id))
  }

  return (
    <div>
      <div className="admin-section-header">
        <h2>Catalogue Projects</h2>
        <button className="admin-btn" onClick={() => setForm({ ...empty })}>+ Add Project</button>
      </div>

      <div className="admin-catalogue-grid">
        {projects.map((project) => (
          <div key={project.id} className="admin-catalogue-item">
            <img src={project.img} alt={project.title} />
            <div className="item-title">{project.title}</div>
            <div className="item-actions">
              <button className="item-edit-btn"   onClick={() => setForm({ ...project })}>✎</button>
              <button className="item-delete-btn" onClick={() => remove(project.id)}>✕</button>
            </div>
          </div>
        ))}
      </div>

      {form !== null && (
        <div className="admin-form-card">
          <h3>{form.id ? 'Edit Project' : 'Add Project'}</h3>
          <div className="form-group">
            <label>Title</label>
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </div>
          <ImageInput value={form.img} onChange={(img) => setForm({ ...form, img })} label="Image" />
          <div className="admin-form-actions">
            <button className="admin-btn"           onClick={save}>Save</button>
            <button className="admin-btn-secondary" onClick={() => setForm(null)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── FAQ tab ──────────────────────────────────────────────────────────────────
function FaqTab() {
  const { faqs, setFaqs } = useAdmin()
  const empty = { q: '', a: '' }
  const [form, setForm] = useState(null)

  const save = () => {
    if (!form.q.trim() || !form.a.trim()) return
    if (form.id) {
      setFaqs(faqs.map((f) => (f.id === form.id ? form : f)))
    } else {
      setFaqs([...faqs, { ...form, id: Date.now() }])
    }
    setForm(null)
  }

  const remove = (id) => {
    if (window.confirm('Delete this FAQ item?')) setFaqs(faqs.filter((f) => f.id !== id))
  }

  return (
    <div>
      <div className="admin-section-header">
        <h2>FAQ</h2>
        <button className="admin-btn" onClick={() => setForm({ ...empty })}>+ Add FAQ</button>
      </div>

      <div className="admin-list">
        {faqs.map((item) => (
          <div key={item.id} className="admin-list-item">
            <div className="admin-list-info">
              <strong>{item.q}</strong>
              <span>{item.a.length > 80 ? item.a.slice(0, 80) + '…' : item.a}</span>
            </div>
            <div className="admin-list-actions">
              <button className="admin-btn-secondary" onClick={() => setForm({ ...item })}>Edit</button>
              <button className="admin-btn-danger"    onClick={() => remove(item.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      {form !== null && (
        <div className="admin-form-card">
          <h3>{form.id ? 'Edit FAQ' : 'Add FAQ'}</h3>
          <div className="form-group">
            <label>Question</label>
            <input value={form.q} onChange={(e) => setForm({ ...form, q: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Answer</label>
            <textarea
              rows={4}
              value={form.a}
              onChange={(e) => setForm({ ...form, a: e.target.value })}
              style={{ width: '100%', padding: '12px', border: '2px solid #e1e5e9', borderRadius: '8px', fontSize: '1rem', resize: 'vertical' }}
            />
          </div>
          <div className="admin-form-actions">
            <button className="admin-btn"           onClick={save}>Save</button>
            <button className="admin-btn-secondary" onClick={() => setForm(null)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Settings tab ─────────────────────────────────────────────────────────────
function SettingsTab() {
  const { whatsapp, setWhatsapp } = useAdmin()
  const [value, setValue] = useState(whatsapp)
  const [saved, setSaved] = useState(false)

  const save = () => {
    setWhatsapp(value)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div>
      <div className="admin-section-header">
        <h2>Settings</h2>
      </div>
      <div className="admin-form-card">
        <h3>WhatsApp Number</h3>
        <p style={{ color: '#666', marginBottom: '1rem', fontSize: '0.9rem' }}>
          Enter the number in international format without + or spaces (e.g. 77013562296)
        </p>
        {saved && <p className="admin-success">Saved!</p>}
        <div className="form-group">
          <label>WhatsApp Number</label>
          <input
            type="text"
            value={value}
            onChange={(e) => { setValue(e.target.value); setSaved(false) }}
            placeholder="77013562296"
          />
        </div>
        <button className="admin-btn" onClick={save}>Save</button>
      </div>
    </div>
  )
}

// ─── Main Admin page ──────────────────────────────────────────────────────────
export default function Admin() {
  const [authed, setAuthed] = useState(isAuthed)
  const [tab, setTab] = useState('team')
  const navigate = useNavigate()

  if (!authed) {
    return <LoginForm onLogin={() => { setAuthed(true) }} />
  }

  const tabs = ['team', 'catalogue', 'faq', 'settings']

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Admin Panel</h1>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <button className="admin-btn-secondary" onClick={() => navigate('/')}>← Back to Site</button>
          <button className="admin-btn-danger" onClick={() => { clearAuth(); setAuthed(false) }}>Logout</button>
        </div>
      </div>

      <div className="admin-tabs">
        {tabs.map((t) => (
          <button
            key={t}
            className={`admin-tab${tab === t ? ' active' : ''}`}
            onClick={() => setTab(t)}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      <div className="admin-content">
        {tab === 'team'      && <TeamTab />}
        {tab === 'catalogue' && <CatalogueTab />}
        {tab === 'faq'       && <FaqTab />}
        {tab === 'settings'  && <SettingsTab />}
      </div>
    </div>
  )
}

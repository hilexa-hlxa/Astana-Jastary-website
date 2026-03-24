import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAdmin } from '../context/AdminContext'

const USERNAME = 'admin'
const PASSWORD = 'admin1234'

const isAuthed  = () => sessionStorage.getItem('aj_auth') === 'true'
const setAuthed = () => sessionStorage.setItem('aj_auth', 'true')
const clearAuth = () => sessionStorage.removeItem('aj_auth')

// ── Image input: file → Supabase Storage, or manual URL/path ────────────────
function ImageInput({ value, onChange, label = 'Image' }) {
  const [uploading, setUploading] = useState(false)

  const handleFile = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    const ext = file.name.split('.').pop()
    const path = `${Date.now()}.${ext}`
    const { error } = await supabase.storage.from('images').upload(path, file)
    if (error) { alert('Upload failed: ' + error.message); setUploading(false); return }
    const { data } = supabase.storage.from('images').getPublicUrl(path)
    onChange(data.publicUrl)
    setUploading(false)
  }

  return (
    <div className="image-input-group">
      <label>{label}</label>
      <input type="file" accept="image/*" onChange={handleFile} disabled={uploading} />
      {uploading && <span style={{ color: '#666', fontSize: '0.9rem' }}>Uploading…</span>}
      <input
        type="text"
        placeholder="Or paste image URL / path (e.g. /images/photo.jpg)"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
      />
      {value && <img src={value} alt="preview" className="image-preview" />}
    </div>
  )
}

// ── Login ────────────────────────────────────────────────────────────────────
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
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Login</button>
        </form>
      </div>
    </div>
  )
}

// ── Team tab ─────────────────────────────────────────────────────────────────
function TeamTab() {
  const { team, addMember, updateMember, removeMember } = useAdmin()
  const [form, setForm]     = useState(null)
  const [saving, setSaving] = useState(false)

  const save = async () => {
    if (!form.name?.trim()) return
    setSaving(true)
    const { error } = form.id
      ? await updateMember(form)
      : await addMember({ name: form.name, role: form.role, img: form.img })
    setSaving(false)
    if (error) { alert('Error: ' + error.message); return }
    setForm(null)
  }

  const remove = async (id) => {
    if (!window.confirm('Delete this team member?')) return
    const { error } = await removeMember(id)
    if (error) alert('Error: ' + error.message)
  }

  return (
    <div>
      <div className="admin-section-header">
        <h2>Team Members</h2>
        <button className="admin-btn" onClick={() => setForm({ name: '', role: '', img: '' })}>+ Add Member</button>
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
            <button className="admin-btn"           onClick={save} disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
            <button className="admin-btn-secondary" onClick={() => setForm(null)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Catalogue tab ─────────────────────────────────────────────────────────────
function CatalogueTab() {
  const { projects, addProject, updateProject, removeProject } = useAdmin()
  const [form, setForm]     = useState(null)
  const [saving, setSaving] = useState(false)

  const save = async () => {
    if (!form.title?.trim() || !form.img) return
    setSaving(true)
    const { error } = form.id
      ? await updateProject(form)
      : await addProject({ title: form.title, img: form.img })
    setSaving(false)
    if (error) { alert('Error: ' + error.message); return }
    setForm(null)
  }

  const remove = async (id) => {
    if (!window.confirm('Delete this project?')) return
    const { error } = await removeProject(id)
    if (error) alert('Error: ' + error.message)
  }

  return (
    <div>
      <div className="admin-section-header">
        <h2>Catalogue Projects</h2>
        <button className="admin-btn" onClick={() => setForm({ title: '', img: '' })}>+ Add Project</button>
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
            <button className="admin-btn"           onClick={save} disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
            <button className="admin-btn-secondary" onClick={() => setForm(null)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  )
}

// ── FAQ tab ───────────────────────────────────────────────────────────────────
function FaqTab() {
  const { faqs, addFaq, updateFaq, removeFaq } = useAdmin()
  const [form, setForm]     = useState(null)
  const [saving, setSaving] = useState(false)

  const save = async () => {
    if (!form.q?.trim() || !form.a?.trim()) return
    setSaving(true)
    const { error } = form.id
      ? await updateFaq(form)
      : await addFaq({ q: form.q, a: form.a })
    setSaving(false)
    if (error) { alert('Error: ' + error.message); return }
    setForm(null)
  }

  const remove = async (id) => {
    if (!window.confirm('Delete this FAQ item?')) return
    const { error } = await removeFaq(id)
    if (error) alert('Error: ' + error.message)
  }

  return (
    <div>
      <div className="admin-section-header">
        <h2>FAQ</h2>
        <button className="admin-btn" onClick={() => setForm({ q: '', a: '' })}>+ Add FAQ</button>
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
            <button className="admin-btn"           onClick={save} disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
            <button className="admin-btn-secondary" onClick={() => setForm(null)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Settings tab ──────────────────────────────────────────────────────────────
function SettingsTab() {
  const { whatsapp, saveWhatsapp } = useAdmin()
  const [value,  setValue]  = useState(whatsapp)
  const [saving, setSaving] = useState(false)
  const [saved,  setSaved]  = useState(false)

  const save = async () => {
    setSaving(true)
    const { error } = await saveWhatsapp(value)
    setSaving(false)
    if (error) { alert('Error: ' + error.message); return }
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div>
      <div className="admin-section-header"><h2>Settings</h2></div>
      <div className="admin-form-card">
        <h3>WhatsApp Number</h3>
        <p style={{ color: '#666', marginBottom: '1rem', fontSize: '0.9rem' }}>
          International format, no + or spaces — e.g. 77013562296
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
        <button className="admin-btn" onClick={save} disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
      </div>
    </div>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function Admin() {
  const [authed, setAuthed] = useState(isAuthed)
  const [tab, setTab]       = useState('team')
  const navigate            = useNavigate()

  if (!authed) {
    return <LoginForm onLogin={() => setAuthed(true)} />
  }

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Admin Panel</h1>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="admin-btn-secondary" onClick={() => navigate('/')}>← Back to Site</button>
          <button className="admin-btn-danger"    onClick={() => { clearAuth(); setAuthed(false) }}>Logout</button>
        </div>
      </div>
      <div className="admin-tabs">
        {['team', 'catalogue', 'faq', 'settings'].map((t) => (
          <button key={t} className={`admin-tab${tab === t ? ' active' : ''}`} onClick={() => setTab(t)}>
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

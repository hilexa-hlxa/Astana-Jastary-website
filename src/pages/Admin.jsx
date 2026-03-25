import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAdmin } from '../context/AdminContext'
import { imgUrl } from '../lib/imgUrl'
import Modal from '../components/Modal'

const USERNAME = 'admin'
const PASSWORD = 'admin1234'

const isAuthed  = () => sessionStorage.getItem('aj_auth') === 'true'
const clearAuth = () => sessionStorage.removeItem('aj_auth')

// ── Reusable form modal ───────────────────────────────────────────────────────
function FormModal({ title, onClose, onSave, saving, children }) {
  return (
    <Modal onClose={onClose}>
      <div className="amodal-header">
        <h3>{title}</h3>
        <button className="amodal-close" onClick={onClose}>✕</button>
      </div>
      <div className="amodal-body">{children}</div>
      <div className="amodal-footer">
        <button className="admin-btn-secondary" onClick={onClose}>Cancel</button>
        <button className="admin-btn" onClick={onSave} disabled={saving}>
          {saving ? 'Saving…' : 'Save'}
        </button>
      </div>
    </Modal>
  )
}

// ── Image input ───────────────────────────────────────────────────────────────
function ImageInput({ value, onChange, label = 'Image' }) {
  const [uploading, setUploading] = useState(false)

  const handleFile = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    const path = `${Date.now()}.${file.name.split('.').pop()}`
    const { error } = await supabase.storage.from('images').upload(path, file)
    if (error) { alert('Upload failed: ' + error.message); setUploading(false); return }
    const { data } = supabase.storage.from('images').getPublicUrl(path)
    onChange(data.publicUrl)
    setUploading(false)
  }

  return (
    <div className="form-group">
      <label>{label}</label>
      <input type="file" accept="image/*" onChange={handleFile} disabled={uploading} />
      {uploading && <span style={{ fontSize: '0.85rem', color: '#666' }}>Uploading…</span>}
      <input
        type="text"
        placeholder="Or paste a URL / path like /images/photo.jpg"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        style={{ marginTop: '0.5rem' }}
      />
      {value && (
        <img src={imgUrl(value)} alt="preview" style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8, marginTop: 8 }} />
      )}
    </div>
  )
}

// ── Login ─────────────────────────────────────────────────────────────────────
function LoginForm({ onLogin }) {
  const [creds, setCreds] = useState({ username: '', password: '' })
  const [error, setError] = useState('')

  const submit = (e) => {
    e.preventDefault()
    if (creds.username === USERNAME && creds.password === PASSWORD) {
      sessionStorage.setItem('aj_auth', 'true')
      onLogin()
    } else {
      setError('Wrong username or password.')
    }
  }

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <h2>Admin Login</h2>
        {error && <p className="admin-error">{error}</p>}
        <form onSubmit={submit}>
          <div className="form-group">
            <label>Username</label>
            <input type="text" autoComplete="username" value={creds.username}
              onChange={(e) => setCreds({ ...creds, username: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" autoComplete="current-password" value={creds.password}
              onChange={(e) => setCreds({ ...creds, password: e.target.value })} required />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Login</button>
        </form>
      </div>
    </div>
  )
}

// ── Team tab ──────────────────────────────────────────────────────────────────
function TeamTab() {
  const { team, addMember, updateMember, removeMember } = useAdmin()
  const [form,   setForm]   = useState(null)
  const [saving, setSaving] = useState(false)

  const openAdd  = () => setForm({ name: '', role: '', img: '' })
  const openEdit = (m) => setForm({ ...m })
  const close    = () => setForm(null)

  const save = async () => {
    if (!form.name?.trim()) return
    setSaving(true)
    const { error } = form.id ? await updateMember(form) : await addMember(form)
    setSaving(false)
    if (error) { alert(error.message); return }
    close()
  }

  const remove = async (id) => {
    if (!window.confirm('Delete this team member?')) return
    const { error } = await removeMember(id)
    if (error) alert(error.message)
  }

  return (
    <div>
      <div className="admin-section-header">
        <h2>Team Members</h2>
        <button className="admin-btn" onClick={openAdd}>+ Add Member</button>
      </div>

      <div className="acard-grid">
        {team.map((m) => (
          <div key={m.id} className="acard">
            <img src={imgUrl(m.img)} alt={m.name} className="acard-photo" />
            <div className="acard-body">
              <strong>{m.name}</strong>
              <span>{m.role}</span>
            </div>
            <div className="acard-actions">
              <button className="admin-btn-secondary" onClick={() => openEdit(m)}>Edit</button>
              <button className="admin-btn-danger"    onClick={() => remove(m.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      {form && (
        <FormModal title={form.id ? 'Edit Member' : 'Add Member'} onClose={close} onSave={save} saving={saving}>
          <div className="form-group">
            <label>Full Name</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Иванов Иван Иванович" />
          </div>
          <div className="form-group">
            <label>Role / Position</label>
            <input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} placeholder="e.g. Специалист" />
          </div>
          <ImageInput value={form.img} onChange={(img) => setForm({ ...form, img })} label="Photo" />
        </FormModal>
      )}
    </div>
  )
}

// ── Catalogue tab ─────────────────────────────────────────────────────────────
function CatalogueTab() {
  const { projects, addProject, updateProject, removeProject } = useAdmin()
  const [form,   setForm]   = useState(null)
  const [saving, setSaving] = useState(false)

  const openAdd  = () => setForm({ title: '', img: '', description: '' })
  const openEdit = (p) => setForm({ ...p })
  const close    = () => setForm(null)

  const save = async () => {
    if (!form.title?.trim()) return
    setSaving(true)
    const { error } = form.id ? await updateProject(form) : await addProject(form)
    setSaving(false)
    if (error) { alert(error.message); return }
    close()
  }

  const remove = async (id) => {
    if (!window.confirm('Delete this project?')) return
    const { error } = await removeProject(id)
    if (error) alert(error.message)
  }

  return (
    <div>
      <div className="admin-section-header">
        <h2>Catalogue Projects</h2>
        <button className="admin-btn" onClick={openAdd}>+ Add Project</button>
      </div>

      <div className="admin-catalogue-grid">
        {projects.map((p) => (
          <div key={p.id} className="admin-catalogue-item">
            <img src={imgUrl(p.img)} alt={p.title} />
            <div className="item-title">{p.title}</div>
            <div className="item-actions">
              <button className="item-edit-btn"   onClick={() => openEdit(p)}>✎</button>
              <button className="item-delete-btn" onClick={() => remove(p.id)}>✕</button>
            </div>
          </div>
        ))}
      </div>

      {form && (
        <FormModal title={form.id ? 'Edit Project' : 'Add Project'} onClose={close} onSave={save} saving={saving}>
          <div className="form-group">
            <label>Title</label>
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Project title" />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              rows={4}
              value={form.description || ''}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Describe what happened at this event…"
              style={{ width: '100%', padding: '12px', border: '2px solid #e1e5e9', borderRadius: '8px', fontSize: '1rem', resize: 'vertical' }}
            />
          </div>
          <ImageInput value={form.img} onChange={(img) => setForm({ ...form, img })} label="Image" />
        </FormModal>
      )}
    </div>
  )
}

// ── FAQ tab ───────────────────────────────────────────────────────────────────
function FaqTab() {
  const { faqs, addFaq, updateFaq, removeFaq } = useAdmin()
  const [form,   setForm]   = useState(null)
  const [saving, setSaving] = useState(false)

  const openAdd  = () => setForm({ q: '', a: '' })
  const openEdit = (f) => setForm({ ...f })
  const close    = () => setForm(null)

  const save = async () => {
    if (!form.q?.trim() || !form.a?.trim()) return
    setSaving(true)
    const { error } = form.id ? await updateFaq(form) : await addFaq(form)
    setSaving(false)
    if (error) { alert(error.message); return }
    close()
  }

  const remove = async (id) => {
    if (!window.confirm('Delete this FAQ?')) return
    const { error } = await removeFaq(id)
    if (error) alert(error.message)
  }

  return (
    <div>
      <div className="admin-section-header">
        <h2>FAQ</h2>
        <button className="admin-btn" onClick={openAdd}>+ Add FAQ</button>
      </div>

      <div className="admin-list">
        {faqs.map((item) => (
          <div key={item.id} className="admin-list-item">
            <div className="admin-list-info">
              <strong>{item.q}</strong>
              <span>{item.a.length > 90 ? item.a.slice(0, 90) + '…' : item.a}</span>
            </div>
            <div className="admin-list-actions">
              <button className="admin-btn-secondary" onClick={() => openEdit(item)}>Edit</button>
              <button className="admin-btn-danger"    onClick={() => remove(item.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      {form && (
        <FormModal title={form.id ? 'Edit FAQ' : 'Add FAQ'} onClose={close} onSave={save} saving={saving}>
          <div className="form-group">
            <label>Question</label>
            <input value={form.q} onChange={(e) => setForm({ ...form, q: e.target.value })} placeholder="e.g. Кто может стать волонтёром?" />
          </div>
          <div className="form-group">
            <label>Answer</label>
            <textarea
              rows={5}
              value={form.a}
              onChange={(e) => setForm({ ...form, a: e.target.value })}
              placeholder="Write the answer here…"
              style={{ width: '100%', padding: '12px', border: '2px solid #e1e5e9', borderRadius: '8px', fontSize: '1rem', resize: 'vertical' }}
            />
          </div>
        </FormModal>
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
    if (error) { alert(error.message); return }
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div>
      <div className="admin-section-header"><h2>Settings</h2></div>
      <div className="admin-form-card">
        <h3>WhatsApp Contact Number</h3>
        <p style={{ color: '#888', marginBottom: '1.25rem', fontSize: '0.9rem' }}>
          Used on the "Join Us" form. Enter digits only, no spaces or + sign. Example: 77013562296
        </p>
        {saved && <p className="admin-success">Saved successfully!</p>}
        <div className="form-group">
          <label>Number</label>
          <input
            type="text"
            value={value}
            onChange={(e) => { setValue(e.target.value); setSaved(false) }}
            placeholder="77013562296"
          />
        </div>
        <button className="admin-btn" onClick={save} disabled={saving}>
          {saving ? 'Saving…' : 'Save'}
        </button>
      </div>
    </div>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────
const TABS = [
  { id: 'team',      label: 'Team Members' },
  { id: 'catalogue', label: 'Catalogue'    },
  { id: 'faq',       label: 'FAQ'          },
  { id: 'settings',  label: 'Settings'     },
]

export default function Admin() {
  const [authed, setAuthed] = useState(isAuthed)
  const [tab,    setTab]    = useState('team')
  const navigate            = useNavigate()

  if (!authed) return <LoginForm onLogin={() => setAuthed(true)} />

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div>
          <h1>Admin Panel</h1>
          <p style={{ fontSize: '0.85rem', color: '#888', marginTop: '0.2rem' }}>Astana Jastary website management</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="admin-btn-secondary" onClick={() => navigate('/')}>← Back to Site</button>
          <button className="admin-btn-danger"    onClick={() => { clearAuth(); setAuthed(false) }}>Logout</button>
        </div>
      </div>

      <div className="admin-tabs">
        {TABS.map((t) => (
          <button key={t.id} className={`admin-tab${tab === t.id ? ' active' : ''}`} onClick={() => setTab(t.id)}>
            {t.label}
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

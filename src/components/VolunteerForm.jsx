import { useState } from 'react'
import emailjs from '@emailjs/browser'
import { useAdmin } from '../context/AdminContext'

// ─────────────────────────────────────────────────────────────────────────────
// EmailJS credentials — fill these in after setting up emailjs.com
// See: https://dashboard.emailjs.com/admin
// ─────────────────────────────────────────────────────────────────────────────
const EMAILJS_SERVICE_ID  = 'YOUR_SERVICE_ID'   // e.g. 'service_abc123'
const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID'  // e.g. 'template_xyz789'
const EMAILJS_PUBLIC_KEY  = 'YOUR_PUBLIC_KEY'   // e.g. 'abcDEFghiJKL'
// ─────────────────────────────────────────────────────────────────────────────

export default function VolunteerForm() {
  const { whatsapp } = useAdmin()
  const [form,       setForm]       = useState({ firstName: '', lastName: '', email: '' })
  const [submitting, setSubmitting] = useState(false)
  const [status,     setStatus]     = useState(null) // 'success' | 'error' | null

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setStatus(null)

    const { firstName, lastName, email } = form
    const fullName = `${firstName} ${lastName}`

    // 1. Send email via EmailJS
    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          from_name:  fullName,
          from_email: email,
          message:    `Новая заявка волонтёра!\n\nИмя: ${fullName}\nEmail: ${email}`,
        },
        EMAILJS_PUBLIC_KEY
      )
    } catch (err) {
      console.error('EmailJS error:', err)
      // Non-blocking — still open WhatsApp even if email fails
    }

    // 2. Open WhatsApp with pre-filled message
    const waMessage = `Привет! Меня зовут ${fullName}. Я хочу стать волонтером в организации "Астана Жастары". Мой email: ${email}`
    window.open(`https://wa.me/${whatsapp}?text=${encodeURIComponent(waMessage)}`, '_blank')

    setStatus('success')
    setSubmitting(false)
    setForm({ firstName: '', lastName: '', email: '' })
  }

  return (
    <section id="form" className="form-section">
      <div className="container">
        <div className="form-content">
          <div className="form-text">
            <h2>Хочешь стать частью команды?</h2>
            <p>
              Сделай первый шаг — заполни анкету и напиши нам в WhatsApp.<br />
              Наш координатор свяжется с тобой, согласует время и пригласит на
              живую регистрацию в нашем офисе.
            </p>
          </div>

          <form className="volunteer-form" onSubmit={handleSubmit}>
            {status === 'success' && (
              <div style={{
                background: '#d4edda', color: '#155724', borderRadius: 8,
                padding: '0.75rem 1rem', marginBottom: '1rem', fontSize: '0.95rem'
              }}>
                Заявка отправлена! Открываем WhatsApp…
              </div>
            )}
            <div className="form-group">
              <label htmlFor="firstName">Имя:</label>
              <input type="text" id="firstName" name="firstName" value={form.firstName} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="lastName">Фамилия:</label>
              <input type="text" id="lastName" name="lastName" value={form.lastName} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="email">Эл. Почта:</label>
              <input type="email" id="email" name="email" value={form.email} onChange={handleChange} required />
            </div>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Отправка…' : 'Стать волонтёром'}
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}

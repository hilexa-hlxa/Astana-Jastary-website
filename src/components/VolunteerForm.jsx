import { useState } from 'react'
import { useAdmin } from '../context/AdminContext'

export default function VolunteerForm() {
  const { whatsapp } = useAdmin()
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '' })

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = (e) => {
    e.preventDefault()
    const { firstName, lastName, email } = form
    const message = `Привет! Меня зовут ${firstName} ${lastName}. Я хочу стать волонтером в организации "Астана Жастары". Мой email: ${email}`
    window.open(`https://wa.me/${whatsapp}?text=${encodeURIComponent(message)}`, '_blank')
    alert('Форма отправлена! Вы будете перенаправлены в WhatsApp.')
    setForm({ firstName: '', lastName: '', email: '' })
  }

  return (
    <section id="form" className="form-section">
      <div className="container">
        <div className="form-content">
          <div className="form-text">
            <h2>Хочешь стать частью команды?</h2>
            <p>
              Сделай первый шаг заполни анкету и напиши нам в WhatsApp.<br />
              Наш координатор свяжется с тобой, согласует время и пригласит на
              живую регистрацию в нашем офисе.
            </p>
          </div>
          <form className="volunteer-form" onSubmit={handleSubmit}>
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
            <button type="submit" className="btn btn-primary">
              Стать волонтёром
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}

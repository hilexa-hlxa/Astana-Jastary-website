import { createContext, useContext, useState, useEffect } from 'react'

const defaultTeam = [
  { id: 1, name: 'Есмуханова Эльвира Карабековна', role: 'Руководитель', img: '/images/IMAGE 2025-06-12 17:28:42.jpg' },
  { id: 2, name: 'Али Айзат Абибуллаевна',         role: 'Специалист',   img: '/images/Aizat Abibullaevna.jpg' },
  { id: 3, name: 'Такенова Дана Азаматовна',        role: 'Специалист',   img: '/images/Dana .jpg' },
]

const defaultProjects = [
  { id: 1,  title: 'Экологический проект',       img: '/images/2bbe36c5-a4d1-4477-ac79-cff9d4fdb284.jpg' },
  { id: 2,  title: 'Помощь детям',               img: '/images/55e4baa3-a9b5-4539-825a-87de0c9c0a2a.jpg' },
  { id: 3,  title: 'Благотворительность',        img: '/images/D45E0B4C-5E5A-41AB-A4C3-A0EEBDF6BAEE.jpg' },
  { id: 4,  title: 'Образовательная программа',  img: '/images/efe7eed2-0d1e-4e72-9890-1ce450be477f.jpg' },
  { id: 5,  title: 'Спортивное мероприятие',     img: '/images/IMAGE 2025-06-12 17:19:16.jpg' },
  { id: 6,  title: 'Культурный фестиваль',       img: '/images/IMAGE 2025-06-12 17:20:29.jpg' },
  { id: 7,  title: 'Помощь пожилым',             img: '/images/PHOTO-2025-06-12-16-32-07.jpg' },
  { id: 8,  title: 'Уборка города',              img: '/images/IMAGE 2025-06-12 17:18:48.jpg' },
  { id: 9,  title: 'Посадка деревьев',           img: '/images/IMAGE 2025-06-12 17:21:29.jpg' },
  { id: 10, title: 'Донорство крови',            img: '/images/IMAGE 2025-06-12 17:21:56.jpg' },
  { id: 11, title: 'Помощь животным',            img: '/images/IMAGE 2025-06-12 17:22:17.jpg' },
  { id: 12, title: 'Образовательные курсы',      img: '/images/IMAGE 2025-06-12 17:22:38.jpg' },
  { id: 13, title: 'Волонтерский лагерь',        img: '/images/PHOTO-2025-06-12-17-25-24.jpg' },
  { id: 14, title: 'Благотворительный концерт',  img: '/images/PHOTO-2025-06-12-17-27-35.jpg' },
  { id: 15, title: 'Экологическая акция',        img: '/images/PHOTO-2025-06-12-17-27-44.jpg' },
  { id: 16, title: 'Социальная помощь',          img: '/images/PHOTO-2025-06-12-17-40-47.jpg' },
  { id: 17, title: 'Детский праздник',           img: '/images/PHOTO-2025-06-12-17-40-48.jpg' },
  { id: 18, title: 'Марафон добра',              img: '/images/1M3A4794.jpg' },
]

const defaultFaqs = [
  { id: 1, q: '1. Кто может стать волонтёром?',                a: 'Любой желающий в возрасте от 14 лет, у кого есть желание помогать и развиваться.' },
  { id: 2, q: '2. Нужно ли иметь опыт?',                      a: 'Нет, опыт не обязателен. Мы обучаем и поддерживаем всех новичков.' },
  { id: 3, q: '3. Сколько времени нужно уделять волонтёрству?',a: 'Гибкий график. Ты сам выбираешь, когда и как часто участвовать.' },
  { id: 4, q: '4. Какие направления есть?',                   a: 'Мы работаем в сферах экологии, помощи людям, организации мероприятий и многое другое.' },
  { id: 5, q: '5. Это оплачивается?',                         a: 'Обычно нет, волонтёрство это добровольная деятельность. Но ты получаешь опыт, знакомства и сертификаты.' },
  { id: 6, q: '6. Где проходят мероприятия?',                 a: 'Чаще всего в Астане, но иногда бывают выезды в другие города или районы.' },
  { id: 7, q: '7. Как попасть в команду?',                    a: 'Заполни анкету и свяжись с нами через WhatsApp мы расскажем всё лично!' },
]

const load = (key, def) => {
  try { return JSON.parse(localStorage.getItem(key)) ?? def } catch { return def }
}

const AdminContext = createContext()

export function AdminProvider({ children }) {
  const [team,     setTeam]     = useState(() => load('aj_team',     defaultTeam))
  const [projects, setProjects] = useState(() => load('aj_projects', defaultProjects))
  const [faqs,     setFaqs]     = useState(() => load('aj_faqs',     defaultFaqs))
  const [whatsapp, setWhatsapp] = useState(() => localStorage.getItem('aj_whatsapp') ?? '')

  useEffect(() => localStorage.setItem('aj_team',     JSON.stringify(team)),     [team])
  useEffect(() => localStorage.setItem('aj_projects', JSON.stringify(projects)), [projects])
  useEffect(() => localStorage.setItem('aj_faqs',     JSON.stringify(faqs)),     [faqs])
  useEffect(() => localStorage.setItem('aj_whatsapp', whatsapp),                 [whatsapp])

  return (
    <AdminContext.Provider value={{ team, setTeam, projects, setProjects, faqs, setFaqs, whatsapp, setWhatsapp }}>
      {children}
    </AdminContext.Provider>
  )
}

export const useAdmin = () => useContext(AdminContext)

import { useNavigate } from 'react-router-dom'

export default function Projects() {
  const navigate = useNavigate()

  return (
    <section className="projects">
      <div className="container">
        <h2 className="section-title">Наши проекты</h2>
        <div className="projects-flex">
          <div className="projects-image">
            <img
              src="/images/PHOTO-2025-06-12-16-32-07.jpg"
              alt="Проект волонтеров"
              className="project-img"
            />
          </div>
          <div className="projects-content">
            <p className="projects-description">
              Здесь вы увидите проекты и инициативы, созданные нашими волонтёрами.<br />
              Каждая работа — это результат усилий, вовлечённости и желания помочь.
            </p>
            <button className="btn btn-secondary" onClick={() => navigate('/catalogue')}>
              Посмотреть работы
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

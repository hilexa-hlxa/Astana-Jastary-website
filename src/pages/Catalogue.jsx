import { useAdmin } from '../context/AdminContext'
import Footer from '../components/Footer'

export default function Catalogue() {
  const { projects } = useAdmin()

  return (
    <>
      <section className="catalogue-page">
        <div className="container">
          <h1 className="section-title">Каталог наших проектов</h1>
          <div className="catalogue-grid">
            {projects.map((project) => (
              <div key={project.id} className="catalogue-item">
                <img src={project.img} alt={project.title} loading="lazy" />
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </>
  )
}

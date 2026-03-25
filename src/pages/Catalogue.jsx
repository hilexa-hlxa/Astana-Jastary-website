import { useState } from 'react'
import { useAdmin } from '../context/AdminContext'
import { imgUrl } from '../lib/imgUrl'
import Modal from '../components/Modal'
import Footer from '../components/Footer'

export default function Catalogue() {
  const { projects } = useAdmin()
  const [selected, setSelected] = useState(null)

  return (
    <>
      <section className="catalogue-page">
        <div className="container">
          <h1 className="section-title">Каталог наших проектов</h1>
          <div className="catalogue-grid">
            {projects.map((project) => (
              <div
                key={project.id}
                className="catalogue-item"
                onClick={() => setSelected(project)}
                style={{ cursor: 'pointer' }}
              >
                <img src={imgUrl(project.img)} alt={project.title} loading="lazy" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {selected && (
        <Modal onClose={() => setSelected(null)}>
          <img src={imgUrl(selected.img)} alt={selected.title} className="modal-img" />
          <div className="modal-body">
            <h2 className="modal-title">{selected.title}</h2>
            {selected.description
              ? <p className="modal-description">{selected.description}</p>
              : <p className="modal-description" style={{ color: '#aaa', fontStyle: 'italic' }}>Описание не добавлено.</p>
            }
          </div>
          <button className="modal-close" onClick={() => setSelected(null)}>✕</button>
        </Modal>
      )}

      <Footer />
    </>
  )
}

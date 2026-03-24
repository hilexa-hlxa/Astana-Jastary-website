import { useState } from 'react'
import { useAdmin } from '../context/AdminContext'

export default function FAQ() {
  const { faqs } = useAdmin()
  const [activeIndex, setActiveIndex] = useState(null)

  const toggle = (i) => setActiveIndex(activeIndex === i ? null : i)

  return (
    <section id="faq" className="faq">
      <div className="container">
        <h2 className="section-title">FAQ</h2>
        <div className="faq-list">
          {faqs.map((item, i) => (
            <div key={item.id} className={`faq-item${activeIndex === i ? ' active' : ''}`}>
              <div className="faq-question" onClick={() => toggle(i)}>
                <h3>{item.q}</h3>
                <span className="faq-toggle">+</span>
              </div>
              <div className={`faq-answer${activeIndex === i ? ' active' : ''}`}>
                <p>{item.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

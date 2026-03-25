import { useNavigate, useLocation } from 'react-router-dom'
import { imgUrl } from '../lib/imgUrl'

export default function Footer() {
  const navigate  = useNavigate()
  const location  = useLocation()

  const goTo = (id) => {
    if (location.pathname === '/') {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    } else {
      navigate('/', { state: { scrollTo: id } })
    }
  }

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-logo">
            <img src={imgUrl('/images/logotype2.jpg')} alt="Астана Жастары" className="footer-logo-img" />
            <div className="footer-contact">
              <p>Телефон: +7 701 356 2296</p>
              <p>Адрес: Сарыарка 13</p>
            </div>
          </div>
          <div className="footer-links">
            <ul>
              <li><button onClick={() => goTo('hero')}>Home</button></li>
              <li><button onClick={() => navigate('/catalogue')}>Catalogue</button></li>
              <li><button onClick={() => goTo('form')}>Join Us</button></li>
              <li><button onClick={() => goTo('contacts')}>Contacts</button></li>
              <li><button onClick={() => goTo('faq')}>FAQ</button></li>
            </ul>
          </div>
          <div className="footer-social">
            <a href="https://wa.me/87058123056"            target="_blank" rel="noreferrer" className="social-link">Связаться в Whatsapp</a>
            <a href="https://instagram.com/astana_jastary" target="_blank" rel="noreferrer" className="social-link">Связаться в Instagram</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

import { imgUrl } from '../lib/imgUrl'

export default function Footer() {
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
              <li><a href="/">Home</a></li>
              <li><a href="/catalogue">Catalogue</a></li>
              <li><a href="#form">Join Us</a></li>
              <li><a href="#contacts">Contacts</a></li>
              <li><a href="#faq">FAQ</a></li>
            </ul>
          </div>
          <div className="footer-social">
            <a href="https://wa.me/87058123056"        target="_blank" rel="noreferrer" className="social-link">Связаться в Whatsapp</a>
            <a href="https://instagram.com/astana_jastary" target="_blank" rel="noreferrer" className="social-link">Связаться в Instagram</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

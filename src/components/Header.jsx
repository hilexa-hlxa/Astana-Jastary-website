import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { imgUrl } from '../lib/imgUrl'

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const isHome   = location.pathname === '/'

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const closeMenu = () => setMenuOpen(false)

  const goToSection = (id) => {
    closeMenu()
    if (isHome) {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    } else {
      navigate('/', { state: { scrollTo: id } })
    }
  }

  return (
    <header className={`header${scrolled ? ' scrolled' : ''}`}>
      <nav className="nav">
        <div className="logo">
          <Link to="/">
            <img src={imgUrl('/images/logotype2.jpg')} alt="Астана Жастары" className="logo-img" />
          </Link>
        </div>

        <ul className={`nav-menu${menuOpen ? ' active' : ''}`}>
          <li>
            <Link to="/catalogue" className="nav-link" onClick={closeMenu}>Catalogue</Link>
          </li>
          <li>
            <button className="nav-link" onClick={() => goToSection('about')}>About Us</button>
          </li>
          <li>
            <button className="nav-link" onClick={() => goToSection('contacts')}>Contacts</button>
          </li>
          <li>
            <button className="btn btn-secondary" id="skibidi" onClick={() => goToSection('form')}>Join Us</button>
          </li>
        </ul>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button className="header-avatar" onClick={() => navigate('/admin')} title="Admin panel">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
            </svg>
          </button>
          <div className={`hamburger${menuOpen ? ' active' : ''}`} onClick={() => setMenuOpen((o) => !o)}>
            <span></span><span></span><span></span>
          </div>
        </div>
      </nav>
    </header>
  )
}

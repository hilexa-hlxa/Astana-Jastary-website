import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Hero from '../components/Hero'
import About from '../components/About'
import Projects from '../components/Projects'
import VolunteerForm from '../components/VolunteerForm'
import Contacts from '../components/Contacts'
import FAQ from '../components/FAQ'
import Footer from '../components/Footer'

export default function Home() {
  const location = useLocation()

  useEffect(() => {
    const id = location.state?.scrollTo
    if (!id) return
    // Small delay lets the page render before scrolling
    const t = setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    }, 80)
    return () => clearTimeout(t)
  }, [])

  return (
    <>
      <Hero />
      <About />
      <Projects />
      <VolunteerForm />
      <Contacts />
      <FAQ />
      <Footer />
    </>
  )
}

import { Routes, Route } from 'react-router-dom'
import { AdminProvider } from './context/AdminContext'
import Header from './components/Header'
import Home from './pages/Home'
import Catalogue from './pages/Catalogue'
import Admin from './pages/Admin'

export default function App() {
  return (
    <AdminProvider>
      <Header />
      <Routes>
        <Route path="/"          element={<Home />} />
        <Route path="/catalogue" element={<Catalogue />} />
        <Route path="/admin"     element={<Admin />} />
      </Routes>
    </AdminProvider>
  )
}

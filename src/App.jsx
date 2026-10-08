import { useState, useEffect } from 'react'
import { ThemeProvider } from './context/ThemeContext'
import Header from './components/Header'
import Hero from './components/Hero'
import Cabanas from './components/Cabanas'
import Tinajas from './components/Tinajas'
import Cotizador from './components/Cotizador'
import Ubicacion from './components/Ubicacion'
import QuienesSomos from './components/QuienesSomos'
import Resenas from './components/Resenas'
import FAQ from './components/FAQ'
import Footer from './components/Footer'
import AdminLoginModal from './components/admin/AdminLoginModal'
import AdminDashboard from './components/admin/AdminDashboard'

function App() {
  const [isScrolled, setIsScrolled] = useState(false)

  // Recuperar sesión activa de administración al recargar
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState(() => {
    try {
      const isAuth = sessionStorage.getItem('anyely_admin_authenticated') === 'true'
      const hasHash = window.location.hash === '#admin'
      return isAuth && hasHash
    } catch (e) {
      return false
    }
  })

  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Detectar atajo #admin en la URL
  useEffect(() => {
    const checkHash = () => {
      if (window.location.hash === '#admin') {
        const isAuth = sessionStorage.getItem('anyely_admin_authenticated') === 'true'
        if (isAuth) {
          setIsAdminDashboardOpen(true)
          setIsAdminLoginOpen(false)
        } else {
          setIsAdminLoginOpen(true)
        }
      }
    }
    checkHash()
    window.addEventListener('hashchange', checkHash)
    return () => window.removeEventListener('hashchange', checkHash)
  }, [])

  const handleOpenAdminTrigger = () => {
    const isAuth = sessionStorage.getItem('anyely_admin_authenticated') === 'true'
    if (isAuth) {
      setIsAdminDashboardOpen(true)
      window.location.hash = '#admin'
    } else {
      setIsAdminLoginOpen(true)
    }
  }

  const handleLoginSuccess = () => {
    sessionStorage.setItem('anyely_admin_authenticated', 'true')
    window.location.hash = '#admin'
    setIsAdminLoginOpen(false)
    setIsAdminDashboardOpen(true)
  }

  const handleCloseDashboard = () => {
    // Al salir voluntariamente del panel, limpiar sesión y URL
    sessionStorage.removeItem('anyely_admin_authenticated')
    setIsAdminDashboardOpen(false)
    setIsAdminLoginOpen(false)
    if (window.location.hash === '#admin') {
      window.history.replaceState(null, '', window.location.pathname)
    }
  }

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
        <Header isScrolled={isScrolled} />
        <Hero />
        <Cabanas />
        <Tinajas />
        <Cotizador />
        <Ubicacion />
        <QuienesSomos />
        <Resenas />
        <FAQ />
        <Footer onOpenAdmin={handleOpenAdminTrigger} />

        {/* Modal de PIN para Administrador */}
        <AdminLoginModal
          isOpen={isAdminLoginOpen}
          onClose={() => {
            setIsAdminLoginOpen(false)
            if (window.location.hash === '#admin') {
              window.history.replaceState(null, '', window.location.pathname)
            }
          }}
          onLoginSuccess={handleLoginSuccess}
        />

        {/* Panel de Administración Principal */}
        <AdminDashboard
          isOpen={isAdminDashboardOpen}
          onClose={handleCloseDashboard}
        />
      </div>
    </ThemeProvider>
  )
}

export default App


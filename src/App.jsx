import { useState, useEffect } from 'react'
import { ThemeProvider } from './context/ThemeContext'
import Header from './components/Header'
import Hero from './components/Hero'
import Cabanas from './components/Cabanas'
import Tinajas from './components/Tinajas'
import Ubicacion from './components/Ubicacion'
import QuienesSomos from './components/QuienesSomos'
import Resenas from './components/Resenas'
import Footer from './components/Footer'

function App() {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
        <Header isScrolled={isScrolled} />
        <Hero />
        <Cabanas />
        <Tinajas />
        <Ubicacion />
        <QuienesSomos />
        <Resenas />
        <Footer />
      </div>
    </ThemeProvider>
  )
}

export default App


import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext()

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

export const ThemeProvider = ({ children }) => {
  // Siempre iniciar en modo claro
  const [isDark, setIsDark] = useState(false)

  // Cargar preferencia guardada al montar
  useEffect(() => {
    const saved = localStorage.getItem('theme')
    if (saved === 'dark') {
      setIsDark(true)
      document.documentElement.classList.add('dark')
    } else {
      setIsDark(false)
      document.documentElement.classList.remove('dark')
      // Asegurar que no esté en modo oscuro
      localStorage.setItem('theme', 'light')
    }
  }, [])

  // Aplicar tema cuando cambia isDark
  useEffect(() => {
    const root = document.documentElement
    
    if (isDark) {
      root.classList.add('dark')
      root.setAttribute('data-theme', 'dark')
      localStorage.setItem('theme', 'dark')
    } else {
      root.classList.remove('dark')
      root.setAttribute('data-theme', 'light')
      localStorage.setItem('theme', 'light')
    }
  }, [isDark])

  const toggleTheme = () => {
    setIsDark((prev) => {
      const newValue = !prev
      const root = document.documentElement
      
      // Aplicar inmediatamente
      if (newValue) {
        root.classList.add('dark')
        root.setAttribute('data-theme', 'dark')
        localStorage.setItem('theme', 'dark')
      } else {
        root.classList.remove('dark')
        root.setAttribute('data-theme', 'light')
        localStorage.setItem('theme', 'light')
      }
      
      return newValue
    })
  }

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Instagram, MessageCircle, Facebook, Moon, Sun } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

const Header = ({ isScrolled }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { isDark, toggleTheme } = useTheme()

  const menuItems = [
    { name: 'Inicio', href: '#inicio' },
    { name: 'Cabañas', href: '#cabanas' },
    { name: 'Tinajas', href: '#tinajas' },
    { name: 'Ubicación', href: '#ubicacion' },
    { name: 'Quiénes Somos', href: '#quienes-somos' },
    { name: 'Reseñas', href: '#resenas' },
    { name: 'Contacto', href: '#contacto' },
  ]

  const scrollToSection = (href) => {
    // Cerrar el menú primero
    setIsMenuOpen(false)
    
    // Pequeño delay para asegurar que el menú se cierre antes del scroll
    setTimeout(() => {
      const element = document.querySelector(href)
      if (element) {
        // Calcular la posición considerando el header fijo
        const headerHeight = 80
        const elementPosition = element.getBoundingClientRect().top + window.pageYOffset
        const offsetPosition = elementPosition - headerHeight

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        })
      }
    }, 100)
  }

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white dark:bg-gray-800 shadow-lg'
          : 'bg-transparent dark:bg-transparent'
      }`}
    >
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center space-x-2"
          >
            <img
              src="/Logo cabañas.png"
              alt="Cabañas Anyely Icalma"
              className="h-12 w-12 md:h-16 md:w-16 rounded-full object-cover"
            />
            <span className="text-lg md:text-xl font-bold text-primary-700 dark:text-primary-400">
              Cabañas Anyely
            </span>
          </motion.div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            {menuItems.map((item) => (
              <button
                key={item.name}
                onClick={(e) => {
                  e.preventDefault()
                  scrollToSection(item.href)
                }}
                className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors font-medium"
              >
                {item.name}
              </button>
            ))}
            {/* Redes Sociales Desktop */}
            <div className="flex items-center space-x-3 ml-4 pl-4 border-l border-gray-300 dark:border-gray-600">
              <a
                href="https://wa.me/56938780736?text=Hola,%20me%20gustaría%20obtener%20más%20información"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors"
                aria-label="WhatsApp"
              >
                <MessageCircle size={20} />
              </a>
              <a
                href="https://www.instagram.com/cabanas_anyely_icalma?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full hover:from-purple-700 hover:to-pink-700 transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a
                href="https://web.facebook.com/anyely.icalma"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
              <button
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  toggleTheme()
                }}
                className="p-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                aria-label="Toggle dark mode"
                type="button"
              >
                {isDark ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            </div>
          </div>

          {/* Mobile Menu Button y Toggle Theme */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                toggleTheme()
              }}
              className="p-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full"
              aria-label="Toggle dark mode"
              type="button"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button
              className="text-gray-700 dark:text-gray-300"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <>
              {/* Overlay para cerrar el menú al hacer click fuera */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
                onClick={() => setIsMenuOpen(false)}
              />
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="md:hidden mt-4 pb-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg relative z-50"
              >
                <div className="flex flex-col space-y-1">
                  {menuItems.map((item) => (
                    <button
                      key={item.name}
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        scrollToSection(item.href)
                      }}
                      className="text-left text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-gray-700 transition-colors font-medium py-3 px-4 rounded-lg"
                    >
                      {item.name}
                    </button>
                  ))}
                  {/* Redes Sociales Móvil */}
                  <div className="flex items-center justify-center space-x-4 pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
                    <a
                      href="https://wa.me/56938780736?text=Hola,%20me%20gustaría%20obtener%20más%20información"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="p-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors"
                      aria-label="WhatsApp"
                    >
                      <MessageCircle size={24} />
                    </a>
                    <a
                      href="https://www.instagram.com/cabanas_anyely_icalma?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="p-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full hover:from-purple-700 hover:to-pink-700 transition-colors"
                      aria-label="Instagram"
                    >
                      <Instagram size={24} />
                    </a>
                    <a
                      href="https://web.facebook.com/anyely.icalma"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                      aria-label="Facebook"
                    >
                      <Facebook size={24} />
                    </a>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </nav>
    </motion.header>
  )
}

export default Header


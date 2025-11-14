import { motion } from 'framer-motion'
import { Phone, Mail, MapPin, Instagram, MessageCircle, ArrowUp, Facebook } from 'lucide-react'

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer id="contacto" className="bg-gray-900 text-white py-12 relative">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Información */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <img
                src="/Logo cabañas.jpeg"
                alt="Cabañas Anyely Icalma"
                className="h-12 w-12 rounded-full object-cover"
              />
              <h3 className="text-xl font-bold">Cabañas Anyely Icalma</h3>
            </div>
            <p className="text-gray-400 mb-4">
              Tu refugio en la naturaleza. Disfruta de la tranquilidad y belleza del sector de Icalma.
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-400">
                <MapPin size={18} />
                <span>Sector de Icalma, Lonquimay, Chile</span>
              </div>
              <a
                href="tel:+56938780736"
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
              >
                <Phone size={18} />
                <span>+569 38780736</span>
              </a>
              <a
                href="mailto:cabanasanyely@gmail.com"
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
              >
                <Mail size={18} />
                <span>cabanasanyely@gmail.com</span>
              </a>
            </div>
          </motion.div>

          {/* Enlaces Rápidos */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h4 className="text-lg font-semibold mb-4">Enlaces Rápidos</h4>
            <ul className="space-y-2">
              {[
                { name: 'Inicio', href: '#inicio' },
                { name: 'Cabañas', href: '#cabanas' },
                { name: 'Tinajas', href: '#tinajas' },
                { name: 'Ubicación', href: '#ubicacion' },
                { name: 'Quiénes Somos', href: '#quienes-somos' },
                { name: 'Reseñas', href: '#resenas' },
              ].map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors"
                    onClick={(e) => {
                      e.preventDefault()
                      const element = document.querySelector(link.href)
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth' })
                      }
                    }}
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contacto y Redes */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h4 className="text-lg font-semibold mb-4">Síguenos</h4>
            <div className="flex flex-col gap-4">
              <a
                href="https://wa.me/56938780736?text=Hola,%20me%20gustaría%20obtener%20más%20información"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors font-semibold"
              >
                <MessageCircle size={24} />
                <span>WhatsApp</span>
              </a>
              <a
                href="https://www.instagram.com/cabanas_anyely_icalma?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-lg transition-colors font-semibold"
              >
                <Instagram size={24} />
                <span>Instagram</span>
              </a>
              <a
                href="https://web.facebook.com/anyely.icalma"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors font-semibold"
              >
                <Facebook size={24} />
                <span>Facebook</span>
              </a>
              <a
                href="https://wa.me/56938780736?text=Hola,%20me%20gustaría%20reservar"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg transition-colors font-semibold"
              >
                <MessageCircle size={24} />
                <span>Reservar Ahora</span>
              </a>
            </div>
          </motion.div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} Cabañas Anyely Icalma. Todos los derechos reservados.
          </p>
          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <span className="text-sm">Volver arriba</span>
            <ArrowUp size={20} />
          </button>
        </div>
      </div>
    </footer>
  )
}

export default Footer


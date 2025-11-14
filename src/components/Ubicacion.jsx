import { motion } from 'framer-motion'
import { MapPin, Navigation, Camera } from 'lucide-react'

const Ubicacion = () => {
  return (
    <section id="ubicacion" className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <MapPin size={48} className="text-primary-600" />
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
              Ubicación
            </h2>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Descubre la belleza natural del sector de Icalma, Lonquimay, Chile
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="bg-gradient-to-br from-primary-50 to-white dark:from-gray-800 dark:to-gray-700 p-6 rounded-2xl shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Sector de Icalma</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Ubicadas en el corazón de la naturaleza, nuestras cabañas te ofrecen una experiencia única 
                rodeada de paisajes impresionantes, montañas majestuosas y la tranquilidad que solo la 
                naturaleza puede brindar.
              </p>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Navigation className="text-primary-600 mt-1" size={20} />
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">Fácil Acceso</p>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Rutas accesibles y señalización clara</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Camera className="text-primary-600 dark:text-primary-400 mt-1" size={20} />
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">Paisajes Únicos</p>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Vistas panorámicas y naturaleza virgen</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="text-primary-600 dark:text-primary-400 mt-1" size={20} />
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">Ubicación Estratégica</p>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Cerca de atracciones naturales y actividades</p>
                  </div>
                </div>
              </div>
            </div>

            <a
              href="https://maps.app.goo.gl/Gk7tCUp79KzpXLr7A"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-primary-600 text-white text-center py-4 rounded-lg font-semibold text-lg hover:bg-primary-700 transition-colors shadow-lg"
            >
              Abrir en Google Maps
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative h-96 w-full rounded-2xl overflow-hidden shadow-2xl bg-gray-200"
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3108.7018923184714!2d-71.2927708!3d-38.8163834!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9613194094386fb1%3A0xeaa46cf3c4bb3d2b!2sCaba%C3%B1as%20Anyely!5e0!3m2!1ses!2scl!4v1763069653796!5m2!1ses!2scl"
              width="100%"
              height="100%"
              style={{ border: 0, display: 'block' }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full"
              title="Ubicación de Cabañas Anyely Icalma"
            />
          </motion.div>
        </div>

        {/* Galería de Paisajes */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-12"
        >
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-8">
            Paisajes de Icalma
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              '/paisajes/paisaje1.jpg',
              '/paisajes/paisaje2.jpg',
              '/paisajes/paisaje3.jpg',
              '/paisajes/paisaje4.jpg',
            ].map((imagePath, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="relative h-48 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow cursor-pointer group"
              >
                <img
                  src={imagePath}
                  alt={`Paisaje de Icalma ${index + 1}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  loading="lazy"
                  onError={(e) => {
                    // Si la imagen no carga, mostrar placeholder
                    e.target.style.display = 'none'
                    e.target.nextElementSibling.style.display = 'flex'
                  }}
                />
                <div className="w-full h-full bg-gradient-to-br from-primary-200 to-primary-400 dark:from-primary-800 dark:to-primary-900 flex items-center justify-center absolute inset-0" style={{ display: 'none' }}>
                  <Camera className="text-white opacity-50 group-hover:opacity-75 transition-opacity" size={32} />
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all" />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Ubicacion


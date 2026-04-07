import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'

const Resenas = () => {
  const resenas = [
    {
      id: 1,
      name: 'Dari Torrealba',
      rating: 5,
      comment: 'Muy buena experiencia! Anfitriones muy amables, todo súper limpio, la cabaña es un lujo!.',
      date: 'Hace 8 semanas',
    },
    {
      id: 2,
      name: 'Marcelo Solis',
      rating: 5,
      comment:
        'Estuvimos ahí para nuestro paseo de amigos, arrendamos las 5 cabañas muy buenas y mucho mejor los anfitriones, muy buenas personas. Sus papás nos hicieron pan calentito todos los días y tortillas para traer devuelta. Aprovecho de dar mis bendiciones a toda la familia. Club Caza y Pesca los Delfines de Chillán.',
      date: 'Hace 8 semanas',
    },
    {
      id: 3,
      name: 'FIGUEROA SAAVEDRA MATÍAS IGNACIO',
      rating: 5,
      comment: 'Hermosa experiencia♥️.',
      date: 'Hace 11 semanas',
    },
    {
      id: 4,
      name: 'Gabriel J',
      rating: 5,
      comment:
        'Execelentes cabañas, a muy buen precio, bien cuidadas y equipadas, una muy agradable y calida acogida de parte de los dueños, muy atento a los detalles. Muy recomendado!.',
      date: '6 abr 2021',
    },
    {
      id: 5,
      name: 'Betzabet Vergara Leiva',
      rating: 5,
      comment:
        'Me encanto muy buena atención de los dueños muy amables el camping buenisimo los baños limpios y quizas se podria mejorar en cambios de almohadas y frazadas pero me encanto el lugar',
      date: '26 feb 2021',
    },
    {
      id: 6,
      name: 'Paulina Nuñez',
      rating: 5,
      comment: 'Muy acogedor, las personas excelente atención. Las cabañas todo equipado.',
      date: '20 jul 2019',
    },
  ]

  return (
    <section id="resenas" className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Star size={48} className="text-primary-600 fill-primary-600" />
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
              Reseñas
            </h2>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Lo que nuestros huéspedes dicen sobre su experiencia en Cabañas Anyely Icalma
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resenas.map((resena, index) => (
            <motion.div
              key={resena.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-gradient-to-br from-primary-50 to-white dark:from-gray-800 dark:to-gray-700 p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow"
            >
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={20}
                    className={`${
                      i < resena.rating
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-300 dark:text-gray-600'
                    }`}
                  />
                ))}
              </div>
              <Quote className="text-primary-600 dark:text-primary-400 mb-3" size={24} />
              <p className="text-gray-700 dark:text-gray-300 mb-4 italic">"{resena.comment}"</p>
              <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
                <p className="font-semibold text-gray-900 dark:text-white">{resena.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{resena.date}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-12"
        >
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            ¿Tuviste una experiencia con nosotros? Comparte tu opinión
          </p>
          <a
            href="https://g.page/r/CSs9u8TzbKTqEBM/review"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-primary-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-primary-700 transition-colors shadow-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            Dejar Reseña
          </a>
        </motion.div>
      </div>
    </section>
  )
}

export default Resenas


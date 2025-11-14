import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'

const Resenas = () => {
  const resenas = [
    {
      id: 1,
      name: 'María González',
      rating: 5,
      comment: 'Excelente experiencia! Las cabañas son muy cómodas y el paisaje es increíble. Definitivamente vamos a volver.',
      date: 'Enero 2025',
    },
    {
      id: 2,
      name: 'Carlos Llanquileo',
      rating: 5,
      comment: 'Un lugar mágico para desconectarse. Las tinajas son perfectas para relajarse. Muy recomendado!',
      date: 'Diciembre 2024',
    },
    {
      id: 3,
      name: 'Ana Martínez',
      rating: 5,
      comment: 'Pasamos un fin de semana increíble en familia. Las cabañas tienen todo lo necesario y la atención es excelente.',
      date: 'Febrero 2024',
    },
    {
      id: 4,
      name: 'Pedro Sánchez',
      rating: 5,
      comment: 'El mejor lugar para escapar de la ciudad. Naturaleza pura y comodidad. Vamos a volver sin duda.',
      date: 'Febrero 2025',
    },
    {
      id: 5,
      name: 'Laura Fernández',
      rating: 5,
      comment: 'Las vistas son espectaculares y las cabañas muy acogedoras. Una experiencia que vamos a repetir.',
      date: 'Enero 2025',
    },
    {
      id: 6,
      name: 'Roberto López',
      rating: 5,
      comment: 'Perfecto para una escapada romántica. Las tinajas son increíbles, y la vista al paisaje es espectacular.',
      date: 'Enero 2025',
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
            href="https://wa.me/56938780736?text=Hola,%20quiero%20dejar%20una%20reseña%20sobre%20mi%20experiencia"
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


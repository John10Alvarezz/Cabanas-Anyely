import { motion } from 'framer-motion'
import { Heart, Users, Home, Award } from 'lucide-react'

const QuienesSomos = () => {
  const features = [
    {
      icon: Home,
      title: 'Experiencia Familiar',
      description: 'Más de 7 años ofreciendo experiencias únicas en contacto con la naturaleza',
    },
    {
      icon: Heart,
      title: 'Pasión por la Naturaleza',
      description: 'Comprometidos con el cuidado del medio ambiente y la preservación del entorno',
    },
    {
      icon: Users,
      title: 'Atención Personalizada',
      description: 'Nos preocupamos por que cada huésped tenga una experiencia inolvidable',
    },
    {
      icon: Award,
      title: 'Calidad Garantizada',
      description: 'Cabañas cómodas, limpias y equipadas con todo lo necesario para tu estadía',
    },
  ]

  return (
    <section id="quienes-somos" className="py-20 bg-gradient-to-br from-primary-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Quiénes Somos
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Conoce más sobre nuestra historia y nuestro compromiso con brindarte la mejor experiencia
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto mb-16"
        >
          <div className="prose prose-lg max-w-none text-center">
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              Bienvenidos a Cabañas Anyely Icalma
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4 text-lg">
              Somos una familia apasionada por la naturaleza y el turismo rural. Desde nuestros inicios, 
              nos hemos dedicado a ofrecer a nuestros huéspedes una experiencia única en contacto con la 
              naturaleza, combinando la comodidad de nuestras cabañas con la belleza del entorno natural 
              del sector de Icalma.
            </p>
            <p className="text-gray-700 dark:text-gray-300 mb-4 text-lg">
              Nuestro compromiso es brindarte un lugar donde puedas desconectarte del estrés diario, 
              disfrutar de momentos en familia o con amigos, y crear recuerdos inolvidables rodeado de 
              paisajes impresionantes.
            </p>
            <p className="text-gray-700 dark:text-gray-300 text-lg">
              Cada cabaña ha sido diseñada pensando en tu comodidad, y nuestras tinajas te ofrecen 
              un espacio único para relajarte. Te invitamos a ser parte de nuestra familia y descubrir 
              la magia de Icalma.
            </p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full mb-4">
                  <Icon className="text-primary-600 dark:text-primary-400" size={32} />
                </div>
                <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{feature.title}</h4>
                <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default QuienesSomos


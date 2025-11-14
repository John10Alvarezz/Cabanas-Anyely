import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Droplets, ChevronLeft, ChevronRight, X } from 'lucide-react'

const Tinajas = () => {
  const [selectedTinaja, setSelectedTinaja] = useState(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const tinajas = [
    {
      id: 1,
      name: 'Tinaja',
      description: 'Disfruta de un relajante baño en nuestra tinaja con agua termal. Perfecto para relajarse después de un día de actividades.',
      capacity: 'Hasta 6 personas',
      temperature: 'Temperatura cálida',
      images: ['/tinajas/tinaja1-1.jpg', '/tinajas/tinaja1-2.jpg'],
      features: ['Agua temperada', 'Vista al paisaje', 'Iluminación nocturna'],
    },
  ]

  const openModal = (tinaja) => {
    setSelectedTinaja(tinaja)
    setCurrentImageIndex(0)
  }

  const closeModal = useCallback(() => {
    setSelectedTinaja(null)
    setCurrentImageIndex(0)
  }, [])

  // Cerrar modal con tecla ESC
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && selectedTinaja) {
        closeModal()
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [selectedTinaja, closeModal])

  const nextImage = () => {
    if (selectedTinaja) {
      setCurrentImageIndex((prev) => 
        (prev + 1) % selectedTinaja.images.length
      )
    }
  }

  const prevImage = () => {
    if (selectedTinaja) {
      setCurrentImageIndex((prev) => 
        (prev - 1 + selectedTinaja.images.length) % selectedTinaja.images.length
      )
    }
  }

  return (
    <section id="tinajas" className="py-20 bg-gradient-to-br from-primary-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Droplets size={48} className="text-primary-600" />
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
              Nuestra Tinaja
            </h2>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Relájate y disfruta de un momento único en nuestra tinaja con agua termal
          </p>
        </motion.div>

        <div className="flex justify-center max-w-2xl mx-auto">
          {tinajas.map((tinaja, index) => (
            <motion.div
              key={tinaja.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow cursor-pointer w-full"
              onClick={() => openModal(tinaja)}
            >
              <div className="relative h-64 bg-gradient-to-br from-blue-100 to-blue-200">
                <img
                  src={tinaja.images[0] || '/placeholder-tinaja.jpg'}
                  alt={`${tinaja.name} - Cabañas Anyely Icalma`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  onError={(e) => {
                    e.target.style.display = 'none'
                  }}
                />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{tinaja.name}</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">{tinaja.description}</p>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <Droplets size={18} className="text-primary-600 dark:text-primary-400" />
                    <span>{tinaja.capacity}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <Droplets size={18} className="text-primary-600 dark:text-primary-400" />
                    <span>{tinaja.temperature}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedTinaja && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative">
                <button
                  onClick={closeModal}
                  className="absolute top-4 right-4 z-10 bg-white dark:bg-gray-700 rounded-full p-2 shadow-lg hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  aria-label="Cerrar modal"
                >
                  <X size={24} />
                </button>
                
                {selectedTinaja.images.length > 0 && (
                  <div className="relative h-64 md:h-96 bg-gray-200">
                    <img
                      src={selectedTinaja.images[currentImageIndex] || '/placeholder-tinaja.jpg'}
                      alt={`${selectedTinaja.name} - Imagen ${currentImageIndex + 1}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      onError={(e) => {
                        e.target.src = '/placeholder-tinaja.jpg'
                      }}
                    />
                    {selectedTinaja.images.length > 1 && (
                      <>
                        <button
                          onClick={prevImage}
                          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white dark:bg-gray-700 rounded-full p-2 shadow-lg hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                          aria-label="Imagen anterior"
                        >
                          <ChevronLeft size={24} />
                        </button>
                        <button
                          onClick={nextImage}
                          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white dark:bg-gray-700 rounded-full p-2 shadow-lg hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                          aria-label="Imagen siguiente"
                        >
                          <ChevronRight size={24} />
                        </button>
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                          {selectedTinaja.images.map((_, idx) => (
                            <button
                              key={idx}
                              onClick={() => setCurrentImageIndex(idx)}
                              className={`w-2 h-2 rounded-full transition-all ${
                                idx === currentImageIndex ? 'bg-white' : 'bg-white/50'
                              }`}
                              aria-label={`Ir a imagen ${idx + 1}`}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                )}

                <div className="p-6">
                  <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{selectedTinaja.name}</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">{selectedTinaja.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center gap-2">
                      <Droplets size={20} className="text-primary-600 dark:text-primary-400" />
                      <span className="text-gray-700 dark:text-gray-300">{selectedTinaja.capacity}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Droplets size={20} className="text-primary-600 dark:text-primary-400" />
                      <span className="text-gray-700 dark:text-gray-300">{selectedTinaja.temperature}</span>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Características</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedTinaja.features.map((feature) => (
                        <span
                          key={feature}
                          className="bg-primary-50 dark:bg-primary-900 text-primary-700 dark:text-primary-300 px-4 py-2 rounded-lg"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>

                  <a
                    href={`https://wa.me/56938780736?text=Hola,%20me%20gustaría%20reservar%20${selectedTinaja.name}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full bg-primary-600 text-white text-center py-4 rounded-lg font-semibold text-lg hover:bg-primary-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                  >
                    Reservar {selectedTinaja.name}
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

export default Tinajas


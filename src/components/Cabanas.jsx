import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bed, Users, Wifi, Car, UtensilsCrossed, ChevronLeft, ChevronRight, X, Bath, Thermometer, Mountain } from 'lucide-react'

const Cabanas = () => {
  const [selectedCabana, setSelectedCabana] = useState(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const cabanas = [
    {
      id: 1,
      name: 'Cabaña 1',
      description: 'Cabaña acogedora con vista al paisaje natural. Perfecta para grupos familiares o grupos de amigos.',
      capacity: 6,
      features: ['Estacionamiento', 'Cocina equipada', 'Baño', 'Terraza','Calefacción', 'Televisión'],
      images: ['/cabañas/cabana1-1.jpg', '/cabañas/cabana1-2.jpg', '/cabañas/cabana1-3.jpg', '/cabañas/cabana1-4.jpg', '/cabañas/cabana1-5.jpg', '/cabañas/cabana1-6.jpg'],
      price: 'Desde $70.000/noche',
    },
    {
      id: 2,
      name: 'Cabaña 2',
      description: 'La más grande y cómoda. Perfecta para eventos familiares o grupos grandes.',
      capacity: '10-12',
      features: ['Estacionamiento', 'Cocina equipada', 'Terraza', '2 baños', 'Calefacción', 'Televisión'],
      images: ['/cabañas/cabana2-1.jpg', '/cabañas/cabana2-2.jpg', '/cabañas/cabana2-3.jpg', '/cabañas/cabana2-4.jpg', '/cabañas/cabana2-5.jpg', '/cabañas/cabana2-6.jpg', '/cabañas/cabana2-7.jpg', '/cabañas/cabana2-8.jpg'],
      price: 'Desde $120.000/noche',
    },
    {
      id: 3,
      name: 'Cabaña 3',
      description: 'Cabaña acogedora con vista al paisaje natural. Perfecta para grupos familiares o grupos de amigos.',
      capacity: 6,
      features: ['Estacionamiento', 'Cocina equipada', 'Terraza', 'Baño', 'Calefacción', 'Televisión'],
      images: ['/cabañas/cabana3-1.jpg', '/cabañas/cabana3-2.jpg', '/cabañas/cabana3-3.jpg', '/cabañas/cabana3-4.jpg', '/cabañas/cabana3-5.jpg'],
      price: 'Desde $70.000/noche',
    },
    {
      id: 4,
      name: 'Cabaña 4',
      description: 'Cabaña acogedora con vista al paisaje natural. Perfecta para grupos familiares o grupos de amigos.',
      capacity: 6,
      features: ['Estacionamiento', 'Cocina equipada', 'Terraza', 'Baño', 'Calefacción', 'Televisión'],
      images: ['/cabañas/cabana4-1.jpg', '/cabañas/cabana4-2.jpg', '/cabañas/cabana4-3.jpg', '/cabañas/cabana4-4.jpg', '/cabañas/cabana4-5.jpg'],
      price: 'Desde $70.000/noche',
    },
  ]

  const openModal = (cabana) => {
    setSelectedCabana(cabana)
    setCurrentImageIndex(0)
  }

  const closeModal = useCallback(() => {
    setSelectedCabana(null)
    setCurrentImageIndex(0)
  }, [])

  // Cerrar modal con tecla ESC
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && selectedCabana) {
        closeModal()
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [selectedCabana, closeModal])

  const nextImage = () => {
    if (selectedCabana) {
      setCurrentImageIndex((prev) => 
        (prev + 1) % selectedCabana.images.length
      )
    }
  }

  const prevImage = () => {
    if (selectedCabana) {
      setCurrentImageIndex((prev) => 
        (prev - 1 + selectedCabana.images.length) % selectedCabana.images.length
      )
    }
  }

  const getFeatureIcon = (feature) => {
    const icons = {
      'Estacionamiento': Car,
      'Cocina equipada': UtensilsCrossed,
      'Terraza': Users,
      'Baño': Bath,
      '2 baños': Bath,
      'Calefacción': Thermometer,
      'Vista al paisaje': Mountain,
    }
    return icons[feature] || Users
  }

  return (
    <section id="cabanas" className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Nuestras Cabañas
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Descubre nuestras 4 cabañas únicas, cada una con su propio encanto y comodidades
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {cabanas.map((cabana, index) => (
            <motion.div
              key={cabana.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow cursor-pointer"
              onClick={() => openModal(cabana)}
            >
              <div className="relative h-64 bg-gradient-to-br from-primary-100 to-primary-200">
                <img
                  src={cabana.images[0] || '/placeholder-cabana.jpg'}
                  alt={`${cabana.name} - Cabañas Anyely Icalma`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  onError={(e) => {
                    e.target.style.display = 'none'
                  }}
                />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{cabana.name}</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">{cabana.description}</p>
                <div className="flex items-center gap-2 mb-4">
                  <Users size={20} className="text-primary-600 dark:text-primary-400" />
                  <span className="text-gray-700 dark:text-gray-300">Hasta {cabana.capacity} personas</span>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {cabana.features.map((feature) => {
                    const Icon = getFeatureIcon(feature)
                    return (
                      <span
                        key={feature}
                        className="flex items-center gap-1 text-sm bg-primary-50 dark:bg-primary-900 text-primary-700 dark:text-primary-300 px-3 py-1 rounded-full"
                      >
                        <Icon size={14} />
                        {feature}
                      </span>
                    )
                  })}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-primary-600 dark:text-primary-400">{cabana.price}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedCabana && (
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
                
                {selectedCabana.images.length > 0 && (
                  <div className="relative h-64 md:h-96 bg-gray-200">
                    <img
                      src={selectedCabana.images[currentImageIndex] || '/placeholder-cabana.jpg'}
                      alt={`${selectedCabana.name} - Imagen ${currentImageIndex + 1}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      onError={(e) => {
                        e.target.src = '/placeholder-cabana.jpg'
                      }}
                    />
                    {selectedCabana.images.length > 1 && (
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
                          {selectedCabana.images.map((_, idx) => (
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
                  <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{selectedCabana.name}</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">{selectedCabana.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center gap-2">
                      <Users size={20} className="text-primary-600 dark:text-primary-400" />
                      <span className="text-gray-700 dark:text-gray-300">Hasta {selectedCabana.capacity} personas</span>
                    </div>
                    <div>
                      <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">{selectedCabana.price}</span>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Comodidades</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedCabana.features.map((feature) => {
                        const Icon = getFeatureIcon(feature)
                        return (
                          <span
                            key={feature}
                            className="flex items-center gap-2 bg-primary-50 dark:bg-primary-900 text-primary-700 dark:text-primary-300 px-4 py-2 rounded-lg"
                          >
                            <Icon size={18} />
                            {feature}
                          </span>
                        )
                      })}
                    </div>
                  </div>

                  <a
                    href={`https://wa.me/56938780736?text=Hola,%20me%20gustaría%20reservar%20${selectedCabana.name}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full bg-primary-600 text-white text-center py-4 rounded-lg font-semibold text-lg hover:bg-primary-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                  >
                    Reservar {selectedCabana.name}
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

export default Cabanas


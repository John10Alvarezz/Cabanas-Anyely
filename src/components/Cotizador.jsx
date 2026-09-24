import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Users, Calculator, MessageCircle, Check, Sparkles, Flame, BedDouble } from 'lucide-react'
import { cabanas, tinajas } from '../data/lodgingData'

const Cotizador = () => {
  // Configuración de fechas por defecto (hoy y mañana)
  const todayStr = useMemo(() => {
    const d = new Date()
    return d.toISOString().split('T')[0]
  }, [])

  const tomorrowStr = useMemo(() => {
    const d = new Date()
    d.setDate(d.getDate() + 2)
    return d.toISOString().split('T')[0]
  }, [])

  const [selectedCabanaId, setSelectedCabanaId] = useState(1)
  const [checkIn, setCheckIn] = useState(todayStr)
  const [checkOut, setCheckOut] = useState(tomorrowStr)
  const [guests, setGuests] = useState(4)
  const [includeTinaja, setIncludeTinaja] = useState(false)

  const selectedCabana = useMemo(() => {
    return cabanas.find((c) => c.id === Number(selectedCabanaId)) || cabanas[0]
  }, [selectedCabanaId])

  // Ajustar huéspedes si la cabaña cambia y excede el máximo
  const handleCabanaChange = (id) => {
    setSelectedCabanaId(id)
    const newCabana = cabanas.find((c) => c.id === Number(id))
    if (newCabana && guests > newCabana.maxGuests) {
      setGuests(newCabana.maxGuests)
    }
  }

  // Calcular número de noches
  const nights = useMemo(() => {
    if (!checkIn || !checkOut) return 1
    const start = new Date(checkIn)
    const end = new Date(checkOut)
    const diffTime = end.getTime() - start.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays > 0 ? diffDays : 1
  }, [checkIn, checkOut])

  // Manejo de cambio en Check-in
  const handleCheckInChange = (e) => {
    const newCheckIn = e.target.value
    setCheckIn(newCheckIn)
    // Si la fecha de salida es menor o igual, ajustarla automáticamente a 1 día después
    if (newCheckIn >= checkOut) {
      const nextDay = new Date(newCheckIn)
      nextDay.setDate(nextDay.getDate() + 1)
      setCheckOut(nextDay.toISOString().split('T')[0])
    }
  }

  // Formatear precios a CLP
  const formatCLP = (amount) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const estimatedTotal = useMemo(() => {
    return selectedCabana.pricePerNight * nights
  }, [selectedCabana, nights])

  // Construir mensaje de WhatsApp
  const whatsappUrl = useMemo(() => {
    const formatDate = (dateStr) => {
      if (!dateStr) return ''
      const [year, month, day] = dateStr.split('-')
      return `${day}/${month}/${year}`
    }

    const message = `¡Hola Cabañas Anyely! 🌲
Me gustaría cotizar y consultar disponibilidad para una estadía en Icalma:

🏡 *Alojamiento:* ${selectedCabana.name} (Capacidad: hasta ${selectedCabana.capacity} personas)
📅 *Llegada (Check-in):* ${formatDate(checkIn)} (desde las 14:00 hrs)
📅 *Salida (Check-out):* ${formatDate(checkOut)} (hasta las 12:00 hrs)
🌙 *Duración:* ${nights} ${nights === 1 ? 'noche' : 'noches'}
👥 *Cantidad de huéspedes:* ${guests} ${guests === 1 ? 'persona' : 'personas'}
♨️ *Tinaja de agua caliente:* ${includeTinaja ? 'Sí, deseo consultar valor y disponibilidad por sesión (servicio adicional independiente)' : 'No en esta ocasión'}
💰 *Estimado estadía cabaña:* ${formatCLP(estimatedTotal)} CLP

¿Tienen disponibilidad para esas fechas? Muchas gracias.`

    return `https://wa.me/56938780736?text=${encodeURIComponent(message)}`
  }, [selectedCabana, checkIn, checkOut, nights, guests, includeTinaja, estimatedTotal])

  return (
    <section id="cotizador" className="py-20 bg-gradient-to-b from-primary-50/40 via-white to-primary-50/30 dark:from-gray-900 dark:via-gray-850 dark:to-gray-900 transition-colors">
      <div className="container mx-auto px-4 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-primary-100 dark:bg-primary-950/70 text-primary-700 dark:text-primary-300 px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
            <Calculator size={16} />
            <span>Planifica tu viaje</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Cotizador de Estadía
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Simula tu estadía, calcula el valor estimado y envíanos tu consulta directa con un solo clic a WhatsApp
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Formulario Interactivo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 bg-white dark:bg-gray-800 rounded-3xl p-6 md:p-8 shadow-xl border border-gray-100 dark:border-gray-700"
          >
            {/* 1. Selector de Cabaña */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                <BedDouble size={18} className="text-primary-600 dark:text-primary-400" />
                <span>1. Selecciona la cabaña:</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                {cabanas.map((c) => {
                  const isSelected = selectedCabana.id === c.id
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => handleCabanaChange(c.id)}
                      className={`p-3.5 rounded-2xl border text-left transition-all relative overflow-hidden flex flex-col justify-between ${
                        isSelected
                          ? 'border-primary-600 bg-primary-50/70 dark:bg-primary-950/40 text-primary-900 dark:text-primary-100 shadow-sm ring-2 ring-primary-500/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-gray-50/50 dark:bg-gray-800/60 text-gray-800 dark:text-gray-200'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-bold text-base">{c.name}</span>
                        {isSelected && (
                          <span className="w-5 h-5 rounded-full bg-primary-600 text-white flex items-center justify-center text-xs">
                            <Check size={12} strokeWidth={3} />
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                        Hasta {c.capacity} personas
                      </span>
                      <span className="text-xs font-semibold text-primary-700 dark:text-primary-400">
                        {formatCLP(c.pricePerNight)} / noche
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* 2. Selector de Fechas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                  <Calendar size={18} className="text-primary-600 dark:text-primary-400" />
                  <span>Llegada (Check-in):</span>
                </label>
                <input
                  type="date"
                  min={todayStr}
                  value={checkIn}
                  onChange={handleCheckInChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-white font-medium focus:ring-2 focus:ring-primary-500 focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                  <Calendar size={18} className="text-primary-600 dark:text-primary-400" />
                  <span>Salida (Check-out):</span>
                </label>
                <input
                  type="date"
                  min={checkIn}
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-white font-medium focus:ring-2 focus:ring-primary-500 focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* 3. Selector de Huéspedes */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Users size={18} className="text-primary-600 dark:text-primary-400" />
                  <span>Cantidad de huéspedes:</span>
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Máximo {selectedCabana.maxGuests} personas
                </span>
              </label>
              <div className="flex items-center justify-between p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50">
                <span className="text-gray-700 dark:text-gray-300 font-medium pl-2">
                  {guests} {guests === 1 ? 'persona' : 'personas'}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setGuests((g) => Math.max(1, g - 1))}
                    disabled={guests <= 1}
                    className="w-10 h-10 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center font-bold text-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-40 transition-colors"
                  >
                    -
                  </button>
                  <button
                    type="button"
                    onClick={() => setGuests((g) => Math.min(selectedCabana.maxGuests, g + 1))}
                    disabled={guests >= selectedCabana.maxGuests}
                    className="w-10 h-10 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center font-bold text-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-40 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* 4. Adicional Tinaja */}
            <div className="pt-2 border-t border-gray-100 dark:border-gray-700">
              <label className="flex items-start gap-3 cursor-pointer p-3 rounded-xl hover:bg-primary-50/50 dark:hover:bg-gray-750 transition-colors">
                <input
                  type="checkbox"
                  checked={includeTinaja}
                  onChange={(e) => setIncludeTinaja(e.target.checked)}
                  className="mt-1 w-5 h-5 rounded text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-600 cursor-pointer"
                />
                <div>
                  <div className="flex items-center gap-2 font-semibold text-gray-800 dark:text-gray-200">
                    <Flame size={16} className="text-amber-500" />
                    <span>¿Deseas consultar por Tinaja de agua caliente?</span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    <strong>Servicio adicional con valor aparte</strong> (no está incluida en el arriendo de la cabaña; se prepara a leña y se coordina valor y horario según disponibilidad).
                  </p>
                </div>
              </label>
            </div>
          </motion.div>

          {/* Resumen y Envío a WhatsApp */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 bg-gradient-to-br from-gray-900 to-gray-800 text-white rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden flex flex-col justify-between"
          >
            {/* Efecto de fondo sutil */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-primary-500/10 rounded-full blur-3xl pointer-events-none" />

            <div>
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-700">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <Sparkles size={20} className="text-primary-400" />
                  <span>Resumen de Estadía</span>
                </h3>
                <span className="text-xs bg-primary-900/60 text-primary-300 font-semibold px-2.5 py-1 rounded-full border border-primary-500/30">
                  {nights} {nights === 1 ? 'noche' : 'noches'}
                </span>
              </div>

              {/* Imagen y Detalle de la cabaña */}
              <div className="flex items-center gap-4 mb-6 p-3 bg-gray-800/80 rounded-2xl border border-gray-700">
                <img
                  src={selectedCabana.images[0]}
                  alt={selectedCabana.name}
                  className="w-16 h-16 rounded-xl object-cover"
                />
                <div>
                  <h4 className="font-bold text-lg text-white">{selectedCabana.name}</h4>
                  <p className="text-xs text-gray-400">Hasta {selectedCabana.capacity} personas</p>
                  <p className="text-sm font-semibold text-primary-400 mt-0.5">
                    {formatCLP(selectedCabana.pricePerNight)} <span className="text-xs text-gray-400 font-normal">/ noche</span>
                  </p>
                </div>
              </div>

              {/* Lista de desglose */}
              <div className="space-y-3 text-sm text-gray-300 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-400">Noches seleccionadas:</span>
                  <span className="font-semibold text-white">{nights}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Huéspedes:</span>
                  <span className="font-semibold text-white">{guests} personas</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Estadía cabaña ({nights} x {formatCLP(selectedCabana.pricePerNight)}):</span>
                  <span className="font-semibold text-white">{formatCLP(estimatedTotal)}</span>
                </div>
                {includeTinaja && (
                  <div className="flex justify-between items-center text-amber-300 text-xs bg-amber-950/40 p-2.5 rounded-lg border border-amber-500/30">
                    <span className="flex items-center gap-1.5 font-medium">
                      <Flame size={14} /> Tinaja de agua caliente:
                    </span>
                    <span className="font-semibold">Valor aparte (a consultar)</span>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-gray-700 mb-6">
                <div className="flex justify-between items-baseline">
                  <span className="text-sm text-gray-400 font-medium">Total estimado cabaña:</span>
                  <span className="text-3xl font-extrabold text-primary-400">
                    {formatCLP(estimatedTotal)}
                  </span>
                </div>
                <p className="text-[11px] text-gray-400 mt-1">
                  * El valor estimado incluye exclusivamente el arriendo de la cabaña. La tinaja es un servicio opcional con cobro independiente.
                </p>
              </div>
            </div>

            {/* Botón WhatsApp */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-4 px-6 rounded-2xl flex items-center justify-center gap-3 shadow-lg hover:shadow-green-500/20 transform hover:scale-[1.02] transition-all text-base"
            >
              <MessageCircle size={22} className="text-white fill-white/20" />
              <span>Consultar Disponibilidad por WhatsApp</span>
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Cotizador

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Calendar, User, Phone, DollarSign, AlertCircle, CheckCircle2, Clock, MessageSquare, Info, ShieldAlert } from 'lucide-react'
import { CABIN_CONFIG, PAYMENT_STATUS } from '../../data/adminCabinConfig'
import { findDateConflicts } from '../../services/reservationService'

const ReservationFormModal = ({
  isOpen,
  onClose,
  onSave,
  reservationToEdit = null,
  initialCabinId = 1,
  initialDate = null,
  existingReservations = []
}) => {
  const [formData, setFormData] = useState({
    cabana_id: 1,
    guest_name: '',
    guest_phone: '',
    guest_email: '',
    check_in: '',
    check_out: '',
    guests_count: 2,
    nights: 1,
    total_price: 70000,
    paid_amount: 35000,
    payment_status: 'paid_half',
    payment_method: 'transferencia',
    notes: ''
  })

  const [dateError, setDateError] = useState('')
  const [activeConflicts, setActiveConflicts] = useState([])
  const [sameDayTransitions, setSameDayTransitions] = useState({ checkInTransition: null, checkOutTransition: null })

  // Inicializar o cargar datos
  useEffect(() => {
    if (isOpen) {
      if (reservationToEdit) {
        setFormData({
          ...reservationToEdit,
          cabana_id: Number(reservationToEdit.cabana_id),
          guests_count: Number(reservationToEdit.guests_count || 1),
          total_price: Number(reservationToEdit.total_price || 0),
          paid_amount: Number(reservationToEdit.paid_amount || 0),
        })
      } else {
        const today = new Date()
        const tomorrow = new Date(today)
        tomorrow.setDate(tomorrow.getDate() + 1)

        const formatDate = (d) => {
          const y = d.getFullYear()
          const m = String(d.getMonth() + 1).padStart(2, '0')
          const day = String(d.getDate()).padStart(2, '0')
          return `${y}-${m}-${day}`
        }

        const checkInStr = initialDate || formatDate(today)
        const checkInDateObj = new Date(checkInStr + 'T00:00:00')
        const nextDay = new Date(checkInDateObj)
        nextDay.setDate(nextDay.getDate() + 1)
        const checkOutStr = formatDate(nextDay)

        const basePrice = CABIN_CONFIG[initialCabinId]?.basePrice || 70000

        setFormData({
          cabana_id: Number(initialCabinId) || 1,
          guest_name: '',
          guest_phone: '',
          guest_email: '',
          check_in: checkInStr,
          check_out: checkOutStr,
          guests_count: 2,
          nights: 1,
          total_price: basePrice,
          paid_amount: Math.round(basePrice * 0.5),
          payment_status: 'paid_half',
          payment_method: 'transferencia',
          notes: ''
        })
      }
      setDateError('')
      setActiveConflicts([])
    }
  }, [isOpen, reservationToEdit, initialCabinId, initialDate])

  // Recalcular noches y validar fechas
  useEffect(() => {
    if (!formData.check_in || !formData.check_out) return

    const start = new Date(formData.check_in + 'T00:00:00')
    const end = new Date(formData.check_out + 'T00:00:00')
    const diffTime = end.getTime() - start.getTime()
    const diffDays = Math.round(diffTime / (1000 * 3600 * 24))

    if (diffDays <= 0) {
      setDateError('La fecha de salida debe ser posterior a la de llegada (mínimo 1 noche).')
      setActiveConflicts([])
      return
    }

    setDateError('')

    // Recalcular precio total si cambiaron las noches
    if (diffDays !== formData.nights) {
      const basePerNight = CABIN_CONFIG[formData.cabana_id]?.basePrice || 70000
      const newTotal = basePerNight * diffDays
      
      setFormData((prev) => {
        let newPaid = prev.paid_amount
        let newStatus = prev.payment_status

        if (prev.payment_status === 'paid_half') {
          newPaid = Math.round(newTotal * 0.5)
        } else if (prev.payment_status === 'paid_full') {
          newPaid = newTotal
        }

        return {
          ...prev,
          nights: diffDays,
          total_price: newTotal,
          paid_amount: newPaid,
          payment_status: newStatus
        }
      })
    }

    // Comprobar conflictos reales de noches ocupadas
    const conflicts = findDateConflicts(
      formData.check_in,
      formData.check_out,
      formData.cabana_id,
      existingReservations,
      reservationToEdit?.id
    )
    setActiveConflicts(conflicts)

    // Detectar si hay transiciones legítimas el mismo día (recambio: salida a las 11:00 y llegada a las 15:00)
    const inTransition = existingReservations.find((r) => {
      if (reservationToEdit && r.id === reservationToEdit.id) return false
      return Number(r.cabana_id) === Number(formData.cabana_id) && r.check_out === formData.check_in
    })

    const outTransition = existingReservations.find((r) => {
      if (reservationToEdit && r.id === reservationToEdit.id) return false
      return Number(r.cabana_id) === Number(formData.cabana_id) && r.check_in === formData.check_out
    })

    setSameDayTransitions({
      checkInTransition: inTransition || null,
      checkOutTransition: outTransition || null
    })
  }, [formData.check_in, formData.check_out, formData.cabana_id, existingReservations, reservationToEdit])

  if (!isOpen) return null

  const handleCabinChange = (cabanaId) => {
    const cid = Number(cabanaId)
    const base = CABIN_CONFIG[cid]?.basePrice || 70000
    const nights = formData.nights || 1
    const newTotal = base * nights
    const newPaid = formData.payment_status === 'paid_half'
      ? Math.round(newTotal * 0.5)
      : (formData.payment_status === 'paid_full' ? newTotal : formData.paid_amount)

    setFormData((prev) => ({
      ...prev,
      cabana_id: cid,
      total_price: newTotal,
      paid_amount: newPaid
    }))
  }

  const handlePaidPreset = (type) => {
    const total = Number(formData.total_price) || 0
    if (type === 'half') {
      const half = Math.round(total * 0.5)
      setFormData((prev) => ({
        ...prev,
        paid_amount: half,
        payment_status: 'paid_half'
      }))
    } else if (type === 'full') {
      setFormData((prev) => ({
        ...prev,
        paid_amount: total,
        payment_status: 'paid_full'
      }))
    } else if (type === 'zero') {
      setFormData((prev) => ({
        ...prev,
        paid_amount: 0,
        payment_status: 'pending'
      }))
    }
  }

  const balanceDue = Math.max(0, (Number(formData.total_price) || 0) - (Number(formData.paid_amount) || 0))
  const hasConflict = activeConflicts.length > 0

  const handleSubmit = (e) => {
    e.preventDefault()
    if (hasConflict) {
      alert('No es posible guardar: Las fechas seleccionadas ya están ocupadas por otra reserva en esta cabaña.')
      return
    }
    if (!formData.guest_name.trim()) {
      alert('Por favor ingresa el nombre del huésped')
      return
    }
    if (dateError) {
      alert(dateError)
      return
    }

    let status = formData.payment_status
    const paid = Number(formData.paid_amount) || 0
    const total = Number(formData.total_price) || 0

    if (paid >= total && total > 0) {
      status = 'paid_full'
    } else if (paid === Math.round(total * 0.5) && total > 0) {
      status = 'paid_half'
    } else if (paid > 0) {
      status = 'paid_partial'
    } else {
      status = 'pending'
    }

    onSave({
      ...formData,
      payment_status: status,
      balance_due: balanceDue
    })
  }

  const currentCabin = CABIN_CONFIG[formData.cabana_id] || CABIN_CONFIG[1]

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.22 }}
          className="relative w-full sm:max-w-2xl bg-white dark:bg-gray-900 rounded-t-3xl sm:rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-800 flex flex-col max-h-[92vh] sm:max-h-[85vh] overflow-hidden"
        >
          {/* Header con color de cabaña */}
          <div className={`p-4 sm:p-5 bg-gradient-to-r ${currentCabin.theme.gradient} text-white shrink-0 relative`}>
            <button
              onClick={onClose}
              className="absolute top-3.5 right-3.5 p-2 text-white/80 hover:text-white bg-black/20 hover:bg-black/30 rounded-full transition-colors"
            >
              <X size={18} />
            </button>
            <div className="flex items-center gap-3 pr-8">
              <div className="p-2 bg-white/20 backdrop-blur-md rounded-xl text-white">
                <Calendar size={20} />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold leading-tight">
                  {reservationToEdit ? 'Editar Reserva' : 'Nueva Reserva Manual'}
                </h3>
                <p className="text-white/80 text-xs mt-0.5">
                  {currentCabin.name} • Capacidad hasta {currentCabin.capacity} personas
                </p>
              </div>
            </div>
          </div>

          {/* Formulario Scrolleable */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {/* Selector de Cabañas */}
            <div>
              <label className="block text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                Cabaña Asignada
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[1, 2, 3, 4].map((id) => {
                  const c = CABIN_CONFIG[id]
                  const isSelected = formData.cabana_id === id
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => handleCabinChange(id)}
                      className={`p-2.5 sm:p-3 rounded-2xl border text-left transition-all ${
                        isSelected
                          ? `${c.theme.border} ${c.theme.bgCard} ring-2 ${c.theme.ring} shadow-xs`
                          : 'border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/40 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className={`w-2.5 h-2.5 rounded-full ${c.theme.dot}`} />
                        <span className="text-[10px] text-gray-400 font-medium">{c.tag}</span>
                      </div>
                      <div className="font-bold text-xs sm:text-sm text-gray-900 dark:text-white truncate">
                        {c.name}
                      </div>
                      <div className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5 font-medium">
                        ${c.basePrice.toLocaleString('es-CL')}/noche
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* ALERTA DE CONFLICTO BLOQUEANTE (NO PERMITE SOBREESCRIBIR) */}
            {hasConflict && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3.5 bg-rose-50 dark:bg-rose-950/50 border-2 border-rose-500 rounded-2xl text-xs text-rose-900 dark:text-rose-200 space-y-1"
              >
                <div className="flex items-center gap-1.5 font-bold text-rose-700 dark:text-rose-300">
                  <ShieldAlert size={17} className="shrink-0" />
                  <span>¡Fechas Ocupadas! Conflicto Detectado</span>
                </div>
                {activeConflicts.map((c) => (
                  <p key={c.id} className="text-[11px] text-rose-800 dark:text-rose-300 pl-6">
                    • Cabaña {formData.cabana_id} ya está reservada por <strong className="font-bold">{c.guest_name}</strong> desde el {c.check_in} hasta el {c.check_out}.
                  </p>
                ))}
                <p className="text-[11px] text-rose-600 dark:text-rose-400 pl-6 pt-1 font-medium">
                  El sistema NO permite sobreescribir reservas activas. Debes elegir fechas disponibles o modificar la reserva anterior.
                </p>
              </motion.div>
            )}

            {/* AVISOS DE DÍA DE RECAMBIO (SALIDA 11:00 Y LLEGADA 15:00) */}
            {(sameDayTransitions.checkInTransition || sameDayTransitions.checkOutTransition) && !hasConflict && (
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 rounded-2xl text-xs text-emerald-900 dark:text-emerald-200 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-emerald-700 dark:text-emerald-300">
                  <Info size={16} />
                  <span>Día de Recambio Coordinado</span>
                </div>
                {sameDayTransitions.checkInTransition && (
                  <p className="text-[11px] pl-5">
                    • El día de llegada ({formData.check_in}), sale <span className="font-semibold">{sameDayTransitions.checkInTransition.guest_name}</span> a las 11:00 hrs. El nuevo huésped ingresa a partir de las 15:00 hrs.
                  </p>
                )}
                {sameDayTransitions.checkOutTransition && (
                  <p className="text-[11px] pl-5">
                    • El día de salida ({formData.check_out}), llega <span className="font-semibold">{sameDayTransitions.checkOutTransition.guest_name}</span> a partir de las 15:00 hrs. La entrega debe ser antes de las 11:00 hrs.
                  </p>
                )}
              </div>
            )}

            {/* Fechas de Llegada y Salida */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Día de Llegada (Check-in) *
                </label>
                <input
                  type="date"
                  required
                  value={formData.check_in}
                  onChange={(e) => setFormData({ ...formData, check_in: e.target.value })}
                  className="w-full py-2.5 px-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Día de Salida (Check-out) *
                </label>
                <input
                  type="date"
                  required
                  value={formData.check_out}
                  onChange={(e) => setFormData({ ...formData, check_out: e.target.value })}
                  className="w-full py-2.5 px-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            {dateError && (
              <p className="text-xs text-rose-500 font-medium -mt-1">{dateError}</p>
            )}

            {/* Noches y Personas */}
            <div className="grid grid-cols-2 gap-3 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-2xl border border-gray-100 dark:border-gray-800">
              <div>
                <span className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Noches</span>
                <div className="text-sm sm:text-base font-bold text-gray-900 dark:text-white flex items-center gap-1.5 mt-0.5">
                  <Clock size={15} className="text-primary-600" />
                  <span>{formData.nights} {formData.nights === 1 ? 'noche' : 'noches'}</span>
                </div>
              </div>

              <div>
                <label className="block text-[10px] text-gray-500 uppercase tracking-wider font-semibold mb-1">
                  Huéspedes (máx. {currentCabin.capacity})
                </label>
                <input
                  type="number"
                  min="1"
                  max={currentCabin.capacity + 2}
                  value={formData.guests_count}
                  onChange={(e) => setFormData({ ...formData, guests_count: Number(e.target.value) })}
                  className="w-full py-1.5 px-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-xs font-bold text-gray-900 dark:text-white text-center"
                />
              </div>
            </div>

            {/* Datos del Huésped */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1">
                  <User size={13} className="text-gray-400" />
                  <span>Nombre del Huésped *</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Marcelo Fuentes"
                  value={formData.guest_name}
                  onChange={(e) => setFormData({ ...formData, guest_name: e.target.value })}
                  className="w-full py-2.5 px-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1">
                  <Phone size={13} className="text-gray-400" />
                  <span>Teléfono / WhatsApp</span>
                </label>
                <input
                  type="tel"
                  placeholder="+569..."
                  value={formData.guest_phone}
                  onChange={(e) => setFormData({ ...formData, guest_phone: e.target.value })}
                  className="w-full py-2.5 px-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            {/* LÓGICA DE PAGOS Y ABONOS */}
            <div className="p-3.5 sm:p-4 bg-gray-50 dark:bg-gray-800/70 rounded-2xl border border-gray-200 dark:border-gray-700 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-800 dark:text-gray-200 flex items-center gap-1.5">
                  <DollarSign size={15} className="text-emerald-500" />
                  Gestión de Pago y Abonos
                </span>
                <span className="text-[10px] text-gray-400">Valores en pesos ($)</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                    Total Estadía
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-gray-400 text-sm">$</span>
                    <input
                      type="number"
                      value={formData.total_price}
                      onChange={(e) => {
                        const total = Number(e.target.value)
                        setFormData((prev) => ({
                          ...prev,
                          total_price: total,
                          paid_amount: prev.payment_status === 'paid_half' ? Math.round(total * 0.5) : prev.paid_amount
                        }))
                      }}
                      className="w-full pl-7 pr-3 py-1.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-bold text-gray-900 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                    Monto Abonado
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-gray-400 text-sm">$</span>
                    <input
                      type="number"
                      value={formData.paid_amount}
                      onChange={(e) => setFormData({ ...formData, paid_amount: Number(e.target.value) })}
                      className="w-full pl-7 pr-3 py-1.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-bold text-emerald-600 dark:text-emerald-400"
                    />
                  </div>
                </div>
              </div>

              {/* Botones de atajo rápido de abono */}
              <div>
                <span className="text-[10px] text-gray-500 dark:text-gray-400 block mb-1">
                  Atajos rápidos:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => handlePaidPreset('half')}
                    className="px-2.5 py-1 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 dark:bg-amber-950/60 dark:text-amber-300 text-xs font-bold transition-colors border border-amber-300 dark:border-amber-800"
                  >
                    Abonó 50% (${Math.round((formData.total_price || 0) * 0.5).toLocaleString('es-CL')})
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePaidPreset('full')}
                    className="px-2.5 py-1 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-300 text-xs font-bold transition-colors border border-emerald-300 dark:border-emerald-800"
                  >
                    Pagó 100% (${(formData.total_price || 0).toLocaleString('es-CL')})
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePaidPreset('zero')}
                    className="px-2.5 py-1 rounded-lg bg-rose-100 hover:bg-rose-200 text-rose-900 dark:bg-rose-950/60 dark:text-rose-300 text-xs font-bold transition-colors border border-rose-300 dark:border-rose-800"
                  >
                    Sin Abono ($0)
                  </button>
                </div>
              </div>

              {/* Tarjeta de Saldo */}
              <div className={`p-2.5 rounded-xl border flex items-center justify-between ${
                balanceDue > 0
                  ? 'bg-amber-50/90 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800'
                  : 'bg-emerald-50/90 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800'
              }`}>
                <div className="flex items-center gap-2">
                  {balanceDue > 0 ? (
                    <Clock size={16} className="text-amber-600 dark:text-amber-400" />
                  ) : (
                    <CheckCircle2 size={16} className="text-emerald-600 dark:text-emerald-400" />
                  )}
                  <div>
                    <div className="text-xs font-bold text-gray-800 dark:text-gray-200">
                      {balanceDue > 0 ? 'Saldo a cobrar al llegar:' : '¡Pagado en su totalidad!'}
                    </div>
                  </div>
                </div>
                <div className={`text-sm sm:text-base font-black ${
                  balanceDue > 0 ? 'text-amber-700 dark:text-amber-400' : 'text-emerald-700 dark:text-emerald-400'
                }`}>
                  ${balanceDue.toLocaleString('es-CL')}
                </div>
              </div>
            </div>

            {/* Notas */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1">
                <MessageSquare size={13} className="text-gray-400" />
                <span>Notas u Observaciones</span>
              </label>
              <textarea
                rows={2}
                placeholder="Ej: Hora estimada de llegada, requiere tinaja, leña, etc."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full py-2 px-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs text-gray-900 dark:text-white outline-none resize-none"
              />
            </div>
          </form>

          {/* Footer Fijo con botones de acción (Accesibles en móvil siempre) */}
          <div className="p-3 sm:p-4 bg-gray-50 dark:bg-gray-850 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between gap-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="button"
              disabled={hasConflict || !!dateError}
              onClick={handleSubmit}
              className={`py-2.5 px-5 sm:px-6 rounded-xl text-xs sm:text-sm font-bold text-white transition-all shadow-md ${
                hasConflict || !!dateError
                  ? 'bg-gray-400 cursor-not-allowed opacity-60'
                  : 'bg-primary-600 hover:bg-primary-700 shadow-primary-600/20 active:scale-95'
              }`}
            >
              {hasConflict ? 'Fechas No Disponibles' : (reservationToEdit ? 'Guardar Cambios' : 'Registrar Reserva')}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

export default ReservationFormModal

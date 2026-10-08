import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Search, Filter, MessageCircle, Edit3, Trash2, Calendar, Phone, DollarSign, User, Plus, ArrowUpDown, CheckCircle2 } from 'lucide-react'
import { CABIN_CONFIG, PAYMENT_STATUS } from '../../data/adminCabinConfig'

const ReservationListView = ({
  reservations = [],
  onEditReservation,
  onDeleteReservation,
  onNewReservation,
  onMarkAsPaid
}) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCabin, setFilterCabin] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [sortBy, setSortBy] = useState('check_in_asc') // 'check_in_asc', 'check_in_desc', 'total_desc'

  const filteredReservations = useMemo(() => {
    return reservations
      .filter((r) => {
        // Filtro de texto
        if (searchTerm.trim()) {
          const term = searchTerm.toLowerCase()
          const nameMatch = r.guest_name?.toLowerCase().includes(term)
          const phoneMatch = r.guest_phone?.includes(term)
          const notesMatch = r.notes?.toLowerCase().includes(term)
          if (!nameMatch && !phoneMatch && !notesMatch) return false
        }

        // Filtro cabaña
        if (filterCabin !== 'all' && Number(r.cabana_id) !== Number(filterCabin)) {
          return false
        }

        // Filtro estado
        if (filterStatus !== 'all' && r.payment_status !== filterStatus) {
          return false
        }

        return true
      })
      .sort((a, b) => {
        if (sortBy === 'check_in_asc') {
          return new Date(a.check_in) - new Date(b.check_in)
        }
        if (sortBy === 'check_in_desc') {
          return new Date(b.check_in) - new Date(a.check_in)
        }
        if (sortBy === 'total_desc') {
          return Number(b.total_price) - Number(a.total_price)
        }
        return 0
      })
  }, [reservations, searchTerm, filterCabin, filterStatus, sortBy])

  const openWhatsApp = (phone, guestName, cabinId, checkIn, checkOut, balance) => {
    if (!phone) {
      alert('Esta reserva no tiene número telefónico registrado.')
      return
    }
    const cleanPhone = phone.replace(/\D/g, '')
    const cabinName = CABIN_CONFIG[cabinId]?.name || `Cabaña ${cabinId}`
    let text = `Hola ${guestName}, te contactamos de Cabañas Anyely Icalma sobre tu reserva en ${cabinName} del ${checkIn} al ${checkOut}.`
    if (balance > 0) {
      text += ` Te recordamos que tienes un saldo pendiente por pagar de $${balance.toLocaleString('es-CL')}.`
    }
    text += ` ¡Te esperamos con mucho gusto!`
    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`
    window.open(url, '_blank')
  }

  return (
    <div className="space-y-4">
      {/* Barra de Filtros y Búsqueda */}
      <div className="bg-white dark:bg-gray-800/80 p-4 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          {/* Buscador */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Buscar por nombre, teléfono o nota..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-primary-500 outline-none"
            />
          </div>

          {/* Botón Nueva Reserva */}
          <button
            onClick={() => onNewReservation()}
            className="py-2.5 px-4 bg-primary-600 hover:bg-primary-700 text-white font-semibold text-xs rounded-2xl shadow-md shadow-primary-600/20 active:scale-95 transition-all flex items-center justify-center gap-2 shrink-0"
          >
            <Plus size={16} />
            <span>Nueva Reserva</span>
          </button>
        </div>

        {/* Filtros rápidos en fila */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-gray-100 dark:border-gray-700/50 text-xs">
          <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 font-medium mr-1">
            <Filter size={14} />
            <span>Cabaña:</span>
          </div>
          <button
            onClick={() => setFilterCabin('all')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
              filterCabin === 'all'
                ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
            }`}
          >
            Todas
          </button>
          {[1, 2, 3, 4].map((id) => (
            <button
              key={id}
              onClick={() => setFilterCabin(id)}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors flex items-center gap-1 ${
                filterCabin === id
                  ? `${CABIN_CONFIG[id].theme.badge}`
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${filterCabin === id ? 'bg-white' : CABIN_CONFIG[id].theme.dot}`} />
              <span>Cabaña {id}</span>
            </button>
          ))}

          <span className="text-gray-300 dark:text-gray-700 mx-1">|</span>

          {/* Estado de pago */}
          <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 font-medium mr-1">
            <span>Pago:</span>
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="py-1 px-2.5 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-xs text-gray-800 dark:text-gray-200 font-medium"
          >
            <option value="all">Todos los estados</option>
            <option value="paid_half">50% Abonado</option>
            <option value="paid_full">Pagado 100%</option>
            <option value="paid_partial">Abono Parcial</option>
            <option value="pending">Sin Abono</option>
          </select>

          {/* Ordenar */}
          <div className="ml-auto flex items-center gap-1 text-gray-500">
            <ArrowUpDown size={14} />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="py-1 px-2 bg-transparent text-xs text-gray-700 dark:text-gray-300 font-medium outline-none cursor-pointer"
            >
              <option value="check_in_asc">Llegada (Próxima primero)</option>
              <option value="check_in_desc">Llegada (Más lejana)</option>
              <option value="total_desc">Mayor Monto Total</option>
            </select>
          </div>
        </div>
      </div>

      {/* Contador de resultados */}
      <div className="text-xs text-gray-500 px-2 flex items-center justify-between">
        <span>Mostrando {filteredReservations.length} de {reservations.length} reservas registradas</span>
      </div>

      {/* Lista de Reservas (Cards en móvil, tabla en desktop) */}
      <div className="space-y-3">
        {filteredReservations.length === 0 ? (
          <div className="bg-white dark:bg-gray-900 rounded-3xl p-10 text-center border border-gray-200 dark:border-gray-800">
            <Calendar className="mx-auto text-gray-400 mb-3" size={36} />
            <h4 className="font-bold text-gray-800 dark:text-gray-200">No se encontraron reservas</h4>
            <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
              Prueba cambiando los filtros o registra una nueva reserva con el botón superior.
            </p>
          </div>
        ) : (
          filteredReservations.map((r) => {
            const cabin = CABIN_CONFIG[r.cabana_id] || CABIN_CONFIG[1]
            const pStatus = PAYMENT_STATUS[r.payment_status] || PAYMENT_STATUS.pending
            const balance = Number(r.balance_due) || 0
            const total = Number(r.total_price) || 0
            const paid = Number(r.paid_amount) || 0

            return (
              <motion.div
                key={r.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`bg-white dark:bg-gray-900 rounded-2xl border ${cabin.theme.border} p-4 shadow-xs hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4`}
              >
                {/* Info Cabaña y Huésped */}
                <div className="flex items-start gap-3.5">
                  <div className={`w-12 h-12 rounded-2xl flex flex-col items-center justify-center font-bold text-white shrink-0 bg-gradient-to-br ${cabin.theme.gradient} shadow-sm`}>
                    <span className="text-[10px] uppercase tracking-tighter">Cab</span>
                    <span className="text-lg leading-none">{r.cabana_id}</span>
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="font-bold text-base text-gray-900 dark:text-white">
                        {r.guest_name}
                      </h4>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${pStatus.badgeLight}`}>
                        {pStatus.label}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500 dark:text-gray-400 mt-1">
                      <span className="flex items-center gap-1 font-medium text-gray-700 dark:text-gray-300">
                        <Calendar size={13} className="text-primary-600" />
                        {r.check_in} ➔ {r.check_out} ({r.nights} {r.nights === 1 ? 'noche' : 'noches'})
                      </span>
                      <span>• {r.guests_count} huéspedes</span>
                      {r.guest_phone && (
                        <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400 font-mono">
                          <Phone size={12} />
                          {r.guest_phone}
                        </span>
                      )}
                    </div>

                    {r.notes && (
                      <div className="text-xs text-gray-600 dark:text-gray-400 italic bg-gray-50 dark:bg-gray-800/60 py-1 px-2.5 rounded-lg mt-2 inline-block">
                        Nota: "{r.notes}"
                      </div>
                    )}
                  </div>
                </div>

                {/* Dinero & Acciones */}
                <div className="flex items-center justify-between md:justify-end gap-5 pt-3 md:pt-0 border-t md:border-t-0 border-gray-100 dark:border-gray-800">
                  {/* Montos */}
                  <div className="text-right">
                    <div className="text-xs text-gray-500">
                      Total: <span className="font-bold text-gray-900 dark:text-white">${total.toLocaleString('es-CL')}</span>
                    </div>
                    <div className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                      Abonado: ${paid.toLocaleString('es-CL')}
                    </div>
                    {balance > 0 ? (
                      <div className="text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-md mt-0.5">
                        Por cobrar: ${balance.toLocaleString('es-CL')}
                      </div>
                    ) : (
                      <div className="text-[11px] text-emerald-700 dark:text-emerald-300 font-semibold">
                        ✓ Saldo saldado
                      </div>
                    )}
                  </div>

                  {/* Botones de Acción */}
                  <div className="flex items-center gap-1.5 flex-wrap justify-end">
                    {/* Botón directo para saldar saldo sin entrar a editar */}
                    {balance > 0 && onMarkAsPaid && (
                      <button
                        onClick={() => {
                          if (confirm(`¿Marcar como PAGADO el saldo restante de $${balance.toLocaleString('es-CL')} para ${r.guest_name}?`)) {
                            onMarkAsPaid(r.id)
                          }
                        }}
                        className="py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs"
                        title="Registrar que el huésped pagó el saldo restante (100% Pagado)"
                      >
                        <CheckCircle2 size={15} />
                        <span>Pagó Saldo</span>
                      </button>
                    )}

                    {/* WhatsApp directo */}
                    {r.guest_phone && (
                      <button
                        onClick={() => openWhatsApp(r.guest_phone, r.guest_name, r.cabana_id, r.check_in, r.check_out, balance)}
                        className="p-2.5 rounded-xl bg-green-50 hover:bg-green-100 text-green-600 dark:bg-green-950/50 dark:text-green-400 dark:hover:bg-green-900/50 transition-colors"
                        title="Enviar WhatsApp al huésped"
                      >
                        <MessageCircle size={17} />
                      </button>
                    )}

                    {/* Editar */}
                    <button
                      onClick={() => onEditReservation(r)}
                      className="p-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
                      title="Editar reserva"
                    >
                      <Edit3 size={17} />
                    </button>

                    {/* Eliminar */}
                    <button
                      onClick={() => {
                        if (confirm(`¿Estás seguro de eliminar la reserva de ${r.guest_name} en Cabaña ${r.cabana_id}?`)) {
                          onDeleteReservation(r.id)
                        }
                      }}
                      className="p-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400 dark:hover:bg-rose-900/50 transition-colors"
                      title="Eliminar reserva"
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                </div>
              </motion.div>
            )
          })
        )}
      </div>
    </div>
  )
}

export default ReservationListView

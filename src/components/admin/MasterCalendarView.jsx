import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Calendar as CalendarIcon,
  List,
  Grid,
  Clock,
  ArrowRight,
  DollarSign
} from 'lucide-react'
import { CABIN_CONFIG, PAYMENT_STATUS } from '../../data/adminCabinConfig'

const MasterCalendarView = ({
  reservations = [],
  onSelectReservation,
  onNewReservationAtDate
}) => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [filterCabin, setFilterCabin] = useState('all') // 'all' or 1, 2, 3, 4
  const [viewType, setViewType] = useState('calendar') // 'calendar' or 'agenda' (ideal para celular)

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ]

  const dayNames = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1))
  }

  const handleToday = () => {
    setCurrentDate(new Date())
  }

  // Generar días para el calendario
  const firstDayOfMonth = new Date(year, month, 1)
  const lastDayOfMonth = new Date(year, month + 1, 0)
  const totalDays = lastDayOfMonth.getDate()

  let startingDayOfWeek = firstDayOfMonth.getDay() - 1
  if (startingDayOfWeek === -1) startingDayOfWeek = 6

  const prevMonthLastDay = new Date(year, month, 0).getDate()
  const prevDays = []
  for (let i = startingDayOfWeek - 1; i >= 0; i--) {
    prevDays.push({
      day: prevMonthLastDay - i,
      monthOffset: -1,
      dateString: `${year}-${String(month).padStart(2, '0')}-${String(prevMonthLastDay - i).padStart(2, '0')}`
    })
  }

  const currentMonthDays = []
  for (let d = 1; d <= totalDays; d++) {
    const formattedMonth = String(month + 1).padStart(2, '0')
    const formattedDay = String(d).padStart(2, '0')
    currentMonthDays.push({
      day: d,
      monthOffset: 0,
      dateString: `${year}-${formattedMonth}-${formattedDay}`
    })
  }

  const remainingDaysCount = (7 - ((prevDays.length + currentMonthDays.length) % 7)) % 7
  const nextDays = []
  for (let d = 1; d <= remainingDaysCount; d++) {
    const formattedMonth = String(month + 2).padStart(2, '0')
    const formattedDay = String(d).padStart(2, '0')
    nextDays.push({
      day: d,
      monthOffset: 1,
      dateString: `${year}-${formattedMonth}-${formattedDay}`
    })
  }

  const allCalendarCells = [...prevDays, ...currentMonthDays, ...nextDays]
  const todayStr = new Date().toISOString().slice(0, 10)

  // Obtener eventos para una fecha específica
  const getDayEvents = (dateStr) => {
    const events = []
    reservations.forEach((r) => {
      if (filterCabin !== 'all' && Number(r.cabana_id) !== Number(filterCabin)) {
        return
      }

      const isCheckIn = r.check_in === dateStr
      const isCheckOut = r.check_out === dateStr
      const isStay = dateStr > r.check_in && dateStr < r.check_out

      if (isCheckIn || isCheckOut || isStay) {
        events.push({
          reservation: r,
          isCheckIn,
          isCheckOut,
          isStay
        })
      }
    })
    return events
  }

  return (
    <div className="space-y-4">
      {/* Controles Superiores Responsivos */}
      <div className="bg-white dark:bg-gray-900 p-3 sm:p-4 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Mes y flechas */}
          <div className="flex items-center justify-between sm:justify-start gap-1 sm:gap-2">
            <button
              onClick={handlePrevMonth}
              className="p-2 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
            >
              <ChevronLeft size={18} />
            </button>
            
            <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white text-center capitalize min-w-[140px]">
              {monthNames[month]} {year}
            </h2>

            <button
              onClick={handleNextMonth}
              className="p-2 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
            >
              <ChevronRight size={18} />
            </button>

            <button
              onClick={handleToday}
              className="px-2.5 py-1.5 rounded-xl border border-gray-200 dark:border-gray-700 text-xs font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 ml-1"
            >
              Hoy
            </button>
          </div>

          {/* Selector de Vista en Móvil (Cuadrícula vs Agenda) */}
          <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl self-end sm:self-auto">
            <button
              onClick={() => setViewType('calendar')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                viewType === 'calendar'
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-xs'
                  : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Grid size={14} />
              <span>Mes</span>
            </button>
            <button
              onClick={() => setViewType('agenda')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                viewType === 'agenda'
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-xs'
                  : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <List size={14} />
              <span>Agenda Diaria</span>
            </button>
          </div>
        </div>

        {/* Filtro de Cabaña */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
          <button
            onClick={() => setFilterCabin('all')}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-colors ${
              filterCabin === 'all'
                ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
            }`}
          >
            Todas
          </button>
          {[1, 2, 3, 4].map((id) => {
            const c = CABIN_CONFIG[id]
            const isSelected = filterCabin === id
            return (
              <button
                key={id}
                onClick={() => setFilterCabin(id)}
                className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  isSelected
                    ? `${c.theme.badge} shadow-xs`
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-white' : c.theme.dot}`} />
                <span>{c.name}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* VISTA 1: CALENDARIO MENSUAL */}
      {viewType === 'calendar' && (
        <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-xs overflow-hidden">
          {/* Días semana */}
          <div className="grid grid-cols-7 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/60 text-center">
            {dayNames.map((d, idx) => (
              <div
                key={d}
                className={`py-2 text-[11px] sm:text-xs font-bold uppercase tracking-wider ${
                  idx >= 5 ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400'
                }`}
              >
                {d}
              </div>
            ))}
          </div>

          {/* Celdas */}
          <div className="grid grid-cols-7 divide-x divide-y divide-gray-100 dark:divide-gray-800/70 border-b border-gray-100 dark:border-gray-800">
            {allCalendarCells.map((cell, idx) => {
              const isToday = cell.dateString === todayStr
              const isOtherMonth = cell.monthOffset !== 0
              const events = getDayEvents(cell.dateString)

              return (
                <div
                  key={idx}
                  className={`min-h-[75px] sm:min-h-[115px] p-1 sm:p-2 flex flex-col justify-between transition-colors relative group ${
                    isOtherMonth
                      ? 'bg-gray-50/40 dark:bg-gray-900/20 text-gray-300 dark:text-gray-700'
                      : 'hover:bg-gray-50/60 dark:hover:bg-gray-800/30'
                  }`}
                >
                  {/* Número de día y botón + */}
                  <div className="flex items-center justify-between">
                    <span
                      className={`inline-flex items-center justify-center text-[10px] sm:text-xs font-bold w-5 h-5 sm:w-6 sm:h-6 rounded-full ${
                        isToday
                          ? 'bg-primary-600 text-white shadow-xs'
                          : isOtherMonth
                          ? 'text-gray-300 dark:text-gray-700'
                          : 'text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {cell.day}
                    </span>

                    {!isOtherMonth && (
                      <button
                        type="button"
                        onClick={() => onNewReservationAtDate(cell.dateString)}
                        className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-primary-600 p-0.5 rounded transition-opacity"
                        title="Nueva reserva este día"
                      >
                        <Plus size={13} />
                      </button>
                    )}
                  </div>

                  {/* Píldoras de eventos en este día */}
                  <div className="space-y-1 my-1 overflow-y-auto max-h-[55px] sm:max-h-[80px] scrollbar-none">
                    {events.map(({ reservation: r, isCheckIn, isCheckOut, isStay }) => {
                      const cabin = CABIN_CONFIG[r.cabana_id] || CABIN_CONFIG[1]

                      return (
                        <button
                          key={r.id + '-' + cell.dateString}
                          onClick={() => onSelectReservation(r)}
                          className={`w-full text-left p-1 rounded-md border text-[9px] sm:text-[11px] leading-tight block truncate transition-transform hover:scale-[1.02] shadow-2xs ${cabin.theme.badgeLight}`}
                          title={`${cabin.name}: ${r.guest_name} (${r.check_in} al ${r.check_out})`}
                        >
                          <div className="flex items-center justify-between gap-1">
                            <span className="font-bold truncate flex items-center gap-1">
                              <span className={`w-1.5 h-1.5 rounded-full ${cabin.theme.dot} shrink-0`} />
                              <span className="hidden sm:inline">C{r.cabana_id}</span> {r.guest_name.split(' ')[0]}
                            </span>

                            {/* Distintivo de Llegada vs Salida vs Estadía */}
                            {isCheckIn && (
                              <span className="text-[8px] bg-primary-600 text-white px-1 rounded font-bold shrink-0">
                                In
                              </span>
                            )}
                            {isCheckOut && (
                              <span className="text-[8px] bg-gray-600 text-white px-1 rounded font-bold shrink-0">
                                Out
                              </span>
                            )}
                          </div>
                        </button>
                      )
                    })}
                  </div>

                  {/* Espacio clickeable */}
                  {events.length === 0 && !isOtherMonth && (
                    <div
                      onClick={() => onNewReservationAtDate(cell.dateString)}
                      className="h-3 cursor-pointer"
                    />
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* VISTA 2: AGENDA DIARIA (Súper cómoda para celular) */}
      {viewType === 'agenda' && (
        <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-xs p-3 sm:p-5 space-y-3">
          <div className="text-xs font-semibold text-gray-500 mb-2">
            Lista cronológica de ocupación durante {monthNames[month]} {year}:
          </div>
          {currentMonthDays.map((cell) => {
            const events = getDayEvents(cell.dateString)
            const isToday = cell.dateString === todayStr

            if (events.length === 0) return null

            return (
              <div
                key={cell.dateString}
                className={`p-3 rounded-2xl border transition-colors ${
                  isToday
                    ? 'border-primary-400 bg-primary-50/50 dark:bg-primary-950/30'
                    : 'border-gray-200 dark:border-gray-800 bg-gray-50/60 dark:bg-gray-800/40'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-lg ${
                      isToday ? 'bg-primary-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                    }`}>
                      {cell.dateString} {isToday ? '• HOY' : ''}
                    </span>
                    <span className="text-xs text-gray-500 font-medium">
                      {events.length} {events.length === 1 ? 'cabaña con actividad' : 'cabañas con actividad'}
                    </span>
                  </div>
                  <button
                    onClick={() => onNewReservationAtDate(cell.dateString)}
                    className="text-xs text-primary-600 dark:text-primary-400 font-bold flex items-center gap-1 hover:underline"
                  >
                    <Plus size={14} />
                    <span>Agregar</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {events.map(({ reservation: r, isCheckIn, isCheckOut, isStay }) => {
                    const cabin = CABIN_CONFIG[r.cabana_id] || CABIN_CONFIG[1]
                    const pStatus = PAYMENT_STATUS[r.payment_status] || PAYMENT_STATUS.pending
                    const balance = Number(r.balance_due) || 0

                    return (
                      <div
                        key={r.id + '-' + cell.dateString}
                        onClick={() => onSelectReservation(r)}
                        className={`p-2.5 rounded-xl border ${cabin.theme.border} ${cabin.theme.bgCard} cursor-pointer hover:shadow-xs transition-shadow flex items-center justify-between`}
                      >
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${cabin.theme.badge}`}>
                              {cabin.name}
                            </span>
                            <span className="font-bold text-xs text-gray-900 dark:text-white truncate">
                              {r.guest_name}
                            </span>
                          </div>
                          <div className="text-[11px] text-gray-500 mt-1 flex items-center gap-2">
                            {isCheckIn && (
                              <span className="text-primary-600 font-bold">🚩 Llega hoy</span>
                            )}
                            {isCheckOut && (
                              <span className="text-gray-600 font-bold">🏁 Sale hoy</span>
                            )}
                            {isStay && (
                              <span className="text-gray-500">En estadía</span>
                            )}
                            {balance > 0 && (
                              <span className="text-amber-600 font-bold">
                                • Debe: ${balance.toLocaleString('es-CL')}
                              </span>
                            )}
                          </div>
                        </div>

                        <ArrowRight size={15} className="text-gray-400 shrink-0" />
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default MasterCalendarView

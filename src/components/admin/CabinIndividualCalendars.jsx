import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Plus, Layers, Eye, Calendar, ArrowRight } from 'lucide-react'
import { CABIN_CONFIG, PAYMENT_STATUS } from '../../data/adminCabinConfig'

const SingleCabinMonth = ({
  cabinId,
  currentDate,
  reservations,
  onSelectReservation,
  onNewReservationAtDate
}) => {
  const cabin = CABIN_CONFIG[cabinId]
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

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

  // Filtrar reservas solo de esta cabaña
  const cabinReservations = reservations.filter((r) => Number(r.cabana_id) === Number(cabinId))

  // Reconocer recambios el mismo día (salida + llegada) sin sobreescrituras
  const getDayActivities = (dateStr) => {
    const outgoing = cabinReservations.find((r) => r.check_out === dateStr)
    const incoming = cabinReservations.find((r) => r.check_in === dateStr)
    const staying = cabinReservations.find((r) => dateStr > r.check_in && dateStr < r.check_out)
    return { outgoing, incoming, staying }
  }

  const dayNames = ['L', 'M', 'M', 'J', 'V', 'S', 'D']

  return (
    <div className={`bg-white dark:bg-gray-900 rounded-3xl border ${cabin.theme.border} shadow-xs overflow-hidden flex flex-col`}>
      {/* Header de la Cabaña con color distintivo */}
      <div className={`p-3.5 sm:p-4 bg-gradient-to-r ${cabin.theme.gradient} text-white flex items-center justify-between`}>
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-white shadow-xs" />
            <h3 className="font-bold text-sm sm:text-base">{cabin.name}</h3>
            <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-medium">
              {cabin.tag}
            </span>
          </div>
          <div className="text-[11px] sm:text-xs text-white/80 mt-0.5">
            ${cabin.basePrice.toLocaleString('es-CL')}/noche • Hasta {cabin.capacity} personas
          </div>
        </div>

        <button
          onClick={() => onNewReservationAtDate(todayStr, cabinId)}
          className="p-2 sm:px-3 bg-white/20 hover:bg-white/30 active:scale-95 text-white rounded-xl transition-all shadow-xs flex items-center gap-1 text-xs font-semibold"
          title="Agregar reserva para esta cabaña"
        >
          <Plus size={16} />
          <span className="hidden sm:inline">Nueva Reserva</span>
        </button>
      </div>

      {/* Días de la semana abreviados */}
      <div className="grid grid-cols-7 border-b border-gray-100 dark:border-gray-800 bg-gray-50/80 dark:bg-gray-800/40 text-center py-1.5 text-[10px] sm:text-[11px] font-bold text-gray-500 dark:text-gray-400">
        {dayNames.map((d, i) => (
          <span key={i}>{d}</span>
        ))}
      </div>

      {/* Cuadrícula de días */}
      <div className="grid grid-cols-7 divide-x divide-y divide-gray-100 dark:divide-gray-800/60 flex-1">
        {allCalendarCells.map((cell, idx) => {
          const isToday = cell.dateString === todayStr
          const isOtherMonth = cell.monthOffset !== 0
          const { outgoing, incoming, staying } = getDayActivities(cell.dateString)
          const hasActivity = outgoing || incoming || staying

          return (
            <div
              key={idx}
              className={`min-h-[58px] sm:min-h-[70px] p-1 flex flex-col justify-between transition-colors relative group ${
                isOtherMonth
                  ? 'bg-gray-50/30 dark:bg-gray-900/20 text-gray-300 dark:text-gray-700'
                  : 'hover:bg-gray-50 dark:hover:bg-gray-800/40'
              } ${hasActivity ? cabin.theme.bgCard : ''}`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`text-[10px] sm:text-[11px] font-semibold w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center rounded-full ${
                    isToday
                      ? 'bg-primary-600 text-white font-bold'
                      : isOtherMonth
                      ? 'text-gray-300 dark:text-gray-700'
                      : 'text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {cell.day}
                </span>

                {/* Si no hay noche ocupada, permite agendar llegada */}
                {!staying && !incoming && !isOtherMonth && (
                  <button
                    onClick={() => onNewReservationAtDate(cell.dateString, cabinId)}
                    className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-primary-600 p-0.5"
                    title="Reservar llegada este día"
                  >
                    <Plus size={11} />
                  </button>
                )}
              </div>

              {/* Contenido de la celda: Salida, Llegada o Estadía */}
              <div className="space-y-0.5 mt-0.5">
                {/* Salida del día */}
                {outgoing && (
                  <button
                    onClick={() => onSelectReservation(outgoing)}
                    className="w-full text-left p-0.5 rounded text-[8px] sm:text-[9px] font-bold bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 truncate flex items-center gap-0.5"
                    title={`Salida 11:00: ${outgoing.guest_name}`}
                  >
                    <span className="text-[7px] bg-gray-600 text-white px-0.5 rounded">Out</span>
                    <span className="truncate">{outgoing.guest_name.split(' ')[0]}</span>
                  </button>
                )}

                {/* Llegada del día */}
                {incoming && (
                  <button
                    onClick={() => onSelectReservation(incoming)}
                    className={`w-full text-left p-0.5 rounded text-[8px] sm:text-[9px] font-bold border truncate flex items-center gap-0.5 ${cabin.theme.badgeLight}`}
                    title={`Llegada 15:00: ${incoming.guest_name}`}
                  >
                    <span className="text-[7px] bg-primary-600 text-white px-0.5 rounded">In</span>
                    <span className="truncate">{incoming.guest_name.split(' ')[0]}</span>
                  </button>
                )}

                {/* En estadía */}
                {staying && !outgoing && !incoming && (
                  <button
                    onClick={() => onSelectReservation(staying)}
                    className={`w-full text-left p-0.5 rounded text-[8px] sm:text-[9px] font-semibold border truncate block ${cabin.theme.badgeLight}`}
                    title={`Ocupado: ${staying.guest_name}`}
                  >
                    <span className="truncate">{staying.guest_name.split(' ')[0]}</span>
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

const CabinIndividualCalendars = ({
  reservations = [],
  onSelectReservation,
  onNewReservationAtDate
}) => {
  const [currentDate, setCurrentDate] = useState(new Date())
  // Detectar ancho inicial para abrir en pestañas en móvil
  const [viewMode, setViewMode] = useState(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      return 'tabs'
    }
    return 'grid'
  })
  const [activeTabCabin, setActiveTabCabin] = useState(1)

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ]

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1))
  }

  const handleToday = () => {
    setCurrentDate(new Date())
  }

  return (
    <div className="space-y-4">
      {/* Controles superiores */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-gray-900 p-3.5 sm:p-4 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-xs">
        {/* Mes y navegación */}
        <div className="flex items-center justify-between sm:justify-start gap-1 sm:gap-2">
          <button
            onClick={handlePrevMonth}
            className="p-2 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
          >
            <ChevronLeft size={18} />
          </button>
          
          <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white min-w-[140px] text-center capitalize">
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

        {/* Modo de visualización: Cuadrícula 2x2 vs Pestañas */}
        <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl self-end sm:self-auto">
          <button
            onClick={() => setViewMode('grid')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
              viewMode === 'grid'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-xs'
                : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <Layers size={14} />
            <span className="hidden sm:inline">Ver las 4 Juntas (2x2)</span>
            <span className="sm:hidden">2x2</span>
          </button>
          <button
            onClick={() => setViewMode('tabs')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
              viewMode === 'tabs'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-xs'
                : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <Eye size={14} />
            <span className="hidden sm:inline">Pestañas Individuales</span>
            <span className="sm:hidden">Individual</span>
          </button>
        </div>
      </div>

      {/* Si está en modo pestañas, selector de cabaña */}
      {viewMode === 'tabs' && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[1, 2, 3, 4].map((id) => {
            const c = CABIN_CONFIG[id]
            const isSelected = activeTabCabin === id
            return (
              <button
                key={id}
                onClick={() => setActiveTabCabin(id)}
                className={`py-2 px-3 rounded-2xl text-xs font-bold transition-all flex items-center justify-between border ${
                  isSelected
                    ? `${c.theme.badge} border-transparent shadow-xs`
                    : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-800 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-1.5 truncate">
                  <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${isSelected ? 'bg-white' : c.theme.dot}`} />
                  <span className="truncate">{c.name}</span>
                </div>
                <span className="opacity-80 text-[10px] shrink-0">{c.tag}</span>
              </button>
            )
          })}
        </div>
      )}

      {/* Renderizado de vistas */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((id) => (
            <SingleCabinMonth
              key={id}
              cabinId={id}
              currentDate={currentDate}
              reservations={reservations}
              onSelectReservation={onSelectReservation}
              onNewReservationAtDate={onNewReservationAtDate}
            />
          ))}
        </div>
      ) : (
        <div className="max-w-4xl mx-auto">
          <SingleCabinMonth
            cabinId={activeTabCabin}
            currentDate={currentDate}
            reservations={reservations}
            onSelectReservation={onSelectReservation}
            onNewReservationAtDate={onNewReservationAtDate}
          />
        </div>
      )}
    </div>
  )
}

export default CabinIndividualCalendars

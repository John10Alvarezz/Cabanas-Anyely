import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Calendar as CalendarIcon,
  Layers,
  ListFilter,
  Bell,
  Settings,
  Plus,
  LogOut,
  Sparkles,
  DollarSign,
  Users,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  Home
} from 'lucide-react'
import MasterCalendarView from './MasterCalendarView'
import CabinIndividualCalendars from './CabinIndividualCalendars'
import ReservationListView from './ReservationListView'
import RemindersView from './RemindersView'
import SettingsSupabaseView from './SettingsSupabaseView'
import ReservationFormModal from './ReservationFormModal'
import {
  fetchAllReservations,
  saveReservation,
  deleteReservation,
  calculateReminders,
  markReservationAsPaid
} from '../../services/reservationService'
import { getSupabaseCredentials } from '../../lib/supabase'

const AdminDashboard = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('master-calendar') // 'master-calendar', 'individual-cabins', 'reservations-list', 'reminders', 'settings'
  const [reservations, setReservations] = useState([])
  const [loading, setLoading] = useState(true)
  const [dataSource, setDataSource] = useState('local') // 'supabase' or 'local'

  // Modal de reserva (crear o editar)
  const [formModalOpen, setFormModalOpen] = useState(false)
  const [reservationToEdit, setReservationToEdit] = useState(null)
  const [formInitialDate, setFormInitialDate] = useState(null)
  const [formInitialCabinId, setFormInitialCabinId] = useState(1)

  // Cargar reservas
  const loadData = async () => {
    setLoading(true)
    try {
      const result = await fetchAllReservations()
      setReservations(result.data || [])
      setDataSource(result.source || 'local')
    } catch (e) {
      console.error('Error cargando reservas:', e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isOpen) {
      loadData()
    }
  }, [isOpen])

  if (!isOpen) return null

  // Métricas rápidas solicitadas
  const reminders = calculateReminders(reservations)
  const totalRevenue = reservations.reduce((acc, r) => acc + (Number(r.paid_amount) || 0), 0)
  const totalBalanceDue = reservations.reduce((acc, r) => acc + (Number(r.balance_due) || 0), 0)
  const totalEstimated = reservations.reduce((acc, r) => acc + (Number(r.total_price) || 0), 0)

  // Marcar como pagado el saldo pendiente con 1 clic
  const handleMarkAsPaid = async (id) => {
    try {
      await markReservationAsPaid(id)
      await loadData()
    } catch (e) {
      alert('Error actualizando pago: ' + e.message)
    }
  }

  // Handlers para abrir el formulario
  const handleOpenNew = (date = null, cabinId = 1) => {
    setReservationToEdit(null)
    setFormInitialDate(date)
    setFormInitialCabinId(cabinId)
    setFormModalOpen(true)
  }

  const handleEdit = (reservation) => {
    setReservationToEdit(reservation)
    setFormInitialDate(null)
    setFormInitialCabinId(reservation.cabana_id)
    setFormModalOpen(true)
  }

  const handleSaveReservation = async (reservationData) => {
    try {
      await saveReservation(reservationData)
      setFormModalOpen(false)
      await loadData()
    } catch (err) {
      alert(err.message)
    }
  }

  const handleDeleteReservation = async (id) => {
    await deleteReservation(id)
    await loadData()
  }

  const navTabs = [
    { id: 'master-calendar', label: 'Calendario General', shortLabel: 'General', icon: CalendarIcon },
    { id: 'individual-cabins', label: 'Las 4 Cabañas', shortLabel: 'Cabañas', icon: Layers },
    { id: 'reservations-list', label: 'Todas las Reservas', shortLabel: 'Reservas', icon: ListFilter, count: reservations.length },
    { id: 'reminders', label: 'Recordatorios', shortLabel: 'Alertas', icon: Bell, count: reminders.totalAlerts, badgeColor: 'bg-rose-500 text-white' },
    { id: 'settings', label: 'Ajustes & Supabase', shortLabel: 'Ajustes', icon: Settings },
  ]

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-100 dark:bg-gray-950 text-gray-900 dark:text-gray-100 flex flex-col font-sans">
      {/* 1. TOP HEADER DEL PANEL ADMIN */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 shadow-xs px-3 sm:px-6 py-2.5 sm:py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          {/* Título & Logo */}
          <div className="flex items-center gap-2 sm:gap-3">
            <img
              src="/logo-cabanas.png"
              alt="Anyely"
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover border border-primary-500/30 shrink-0"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="font-extrabold text-sm sm:text-lg text-gray-900 dark:text-white leading-tight">
                  Cabañas Anyely
                </h1>
                <span className="text-[10px] sm:text-[11px] bg-primary-100 dark:bg-primary-950/80 text-primary-700 dark:text-primary-300 font-bold px-1.5 py-0.2 rounded-full border border-primary-300 dark:border-primary-800">
                  Admin
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-gray-500">
                <span className={`inline-flex items-center gap-1 font-semibold ${
                  dataSource === 'supabase' ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${dataSource === 'supabase' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                  {dataSource === 'supabase' ? 'Supabase' : 'Local'}
                </span>
              </div>
            </div>
          </div>

          {/* Acciones principales de header */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={() => handleOpenNew()}
              className="py-1.5 sm:py-2 px-3 sm:px-4 bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-primary-600/20 active:scale-95 transition-all flex items-center gap-1.5"
            >
              <Plus size={16} />
              <span className="hidden sm:inline">Nueva Reserva</span>
              <span className="sm:hidden">Nueva</span>
            </button>

            <button
              onClick={loadData}
              className="p-1.5 sm:p-2.5 text-gray-500 hover:text-gray-900 dark:hover:text-white rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 transition-colors"
              title="Recargar datos"
            >
              <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
            </button>

            <button
              onClick={onClose}
              className="flex items-center gap-1 py-1.5 sm:py-2 px-2.5 sm:px-3 text-xs font-semibold text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-xl transition-colors"
              title="Volver a la web pública"
            >
              <LogOut size={14} />
              <span className="hidden sm:inline">Volver a la Web</span>
            </button>
          </div>
        </div>

        {/* Barra de pestañas en Desktop / Tablet */}
        <div className="hidden sm:flex max-w-7xl mx-auto mt-2.5 pt-2 border-t border-gray-100 dark:border-gray-800 items-center gap-1.5 overflow-x-auto scrollbar-none text-xs font-semibold">
          {navTabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-3 sm:px-4 rounded-xl flex items-center gap-2 whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-primary-600 text-white shadow-xs'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <Icon size={15} />
                <span>{tab.label}</span>
                {tab.count !== undefined && tab.count > 0 && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    tab.badgeColor || (isActive ? 'bg-white text-primary-700' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300')
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </header>

      {/* 2. CONTENIDO PRINCIPAL */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6 pb-24 sm:pb-8 space-y-4 sm:space-y-6">
        {/* Tarjetas de Resumen Rápido (Stats) */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-2.5 sm:gap-3.5">
          {/* Total Reservas */}
          <div className="bg-white dark:bg-gray-900 p-3 sm:p-3.5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-2xs">
            <span className="text-[10px] sm:text-[11px] text-gray-500 font-medium block">Total Reservas</span>
            <div className="text-lg sm:text-2xl font-black text-gray-900 dark:text-white mt-0.5">
              {reservations.length}
            </div>
            <span className="text-[9px] text-gray-400">Registradas</span>
          </div>

          {/* Total Estimado (Si todo estuviese pagado) */}
          <div className="bg-white dark:bg-gray-900 p-3 sm:p-3.5 rounded-2xl border border-blue-200 dark:border-blue-900/40 shadow-2xs">
            <span className="text-[10px] sm:text-[11px] text-blue-600 dark:text-blue-400 font-semibold block">Total Estimado</span>
            <div className="text-base sm:text-xl font-black text-blue-700 dark:text-blue-300 mt-0.5 truncate">
              ${totalEstimated.toLocaleString('es-CL')}
            </div>
            <span className="text-[9px] text-gray-400">100% Proyectado</span>
          </div>

          {/* Total Recaudado */}
          <div className="bg-white dark:bg-gray-900 p-3 sm:p-3.5 rounded-2xl border border-emerald-200 dark:border-emerald-900/40 shadow-2xs">
            <span className="text-[10px] sm:text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold block">Total Recaudado</span>
            <div className="text-base sm:text-xl font-black text-emerald-600 dark:text-emerald-400 mt-0.5 truncate">
              ${totalRevenue.toLocaleString('es-CL')}
            </div>
            <span className="text-[9px] text-gray-400">En caja / Pagado</span>
          </div>

          {/* Saldo por Cobrar */}
          <div className="bg-white dark:bg-gray-900 p-3 sm:p-3.5 rounded-2xl border border-amber-200 dark:border-amber-900/40 shadow-2xs">
            <span className="text-[10px] sm:text-[11px] text-amber-600 dark:text-amber-400 font-semibold block">Saldo por Cobrar</span>
            <div className="text-base sm:text-xl font-black text-amber-600 dark:text-amber-400 mt-0.5 truncate">
              ${totalBalanceDue.toLocaleString('es-CL')}
            </div>
            <span className="text-[9px] text-gray-400">Pendiente de cobro</span>
          </div>

          {/* Llegadas Hoy */}
          <div className="bg-white dark:bg-gray-900 p-3 sm:p-3.5 rounded-2xl border border-primary-200 dark:border-primary-900/40 shadow-2xs col-span-2 lg:col-span-1">
            <span className="text-[10px] sm:text-[11px] text-primary-600 dark:text-primary-400 font-semibold block">Llegadas Hoy</span>
            <div className="text-lg sm:text-2xl font-black text-primary-600 dark:text-primary-400 mt-0.5">
              {reminders.checkInsToday.length}
            </div>
            <span className="text-[9px] text-gray-400">Check-ins activos</span>
          </div>
        </div>

        {/* VISTAS ACTIVAS */}
        {activeTab === 'master-calendar' && (
          <MasterCalendarView
            reservations={reservations}
            onSelectReservation={handleEdit}
            onNewReservationAtDate={(date) => handleOpenNew(date)}
          />
        )}

        {activeTab === 'individual-cabins' && (
          <CabinIndividualCalendars
            reservations={reservations}
            onSelectReservation={handleEdit}
            onNewReservationAtDate={(date, cabinId) => handleOpenNew(date, cabinId)}
          />
        )}

        {activeTab === 'reservations-list' && (
          <ReservationListView
            reservations={reservations}
            onEditReservation={handleEdit}
            onDeleteReservation={handleDeleteReservation}
            onNewReservation={() => handleOpenNew()}
            onMarkAsPaid={handleMarkAsPaid}
          />
        )}

        {activeTab === 'reminders' && (
          <RemindersView
            reservations={reservations}
            onSelectReservation={handleEdit}
            onMarkAsPaid={handleMarkAsPaid}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsSupabaseView onDataReload={loadData} />
        )}
      </main>

      {/* 3. BARRA DE NAVEGACIÓN INFERIOR PARA MÓVIL (MOBILE FIRST BOTTOM BAR) */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-t border-gray-200 dark:border-gray-800 px-2 py-1.5 flex items-center justify-around shadow-lg">
        {navTabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center p-1.5 rounded-xl transition-all relative ${
                isActive
                  ? 'text-primary-600 dark:text-primary-400 font-bold'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-900'
              }`}
            >
              <div className="relative">
                <Icon size={19} />
                {tab.count !== undefined && tab.count > 0 && (
                  <span className={`absolute -top-1.5 -right-2 text-[9px] px-1 py-0.1 rounded-full font-bold ${
                    tab.badgeColor || 'bg-gray-800 text-white dark:bg-gray-200 dark:text-gray-900'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-0.5">{tab.shortLabel}</span>
            </button>
          )
        })}
      </nav>

      {/* Modal para Crear / Editar Reserva */}
      <ReservationFormModal
        isOpen={formModalOpen}
        onClose={() => setFormModalOpen(false)}
        onSave={handleSaveReservation}
        reservationToEdit={reservationToEdit}
        initialCabinId={formInitialCabinId}
        initialDate={formInitialDate}
        existingReservations={reservations}
      />
    </div>
  )
}

export default AdminDashboard

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Bell,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowRight,
  MessageCircle,
  DollarSign,
  Calendar,
  Sparkles,
  Smartphone,
  Send,
  Check,
  Share2
} from 'lucide-react'
import { CABIN_CONFIG, PAYMENT_STATUS } from '../../data/adminCabinConfig'
import { calculateReminders } from '../../services/reservationService'
import {
  isNotificationSupported,
  getNotificationPermission,
  requestNotificationPermission,
  triggerDailyAlertsNotification,
  generateDailyWhatsAppSummaryUrl
} from '../../services/notificationService'

const RemindersView = ({
  reservations = [],
  onSelectReservation,
  onMarkAsPaid
}) => {
  const {
    checkInsToday,
    checkInsTomorrow,
    checkOutsToday,
    pendingBalances,
    totalPendingAmount
  } = calculateReminders(reservations)

  const [notifPermission, setNotifPermission] = useState('default')
  const [notifSent, setNotifSent] = useState(false)

  useEffect(() => {
    setNotifPermission(getNotificationPermission())
  }, [])

  const handleRequestNotif = async () => {
    const res = await requestNotificationPermission()
    setNotifPermission(res)
    if (res === 'granted') {
      triggerDailyAlertsNotification(reservations)
      setNotifSent(true)
      setTimeout(() => setNotifSent(false), 4000)
    }
  }

  const handleTestNotif = () => {
    triggerDailyAlertsNotification(reservations)
    setNotifSent(true)
    setTimeout(() => setNotifSent(false), 4000)
  }

  const openWhatsApp = (phone, text) => {
    if (!phone) {
      alert('Esta reserva no cuenta con teléfono registrado.')
      return
    }
    const cleanPhone = phone.replace(/\D/g, '')
    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`
    window.open(url, '_blank')
  }

  const handleOpenWhatsAppSummary = () => {
    const url = generateDailyWhatsAppSummaryUrl(reservations, '56938780736')
    window.open(url, '_blank')
  }

  return (
    <div className="space-y-6">
      {/* Banner Superior */}
      <div className="bg-gradient-to-r from-primary-700 via-primary-600 to-emerald-600 text-white p-5 sm:p-6 rounded-3xl shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md mb-2">
              <Sparkles size={14} />
              <span>Centro de Operaciones Diarias & Alertas</span>
            </div>
            <h3 className="text-xl md:text-2xl font-black">
              Panel de Tareas y Cobros de Hoy
            </h3>
            <p className="text-white/80 text-xs sm:text-sm mt-1 max-w-xl">
              Monitorea quién llega hoy, salidas para coordinar aseo y todos los saldos por cobrar pendientes.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20 self-start md:self-auto">
            <div className="text-center px-2">
              <div className="text-xl sm:text-2xl font-black">{checkInsToday.length}</div>
              <div className="text-[10px] text-white/80 font-medium">Llegadas Hoy</div>
            </div>
            <div className="w-px h-8 bg-white/20" />
            <div className="text-center px-2">
              <div className="text-xl sm:text-2xl font-black">{checkOutsToday.length}</div>
              <div className="text-[10px] text-white/80 font-medium">Salidas Hoy</div>
            </div>
            <div className="w-px h-8 bg-white/20" />
            <div className="text-center px-2">
              <div className="text-xl sm:text-2xl font-black">{pendingBalances.length}</div>
              <div className="text-[10px] text-white/80 font-medium">Saldos X Cobrar</div>
            </div>
          </div>
        </div>
      </div>

      {/* SECCIÓN NUEVA: NOTIFICACIONES AL CELULAR & WHATSAPP DIARIO */}
      <div className="bg-white dark:bg-gray-900 rounded-3xl p-5 border border-primary-200 dark:border-primary-900/60 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-primary-100 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400 flex items-center justify-center font-bold">
              <Smartphone size={20} />
            </div>
            <div>
              <h4 className="font-bold text-base text-gray-900 dark:text-white">
                Notificaciones al Celular & Resumen de WhatsApp
              </h4>
              <p className="text-xs text-gray-500">
                Recibe alertas directamente en tu teléfono o envíate la agenda del día
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* Opción 1: Enviar resumen a mi WhatsApp */}
          <div className="p-4 rounded-2xl border border-green-200 dark:border-green-900/40 bg-green-50/50 dark:bg-green-950/20 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center gap-2 text-green-700 dark:text-green-400 font-bold text-xs">
                <MessageCircle size={16} />
                <span>Resumen Diario a tu WhatsApp</span>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                Genera un mensaje listo con las llegadas, salidas y cobros del día para tenerlo a mano en tu chat personal.
              </p>
            </div>
            <button
              onClick={handleOpenWhatsAppSummary}
              className="w-full py-2.5 px-4 bg-green-600 hover:bg-green-700 active:scale-95 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              <Send size={15} />
              <span>Enviar Agenda de Hoy a mi WhatsApp</span>
            </button>
          </div>

          {/* Opción 2: Notificaciones Push del navegador en el Celular */}
          <div className="p-4 rounded-2xl border border-blue-200 dark:border-blue-900/40 bg-blue-50/50 dark:bg-blue-950/20 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center gap-2 text-blue-700 dark:text-blue-400 font-bold text-xs">
                <Bell size={16} />
                <span>Notificaciones del Dispositivo</span>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                {notifPermission === 'granted'
                  ? '✓ Notificaciones habilitadas en este dispositivo para avisos de llegadas y salidas.'
                  : 'Permite que el navegador te envíe notificaciones emergentes de las reservas al celular.'}
              </p>
            </div>

            {notifPermission === 'granted' ? (
              <button
                onClick={handleTestNotif}
                className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                {notifSent ? <Check size={15} /> : <Bell size={15} />}
                <span>{notifSent ? '¡Notificación Enviada!' : 'Probar Notificación de Alertas'}</span>
              </button>
            ) : (
              <button
                onClick={handleRequestNotif}
                className="w-full py-2.5 px-4 bg-primary-600 hover:bg-primary-700 active:scale-95 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <Bell size={15} />
                <span>Activar Notificaciones en este Celular</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. LLEGADAS DE HOY */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-5 border border-primary-200 dark:border-primary-900/50 shadow-xs flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-primary-100 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400 flex items-center justify-center font-bold">
                🚩
              </div>
              <div>
                <h4 className="font-bold text-gray-900 dark:text-white text-base">
                  Llegadas de Hoy (Check-in)
                </h4>
                <p className="text-xs text-gray-500">Preparar cabañas y recibir huéspedes</p>
              </div>
            </div>
            <span className="px-2.5 py-1 bg-primary-100 text-primary-800 dark:bg-primary-950 dark:text-primary-300 rounded-full text-xs font-bold">
              {checkInsToday.length}
            </span>
          </div>

          <div className="space-y-3 flex-1">
            {checkInsToday.length === 0 ? (
              <div className="p-6 text-center text-xs text-gray-400 border border-dashed border-gray-200 dark:border-gray-800 rounded-2xl">
                No hay check-ins programados para el día de hoy.
              </div>
            ) : (
              checkInsToday.map((r) => {
                const cabin = CABIN_CONFIG[r.cabana_id] || CABIN_CONFIG[1]
                const balance = Number(r.balance_due) || 0
                return (
                  <div
                    key={r.id}
                    className={`p-3.5 rounded-2xl border ${cabin.theme.border} ${cabin.theme.bgCard} flex items-center justify-between gap-3`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${cabin.theme.badge}`}>
                          {cabin.name}
                        </span>
                        <span className="font-bold text-sm text-gray-900 dark:text-white">
                          {r.guest_name}
                        </span>
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        Estadía: {r.nights} {r.nights === 1 ? 'noche' : 'noches'} • {r.guests_count} personas
                      </div>
                      {balance > 0 ? (
                        <div className="text-xs font-bold text-amber-700 dark:text-amber-400 mt-1 flex items-center gap-1">
                          <DollarSign size={13} />
                          Cobrar saldo en check-in: ${balance.toLocaleString('es-CL')}
                        </div>
                      ) : (
                        <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-1">
                          ✓ Pagado completo
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {/* Botón rápido para marcar pagado al recibir al huésped */}
                      {balance > 0 && onMarkAsPaid && (
                        <button
                          onClick={() => {
                            if (confirm(`¿Marcar como PAGADO el saldo restante de $${balance.toLocaleString('es-CL')} para ${r.guest_name}?`)) {
                              onMarkAsPaid(r.id)
                            }
                          }}
                          className="py-1.5 px-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 shadow-xs"
                          title="Marcar saldo como pagado"
                        >
                          <CheckCircle2 size={14} />
                          <span className="hidden sm:inline">Cobrado</span>
                        </button>
                      )}

                      {r.guest_phone && (
                        <button
                          onClick={() => openWhatsApp(
                            r.guest_phone,
                            `¡Hola ${r.guest_name}! Te esperamos hoy en ${cabin.name} de Cabañas Anyely. ¿A qué hora aproximada llegarás para tenerte todo listo?`
                          )}
                          className="p-2.5 rounded-xl bg-green-600 hover:bg-green-700 text-white transition-colors"
                          title="Contactar por WhatsApp"
                        >
                          <MessageCircle size={16} />
                        </button>
                      )}
                      <button
                        onClick={() => onSelectReservation(r)}
                        className="p-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                        title="Ver detalle"
                      >
                        <ArrowRight size={16} />
                      </button>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* 2. SALIDAS DE HOY */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-5 border border-gray-200 dark:border-gray-800 shadow-xs flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 flex items-center justify-center font-bold">
                🏁
              </div>
              <div>
                <h4 className="font-bold text-gray-900 dark:text-white text-base">
                  Salidas de Hoy (Check-out)
                </h4>
                <p className="text-xs text-gray-500">Recepción de llaves y aseo</p>
              </div>
            </div>
            <span className="px-2.5 py-1 bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200 rounded-full text-xs font-bold">
              {checkOutsToday.length}
            </span>
          </div>

          <div className="space-y-3 flex-1">
            {checkOutsToday.length === 0 ? (
              <div className="p-6 text-center text-xs text-gray-400 border border-dashed border-gray-200 dark:border-gray-800 rounded-2xl">
                No hay salidas programadas para hoy.
              </div>
            ) : (
              checkOutsToday.map((r) => {
                const cabin = CABIN_CONFIG[r.cabana_id] || CABIN_CONFIG[1]
                return (
                  <div
                    key={r.id}
                    className="p-3.5 rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50/60 dark:bg-gray-800/40 flex items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${cabin.theme.badge}`}>
                          {cabin.name}
                        </span>
                        <span className="font-bold text-sm text-gray-900 dark:text-white">
                          {r.guest_name}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Salida pactada para hoy (hasta las 11:00 hrs). Coordinar limpieza.
                      </div>
                    </div>

                    <button
                      onClick={() => onSelectReservation(r)}
                      className="p-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                      title="Ver detalle"
                    >
                      <ArrowRight size={16} />
                    </button>
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* 3. TODOS LOS SALDOS PENDIENTES POR COBRAR (SOLICITUD EXPLÍCITA) */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-5 border border-amber-200 dark:border-amber-900/40 shadow-xs flex flex-col lg:col-span-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
                💰
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-gray-900 dark:text-white text-base">
                    Todos los Saldos por Cobrar
                  </h4>
                  <span className="px-2 py-0.5 bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 rounded-full text-xs font-bold">
                    {pendingBalances.length} reservas
                  </span>
                </div>
                <p className="text-xs text-gray-500">
                  Total pendiente por recaudar: <strong className="text-amber-700 dark:text-amber-400 font-bold">${totalPendingAmount.toLocaleString('es-CL')}</strong>
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 flex-1">
            {pendingBalances.length === 0 ? (
              <div className="p-6 text-center text-xs text-gray-400 border border-dashed border-gray-200 dark:border-gray-800 rounded-2xl col-span-2">
                ¡Excelente! No hay ningún saldo pendiente por cobrar en el sistema.
              </div>
            ) : (
              pendingBalances.map((r) => {
                const cabin = CABIN_CONFIG[r.cabana_id] || CABIN_CONFIG[1]
                const balance = Number(r.balance_due) || 0
                return (
                  <div
                    key={r.id}
                    className="p-3.5 rounded-2xl border border-amber-200 dark:border-amber-800/60 bg-amber-50/40 dark:bg-amber-950/20 flex items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${cabin.theme.badge}`}>
                          {cabin.name}
                        </span>
                        <span className="font-bold text-sm text-gray-900 dark:text-white">
                          {r.guest_name}
                        </span>
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        Llegada: <span className="font-bold text-gray-800 dark:text-gray-200">{r.check_in}</span> • Abonó: ${Number(r.paid_amount || 0).toLocaleString('es-CL')}
                      </div>
                      <div className="text-sm font-black text-amber-700 dark:text-amber-400 mt-1">
                        Falta: ${balance.toLocaleString('es-CL')}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {/* Botón rápido para saldar deuda con 1 clic */}
                      {onMarkAsPaid && (
                        <button
                          onClick={() => {
                            if (confirm(`¿Marcar como PAGADO el saldo restante de $${balance.toLocaleString('es-CL')} para ${r.guest_name}?`)) {
                              onMarkAsPaid(r.id)
                            }
                          }}
                          className="py-1.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs flex items-center gap-1 shadow-xs transition-all"
                          title="Saldar deuda completa"
                        >
                          <CheckCircle2 size={14} />
                          <span>Pagó</span>
                        </button>
                      )}

                      <button
                        onClick={() => onSelectReservation(r)}
                        className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                        title="Ver detalle"
                      >
                        <ArrowRight size={15} />
                      </button>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* 4. LLEGADAS DE MAÑANA */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-5 border border-gray-200 dark:border-gray-800 shadow-xs flex flex-col lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                🗓️
              </div>
              <div>
                <h4 className="font-bold text-gray-900 dark:text-white text-base">
                  Llegadas de Mañana
                </h4>
                <p className="text-xs text-gray-500">Anticipar preparación y leña para estufas</p>
              </div>
            </div>
            <span className="px-2.5 py-1 bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 rounded-full text-xs font-bold">
              {checkInsTomorrow.length}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 flex-1">
            {checkInsTomorrow.length === 0 ? (
              <div className="p-6 text-center text-xs text-gray-400 border border-dashed border-gray-200 dark:border-gray-800 rounded-2xl col-span-2">
                No hay llegadas programadas para mañana.
              </div>
            ) : (
              checkInsTomorrow.map((r) => {
                const cabin = CABIN_CONFIG[r.cabana_id] || CABIN_CONFIG[1]
                return (
                  <div
                    key={r.id}
                    className="p-3.5 rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50/60 dark:bg-gray-800/40 flex items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${cabin.theme.badge}`}>
                          {cabin.name}
                        </span>
                        <span className="font-bold text-sm text-gray-900 dark:text-white">
                          {r.guest_name}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Estadía: {r.nights} {r.nights === 1 ? 'noche' : 'noches'} • {r.guests_count} personas
                      </div>
                    </div>

                    <button
                      onClick={() => onSelectReservation(r)}
                      className="p-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                    >
                      <ArrowRight size={16} />
                    </button>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default RemindersView

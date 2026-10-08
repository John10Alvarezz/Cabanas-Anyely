import { calculateReminders } from './reservationService'
import { CABIN_CONFIG } from '../data/adminCabinConfig'

// Verificar si el navegador soporta Notificaciones
export const isNotificationSupported = () => {
  return typeof window !== 'undefined' && 'Notification' in window
}

// Obtener estado actual del permiso
export const getNotificationPermission = () => {
  if (!isNotificationSupported()) return 'unsupported'
  return Notification.permission
}

// Solicitar permiso al usuario
export const requestNotificationPermission = async () => {
  if (!isNotificationSupported()) return 'unsupported'
  try {
    const permission = await Notification.requestPermission()
    return permission
  } catch (e) {
    console.error('Error solicitando permisos de notificación:', e)
    return 'denied'
  }
}

// Enviar una notificación local en el dispositivo (celular o PC)
export const sendBrowserNotification = (title, options = {}) => {
  if (!isNotificationSupported() || Notification.permission !== 'granted') {
    return false
  }

  try {
    const notif = new Notification(title, {
      icon: '/logo-cabanas.png',
      badge: '/logo-cabanas.png',
      vibrate: [200, 100, 200],
      ...options
    })

    notif.onclick = () => {
      window.focus()
      window.location.hash = '#admin'
    }

    return true
  } catch (e) {
    console.error('Error enviando notificación del navegador:', e)
    return false
  }
}

// Notificación de prueba / resumen del día
export const triggerDailyAlertsNotification = (reservations) => {
  const { checkInsToday, checkOutsToday, pendingBalances } = calculateReminders(reservations)

  let body = ''
  if (checkInsToday.length > 0) {
    body += `🚩 ${checkInsToday.length} llegada(s) hoy. `
  }
  if (checkOutsToday.length > 0) {
    body += `🏁 ${checkOutsToday.length} salida(s) hoy. `
  }
  if (pendingBalances.length > 0) {
    body += `💰 ${pendingBalances.length} con saldo por cobrar.`
  }

  if (!body) {
    body = 'Hoy no tienes llegadas ni salidas programadas. Todo al día en Cabañas Anyely.'
  }

  return sendBrowserNotification('🔔 Cabañas Anyely • Alertas de Hoy', {
    body,
    tag: 'daily-reminder-' + new Date().toISOString().slice(0, 10)
  })
}

// Generar enlace de WhatsApp para enviarse el resumen de hoy a su propio WhatsApp
export const generateDailyWhatsAppSummaryUrl = (reservations, targetPhone = '56938780736') => {
  const todayStr = new Date().toLocaleDateString('es-CL', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })

  const { checkInsToday, checkOutsToday, pendingBalances, totalPendingAmount } = calculateReminders(reservations)

  let text = `🌲 *RESUMEN DIARIO CABAÑAS ANYELY*\n📅 ${todayStr}\n\n`

  // Llegadas
  text += `🚩 *LLEGADAS DE HOY (${checkInsToday.length}):*\n`
  if (checkInsToday.length === 0) {
    text += `_Sin llegadas programadas para hoy._\n`
  } else {
    checkInsToday.forEach((r) => {
      const c = CABIN_CONFIG[r.cabana_id]?.name || `Cabaña ${r.cabana_id}`
      const balance = Number(r.balance_due) || 0
      text += `• *${c}*: ${r.guest_name} (${r.guests_count} pers.)`
      if (balance > 0) {
        text += ` ⚠️ _Cobrar saldo: $${balance.toLocaleString('es-CL')}_`
      } else {
        text += ` ✓ _Pagado_`
      }
      text += `\n`
    })
  }

  // Salidas
  text += `\n🏁 *SALIDAS DE HOY (${checkOutsToday.length}):*\n`
  if (checkOutsToday.length === 0) {
    text += `_Sin salidas programadas para hoy._\n`
  } else {
    checkOutsToday.forEach((r) => {
      const c = CABIN_CONFIG[r.cabana_id]?.name || `Cabaña ${r.cabana_id}`
      text += `• *${c}*: ${r.guest_name} (Revisar aseo/llaves)\n`
    })
  }

  // Saldos
  text += `\n💰 *SALDOS TOTALES POR COBRAR:*\n`
  text += `Total por recaudar: *$${totalPendingAmount.toLocaleString('es-CL')}* (${pendingBalances.length} reservas)\n`

  const cleanPhone = targetPhone.replace(/\D/g, '')
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`
}

import { getSupabaseClient } from '../lib/supabase'

const STORAGE_KEY = 'anyely_reservations_v1'
const PIN_KEY = 'anyely_admin_pin'
const DEFAULT_PIN = '1234'
const ATTEMPTS_KEY = 'anyely_admin_login_attempts'
const MAX_ATTEMPTS = 5
const LOCKOUT_DURATION_MS = 60 * 1000 // 60 segundos de bloqueo tras 5 intentos fallidos

// Obtener PIN local inmediato
export const getAdminPin = () => {
  return localStorage.getItem(PIN_KEY) || DEFAULT_PIN
}

// Obtener PIN sincronizado desde Supabase (con respaldo local)
export const fetchAdminPin = async () => {
  const client = getSupabaseClient()
  if (client) {
    try {
      const { data, error } = await client
        .from('configuracion')
        .select('valor')
        .eq('clave', 'admin_pin')
        .maybeSingle()

      if (!error && data && data.valor) {
        localStorage.setItem(PIN_KEY, data.valor)
        return data.valor
      }
    } catch (e) {
      console.warn('Error obteniendo PIN desde Supabase:', e)
    }
  }
  return localStorage.getItem(PIN_KEY) || DEFAULT_PIN
}

// Guardar PIN localmente y sincronizar en Supabase para todos los dispositivos
export const setAdminPin = async (newPin) => {
  if (!newPin || newPin.trim().length < 4) {
    throw new Error('El PIN debe tener al menos 4 dígitos')
  }
  const cleanPin = newPin.trim()
  localStorage.setItem(PIN_KEY, cleanPin)

  const client = getSupabaseClient()
  if (client) {
    try {
      const { error } = await client
        .from('configuracion')
        .upsert({ clave: 'admin_pin', valor: cleanPin, updated_at: new Date().toISOString() })

      if (error) {
        console.warn('Tabla configuracion no disponible en Supabase:', error)
        return { ok: true, synced: false, error: error.message }
      }
      return { ok: true, synced: true }
    } catch (e) {
      console.warn('Error guardando PIN en Supabase:', e)
      return { ok: true, synced: false }
    }
  }
  return { ok: true, synced: false }
}

// Control de seguridad y bloqueo por fuerza bruta
export const getSecurityStatus = () => {
  try {
    const raw = localStorage.getItem(ATTEMPTS_KEY)
    if (!raw) return { locked: false, remainingSeconds: 0, attemptsLeft: MAX_ATTEMPTS }
    const { count, lockedUntil } = JSON.parse(raw)
    const now = Date.now()

    if (lockedUntil && lockedUntil > now) {
      const remainingSeconds = Math.ceil((lockedUntil - now) / 1000)
      return { locked: true, remainingSeconds, attemptsLeft: 0 }
    }

    // Si ya expiró el bloqueo, resetear
    if (lockedUntil && lockedUntil <= now) {
      localStorage.removeItem(ATTEMPTS_KEY)
      return { locked: false, remainingSeconds: 0, attemptsLeft: MAX_ATTEMPTS }
    }

    const attemptsLeft = Math.max(0, MAX_ATTEMPTS - (count || 0))
    return { locked: false, remainingSeconds: 0, attemptsLeft }
  } catch (e) {
    return { locked: false, remainingSeconds: 0, attemptsLeft: MAX_ATTEMPTS }
  }
}

export const recordFailedAttempt = () => {
  try {
    const raw = localStorage.getItem(ATTEMPTS_KEY)
    const current = raw ? JSON.parse(raw) : { count: 0, lockedUntil: null }
    const nextCount = (current.count || 0) + 1

    if (nextCount >= MAX_ATTEMPTS) {
      const lockedUntil = Date.now() + LOCKOUT_DURATION_MS
      localStorage.setItem(ATTEMPTS_KEY, JSON.stringify({ count: nextCount, lockedUntil }))
      return { locked: true, remainingSeconds: Math.ceil(LOCKOUT_DURATION_MS / 1000), attemptsLeft: 0 }
    } else {
      localStorage.setItem(ATTEMPTS_KEY, JSON.stringify({ count: nextCount, lockedUntil: null }))
      return { locked: false, remainingSeconds: 0, attemptsLeft: MAX_ATTEMPTS - nextCount }
    }
  } catch (e) {
    return { locked: false, remainingSeconds: 0, attemptsLeft: 3 }
  }
}

export const resetFailedAttempts = () => {
  localStorage.removeItem(ATTEMPTS_KEY)
}

// Verificación estricta de conflicto de fechas:
// Regla hotelera: Check-in a partir de las 14:00 hrs y Check-out hasta las 12:00 hrs.
// Por ende, la noche ocupada por una reserva es desde `check_in` hasta `check_out - 1 día`.
// Si el huésped A sale el 29 (check_out = 29), el huésped B SÍ puede llegar el 29 (check_in = 29).
// Hay conflicto SÓLO SI: newCheckIn < existingCheckOut Y newCheckOut > existingCheckIn (desigualdad estricta).
export const findDateConflicts = (newCheckIn, newCheckOut, cabinId, existingReservations = [], ignoreReservationId = null) => {
  if (!newCheckIn || !newCheckOut || !cabinId) return []

  const newStart = new Date(newCheckIn + 'T00:00:00').getTime()
  const newEnd = new Date(newCheckOut + 'T00:00:00').getTime()

  if (newEnd <= newStart) return [] // Fechas inválidas

  return existingReservations.filter((r) => {
    if (ignoreReservationId && r.id === ignoreReservationId) return false
    if (Number(r.cabana_id) !== Number(cabinId)) return false

    const rStart = new Date(r.check_in + 'T00:00:00').getTime()
    const rEnd = new Date(r.check_out + 'T00:00:00').getTime()

    // Conflicto solo si se solapan las noches:
    return newStart < rEnd && newEnd > rStart
  })
}


// Datos iniciales de demostración para que el calendario se vea activo de inmediato
const getInitialSampleData = () => {
  const today = new Date()
  const formatDate = (date) => {
    const y = date.getFullYear()
    const m = String(date.getMonth() + 1).padStart(2, '0')
    const d = String(date.getDate()).padStart(2, '0')
    return `${y}-${m}-${d}`
  }

  const addDays = (days) => {
    const d = new Date(today)
    d.setDate(d.getDate() + days)
    return formatDate(d)
  }

  return [
    {
      id: 'res-demo-1',
      cabana_id: 1,
      guest_name: 'Carlos Mendoza',
      guest_phone: '+56987654321',
      guest_email: 'carlos.m@gmail.com',
      check_in: addDays(0), // Hoy
      check_out: addDays(2),
      guests_count: 4,
      nights: 2,
      total_price: 140000,
      paid_amount: 70000,
      balance_due: 70000,
      payment_status: 'paid_half',
      payment_method: 'transferencia',
      notes: 'Llegan a las 16:00 hrs. Pidieron leña adicional para estufa.',
      created_at: new Date().toISOString()
    },
    {
      id: 'res-demo-2',
      cabana_id: 2,
      guest_name: 'Familia González Soto',
      guest_phone: '+56976543210',
      guest_email: 'valeria.gonzalez@gmail.com',
      check_in: addDays(3),
      check_out: addDays(6),
      guests_count: 10,
      nights: 3,
      total_price: 360000,
      paid_amount: 360000,
      balance_due: 0,
      payment_status: 'paid_full',
      payment_method: 'transferencia',
      notes: 'Celebración de cumpleaños. Solicitan tinaja para la segunda noche.',
      created_at: new Date().toISOString()
    },
    {
      id: 'res-demo-3',
      cabana_id: 3,
      guest_name: 'Matías Riquelme',
      guest_phone: '+56965432109',
      guest_email: 'matias.r@outlook.cl',
      check_in: addDays(1), // Mañana
      check_out: addDays(4),
      guests_count: 5,
      nights: 3,
      total_price: 210000,
      paid_amount: 105000,
      balance_due: 105000,
      payment_status: 'paid_half',
      payment_method: 'efectivo',
      notes: 'Confirmado por WhatsApp. Paga saldo en efectivo al llegar.',
      created_at: new Date().toISOString()
    },
    {
      id: 'res-demo-4',
      cabana_id: 4,
      guest_name: 'Constanza Silva',
      guest_phone: '+56954321098',
      guest_email: '',
      check_in: addDays(-2),
      check_out: addDays(0), // Salida hoy
      guests_count: 2,
      nights: 2,
      total_price: 140000,
      paid_amount: 140000,
      balance_due: 0,
      payment_status: 'paid_full',
      payment_method: 'transferencia',
      notes: 'Pareja joven. Check-out pactado para las 11:30 hrs.',
      created_at: new Date().toISOString()
    },
    {
      id: 'res-demo-5',
      cabana_id: 1,
      guest_name: 'Roberto Barra',
      guest_phone: '+56943210987',
      guest_email: 'r.barra@empresa.cl',
      check_in: addDays(8),
      check_out: addDays(10),
      guests_count: 6,
      nights: 2,
      total_price: 140000,
      paid_amount: 0,
      balance_due: 140000,
      payment_status: 'pending',
      payment_method: 'transferencia',
      notes: 'Pendiente comprobante de transferencia bancaria.',
      created_at: new Date().toISOString()
    }
  ]
}

// Cargar reservas locales
export const getLocalReservations = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      const initial = getInitialSampleData()
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial))
      return initial
    }
    return JSON.parse(raw)
  } catch (e) {
    console.error('Error leyendo reservas locales:', e)
    return []
  }
}

// Guardar en local
export const setLocalReservations = (reservations) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reservations))
}

// Obtener todas las reservas (desde Supabase si está disponible, o fallback LocalStorage)
export const fetchAllReservations = async () => {
  const client = getSupabaseClient()

  if (client) {
    try {
      const { data, error } = await client
        .from('reservas')
        .select('*')
        .order('check_in', { ascending: true })

      if (!error && data) {
        // Mapear números y campos
        const normalized = data.map((r) => ({
          ...r,
          cabana_id: Number(r.cabana_id),
          guests_count: Number(r.guests_count || 1),
          nights: Number(r.nights || 1),
          total_price: Number(r.total_price || 0),
          paid_amount: Number(r.paid_amount || 0),
          balance_due: Number(r.balance_due || 0),
        }))
        // Sincronizar copia local
        setLocalReservations(normalized)
        return { data: normalized, source: 'supabase' }
      } else {
        console.warn('Fallo Supabase, usando respaldo local:', error)
      }
    } catch (e) {
      console.warn('Excepción al consultar Supabase:', e)
    }
  }

  // Fallback a LocalStorage
  return { data: getLocalReservations(), source: 'local' }
}

// Guardar o actualizar una reserva
export const saveReservation = async (reservation) => {
  const isNew = !reservation.id
  const now = new Date().toISOString()
  const currentLocal = getLocalReservations()

  // Validación estricta: NO permitir sobreescribir fechas ya reservadas en la misma cabaña
  const conflicts = findDateConflicts(
    reservation.check_in,
    reservation.check_out,
    reservation.cabana_id,
    currentLocal,
    reservation.id
  )

  if (conflicts.length > 0) {
    const c = conflicts[0]
    throw new Error(
      `No se puede guardar: La Cabaña ${reservation.cabana_id} ya está reservada por ${c.guest_name} del ${c.check_in} al ${c.check_out}. Debes modificar las fechas o eliminar la reserva existente.`
    )
  }

  const formatted = {
    ...reservation,
    id: isNew ? 'res-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7) : reservation.id,
    cabana_id: Number(reservation.cabana_id),
    guests_count: Number(reservation.guests_count || 1),
    nights: Number(reservation.nights || 1),
    total_price: Number(reservation.total_price || 0),
    paid_amount: Number(reservation.paid_amount || 0),
    balance_due: Math.max(0, Number(reservation.total_price || 0) - Number(reservation.paid_amount || 0)),
    updated_at: now,
    created_at: reservation.created_at || now,
  }

  // Actualizar en LocalStorage inmediatamente
  let updatedLocal = []
  if (isNew) {
    updatedLocal = [formatted, ...currentLocal]
  } else {
    updatedLocal = currentLocal.map((r) => (r.id === formatted.id ? formatted : r))
  }
  setLocalReservations(updatedLocal)

  // Sincronizar en Supabase si está disponible
  const client = getSupabaseClient()
  if (client) {
    try {
      const { error } = await client.from('reservas').upsert(formatted)
      if (error) {
        console.error('Error guardando en Supabase:', error)
      }
    } catch (e) {
      console.error('Excepción guardando en Supabase:', e)
    }
  }

  return formatted
}

// Eliminar una reserva
export const deleteReservation = async (id) => {
  const currentLocal = getLocalReservations()
  const updatedLocal = currentLocal.filter((r) => r.id !== id)
  setLocalReservations(updatedLocal)

  const client = getSupabaseClient()
  if (client) {
    try {
      const { error } = await client.from('reservas').delete().eq('id', id)
      if (error) {
        console.error('Error borrando en Supabase:', error)
      }
    } catch (e) {
      console.error('Excepción borrando en Supabase:', e)
    }
  }

  return true
}

// Exportar copia de respaldo JSON
export const exportReservationsJSON = () => {
  const data = getLocalReservations()
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `respaldo-reservas-anyely-${new Date().toISOString().slice(0, 10)}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

// Importar copia de respaldo JSON
export const importReservationsJSON = async (jsonString) => {
  try {
    const parsed = JSON.parse(jsonString)
    if (!Array.isArray(parsed)) {
      throw new Error('El archivo no contiene una lista válida de reservas')
    }
    setLocalReservations(parsed)

    // Intentar sincronizar en Supabase si está activo
    const client = getSupabaseClient()
    if (client && parsed.length > 0) {
      await client.from('reservas').upsert(parsed)
    }

    return { ok: true, count: parsed.length }
  } catch (err) {
    return { ok: false, error: err.message }
  }
}

// Marcar reserva como 100% pagada directamente (saldar deuda con 1 clic)
export const markReservationAsPaid = async (id) => {
  const currentLocal = getLocalReservations()
  const target = currentLocal.find((r) => r.id === id)
  if (!target) return null

  const total = Number(target.total_price || 0)
  const updated = {
    ...target,
    paid_amount: total,
    balance_due: 0,
    payment_status: 'paid_full',
    updated_at: new Date().toISOString()
  }

  const updatedLocal = currentLocal.map((r) => (r.id === id ? updated : r))
  setLocalReservations(updatedLocal)

  const client = getSupabaseClient()
  if (client) {
    try {
      await client.from('reservas').update({
        paid_amount: total,
        balance_due: 0,
        payment_status: 'paid_full',
        updated_at: updated.updated_at
      }).eq('id', id)
    } catch (e) {
      console.error('Error actualizando saldo en Supabase:', e)
    }
  }

  return updated
}

// Cálculo de recordatorios y alertas útiles
export const calculateReminders = (reservations) => {
  const todayStr = new Date().toISOString().slice(0, 10)
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const tomorrowStr = tomorrow.toISOString().slice(0, 10)

  const checkInsToday = reservations.filter((r) => r.check_in === todayStr)
  const checkInsTomorrow = reservations.filter((r) => r.check_in === tomorrowStr)
  const checkOutsToday = reservations.filter((r) => r.check_out === todayStr)

  // Ahora incluye TODOS los saldos pendientes por cobrar ordenados por fecha de llegada
  const pendingBalances = reservations
    .filter((r) => Number(r.balance_due) > 0)
    .sort((a, b) => new Date(a.check_in) - new Date(b.check_in))

  // Sin abono
  const unconfirmed = reservations.filter((r) => r.payment_status === 'pending')

  const totalPendingAmount = pendingBalances.reduce((acc, r) => acc + (Number(r.balance_due) || 0), 0)

  return {
    checkInsToday,
    checkInsTomorrow,
    checkOutsToday,
    pendingBalances,
    unconfirmed,
    totalPendingAmount,
    totalAlerts: checkInsToday.length + checkOutsToday.length + pendingBalances.length
  }
}


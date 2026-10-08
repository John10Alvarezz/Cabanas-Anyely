// Configuración visual y metadatos de las 4 Cabañas
export const CABIN_CONFIG = {
  1: {
    id: 1,
    name: 'Cabaña 1',
    capacity: 6,
    basePrice: 70000,
    tag: 'Familiar 6p',
    theme: {
      name: 'Azul Zafiro',
      border: 'border-blue-500',
      badge: 'bg-blue-600 text-white',
      badgeLight: 'bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-200 border border-blue-300 dark:border-blue-700',
      bgCard: 'bg-blue-50/70 dark:bg-blue-950/30',
      dot: 'bg-blue-500',
      text: 'text-blue-600 dark:text-blue-400',
      ring: 'focus:ring-blue-500',
      gradient: 'from-blue-600 to-cyan-600',
      accent: '#2563eb'
    }
  },
  2: {
    id: 2,
    name: 'Cabaña 2',
    capacity: 12,
    basePrice: 120000,
    tag: 'Grande 10-12p',
    theme: {
      name: 'Verde Esmeralda',
      border: 'border-emerald-500',
      badge: 'bg-emerald-600 text-white',
      badgeLight: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-700',
      bgCard: 'bg-emerald-50/70 dark:bg-emerald-950/30',
      dot: 'bg-emerald-500',
      text: 'text-emerald-600 dark:text-emerald-400',
      ring: 'focus:ring-emerald-500',
      gradient: 'from-emerald-600 to-teal-600',
      accent: '#059669'
    }
  },
  3: {
    id: 3,
    name: 'Cabaña 3',
    capacity: 6,
    basePrice: 70000,
    tag: 'Rústica 6p',
    theme: {
      name: 'Ámbar Cálido',
      border: 'border-amber-500',
      badge: 'bg-amber-600 text-white',
      badgeLight: 'bg-amber-100 text-amber-900 dark:bg-amber-900/60 dark:text-amber-200 border border-amber-300 dark:border-amber-700',
      bgCard: 'bg-amber-50/70 dark:bg-amber-950/30',
      dot: 'bg-amber-500',
      text: 'text-amber-600 dark:text-amber-400',
      ring: 'focus:ring-amber-500',
      gradient: 'from-amber-600 to-orange-600',
      accent: '#d97706'
    }
  },
  4: {
    id: 4,
    name: 'Cabaña 4',
    capacity: 6,
    basePrice: 70000,
    tag: 'Privada 6p',
    theme: {
      name: 'Morado Amatista',
      border: 'border-purple-500',
      badge: 'bg-purple-600 text-white',
      badgeLight: 'bg-purple-100 text-purple-800 dark:bg-purple-900/60 dark:text-purple-200 border border-purple-300 dark:border-purple-700',
      bgCard: 'bg-purple-50/70 dark:bg-purple-950/30',
      dot: 'bg-purple-500',
      text: 'text-purple-600 dark:text-purple-400',
      ring: 'focus:ring-purple-500',
      gradient: 'from-purple-600 to-fuchsia-600',
      accent: '#9333ea'
    }
  }
}

// Estados de pago con sus estilos
export const PAYMENT_STATUS = {
  paid_full: {
    id: 'paid_full',
    label: 'Pagado 100%',
    shortLabel: 'Pagado',
    color: 'emerald',
    badge: 'bg-emerald-500 text-white',
    badgeLight: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800',
    dot: 'bg-emerald-500',
    text: 'text-emerald-600 dark:text-emerald-400'
  },
  paid_half: {
    id: 'paid_half',
    label: 'Abonó 50%',
    shortLabel: '50% Abonado',
    color: 'amber',
    badge: 'bg-amber-500 text-white',
    badgeLight: 'bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300 border border-amber-300 dark:border-amber-800',
    dot: 'bg-amber-500',
    text: 'text-amber-600 dark:text-amber-400'
  },
  paid_partial: {
    id: 'paid_partial',
    label: 'Abono Parcial',
    shortLabel: 'Abono Parcial',
    color: 'yellow',
    badge: 'bg-yellow-500 text-black font-semibold',
    badgeLight: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950/70 dark:text-yellow-300 border border-yellow-300 dark:border-yellow-800',
    dot: 'bg-yellow-500',
    text: 'text-yellow-600 dark:text-yellow-400'
  },
  pending: {
    id: 'pending',
    label: 'Sin Abono / Pendiente',
    shortLabel: 'Sin Abono',
    color: 'rose',
    badge: 'bg-rose-500 text-white',
    badgeLight: 'bg-rose-100 text-rose-800 dark:bg-rose-950/70 dark:text-rose-300 border border-rose-300 dark:border-rose-800',
    dot: 'bg-rose-500',
    text: 'text-rose-600 dark:text-rose-400'
  }
}

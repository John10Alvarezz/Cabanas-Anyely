import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Sun,
  CloudSun,
  Cloud,
  CloudRain,
  CloudSnow,
  Snowflake,
  CloudFog,
  CloudLightning,
  Wind,
  Droplets,
  Thermometer,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react'

// Mapeo de códigos meteorológicos WMO
const getWeatherDetails = (code, isDay = 1) => {
  switch (code) {
    case 0:
      return {
        label: isDay ? 'Cielo despejado' : 'Noche despejada',
        icon: Sun,
        color: 'text-amber-500',
        bg: 'from-amber-500/10 to-orange-500/5',
      }
    case 1:
    case 2:
      return {
        label: isDay ? 'Parcialmente nublado' : 'Parcialmente despejado',
        icon: CloudSun,
        color: 'text-amber-600 dark:text-amber-400',
        bg: 'from-amber-500/10 to-blue-500/5',
      }
    case 3:
      return {
        label: 'Nublado',
        icon: Cloud,
        color: 'text-slate-500 dark:text-slate-300',
        bg: 'from-slate-500/10 to-slate-600/5',
      }
    case 45:
    case 48:
      return {
        label: 'Neblina cordillerana',
        icon: CloudFog,
        color: 'text-teal-600 dark:text-teal-300',
        bg: 'from-teal-500/10 to-slate-500/5',
      }
    case 51:
    case 53:
    case 55:
      return {
        label: 'Llovizna',
        icon: CloudRain,
        color: 'text-blue-500',
        bg: 'from-blue-500/10 to-cyan-500/5',
      }
    case 61:
    case 63:
    case 65:
    case 80:
    case 81:
    case 82:
      return {
        label: 'Lluvia en el sector',
        icon: CloudRain,
        color: 'text-blue-600 dark:text-blue-400',
        bg: 'from-blue-600/15 to-indigo-500/5',
      }
    case 71:
    case 73:
    case 75:
    case 77:
    case 85:
    case 86:
      return {
        label: 'Nevadas en Icalma',
        icon: Snowflake,
        color: 'text-sky-500 dark:text-sky-300',
        bg: 'from-sky-500/15 to-indigo-500/10',
        isSnow: true,
      }
    case 95:
    case 96:
    case 99:
      return {
        label: 'Tormenta eléctrica',
        icon: CloudLightning,
        color: 'text-purple-600 dark:text-purple-400',
        bg: 'from-purple-600/15 to-pink-500/5',
      }
    default:
      return {
        label: 'Cordillerano variable',
        icon: CloudSun,
        color: 'text-primary-600',
        bg: 'from-primary-500/10 to-emerald-500/5',
      }
  }
}

const WeatherWidget = () => {
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [lastUpdated, setLastUpdated] = useState(null)

  const fetchWeather = async () => {
    try {
      setLoading(true)
      setError(false)
      const res = await fetch(
        'https://api.open-meteo.com/v1/forecast?latitude=-38.8164&longitude=-71.2928&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=America%2FSantiago&forecast_days=3'
      )
      if (!res.ok) throw new Error('Error al consultar clima')
      const data = await res.json()
      setWeather(data)
      setLastUpdated(new Date().toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' }))
    } catch (err) {
      console.error(err)
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchWeather()
    // Actualizar cada 30 minutos automáticamente
    const interval = setInterval(fetchWeather, 30 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  if (loading && !weather) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl border border-gray-100 dark:border-gray-700 animate-pulse">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
        <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
    )
  }

  if (error && !weather) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl border border-gray-100 dark:border-gray-700 text-center">
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">
          No se pudo sincronizar el pronóstico en vivo en este momento.
        </p>
        <button
          onClick={fetchWeather}
          className="text-xs bg-primary-50 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400 font-semibold px-4 py-2 rounded-full hover:bg-primary-100 transition-colors"
        >
          Reintentar conexión
        </button>
      </div>
    )
  }

  const current = weather?.current
  const currentDetails = getWeatherDetails(current?.weather_code, current?.is_day)
  const CurrentIcon = currentDetails.icon
  const isColdOrSnow = (current?.temperature_2m <= 3) || currentDetails.isSnow

  const dayNames = ['Hoy', 'Mañana', 'Pasado']

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className={`relative overflow-hidden rounded-3xl p-6 md:p-8 bg-gradient-to-br ${currentDetails.bg} bg-white dark:bg-gray-800 border border-gray-200/80 dark:border-gray-700 shadow-xl`}
    >
      {/* Encabezado */}
      <div className="flex items-center justify-between gap-3 mb-6 pb-4 border-b border-gray-100 dark:border-gray-700">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
              En Tiempo Real
            </span>
          </div>
          <h4 className="text-xl font-bold text-gray-900 dark:text-white mt-0.5">
            Clima en Icalma
          </h4>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-3 py-1 rounded-full">
            1.185 msnm
          </span>
          <button
            onClick={fetchWeather}
            disabled={loading}
            title="Actualizar pronóstico"
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Bloque Principal */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-6">
        <div className="flex items-center gap-4">
          <div className={`p-4 rounded-2xl bg-white dark:bg-gray-750 shadow-md ${currentDetails.color}`}>
            <CurrentIcon size={42} strokeWidth={2.2} />
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white">
                {Math.round(current?.temperature_2m)}°C
              </span>
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Sensación {Math.round(current?.apparent_temperature)}°C
              </span>
            </div>
            <p className="text-base font-semibold text-gray-700 dark:text-gray-200 mt-1">
              {currentDetails.label}
            </p>
          </div>
        </div>

        {/* Métricas Rápidas */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="flex items-center gap-2 bg-white/70 dark:bg-gray-750/70 p-2.5 rounded-xl border border-gray-100 dark:border-gray-700">
            <Wind size={16} className="text-primary-600 dark:text-primary-400" />
            <div>
              <span className="text-gray-400 block text-[10px]">Viento</span>
              <span className="font-bold text-gray-800 dark:text-gray-200">
                {Math.round(current?.wind_speed_10m)} km/h
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-white/70 dark:bg-gray-750/70 p-2.5 rounded-xl border border-gray-100 dark:border-gray-700">
            <Droplets size={16} className="text-blue-500" />
            <div>
              <span className="text-gray-400 block text-[10px]">Humedad</span>
              <span className="font-bold text-gray-800 dark:text-gray-200">
                {current?.relative_humidity_2m}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Alerta de montaña si hace mucho frío o nevisca */}
      {isColdOrSnow && (
        <div className="mb-6 flex items-start gap-2.5 p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-amber-900 dark:text-amber-300 text-xs">
          <AlertTriangle size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
          <p>
            <strong>Aviso de cordillera:</strong> Bajas temperaturas o posibles precipitaciones en Icalma. Se aconseja portar cadenas en tu vehículo y ropa de abrigo.
          </p>
        </div>
      )}

      {/* Pronóstico 3 días */}
      <div>
        <h5 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
          Pronóstico próximos días
        </h5>
        <div className="grid grid-cols-3 gap-2">
          {weather?.daily?.time?.slice(0, 3).map((date, idx) => {
            const dailyCode = weather.daily.weather_code[idx]
            const dailyDetails = getWeatherDetails(dailyCode)
            const DailyIcon = dailyDetails.icon
            const maxTemp = Math.round(weather.daily.temperature_2m_max[idx])
            const minTemp = Math.round(weather.daily.temperature_2m_min[idx])

            return (
              <div
                key={date}
                className="bg-white/80 dark:bg-gray-750/70 p-3 rounded-2xl text-center border border-gray-100 dark:border-gray-700 flex flex-col items-center justify-between"
              >
                <span className="text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">
                  {dayNames[idx]}
                </span>
                <DailyIcon size={22} className={`my-1 ${dailyDetails.color}`} />
                <div className="text-xs mt-1">
                  <span className="font-bold text-gray-900 dark:text-white">{maxTemp}°</span>
                  <span className="text-gray-400 mx-1">/</span>
                  <span className="text-gray-500 dark:text-gray-400">{minTemp}°</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {lastUpdated && (
        <p className="text-[10px] text-gray-400 text-right mt-4">
          Datos oficiales Open-Meteo • Actualizado {lastUpdated} hrs
        </p>
      )}
    </motion.div>
  )
}

export default WeatherWidget

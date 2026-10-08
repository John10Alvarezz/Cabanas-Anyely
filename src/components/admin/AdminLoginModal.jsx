import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Lock, KeyRound, X, AlertCircle, ShieldAlert, ShieldCheck, Clock } from 'lucide-react'
import { getAdminPin, fetchAdminPin, getSecurityStatus, recordFailedAttempt, resetFailedAttempts } from '../../services/reservationService'

const AdminLoginModal = ({ isOpen, onClose, onLoginSuccess }) => {
  const [pin, setPin] = useState('')
  const [expectedPin, setExpectedPin] = useState(getAdminPin())
  const [errorMsg, setErrorMsg] = useState('')
  const [shake, setShake] = useState(false)
  const [securityStatus, setSecurityStatus] = useState({ locked: false, remainingSeconds: 0, attemptsLeft: 5 })
  const inputRef = useRef(null)

  // Actualizar estado de seguridad y consultar PIN más reciente de Supabase
  useEffect(() => {
    if (isOpen) {
      setPin('')
      setErrorMsg('')
      const sec = getSecurityStatus()
      setSecurityStatus(sec)
      if (!sec.locked) {
        setTimeout(() => inputRef.current?.focus(), 150)
      }
      // Consultar el PIN actualizado en la nube
      fetchAdminPin().then((p) => {
        if (p) setExpectedPin(p)
      })
    }
  }, [isOpen])

  // Temporizador de cuenta regresiva si está bloqueado por fuerza bruta
  useEffect(() => {
    let timer
    if (securityStatus.locked && securityStatus.remainingSeconds > 0) {
      timer = setInterval(() => {
        setSecurityStatus((prev) => {
          if (prev.remainingSeconds <= 1) {
            clearInterval(timer)
            return { locked: false, remainingSeconds: 0, attemptsLeft: 5 }
          }
          return { ...prev, remainingSeconds: prev.remainingSeconds - 1 }
        })
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [securityStatus.locked, securityStatus.remainingSeconds])

  if (!isOpen) return null

  const handleVerify = async (inputPin) => {
    if (securityStatus.locked) return

    // Verificar primero con el PIN en memoria/local
    let valid = (inputPin === expectedPin || inputPin === getAdminPin())

    // Si no coincide, consultar Supabase en vivo por si se cambió desde otro dispositivo hace segundos
    if (!valid) {
      const freshPin = await fetchAdminPin()
      if (inputPin === freshPin) {
        setExpectedPin(freshPin)
        valid = true
      }
    }

    if (valid) {
      resetFailedAttempts()
      setErrorMsg('')
      onLoginSuccess()
    } else {
      const sec = recordFailedAttempt()
      setSecurityStatus(sec)
      setShake(true)
      setTimeout(() => setShake(false), 500)

      if (sec.locked) {
        setErrorMsg(`Acceso bloqueado por ${sec.remainingSeconds}s debido a reiterados intentos fallidos.`)
      } else {
        setErrorMsg(`PIN incorrecto. Te quedan ${sec.attemptsLeft} intentos antes del bloqueo de seguridad.`)
      }
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleVerify(pin)
    } else if (e.key === 'Escape') {
      onClose()
    }
  }

  const handlePadClick = (digit) => {
    if (securityStatus.locked) return
    if (pin.length < 8) {
      const next = pin + digit
      setPin(next)
      if (next.length === getAdminPin().length) {
        handleVerify(next)
      }
    }
  }

  const handleClear = () => {
    setPin('')
    setErrorMsg('')
  }

  const handleBackspace = () => {
    setPin((prev) => prev.slice(0, -1))
    setErrorMsg('')
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{
            opacity: 1,
            scale: 1,
            y: 0,
            x: shake ? [-12, 12, -8, 8, -4, 4, 0] : 0
          }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.25 }}
          className="relative w-full max-w-sm bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-800 p-5 sm:p-6 overflow-hidden"
        >
          {/* Botón cerrar */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            title="Cerrar"
          >
            <X size={18} />
          </button>

          {/* Encabezado */}
          <div className="text-center mb-5">
            <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-3 shadow-inner ${securityStatus.locked
                ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-600'
                : 'bg-primary-100 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400'
              }`}>
              {securityStatus.locked ? <ShieldAlert size={28} /> : <ShieldCheck size={28} />}
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Acceso Administrativo
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Cabañas Anyely • Gestión de Reservas
            </p>
          </div>

          {/* Aviso si está bloqueado por fuerza bruta */}
          {securityStatus.locked ? (
            <div className="mb-5 p-4 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 rounded-2xl text-center space-y-2">
              <div className="flex items-center justify-center gap-1.5 text-rose-600 dark:text-rose-400 text-xs font-bold">
                <Clock size={16} className="animate-spin" />
                <span>Sistema Temporalmente Bloqueado</span>
              </div>
              <div className="text-2xl font-black font-mono text-rose-700 dark:text-rose-300">
                00:{String(securityStatus.remainingSeconds).padStart(2, '0')}
              </div>
              <p className="text-[11px] text-gray-600 dark:text-gray-400">
                Por protección contra intentos no autorizados, espera a que finalice el contador para volver a intentar.
              </p>
            </div>
          ) : (
            /* Campo de PIN / Display */
            <div className="mb-5">
              <div className="flex justify-center items-center gap-3 py-2 mb-1">
                {[0, 1, 2, 3].map((idx) => {
                  const filled = pin.length > idx
                  return (
                    <div
                      key={idx}
                      className={`w-3.5 h-3.5 rounded-full transition-all duration-200 ${filled
                          ? 'bg-primary-600 scale-125 shadow-md shadow-primary-500/40'
                          : 'bg-gray-200 dark:bg-gray-700'
                        }`}
                    />
                  )
                })}
              </div>

              <input
                ref={inputRef}
                type="password"
                inputMode="numeric"
                maxLength={8}
                disabled={securityStatus.locked}
                value={pin}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '')
                  setPin(val)
                  if (val.length === getAdminPin().length) {
                    handleVerify(val)
                  }
                }}
                onKeyDown={handleKeyDown}
                className="w-full text-center text-xl tracking-widest font-mono py-2.5 px-4 bg-gray-50 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-gray-900 dark:text-white placeholder:text-gray-400 text-sm"
                placeholder="Ingresa tu PIN..."
              />

              {errorMsg && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-2 mt-2 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-xl text-center text-xs text-rose-600 dark:text-rose-400 font-medium"
                >
                  {errorMsg}
                </motion.div>
              )}
            </div>
          )}

          {/* Teclado numérico táctil optimizado para celular */}
          {!securityStatus.locked && (
            <>
              <div className="grid grid-cols-3 gap-2 mb-4">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => handlePadClick(String(num))}
                    className="h-12 flex items-center justify-center rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 active:scale-95 text-lg font-semibold text-gray-800 dark:text-gray-100 transition-all shadow-xs"
                  >
                    {num}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={handleClear}
                  className="h-12 flex items-center justify-center rounded-xl bg-gray-100/80 dark:bg-gray-800/60 hover:bg-gray-200 dark:hover:bg-gray-700 text-xs font-semibold text-gray-500 dark:text-gray-400 active:scale-95 transition-all"
                >
                  Borrar
                </button>
                <button
                  type="button"
                  onClick={() => handlePadClick('0')}
                  className="h-12 flex items-center justify-center rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 active:scale-95 text-lg font-semibold text-gray-800 dark:text-gray-100 transition-all shadow-xs"
                >
                  0
                </button>
                <button
                  type="button"
                  onClick={handleBackspace}
                  className="h-12 flex items-center justify-center rounded-xl bg-gray-100/80 dark:bg-gray-800/60 hover:bg-gray-200 dark:hover:bg-gray-700 text-sm font-semibold text-gray-500 dark:text-gray-400 active:scale-95 transition-all"
                >
                  ←
                </button>
              </div>

              {/* Botón de acceso */}
              <button
                onClick={() => handleVerify(pin)}
                disabled={pin.length < 4}
                className="w-full py-3 px-4 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-bold shadow-lg shadow-primary-600/20 active:scale-95 transition-all flex items-center justify-center gap-2 text-sm"
              >
                <KeyRound size={17} />
                <span>Ingresar al Sistema</span>
              </button>
            </>
          )}

          {/* Ayuda de inicio */}
          <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800 text-[11px] text-center text-gray-400 dark:text-gray-500">
            PIN inicial: <span className="font-mono font-bold text-gray-600 dark:text-gray-300">1234</span> • Protegido contra fuerza bruta
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

export default AdminLoginModal

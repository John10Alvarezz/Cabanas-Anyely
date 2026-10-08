import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { KeyRound, Database, Download, Upload, CheckCircle2, AlertCircle, Copy, Check, Shield, RefreshCw } from 'lucide-react'
import { getAdminPin, setAdminPin, exportReservationsJSON, importReservationsJSON } from '../../services/reservationService'
import { getSupabaseCredentials, saveSupabaseCredentials, testSupabaseConnection, SUPABASE_SQL_SCHEMA } from '../../lib/supabase'

const SettingsSupabaseView = ({ onDataReload }) => {
  // Estado PIN
  const [currentPin, setCurrentPinState] = useState(getAdminPin())
  const [newPin, setNewPin] = useState('')
  const [confirmPin, setConfirmPin] = useState('')
  const [pinMessage, setPinMessage] = useState({ text: '', type: '' })

  // Estado Supabase
  const [supabaseUrl, setSupabaseUrl] = useState('')
  const [supabaseKey, setSupabaseKey] = useState('')
  const [testResult, setTestResult] = useState(null)
  const [testing, setTesting] = useState(false)
  const [copiedSql, setCopiedSql] = useState(false)

  // Estado Backup
  const [importStatus, setImportStatus] = useState(null)

  useEffect(() => {
    const creds = getSupabaseCredentials()
    setSupabaseUrl(creds.url || '')
    setSupabaseKey(creds.anonKey || '')
    if (creds.url && creds.anonKey) {
      handleTestConnection(creds.url, creds.anonKey)
    }
  }, [])

  const handleChangePin = (e) => {
    e.preventDefault()
    if (newPin.length < 4) {
      setPinMessage({ text: 'El PIN debe tener al menos 4 números', type: 'error' })
      return
    }
    if (newPin !== confirmPin) {
      setPinMessage({ text: 'Los PINs no coinciden', type: 'error' })
      return
    }
    try {
      setAdminPin(newPin)
      setCurrentPinState(newPin)
      setNewPin('')
      setConfirmPin('')
      setPinMessage({ text: '¡PIN actualizado exitosamente!', type: 'success' })
      setTimeout(() => setPinMessage({ text: '', type: '' }), 4000)
    } catch (err) {
      setPinMessage({ text: err.message, type: 'error' })
    }
  }

  const handleTestConnection = async (urlToTest, keyToTest) => {
    setTesting(true)
    setTestResult(null)
    const result = await testSupabaseConnection(urlToTest || supabaseUrl, keyToTest || supabaseKey)
    setTestResult(result)
    setTesting(false)
  }

  const handleSaveSupabase = async (e) => {
    e.preventDefault()
    saveSupabaseCredentials(supabaseUrl, supabaseKey)
    await handleTestConnection(supabaseUrl, supabaseKey)
    if (onDataReload) onDataReload()
  }

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA)
    setCopiedSql(true)
    setTimeout(() => setCopiedSql(false), 3000)
  }

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = async (event) => {
      const content = event.target?.result
      if (typeof content === 'string') {
        const res = await importReservationsJSON(content)
        if (res.ok) {
          setImportStatus({ ok: true, msg: `¡Se importaron ${res.count} reservas con éxito!` })
          if (onDataReload) onDataReload()
        } else {
          setImportStatus({ ok: false, msg: `Error al importar: ${res.error}` })
        }
      }
    }
    reader.readAsText(file)
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* 1. CONFIGURACIÓN DE PIN */}
      <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-primary-100 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400 flex items-center justify-center">
            <KeyRound size={20} />
          </div>
          <div>
            <h3 className="font-bold text-lg text-gray-900 dark:text-white">
              Seguridad y Código PIN
            </h3>
            <p className="text-xs text-gray-500">
              PIN actual: <span className="font-mono font-bold text-gray-700 dark:text-gray-300">•••• ({currentPin})</span>
            </p>
          </div>
        </div>

        <form onSubmit={handleChangePin} className="space-y-4 max-w-md">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Nuevo PIN (mín. 4 dígitos)
              </label>
              <input
                type="password"
                inputMode="numeric"
                maxLength={8}
                required
                value={newPin}
                onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ''))}
                placeholder="Ej: 5678"
                className="w-full py-2 px-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Confirmar Nuevo PIN
              </label>
              <input
                type="password"
                inputMode="numeric"
                maxLength={8}
                required
                value={confirmPin}
                onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, ''))}
                placeholder="Repite el PIN"
                className="w-full py-2 px-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-mono"
              />
            </div>
          </div>

          {pinMessage.text && (
            <div className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
              pinMessage.type === 'success'
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300'
                : 'bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-300'
            }`}>
              {pinMessage.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
              <span>{pinMessage.text}</span>
            </div>
          )}

          <button
            type="submit"
            className="py-2.5 px-5 bg-gray-900 hover:bg-black dark:bg-white dark:hover:bg-gray-100 text-white dark:text-gray-900 rounded-xl text-xs font-bold transition-all"
          >
            Actualizar PIN
          </button>
        </form>
      </div>

      {/* 2. CONEXIÓN A SUPABASE */}
      <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Database size={20} />
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                Base de Datos Supabase (Sincronización en la Nube)
              </h3>
              <p className="text-xs text-gray-500">
                Sincroniza tus reservas en tiempo real entre tu teléfono, tablet y computador
              </p>
            </div>
          </div>

          {/* Estado de conexión */}
          <div className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${
            testResult?.ok
              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
              : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
          }`}>
            <span className={`w-2 h-2 rounded-full ${testResult?.ok ? 'bg-emerald-500' : 'bg-amber-500'}`} />
            <span>{testResult?.ok ? 'Conectado a Supabase' : 'Modo Local (LocalStorage)'}</span>
          </div>
        </div>

        <form onSubmit={handleSaveSupabase} className="space-y-3 pt-2">
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Project URL de Supabase
            </label>
            <input
              type="text"
              placeholder="https://xyzcompany.supabase.co"
              value={supabaseUrl}
              onChange={(e) => setSupabaseUrl(e.target.value)}
              className="w-full py-2.5 px-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Anon / Public API Key
            </label>
            <input
              type="password"
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              value={supabaseKey}
              onChange={(e) => setSupabaseKey(e.target.value)}
              className="w-full py-2.5 px-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-mono"
            />
          </div>

          {testResult && (
            <div className={`p-3 rounded-xl text-xs font-medium flex items-start gap-2 ${
              testResult.ok
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300'
                : 'bg-rose-50 text-rose-800 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-300'
            }`}>
              {testResult.ok ? <CheckCircle2 size={16} className="shrink-0 mt-0.5" /> : <AlertCircle size={16} className="shrink-0 mt-0.5" />}
              <div>
                <div>{testResult.message || testResult.error}</div>
                {testResult.tableMissing && (
                  <div className="mt-1 font-semibold text-amber-700 dark:text-amber-300">
                    Recuerda ejecutar el script SQL que encuentras abajo en Supabase para crear la tabla "reservas".
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              className="py-2.5 px-5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 transition-all"
            >
              Guardar Credenciales
            </button>
            <button
              type="button"
              disabled={testing || !supabaseUrl || !supabaseKey}
              onClick={() => handleTestConnection()}
              className="py-2.5 px-4 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50"
            >
              <RefreshCw size={14} className={testing ? 'animate-spin' : ''} />
              <span>{testing ? 'Comprobando...' : 'Probar Conexión'}</span>
            </button>
          </div>
        </form>

        {/* Script SQL para Supabase */}
        <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
              Script SQL para crear la tabla en Supabase (SQL Editor):
            </span>
            <button
              onClick={handleCopySql}
              className="py-1 px-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              {copiedSql ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
              <span>{copiedSql ? '¡Copiado!' : 'Copiar Script SQL'}</span>
            </button>
          </div>
          <pre className="p-3 bg-gray-950 text-gray-200 rounded-xl text-[11px] font-mono overflow-x-auto max-h-40 border border-gray-800">
            {SUPABASE_SQL_SCHEMA}
          </pre>
        </div>
      </div>

      {/* 3. COPIAS DE RESPALDO (BACKUP & RESTORE) */}
      <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <Download size={20} />
          </div>
          <div>
            <h3 className="font-bold text-lg text-gray-900 dark:text-white">
              Copias de Seguridad (Respaldos JSON)
            </h3>
            <p className="text-xs text-gray-500">
              Descarga un archivo con todas tus reservas en tu computador o restaura una copia anterior
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={exportReservationsJSON}
            className="py-2.5 px-4 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors border border-gray-200 dark:border-gray-700"
          >
            <Download size={16} />
            <span>Descargar Respaldo JSON</span>
          </button>

          <label className="py-2.5 px-4 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer transition-colors border border-gray-200 dark:border-gray-700">
            <Upload size={16} />
            <span>Restaurar Copia JSON</span>
            <input
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>

        {importStatus && (
          <div className={`p-3 rounded-xl text-xs font-medium flex items-center gap-2 ${
            importStatus.ok
              ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300'
              : 'bg-rose-50 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300'
          }`}>
            {importStatus.ok ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
            <span>{importStatus.msg}</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default SettingsSupabaseView

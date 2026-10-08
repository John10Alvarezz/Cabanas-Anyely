import { createClient } from '@supabase/supabase-js'

const SUPABASE_CONFIG_KEY = 'anyely_admin_supabase_config'

// Obtiene la configuración desde import.meta.env o desde localStorage
export const getSupabaseCredentials = () => {
  const envUrl = import.meta.env.VITE_SUPABASE_URL || ''
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

  try {
    const saved = localStorage.getItem(SUPABASE_CONFIG_KEY)
    if (saved) {
      const parsed = JSON.parse(saved)
      if (parsed.url && parsed.anonKey) {
        return { url: parsed.url.trim(), anonKey: parsed.anonKey.trim(), source: 'custom' }
      }
    }
  } catch (e) {
    console.error('Error leyendo configuración de Supabase:', e)
  }

  return {
    url: envUrl.trim(),
    anonKey: envKey.trim(),
    source: envUrl && envKey ? 'env' : 'none'
  }
}

export const saveSupabaseCredentials = (url, anonKey) => {
  if (!url && !anonKey) {
    localStorage.removeItem(SUPABASE_CONFIG_KEY)
    cachedClient = null
    return
  }
  localStorage.setItem(SUPABASE_CONFIG_KEY, JSON.stringify({ url, anonKey }))
  cachedClient = null
}

let cachedClient = null

export const getSupabaseClient = () => {
  if (cachedClient) return cachedClient
  const { url, anonKey } = getSupabaseCredentials()

  if (url && anonKey) {
    try {
      cachedClient = createClient(url, anonKey, {
        auth: {
          persistSession: false
        }
      })
      return cachedClient
    } catch (e) {
      console.warn('Error inicializando Supabase client:', e)
      return null
    }
  }
  return null
}

// Probar conexión a Supabase
export const testSupabaseConnection = async (testUrl, testKey) => {
  try {
    const url = testUrl || getSupabaseCredentials().url
    const key = testKey || getSupabaseCredentials().anonKey

    if (!url || !key) {
      return { ok: false, error: 'Faltan credenciales (URL o Anon Key)' }
    }

    const client = createClient(url, key)
    // Intentar una consulta ligera a la tabla reservas
    const { data, error } = await client.from('reservas').select('id').limit(1)

    if (error) {
      if (error.code === '42P01') {
        // La tabla no existe aún, pero la conexión fue exitosa
        return {
          ok: true,
          tableMissing: true,
          message: 'Conectado a Supabase con éxito, pero la tabla "reservas" aún no ha sido creada.'
        }
      }
      return { ok: false, error: error.message || 'Error al conectar con Supabase' }
    }

    return { ok: true, tableMissing: false, message: '¡Conexión exitosa con Supabase y tabla reservas lista!' }
  } catch (err) {
    return { ok: false, error: err.message || 'Error inesperado' }
  }
}

// Script SQL para crear la tabla en Supabase
export const SUPABASE_SQL_SCHEMA = `-- Copia y pega este script en el "SQL Editor" de tu proyecto de Supabase:

CREATE TABLE IF NOT EXISTS public.reservas (
  id TEXT PRIMARY KEY,
  cabana_id INTEGER NOT NULL,
  guest_name TEXT NOT NULL,
  guest_phone TEXT,
  guest_email TEXT,
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  guests_count INTEGER DEFAULT 2,
  nights INTEGER DEFAULT 1,
  total_price NUMERIC DEFAULT 0,
  paid_amount NUMERIC DEFAULT 0,
  balance_due NUMERIC DEFAULT 0,
  payment_status TEXT DEFAULT 'pending',
  payment_method TEXT DEFAULT 'transferencia',
  notes TEXT,
  source TEXT DEFAULT 'manual',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habilitar Row Level Security (RLS) con acceso libre para tu clave pública anon
ALTER TABLE public.reservas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir todo a usuarios anon en reservas" 
ON public.reservas 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- Tabla para sincronizar el PIN y configuraciones globales en todos los dispositivos:
CREATE TABLE IF NOT EXISTS public.configuracion (
  clave TEXT PRIMARY KEY,
  valor TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.configuracion ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir todo a usuarios anon en configuracion" 
ON public.configuracion 
FOR ALL 
USING (true) 
WITH CHECK (true);

INSERT INTO public.configuracion (clave, valor)
VALUES ('admin_pin', '1234')
ON CONFLICT (clave) DO NOTHING;
`

# Cabañas Anyely Icalma - Landing Page

Landing page moderna y responsive para promocionar las cabañas y tinajas en el sector de Icalma, Chile.

## 🚀 Características

- ✅ Diseño responsive mobile-first
- ✅ Animaciones suaves con Framer Motion
- ✅ 4 secciones de cabañas con galería de fotos
- ✅ Sección de tinajas con información detallada
- ✅ Integración con WhatsApp para reservas
- ✅ Links a Instagram y redes sociales
- ✅ Sección de reseñas
- ✅ Información de ubicación
- ✅ Sección "Quiénes Somos"
- ✅ Navegación suave entre secciones

## 📦 Instalación

1. Instala las dependencias:
```bash
npm install
```

2. Inicia el servidor de desarrollo:
```bash
npm run dev
```

3. Abre tu navegador en `http://localhost:5173`

## 🏗️ Construcción para Producción

```bash
npm run build
```

Los archivos se generarán en la carpeta `dist/`.

## 📁 Estructura de Carpetas para Imágenes

Para que las imágenes se muestren correctamente, crea las siguientes carpetas en `public/`:

```
public/
├── Logo cabañas.jpeg (ya existe)
├── cabanas/
│   ├── cabana1-1.jpg
│   ├── cabana1-2.jpg
│   ├── cabana1-video.mp4
│   ├── cabana2-1.jpg
│   ├── cabana2-2.jpg
│   ├── cabana2-video.mp4
│   ├── cabana3-1.jpg
│   ├── cabana3-2.jpg
│   ├── cabana3-video.mp4
│   ├── cabana4-1.jpg
│   ├── cabana4-2.jpg
│   └── cabana4-video.mp4
├── tinajas/
│   ├── tinaja1-1.jpg
│   ├── tinaja1-2.jpg
│   ├── tinaja1-video.mp4
│   ├── tinaja2-1.jpg
│   ├── tinaja2-2.jpg
│   └── tinaja2-video.mp4
└── paisajes/
    ├── paisaje1.jpg
    ├── paisaje2.jpg
    ├── paisaje3.jpg
    └── paisaje4.jpg
```

## 🔧 Configuración

### Actualizar Números de WhatsApp

Edita los archivos de componentes y reemplaza `56912345678` con tu número real de WhatsApp (formato: código de país + número sin espacios ni guiones).

Archivos a editar:
- `src/components/Hero.jsx`
- `src/components/Cabanas.jsx`
- `src/components/Tinajas.jsx`
- `src/components/Resenas.jsx`
- `src/components/Footer.jsx`

### Actualizar Link de Instagram

Edita `src/components/Footer.jsx` y reemplaza `https://instagram.com/cabanasanyely` con tu perfil real de Instagram.

### Actualizar Información de Contacto

Edita `src/components/Footer.jsx` para actualizar:
- Teléfono
- Email
- Dirección exacta

## 🌐 Deploy en Netlify

1. Conecta tu repositorio de GitHub/GitLab a Netlify
2. Configuración de build:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
3. Netlify detectará automáticamente el archivo `netlify.toml`
4. ¡Listo! Tu sitio estará en línea

### Deploy Manual

Si prefieres hacer deploy manual:

```bash
npm run build
```

Luego arrastra la carpeta `dist/` a [Netlify Drop](https://app.netlify.com/drop)

## 🎨 Personalización

### Colores

Los colores principales están definidos en `tailwind.config.js`. Puedes modificar la paleta de colores `primary` según tus preferencias.

### Contenido

- **Cabañas**: Edita `src/components/Cabanas.jsx` para modificar información, precios y características
- **Tinajas**: Edita `src/components/Tinajas.jsx`
- **Reseñas**: Edita `src/components/Resenas.jsx`
- **Quiénes Somos**: Edita `src/components/QuienesSomos.jsx`

## 📱 Responsive Design

La aplicación está optimizada para:
- 📱 Móviles (320px+)
- 📱 Tablets (768px+)
- 💻 Desktop (1024px+)

## 🛠️ Tecnologías Utilizadas

- **React 18** - Framework de UI
- **Vite** - Build tool y dev server
- **Tailwind CSS** - Estilos utility-first
- **Framer Motion** - Animaciones
- **Lucide React** - Iconos

## 📝 Notas

- Las imágenes placeholder se mostrarán hasta que subas las imágenes reales
- Los videos son opcionales, pero recomendados para mejor experiencia
- Asegúrate de optimizar las imágenes antes de subirlas para mejor rendimiento

## 📄 Licencia

Este proyecto es privado y pertenece a Cabañas Anyely Icalma.


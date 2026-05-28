# 🚀 Space — Bitácora Personal

Portafolio y bitácora personal de **Pablo DP**. Un espacio para compartir proyectos, habilidades y reflexiones sobre desarrollo de software.

🔗 [space.sypablitodp.site](https://space.sypablitodp.site)

## 🛠️ Tech Stack

- **Frontend:** React 19, Vite 8, Tailwind CSS 4
- **Backend:** Supabase (PostgreSQL, Auth, Edge Functions)
- **IA:** DeepSeek (via Supabase Edge Function proxy)
- **Deploy:** GitHub Pages + GitHub Actions CI/CD

## 📦 Setup Local

```bash
# 1. Clonar e instalar
git clone https://github.com/dppablito4-oss/mibitacora.git
cd mibitacora
npm install

# 2. Configurar variables de entorno
cp .env.example .env
# Edita .env con tus credenciales de Supabase

# 3. Dev server
npm run dev
```

## 🚀 Proyectos Destacados

- **[Pablito Expo](https://expo.sypablitodp.site)** — Editor de presentaciones con canvas y generación IA
- **[Grafiplot](https://grafiplotvasquez.lat)** — Servicio de impresión digital con dashboard admin
- **[I.E.I. N° 090](https://iein090-pampas-de-flores.sypablitodp.site)** — Sitio institucional educativo

---

## ✨ Características

- 🎨 Diseño dark mode ultra-minimalista con glassmorphism
- 📝 Bitácora/Blog dinámico con Supabase (CRUD completo)
- 🤖 Asistente IA integrado (P.A.B.L.O. — DeepSeek)
- 🔐 Panel admin protegido con autenticación
- 📱 Diseño 100% responsive
- ⚡ Code splitting y lazy loading
- 🎭 Scroll animations con Intersection Observer
- 📊 Analytics internos con user_logs

## 🛠️ Tech Stack

| Capa | Tecnología |
|---|---|
| **Frontend** | React 19, Vite 8, Tailwind CSS 4 |
| **Backend** | Supabase (PostgreSQL + Auth + Edge Functions) |
| **IA** | DeepSeek V3 via Edge Function proxy |
| **Deploy** | GitHub Pages + GitHub Actions CI/CD |
| **Extras** | Lucide Icons, React Router, JetBrains Mono |

## 📂 Estructura

```
src/
├── components/     # UI components (Header, Profile, Skills, etc.)
├── config/         # Supabase client
├── context/        # Auth context provider
├── data/           # Site configuration data
├── lib/            # Utilities (slugify)
├── pages/          # Route pages (Home, Login, Admin)
supabase/
├── functions/      # Edge Functions (deepseek-router)
├── migrations/     # SQL schemas
```

## 🚀 Setup Local

```bash
git clone https://github.com/dppablito4-oss/mibitacora.git
cd mibitacora
cp .env.example .env   # Agregar credenciales de Supabase
npm install
npm run dev
```

## 📜 Licencia

© 2025–2026 **PABLITODP** — Todos los derechos reservados.

---

Hecho con ❤️ y ⚡ por Pablo DP

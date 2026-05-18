# 🚀 Space — Bitácora Personal

> Portafolio y bitácora personal de **Pablo DP** — Desarrollador Full-Stack & Digital Creator.

🔗 **[space.sypablitodp.site](https://space.sypablitodp.site)**

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

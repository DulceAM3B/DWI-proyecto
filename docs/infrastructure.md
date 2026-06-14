# Infraestructura de Despliegue - MaquilaControl

- **Frontend (`apps/web`):** Vercel — deploy automático desde GitHub, HTTPS incluido.
- **Backend (`apps/api`):** Render — servidor Node.js/Express accesible por URL pública.
- **Base de datos + Auth:** Supabase Cloud — PostgreSQL administrado con autenticación integrada (Supabase Auth).
- **Repositorio:** GitHub (monorepo `DWI-proyecto`, con `apps/web` y `apps/api`).
- **Tiempo real:** Supabase Realtime, suscrito a cambios en la tabla `lotes`.

# Seguridad - MaquilaControl

- HTTPS obligatorio en todos los endpoints.
- Autenticación gestionada por Supabase Auth (JWT emitido al iniciar sesión).
- Control de acceso por rol (RBAC): cada endpoint valida el rol del usuario (administrador, supervisor, operador) antes de ejecutar la acción.
- Las contraseñas son gestionadas internamente por Supabase Auth; el sistema no almacena ni maneja hashes de contraseña manualmente.
- Validación de datos en el backend antes de tocar la base de datos.
- Rate limiting en endpoints críticos (ej. `/api/produccion/registrar`) para evitar abuso o ataques de fuerza bruta.
- Auditoría de cambios sensibles mediante la tabla `auditoria_cambios`.

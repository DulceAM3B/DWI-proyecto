# Pruebas locales y Docker

## Probar piezas disponibles en tiempo real

1. Levanta el backend:

```bash
cd apps/api
npm start
```

2. Levanta el frontend:

```bash
cd apps/web
npm run dev
```

3. En Supabase, asegúrate de tener al menos un lote abierto:

```sql
insert into lotes (codigo_lote, total_piezas_requeridas, piezas_acumuladas, estado)
values ('LOTE-PRUEBA-001', 100, 0, 'abierto');
```

Si tu tabla usa catálogo de estados, primero crea los estados y usa `estado_id`:

```sql
insert into estados_lote (nombre)
values ('abierto'), ('cerrado'), ('pausado')
on conflict (nombre) do nothing;

insert into lotes (codigo_lote, total_piezas_requeridas, piezas_acumuladas, estado_id)
values (
  'LOTE-PRUEBA-001',
  100,
  0,
  (select id from estados_lote where nombre = 'abierto')
);
```

4. Entra con un usuario operador y abre `http://localhost:3000/operador`.
5. Escribe el ID numérico del lote. La pantalla consulta `GET /api/lotes/estado/:id` y muestra piezas disponibles.
6. Registra piezas. Al terminar el registro, la pantalla usa la respuesta de `POST /api/produccion/registrar` para actualizar disponibles.
7. Para comprobarlo mejor, abre también `http://localhost:3000/supervisor`; el dashboard refresca lotes cada 5 segundos.

La alerta `Límite Cercano` aparece solo cuando el backend calcula que el lote real supera el 90%.

## Crear usuarios reales

El login usa Supabase Auth y después busca el perfil en la tabla `usuarios`.
Cada usuario debe existir en ambos lugares:

1. Crea el usuario en Supabase Auth.
2. Copia su UUID.
3. Inserta el perfil en `usuarios` con el mismo UUID.

Ejemplo para operador:

```sql
insert into usuarios (id, nombre, email, rol)
values ('UUID_DEL_AUTH_USER', 'Operador Prueba', 'operador@prueba.com', 'operador');
```

Ejemplo para supervisor:

```sql
insert into usuarios (id, nombre, email, rol)
values ('UUID_DEL_AUTH_USER', 'Supervisor Prueba', 'supervisor@prueba.com', 'supervisor');
```

Sí conviene crear un supervisor si quieres probar el redirect real a `/supervisor` y ver el dashboard con datos reales.

## Docker

1. Copia el ejemplo de variables:

```bash
cp .env.example .env
```

En Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

2. Llena `.env` con tus valores reales de Supabase.
3. Abre Docker Desktop.
4. Construye y levanta los servicios:

```bash
docker compose up --build
```

5. Abre:

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:3001`

Para detener:

```bash
docker compose down
```

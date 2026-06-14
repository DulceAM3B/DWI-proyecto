# Modelo de Datos - MaquilaControl

## 1. Cambios respecto a la versión del sistema

Con base en la retroalimentación recibida, el modelo se amplía para incluir:

- Catálogo de estados de lote (`estados_lote`).
- Turnos (`turnos`).
- Líneas de producción (`lineas_produccion`).
- Tarifas por tipo de pieza y vigencia (`tarifas_nomina` actualizada).
- Nómina generada y su detalle (`nominas_generadas`, `detalle_nomina`).
- Auditoría de cambios (`auditoria_cambios`).
- Eliminación de `password_hash` de `usuarios` (se usa Supabase Auth).

## 2. Esquema SQL

```sql
-- =========================================
-- Catálogos
-- =========================================

create table estados_lote (
  id bigint primary key generated always as identity,
  nombre text unique check (nombre in ('abierto', 'cerrado', 'pausado'))
);

create table turnos (
  id bigint primary key generated always as identity,
  nombre text unique check (nombre in ('matutino', 'vespertino', 'nocturno')),
  hora_inicio time,
  hora_fin time
);

create table lineas_produccion (
  id bigint primary key generated always as identity,
  nombre text unique,
  descripcion text
);

-- =========================================
-- Usuarios (perfil — auth gestionado por Supabase Auth)
-- =========================================

create table usuarios (
  id uuid primary key references auth.users (id),
  nombre text,
  email text unique,
  rol text check (rol in ('administrador', 'supervisor', 'operador')),
  fecha_creacion timestamp default now()
);

-- =========================================
-- Lotes
-- =========================================

create table lotes (
  id bigint primary key generated always as identity,
  codigo_lote text unique,
  total_piezas_requeridas int,
  piezas_acumuladas int default 0,
  estado_id bigint references estados_lote (id),
  linea_id bigint references lineas_produccion (id),
  turno_id bigint references turnos (id),
  supervisor_id uuid references usuarios (id),
  fecha_creacion timestamp default now(),
  fecha_cierre timestamp
);

-- =========================================
-- Registros de producción
-- =========================================

create table registros_produccion (
  id bigint primary key generated always as identity,
  lote_id bigint references lotes (id),
  usuario_id uuid references usuarios (id),
  piezas_reportadas int,
  tipo_pieza text,
  fecha_registro timestamp default now()
);

-- =========================================
-- Tarifas (por tipo de pieza y vigencia)
-- =========================================

create table tarifas_nomina (
  id bigint primary key generated always as identity,
  tipo_pieza text,
  pago_por_pieza numeric,
  fecha_inicio_vigencia date,
  fecha_fin_vigencia date
);

-- =========================================
-- Nómina generada
-- =========================================

create table nominas_generadas (
  id bigint primary key generated always as identity,
  periodo_inicio date,
  periodo_fin date,
  fecha_generacion timestamp default now(),
  generado_por uuid references usuarios (id),
  estado text check (estado in ('borrador', 'cerrada')) default 'borrador'
);

create table detalle_nomina (
  id bigint primary key generated always as identity,
  nomina_id bigint references nominas_generadas (id),
  usuario_id uuid references usuarios (id),
  total_piezas_validas int,
  monto_calculado numeric
);

-- =========================================
-- Auditoría de cambios
-- =========================================

create table auditoria_cambios (
  id bigint primary key generated always as identity,
  tabla_afectada text,
  registro_id bigint,
  accion text check (accion in ('insert', 'update', 'delete')),
  usuario_id uuid references usuarios (id),
  fecha timestamp default now(),
  datos_anteriores jsonb,
  datos_nuevos jsonb
);
```

## 3. Relaciones principales

| Tabla | Campo FK | Referencia |
|---|---|---|
| `lotes` | `estado_id` | `estados_lote.id` |
| `lotes` | `linea_id` | `lineas_produccion.id` |
| `lotes` | `turno_id` | `turnos.id` |
| `lotes` | `supervisor_id` | `usuarios.id` |
| `registros_produccion` | `lote_id` | `lotes.id` |
| `registros_produccion` | `usuario_id` | `usuarios.id` |
| `detalle_nomina` | `nomina_id` | `nominas_generadas.id` |
| `detalle_nomina` | `usuario_id` | `usuarios.id` |
| `nominas_generadas` | `generado_por` | `usuarios.id` |
| `auditoria_cambios` | `usuario_id` | `usuarios.id` |
| `usuarios` | `id` | `auth.users.id` (Supabase Auth) |

## 4. Notas sobre autenticación

La tabla `usuarios` **no almacena contraseñas**. El campo `id` es el mismo
UUID generado por Supabase Auth al registrar al usuario (`auth.users`).
Supabase gestiona el hash de la contraseña internamente; el backend solo
necesita el JWT emitido por Supabase para identificar al usuario y consultar
su `rol` en esta tabla.

-- ========================================
-- TABLAS DE LOOKUP / CATÁLOGOS
-- ========================================

-- Tabla: roles_usuario
CREATE TABLE roles_usuario (
    rol_id SERIAL PRIMARY KEY,
    nombre_rol VARCHAR(50) UNIQUE NOT NULL,
    descripcion TEXT
);
-- Insertar roles básicos
INSERT INTO roles_usuario (nombre_rol, descripcion) VALUES
('Administrador', 'Acceso total al sistema'),
('Operador', 'Gestión de inventario y registros diarios'),
('Veterinario', 'Gestión de salud y sanidad animal');

-- Tabla: especies
CREATE TABLE especies (
    especie_id SERIAL PRIMARY KEY,
    nombre_comun VARCHAR(100) UNIQUE NOT NULL,
    nombre_cientifico VARCHAR(100)
);
-- Ejemplo: Bovino, Ovino, Equino

-- Tabla: razas
CREATE TABLE razas (
    raza_id SERIAL PRIMARY KEY,
    especie_id INT NOT NULL REFERENCES especies(especie_id),
    nombre_raza VARCHAR(100) NOT NULL,
    UNIQUE (especie_id, nombre_raza) -- Una raza pertenece a una especie
);

-- Tabla: tipos_alimento
CREATE TABLE tipos_alimento (
    tipo_alimento_id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) UNIQUE NOT NULL,
    descripcion TEXT,
    unidad_medida VARCHAR(20) -- Ej: kg, fardo, litro
);

-- Tabla: tipos_vacuna
CREATE TABLE tipos_vacuna (
    tipo_vacuna_id SERIAL PRIMARY KEY,
    nombre_vacuna VARCHAR(150) NOT NULL,
    enfermedad_prevenida VARCHAR(200),
    laboratorio VARCHAR(100),
    especie_destino_id INT REFERENCES especies(especie_id), -- Para qué especie es
    UNIQUE (nombre_vacuna, laboratorio)
);

-- Tabla: medicamentos
CREATE TABLE medicamentos (
    medicamento_id SERIAL PRIMARY KEY,
    nombre_comercial VARCHAR(150) NOT NULL,
    principio_activo VARCHAR(200),
    laboratorio VARCHAR(100),
    presentacion VARCHAR(100), -- Ej: Inyectable 100ml, Polvo 1kg
    periodo_retiro_carne_dias INT DEFAULT 0,
    periodo_retiro_leche_dias INT DEFAULT 0,
    UNIQUE (nombre_comercial, laboratorio, presentacion)
);

-- Tabla: ubicaciones (Potreros, Corrales, etc.)
CREATE TABLE ubicaciones (
    ubicacion_id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) UNIQUE NOT NULL,
    tipo VARCHAR(50) CHECK (tipo IN ('Potrero', 'Corral', 'Establo', 'Enfermeria', 'Cuarentena')),
    area_hectareas DECIMAL(10, 2),
    capacidad_maxima_animales INT,
    descripcion TEXT
);

-- Tabla: lotes (Grupos de manejo)
CREATE TABLE lotes (
    lote_id SERIAL PRIMARY KEY,
    codigo_lote VARCHAR(50) UNIQUE NOT NULL, -- Ej: ENGORDE-2024-01
    fecha_creacion DATE NOT NULL DEFAULT CURRENT_DATE,
    proposito TEXT, -- Ej: Engorde, Cría, Lechería, Recría
    descripcion TEXT,
    activo BOOLEAN DEFAULT TRUE
);

-- ========================================
-- TABLAS PRINCIPALES
-- ========================================

-- Tabla: usuarios
CREATE TABLE usuarios (
    usuario_id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    nombre TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL, -- *** ALMACENAR HASH, NUNCA TEXTO PLANO ***
    rol_id INT NOT NULL REFERENCES roles_usuario(rol_id),
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMPTZ DEFAULT now(),
    fecha_actualizacion TIMESTAMPTZ
);
-- Crear un trigger para actualizar fecha_actualizacion automáticamente

-- Tabla: proveedores
CREATE TABLE proveedores (
    proveedor_id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    nombre TEXT NOT NULL,
    identificacion_fiscal VARCHAR(50) UNIQUE, -- NIT, CUIT, RUC, etc.
    telefono TEXT,
    email TEXT,
    direccion TEXT,
    persona_contacto VARCHAR(150),
    tipo_proveedor TEXT, -- Ej: Animales, Alimento, Medicamentos, Servicios
    fecha_creacion TIMESTAMPTZ DEFAULT now(),
    fecha_actualizacion TIMESTAMPTZ
);
-- Crear un trigger para actualizar fecha_actualizacion automáticamente

-- Tabla: clientes (Compradores)
CREATE TABLE clientes (
    cliente_id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    nombre TEXT NOT NULL,
    identificacion_fiscal VARCHAR(50) UNIQUE,
    telefono TEXT,
    email TEXT,
    direccion TEXT,
    fecha_creacion TIMESTAMPTZ DEFAULT now(),
    fecha_actualizacion TIMESTAMPTZ
);
-- Crear un trigger para actualizar fecha_actualizacion automáticamente

-- Tabla: animal (Datos intrínsecos del animal)
CREATE TABLE animal (
    animal_id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    numero_trazabilidad VARCHAR(50) UNIQUE NOT NULL, -- Caravana, DIIO, etc.
    nombre_identificatorio VARCHAR(100), -- Opcional, para reproductores p.ej.
    especie_id INT NOT NULL REFERENCES especies(especie_id),
    raza_id INT NOT NULL REFERENCES razas(raza_id),
    sexo CHAR(1) NOT NULL CHECK (sexo IN ('M', 'H')), -- Macho / Hembra
    fecha_nacimiento DATE,
    madre_id BIGINT REFERENCES animal(animal_id) ON DELETE SET NULL, -- Para genealogía
    padre_id BIGINT REFERENCES animal(animal_id) ON DELETE SET NULL, -- Para genealogía
    estado_actual VARCHAR(20) NOT NULL DEFAULT 'Activo' CHECK (estado_actual IN ('Activo', 'Vendido', 'Muerto', 'Descartado')), -- Estado general del animal
    fecha_registro TIMESTAMPTZ DEFAULT now(),
    observaciones_generales TEXT
);
-- Indices para madre_id y padre_id

-- Tabla: inventario_animal (Registro de la estancia del animal en la finca)
CREATE TABLE inventario_animal (
    inventario_id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    animal_id BIGINT UNIQUE NOT NULL REFERENCES animal(animal_id) ON DELETE RESTRICT, -- Un animal sólo puede estar una vez en el inventario activo
    fecha_ingreso DATE NOT NULL,
    motivo_ingreso VARCHAR(50) NOT NULL CHECK (motivo_ingreso IN ('Nacimiento', 'Compra', 'TrasladoInterno')),
    proveedor_compra_id BIGINT REFERENCES proveedores(proveedor_id), -- Si motivo_ingreso = 'Compra'
    precio_compra DECIMAL(12, 2), -- Si motivo_ingreso = 'Compra'
    ubicacion_actual_id INT REFERENCES ubicaciones(ubicacion_id),
    lote_actual_id INT REFERENCES lotes(lote_id),
    fecha_egreso DATE, -- Se llena cuando el animal sale del inventario activo
    motivo_egreso VARCHAR(50) CHECK (motivo_egreso IN ('Venta', 'Muerte', 'Descarte', 'TrasladoExterno')),
    -- CONSTRAINT chk_compra CHECK (motivo_ingreso != 'Compra' OR (proveedor_compra_id IS NOT NULL AND precio_compra IS NOT NULL)),
    -- CONSTRAINT chk_egreso CHECK ((fecha_egreso IS NULL AND motivo_egreso IS NULL) OR (fecha_egreso IS NOT NULL AND motivo_egreso IS NOT NULL)),
    activo_en_finca BOOLEAN GENERATED ALWAYS AS (fecha_egreso IS NULL) STORED -- Columna calculada para saber si está activo
);
-- Indices en animal_id, ubicacion_actual_id, lote_actual_id, fecha_ingreso, fecha_egreso

-- Tabla: movimientos_animal (Historial de entradas, salidas y traslados)
CREATE TABLE movimientos_animal (
    movimiento_id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    animal_id BIGINT NOT NULL REFERENCES animal(animal_id) ON DELETE CASCADE,
    fecha_movimiento TIMESTAMPTZ NOT NULL DEFAULT now(),
    tipo_movimiento VARCHAR(50) NOT NULL CHECK (tipo_movimiento IN ('IngresoCompra', 'IngresoNacimiento', 'EgresoVenta', 'EgresoMuerte', 'EgresoDescarte', 'TrasladoInterno', 'CambioLote')),
    origen_ubicacion_id INT REFERENCES ubicaciones(ubicacion_id),
    destino_ubicacion_id INT REFERENCES ubicaciones(ubicacion_id),
    origen_lote_id INT REFERENCES lotes(lote_id),
    destino_lote_id INT REFERENCES lotes(lote_id),
    proveedor_id BIGINT REFERENCES proveedores(proveedor_id), -- Para IngresoCompra
    cliente_id BIGINT REFERENCES clientes(cliente_id), -- Para EgresoVenta
    documento_referencia TEXT, -- Nro Guía, Factura Venta/Compra
    usuario_id BIGINT REFERENCES usuarios(usuario_id),
    observaciones TEXT
);
-- Indices en animal_id, fecha_movimiento, tipo_movimiento

-- Tabla: controles_sanitarios (Pesajes, condición corporal, chequeos generales)
CREATE TABLE controles_sanitarios (
    control_id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    animal_id BIGINT NOT NULL REFERENCES animal(animal_id) ON DELETE CASCADE,
    fecha_control DATE NOT NULL DEFAULT CURRENT_DATE,
    peso_kg DECIMAL(7, 2),
    condicion_corporal DECIMAL(3, 1), -- Escala 1-5 o 1-9 según se use
    altura_cm DECIMAL(5, 1),
    responsable_id BIGINT REFERENCES usuarios(usuario_id) ON DELETE SET NULL,
    ubicacion_id INT REFERENCES ubicaciones(ubicacion_id), -- Dónde se realizó
    observaciones TEXT
);
-- Indices en animal_id, fecha_control, responsable_id

-- Tabla: vacunaciones (Registro específico de cada vacunación)
CREATE TABLE vacunaciones (
    vacunacion_id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    animal_id BIGINT NOT NULL REFERENCES animal(animal_id) ON DELETE CASCADE,
    fecha_aplicacion DATE NOT NULL,
    tipo_vacuna_id INT NOT NULL REFERENCES tipos_vacuna(tipo_vacuna_id),
    dosis_aplicada DECIMAL(6, 2),
    unidad_dosis VARCHAR(10), -- ml, cc
    lote_vacuna VARCHAR(100),
    fecha_vencimiento_lote DATE,
    proveedor_vacuna_id BIGINT REFERENCES proveedores(proveedor_id), -- Quién suministró la vacuna
    responsable_aplicacion_id BIGINT REFERENCES usuarios(usuario_id) ON DELETE SET NULL, -- Quién la aplicó
    proxima_vacunacion_sugerida DATE,
    observaciones TEXT
);
-- Indices en animal_id, fecha_aplicacion, tipo_vacuna_id, responsable_aplicacion_id

-- Tabla: tratamientos_sanitarios (Diagnósticos y tratamientos médicos)
CREATE TABLE tratamientos_sanitarios (
    tratamiento_id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    animal_id BIGINT NOT NULL REFERENCES animal(animal_id) ON DELETE CASCADE,
    fecha_diagnostico DATE NOT NULL,
    sintomas_observados TEXT,
    diagnostico TEXT, -- Podría ser FK a tabla Diagnosticos si se estandariza mucho
    fecha_inicio_tratamiento DATE,
    medicamento_id INT REFERENCES medicamentos(medicamento_id),
    dosis_aplicada DECIMAL(8, 2),
    unidad_dosis VARCHAR(20),
    via_administracion VARCHAR(50), -- Oral, Inyectable (IM, SC, IV), Tópica
    duracion_tratamiento_dias INT,
    fecha_fin_tratamiento DATE,
    proveedor_medicamento_id BIGINT REFERENCES proveedores(proveedor_id),
    responsable_veterinario_id BIGINT REFERENCES usuarios(usuario_id) ON DELETE SET NULL, -- Usuario con rol Veterinario
    periodo_retiro_aplicable_dias INT, -- Calculado o ingresado basado en medicamento y fecha fin
    fecha_fin_retiro DATE, -- Calculada: fecha_fin_tratamiento + periodo_retiro_aplicable_dias
    proxima_revision DATE,
    resultado_tratamiento TEXT, -- Ej: Curado, Mejoría, Sin cambios, Muerte
    observaciones TEXT
);
-- Indices en animal_id, fecha_diagnostico, medicamento_id, responsable_veterinario_id

-- Tabla: alimentaciones (Registro de suministro de alimento)
CREATE TABLE alimentaciones (
    alimentacion_id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    -- Puede ser para un animal específico o para un lote/ubicación
    animal_id BIGINT REFERENCES animal(animal_id) ON DELETE CASCADE,
    lote_id INT REFERENCES lotes(lote_id),
    ubicacion_id INT REFERENCES ubicaciones(ubicacion_id),
    fecha_suministro DATE NOT NULL,
    tipo_alimento_id INT NOT NULL REFERENCES tipos_alimento(tipo_alimento_id),
    cantidad_suministrada DECIMAL(10, 2) NOT NULL,
    -- unidad_medida viene de tipos_alimento
    proveedor_alimento_id BIGINT REFERENCES proveedores(proveedor_id),
    costo_total_alimento DECIMAL(12, 2),
    responsable_id BIGINT REFERENCES usuarios(usuario_id) ON DELETE SET NULL,
    observaciones TEXT,
    CONSTRAINT chk_alimentacion_destino CHECK (animal_id IS NOT NULL OR lote_id IS NOT NULL OR ubicacion_id IS NOT NULL) -- Debe especificarse al menos un destino
);
-- Indices en animal_id, lote_id, ubicacion_id, fecha_suministro, tipo_alimento_id

-- Tabla: ventas (Registro de la transacción de venta)
CREATE TABLE ventas (
    venta_id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    cliente_id BIGINT NOT NULL REFERENCES clientes(cliente_id),
    fecha_venta DATE NOT NULL,
    documento_venta_ref TEXT UNIQUE, -- Factura, Guía de Traslado (Debería ser único por venta)
    precio_venta_total_general DECIMAL(14, 2), -- El total de la factura/transacción. Puede ser calculado o ingresado.
    condicion_pago TEXT, -- Contado, Crédito 30 días, etc.
    lote_origen_id INT REFERENCES lotes(lote_id), -- Opcional: Si la venta corresponde a un lote de manejo predefinido.
    usuario_registra_id BIGINT REFERENCES usuarios(usuario_id),
    fecha_registro TIMESTAMPTZ DEFAULT now(),
    observaciones TEXT -- Observaciones generales de la venta
);

CREATE TABLE ventas_detalle (
    venta_detalle_id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    venta_id BIGINT NOT NULL REFERENCES ventas(venta_id) ON DELETE CASCADE, -- Si se borra la venta, se borran sus detalles.
    animal_id BIGINT NOT NULL REFERENCES animal(animal_id) ON DELETE RESTRICT, -- No permitir borrar un animal si está en un detalle de venta.
    peso_venta_kg DECIMAL(7, 2), -- Peso del animal al momento de la venta (opcional pero útil)
    precio_individual DECIMAL(12, 2), -- Precio asignado a este animal específico en la venta (opcional)
    precio_por_kg DECIMAL(10, 2), -- Precio por kg aplicado a este animal (opcional)
    observaciones TEXT, -- Observaciones específicas para este animal en esta venta.
    CONSTRAINT uq_venta_animal UNIQUE (venta_id, animal_id) -- Asegura que un animal no se añada dos veces a la misma venta.
);
-- Indices en animal_id, cliente_id, fecha_venta

-- Tabla: reportes (Metadatos de reportes generados, si es necesario)
-- Esta tabla es opcional y depende de cómo se manejen los reportes.
-- Si los reportes se generan bajo demanda, quizás no sea necesaria.
-- Si se guardan resultados, podría ser útil.
CREATE TABLE reportes_generados (
    reporte_id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    usuario_id BIGINT NOT NULL REFERENCES usuarios(usuario_id),
    tipo_reporte TEXT NOT NULL, -- Ej: 'Inventario Actual', 'Ventas por Periodo', 'Sanidad Lote X'
    parametros_usados JSONB, -- Guardar los filtros/parámetros usados
    fecha_generado TIMESTAMPTZ DEFAULT now(),
    formato VARCHAR(10) DEFAULT 'PDF', -- PDF, CSV, XLSX
    ruta_archivo TEXT -- Opcional, si se guarda el archivo generado en servidor
);
-- Indices en usuario_id, fecha_generado, tipo_reporte

-- ========================================
-- Consideraciones Adicionales
-- ========================================
-- 1. TRIGGERS: Implementar triggers para actualizar automáticamente campos como `fecha_actualizacion`.
-- 2. INDICES: Añadir índices adicionales en columnas usadas frecuentemente en WHERE, JOIN, ORDER BY (fechas, IDs externos, etc.). Ya he sugerido algunos.
-- 3. FUNCIONES y VISTAS: Crear vistas para consultas comunes (ej: `vista_inventario_activo_detallado` que una `inventario_animal`, `animal`, `especies`, `razas`, `ubicaciones`, `lotes`). Crear funciones para cálculos complejos (ej: calcular edad, calcular días en finca).
-- 4. SEGURIDAD: ¡Recordatorio crucial! Nunca almacenar contraseñas en texto plano. Usar algoritmos de hashing robustos (como bcrypt, Argon2) en la capa de aplicación antes de guardar en `password_hash`.
-- 5. AUDITORÍA: Considerar añadir tablas de auditoría o usar extensiones de BBDD (como pgaudit en PostgreSQL) para rastrear cambios importantes.
-- 6. REPRODUCCIÓN: Si la gestión reproductiva es importante (servicios, partos, genealogía), se necesitarían tablas adicionales (`servicios`, `diagnosticos_prenez`, `partos`). Los campos `madre_id` y `padre_id` en `animal` son un primer paso.
-- 7. INVENTARIO DE INSUMOS: Podría añadirse un módulo para gestionar el stock de alimentos, vacunas y medicamentos.
-- Tabla de usuarios
CREATE TABLE usuarios (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    rol ENUM('administrador', 'operador', 'veterinario') NOT NULL
);

-- Tabla de ganado
CREATE TABLE ganado (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    tipo VARCHAR(100) NOT NULL,
    raza VARCHAR(100) NOT NULL,
    edad INT NOT NULL,
    peso DECIMAL(5,2) NOT NULL,
    estado_salud VARCHAR(255) NOT NULL,
    fecha_ingreso DATE NOT NULL
);

-- Tabla de controles (pesajes, chequeos, vacunaciones)
CREATE TABLE controles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    ganado_id BIGINT NOT NULL,
    fecha DATE NOT NULL,
    peso DECIMAL(5,2),
    observaciones TEXT,
    veterinario_id BIGINT,
    FOREIGN KEY (ganado_id) REFERENCES ganado(id) ON DELETE CASCADE,
    FOREIGN KEY (veterinario_id) REFERENCES usuarios(id) ON DELETE SET NULL
);

-- Tabla de ventas
CREATE TABLE ventas (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    ganado_id BIGINT NOT NULL,
    fecha_venta DATE NOT NULL,
    precio_venta DECIMAL(10,2) NOT NULL,
    comprador VARCHAR(255) NOT NULL,
    estado_trazabilidad TEXT,
    FOREIGN KEY (ganado_id) REFERENCES ganado(id) ON DELETE CASCADE
);

-- Tabla de reportes
CREATE TABLE reportes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    usuario_id BIGINT NOT NULL,
    tipo VARCHAR(100) NOT NULL,
    fecha_generado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    contenido TEXT NOT NULL,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Tabla de predicciones
CREATE TABLE predicciones (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    ganado_id BIGINT NOT NULL,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    tipo_prediccion VARCHAR(100) NOT NULL,
    resultado TEXT NOT NULL,
    FOREIGN KEY (ganado_id) REFERENCES ganado(id) ON DELETE CASCADE
);

from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import pymysql  # Necesario para `mysql+aiomysql`
import asyncio
from sqlalchemy.future import select


# URL de conexión (usando aiomysql para compatibilidad con async)
DATABASE_URL = "mysql+aiomysql://root:@localhost:3306/estancianazario"

# Crear motor asíncrono
engine = create_async_engine(DATABASE_URL, echo=True, future=True)

# Crear la sesión asíncrona
SessionLocal = sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False
)

# Base para los modelos
Base = declarative_base()

# Dependencia de sesión para FastAPI u otros usos
async def get_db():
    async with SessionLocal() as session:
        yield session

# Función para inicializar la base de datos y agregar usuarios por defecto
# 🔥 Inicializar datos: roles y usuarios por defecto
async def initialize_data():
    from app.models.usuario import Usuario
    from app.models.rol_usuario import RolUsuario
    from app.routes.usuario import hash_password
    from app.models.especie import Especie
    from app.models.raza import Raza

    async with SessionLocal() as db:
        # Crear tablas
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)

        # Crear roles si no existen
        result = await db.execute(select(RolUsuario))
        existing_roles = result.scalars().all()

        if not existing_roles:
            print("📌 Insertando roles por defecto...")
            roles = [
                RolUsuario(nombre_rol="Administrador", descripcion="Acceso total al sistema"),
                RolUsuario(nombre_rol="Operador", descripcion="Gestión de inventario y registros diarios"),
                RolUsuario(nombre_rol="Veterinario", descripcion="Gestión de salud y sanidad animal"),
            ]
            db.add_all(roles)
            await db.commit()
            print("✅ Roles creados.")

        # Obtener roles para mapear IDs
        roles_map = {}
        result = await db.execute(select(RolUsuario))
        for rol in result.scalars():
            roles_map[rol.nombre_rol.lower()] = rol.rol_id

        # Verificar usuarios existentes
        result = await db.execute(select(Usuario))
        if result.scalars().first():
            print("ℹ️ Usuarios ya existen, no se insertan duplicados.")
        else:
            print("📌 Insertando usuarios por defecto...")
            users = [
                {"nombre": "Administrador", "email": "admin@gmail.com", "rol": "administrador", "password": "admin123"},
                {"nombre": "Operador", "email": "operador@gmail.com", "rol": "operador", "password": "123456"},
                {"nombre": "Veterinario", "email": "veterinario@gmail.com", "rol": "veterinario", "password": "veterinario123"},
            ]

            for user_data in users:
                rol_key = user_data["rol"].lower()
                rol_id = roles_map.get(rol_key)

                if not rol_id:
                    print(f"⚠️ Rol no encontrado: {user_data['rol']}")
                    continue

                usuario = Usuario(
                    nombre=user_data["nombre"],
                    email=user_data["email"],
                    rol_id=rol_id,
                    password_hash=hash_password(user_data["password"]),
                    activo=True
                )
                db.add(usuario)

            await db.commit()
            print("✅ Usuarios por defecto creados.")

        # Insertar especies y razas si no existen
        result = await db.execute(select(Especie))
        existing_species = result.scalars().all()

        if not existing_species:
            print("📌 Insertando especies y razas...")

            especies_data = {
                "Bos taurus": {
                    "nombre_cientifico": "Bos taurus",
                    "razas": [
                        "Holstein-Friesian", "Jersey", "Guernsey", "Ayrshire",
                        "Brown Swiss", "Milking Shorthorn", "Angus", "Hereford",
                        "Limousin", "Charolais", "Simmental", "Shorthorn", "Blonde d’Aquitaine"
                    ]
                },
                "Bos indicus": {
                    "nombre_cientifico": "Bos indicus",
                    "razas": [
                        "Brahman", "Nelore", "Gyr", "Guzerá", "Sahiwal", "Red Sindhi"
                    ]
                },
                "Híbrido Bos taurus × Bos indicus": {
                    "nombre_cientifico": None,
                    "razas": [
                        "Beefmaster", "Brangus", "Santa Gertrudis", "Girolando", "Canchim"
                    ]
                }
            }

            for nombre_comun, data in especies_data.items():
                especie = Especie(
                    nombre_comun=nombre_comun,
                    nombre_cientifico=data["nombre_cientifico"]
                )
                db.add(especie)
                await db.flush()  # Para obtener especie_id

                for nombre_raza in data["razas"]:
                    raza = Raza(
                        especie_id=especie.especie_id,
                        nombre_raza=nombre_raza
                    )
                    db.add(raza)

            await db.commit()
            print("✅ Especies y razas insertadas.")
        else:
            print("ℹ️ Especies ya existen, no se insertan duplicados")


# Función para probar la conexión asíncrona
async def test_connection():
    try:
        async with engine.connect() as conn:
            await conn.execute("SELECT 1")  # Prueba de consulta
        print("✅ Conexión exitosa a MySQL")
    except Exception as e:
        print(f"❌ Error en la conexión: {e}")

# Ejecutar prueba de conexión si el script se ejecuta directamente
if __name__ == "__main__":
    asyncio.run(test_connection())

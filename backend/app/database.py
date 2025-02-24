from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import pymysql  # Necesario para `mysql+aiomysql`
import asyncio

# URL de conexión (usando aiomysql para compatibilidad con async)
DATABASE_URL = "mysql+aiomysql://root:@localhost:3306/estancia_nazario"

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

# Función para probar la conexión asíncrona
async def test_connection():
    try:
        async with engine.connect() as conn:
            await conn.execute("SELECT 1")  # Prueba de consulta
        print("✅ Conexión exitosa a MySQL")
    except Exception as e:
        print(f"❌ Error en la conexión: {e}")

# Ejecutar prueba si el script se ejecuta directamente
if __name__ == "__main__":
    asyncio.run(test_connection())

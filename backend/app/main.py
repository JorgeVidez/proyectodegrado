from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from app.routes import usuario, control, ganado, ventas, proveedor, reporte
from app.database import engine, Base, initialize_data
from fastapi.responses import JSONResponse
from fastapi.exception_handlers import http_exception_handler
from fastapi.exceptions import HTTPException
from . import prediccion #Importamos el nuevo modulo.



app = FastAPI(title="Sistema de Ganado API")

# Habilitar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Permitir peticiones desde el frontend
    allow_credentials=True,
    allow_methods=["*"],  # Permitir todos los métodos (GET, POST, PUT, DELETE, etc.)
    allow_headers=["*"],  # Permitir todos los encabezados
)

# Inicializar base de datos y datos por defecto
async def init_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)  # Crea las tablas si no existen
    await initialize_data()  # Agrega los usuarios por defecto si es necesario

@app.on_event("startup")
async def startup_event():
    await init_db()  # Ejecutar todo en un solo evento de inicio

@app.get("/")
def read_root():
    return {"message": "Bienvenido a la API de administración de ganado"}

# Incluir routers
app.include_router(ganado.router, prefix="/api", tags=["Ganado"])
app.include_router(usuario.router, prefix="/api", tags=["Usuarios"])
app.include_router(control.router, prefix="/api", tags=["Controles"])
app.include_router(ventas.router, prefix="/api", tags=["Ventas"])
app.include_router(reporte.router, prefix="/api", tags=["Reportes"])
app.include_router(proveedor.router, prefix="/api", tags=["Proveedores"])

app.include_router(prediccion.router, prefix="/api", tags=["Predicción"]) #Incluimos el router de prediccion.

# Ejecutar Uvicorn solo si el script se ejecuta directamente
if __name__ == "__main__":
    import asyncio
    asyncio.run(init_db())  # Asegura que la DB esté lista antes de iniciar Uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

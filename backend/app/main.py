from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from app.routes import ganado, usuario, control, ventas, reportes
from app.database import engine, Base

app = FastAPI(title="Sistema de Ganado API")

# Habilitar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Permite peticiones desde el frontend
    allow_credentials=True,
    allow_methods=["*"],  # Permitir todos los métodos (GET, POST, PUT, DELETE, etc.)
    allow_headers=["*"],  # Permitir todos los encabezados
)

# Crear tablas (si no existen)
async def init_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

@app.on_event("startup")
async def startup_event():
    await init_db()

@app.get("/")
def read_root():
    return {"message": "Bienvenido a la API de administración de ganado"}

# Incluir routers
app.include_router(ganado.router, prefix="/api", tags=["Ganado"])
app.include_router(usuario.router, prefix="/api", tags=["Usuarios"])
app.include_router(control.router, prefix="/api", tags=["Controles"])
app.include_router(ventas.router, prefix="/api", tags=["Ventas"])
app.include_router(reportes.router, prefix="/api", tags=["Reportes"])

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)

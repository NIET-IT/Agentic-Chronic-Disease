"""Main FastAPI application for Chronic Disease Early Prediction & Decision Support."""

from pathlib import Path
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

from backend.api.routes import router as api_router
from backend.services.diabetes_service import diabetes_service
from backend.services.heart_disease_service import heart_disease_service

FRONTEND_DIR = Path("frontend")


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Pre-warm models on startup
    _ = diabetes_service
    _ = heart_disease_service
    print("[System] Chronic Disease Models and Decision Agents loaded and initialized successfully.")
    yield
    print("[System] Shutting down application.")


app = FastAPI(
    title="Agentic AI Chronic Disease Early Prediction & Decision-Support System",
    description="Early prediction, local explainability, and clinical decision support for Diabetes and Coronary Artery Disease.",
    version="1.0.0",
    lifespan=lifespan,
)

# Enable CORS for local development and frontend client
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API endpoints
app.include_router(api_router)


# Mount static frontend directory if it exists
if FRONTEND_DIR.exists():
    app.mount("/static", StaticFiles(directory=str(FRONTEND_DIR)), name="static")

    @app.get("/", include_in_schema=False)
    async def serve_index():
        index_file = FRONTEND_DIR / "index.html"
        if index_file.exists():
            return FileResponse(str(index_file))
        return {
            "message": "Agentic AI Chronic Disease API is running. Access interactive docs at /docs."
        }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="127.0.0.1", port=8000, reload=True)

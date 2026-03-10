"""FastAPI application entry point."""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import calculate, calculus, scientific

app = FastAPI(title="Calculator API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(calculate.router, prefix="/api")
app.include_router(scientific.router, prefix="/api")
app.include_router(calculus.router, prefix="/api")


@app.get("/health")
def health() -> dict:
    """Return a simple liveness indicator.

    Returns:
        A dictionary with a single 'status' key set to 'ok'.
    """
    return {"status": "ok"}

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.database import connect_to_mongodb, close_mongodb_connection
from app.routers import portfolio
from app.config import get_settings

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events"""
    # Startup
    await connect_to_mongodb()
    yield
    # Shutdown
    await close_mongodb_connection()


app = FastAPI(
    title=settings.app_name,
    description="Dynamic Portfolio Generator - Generate beautiful portfolios from your GitHub, LeetCode, and HackerRank data",
    version="1.0.0",
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(portfolio.router)


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "name": settings.app_name,
        "version": "1.0.0",
        "description": "Dynamic Portfolio Generator",
        "endpoints": {
            "generate": "POST /api/portfolio/generate",
            "get_portfolio": "GET /api/portfolio/{username}",
            "update": "PUT /api/portfolio/{username}",
            "delete": "DELETE /api/portfolio/{username}",
            "refresh": "POST /api/portfolio/{username}/refresh"
        }
    }


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}


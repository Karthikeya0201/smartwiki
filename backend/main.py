from fastapi import FastAPI
from contextlib import asynccontextmanager
from app.database.mongodb import connect_to_mongo, close_mongo_connection
from app.routers import auth, users, features, documents
from fastapi.middleware.cors import CORSMiddleware

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup logic
    connect_to_mongo()
    yield
    # Shutdown logic
    close_mongo_connection()

app = FastAPI(
    title="Smart Personalized Product Wiki API",
    description="A backend for personalized product documentation with feature-based access and versioning.",
    version="1.0.0",
    lifespan=lifespan
)

origins = [
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(features.router)
app.include_router(documents.router)

@app.get("/")
async def root():
    return {"message": "Welcome to Smart Personalized Product Wiki API", "docs": "/docs"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)

from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings

class Database:
    client: AsyncIOMotorClient = None
    db_name: str = settings.DATABASE_NAME

db = Database()

def get_database():
    return db.client[db.db_name]

def connect_to_mongo():
    db.client = AsyncIOMotorClient(settings.MONGO_URL)

def close_mongo_connection():
    db.client.close()

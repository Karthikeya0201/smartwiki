import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings
from app.core.security import get_password_hash
from app.schemas.user import UserRole

async def init_db():
    client = AsyncIOMotorClient(settings.MONGO_URL)
    db = client[settings.DATABASE_NAME]
    
    # Check if admin exists
    admin_exists = await db.users.find_one({"email": "admin@gmail.com"})
    if not admin_exists:
        admin_user = {
            "name": "Super Admin",
            "email": "admin@gmail.com",
            "password": get_password_hash("admin123"),
            "role": UserRole.ADMIN,
            "assigned_features": []
        }
        await db.users.insert_one(admin_user)
        print("Admin user created: admin@gmail.com / admin123")
    else:
        print("Admin user already exists")

    client.close()

if __name__ == "__main__":
    asyncio.run(init_db())

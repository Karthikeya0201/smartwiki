from typing import List, Optional
from motor.motor_asyncio import AsyncIOMotorDatabase
from bson import ObjectId
from app.schemas.user import UserCreate, UserUpdate
from app.core.security import get_password_hash

class UserService:
    def __init__(self, db: AsyncIOMotorDatabase):
        self.collection = db.users

    async def get_by_email(self, email: str):
        user = await self.collection.find_one({"email": email})
        if user:
            user["id"] = str(user["_id"])
        return user

    async def get_by_id(self, user_id: str):
        if not ObjectId.is_valid(user_id):
            return None
        user = await self.collection.find_one({"_id": ObjectId(user_id)})
        if user:
            user["id"] = str(user["_id"])
        return user

    async def create(self, user_in: UserCreate):
        user_dict = user_in.dict()
        user_dict["password"] = get_password_hash(user_dict["password"])
        result = await self.collection.insert_one(user_dict)
        return await self.get_by_id(str(result.inserted_id))

    async def get_all(self, skip: int = 0, limit: int = 100):
        users = []
        cursor = self.collection.find().skip(skip).limit(limit)
        async for user in cursor:
            user["id"] = str(user["_id"])
            users.append(user)
        return users

    async def update_assigned_features(self, user_id: str, feature_ids: List[str]):
        if not ObjectId.is_valid(user_id):
            return None
        await self.collection.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": {"assigned_features": feature_ids}}
        )
        return await self.get_by_id(user_id)

    async def update_role(self, user_id: str, role: str):
        if not ObjectId.is_valid(user_id):
            return None
        await self.collection.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": {"role": role}}
        )
        return await self.get_by_id(user_id)

    async def update_status(self, user_id: str, is_active: bool):
        if not ObjectId.is_valid(user_id):
            return None
        await self.collection.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": {"is_active": is_active}}
        )
        return await self.get_by_id(user_id)

    async def delete(self, user_id: str):
        if not ObjectId.is_valid(user_id):
            return False
        result = await self.collection.delete_one({"_id": ObjectId(user_id)})
        return result.deleted_count > 0

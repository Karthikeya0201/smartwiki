from typing import List, Optional
from motor.motor_asyncio import AsyncIOMotorDatabase
from bson import ObjectId
from app.schemas.feature import FeatureCreate, FeatureUpdate

class FeatureService:
    def __init__(self, db: AsyncIOMotorDatabase):
        self.collection = db.features

    async def get_by_id(self, feature_id: str):
        if not ObjectId.is_valid(feature_id):
            return None
        feature = await self.collection.find_one({"_id": ObjectId(feature_id)})
        if feature:
            feature["id"] = str(feature["_id"])
        return feature

    async def create(self, feature_in: FeatureCreate):
        feature_dict = feature_in.dict()
        result = await self.collection.insert_one(feature_dict)
        return await self.get_by_id(str(result.inserted_id))

    async def get_all(self):
        features = []
        cursor = self.collection.find()
        async for feature in cursor:
            feature["id"] = str(feature["_id"])
            features.append(feature)
        return features

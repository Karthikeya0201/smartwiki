from datetime import datetime
from typing import List, Optional
from motor.motor_asyncio import AsyncIOMotorDatabase
from bson import ObjectId
from app.schemas.document import DocumentCreate, DocumentUpdate

class DocumentService:
    def __init__(self, db: AsyncIOMotorDatabase):
        self.db = db
        self.collection = db.documents
        self.versions_collection = db.document_versions

    async def get_by_id(self, doc_id: str, feature_access: Optional[List[str]] = None):
        if not ObjectId.is_valid(doc_id):
            return None
        
        query = {"_id": ObjectId(doc_id)}
        if feature_access is not None:
             # User is not admin: Only can see if it's public
             query["is_public"] = True

        doc = await self.collection.find_one(query)
        if doc:
            doc["id"] = str(doc["_id"])
        return doc

    async def create(self, doc_in: DocumentCreate):
        doc_dict = doc_in.dict()
        doc_dict["created_at"] = datetime.utcnow()
        doc_dict["updated_at"] = datetime.utcnow()
        doc_dict["version"] = 1
        result = await self.collection.insert_one(doc_dict)
        return await self.get_by_id(str(result.inserted_id))

    async def update(self, doc_id: str, doc_in: DocumentUpdate):
        if not ObjectId.is_valid(doc_id):
            return None
        
        current_doc = await self.collection.find_one({"_id": ObjectId(doc_id)})
        if not current_doc:
            return None

        # Archive current version
        version_entry = {
            "document_id": str(current_doc["_id"]),
            "title": current_doc["title"],
            "content": current_doc["content"],
            "version": current_doc["version"],
            "updated_at": current_doc["updated_at"]
        }
        await self.versions_collection.insert_one(version_entry)

        # Update main document
        update_data = doc_in.dict(exclude_unset=True)
        update_data["updated_at"] = datetime.utcnow()
        update_data["version"] = current_doc["version"] + 1

        await self.collection.update_one(
            {"_id": ObjectId(doc_id)},
            {"$set": update_data}
        )
        return await self.get_by_id(doc_id)

    async def delete(self, doc_id: str):
        if not ObjectId.is_valid(doc_id):
            return False
        result = await self.collection.delete_one({"_id": ObjectId(doc_id)})
        # Also delete versions if needed, but usually history is kept.
        return result.deleted_count > 0

    async def get_all_paged(self, feature_access: Optional[List[str]], skip: int = 0, limit: int = 20):
        docs = []
        query = {}
        if feature_access is not None:
            # User is not admin: Only see public docs
            query["is_public"] = True
        
        cursor = self.collection.find(query).skip(skip).limit(limit)
        async for doc in cursor:
            doc["id"] = str(doc["_id"])
            docs.append(doc)
        return docs

    async def get_versions_history(self, doc_id: str):
         versions = []
         cursor = self.versions_collection.find({"document_id": doc_id}).sort("version", -1)
         async for v in cursor:
             v["id"] = str(v["_id"])
             versions.append(v)
         return versions

    async def search_documents(self, query_str: str, feature_access: Optional[List[str]]):
        search_query = {
            "$or": [
                {"title": {"$regex": query_str, "$options": "i"}},
                {"content": {"$regex": query_str, "$options": "i"}}
            ]
        }
        
        query = search_query
        if feature_access is not None:
            query = {
                "$and": [
                    {"is_public": True},
                    search_query
                ]
            }
        docs = []
        cursor = self.collection.find(query)
        async for doc in cursor:
            doc["id"] = str(doc["_id"])
            docs.append(doc)
        return docs

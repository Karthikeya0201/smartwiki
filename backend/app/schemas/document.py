from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field

class DocumentBase(BaseModel):
    title: str
    content: str
    feature_id: str
    category: str
    version: int = 1
    is_public: bool = True

class DocumentCreate(DocumentBase):
    pass

class DocumentUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    feature_id: Optional[str] = None
    category: Optional[str] = None
    version: Optional[int] = None
    is_public: Optional[bool] = None

class DocumentInDB(DocumentBase):
    id: str = Field(alias="_id")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class DocumentResponse(DocumentBase):
    id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
        populate_by_name = True

class DocumentVersionInDB(BaseModel):
    document_id: str
    version_id: str = Field(alias="_id")
    title: str
    content: str
    version: int
    updated_at: datetime

    class Config:
        from_attributes = True
        populate_by_name = True

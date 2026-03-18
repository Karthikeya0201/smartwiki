from typing import Optional
from pydantic import BaseModel, Field

class FeatureBase(BaseModel):
    name: str
    description: str

class FeatureCreate(FeatureBase):
    pass

class FeatureUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None

class FeatureInDB(FeatureBase):
    id: str = Field(alias="_id")

class FeatureResponse(FeatureBase):
    id: str

    class Config:
        from_attributes = True
        populate_by_name = True

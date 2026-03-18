from typing import List, Optional
from pydantic import BaseModel, EmailStr, Field
from enum import Enum

class UserRole(str, Enum):
    ADMIN = "admin"
    USER = "user"

class UserBase(BaseModel):
    name: str
    email: EmailStr
    role: UserRole = UserRole.USER
    is_active: bool = False
    assigned_features: List[str] = []

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    role: Optional[UserRole] = None
    is_active: Optional[bool] = None
    assigned_features: Optional[List[str]] = None

class UserInDB(UserBase):
    id: str = Field(alias="_id")

class UserResponse(UserBase):
    id: str

    class Config:
        from_attributes = True
        populate_by_name = True

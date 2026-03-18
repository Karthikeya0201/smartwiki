from typing import List
from fastapi import APIRouter, Depends, HTTPException
from app.database.mongodb import get_database
from app.services.user_service import UserService
from app.schemas.user import UserResponse, UserUpdate
from app.core.deps import get_current_active_admin, get_current_user

router = APIRouter(tags=["Users"])

@router.get("/me", response_model=UserResponse)
async def get_me(current_user: UserResponse = Depends(get_current_user)):
    return current_user

@router.get("/users", response_model=List[UserResponse], dependencies=[Depends(get_current_active_admin)])
async def get_users(
    skip: int = 0,
    limit: int = 100,
    db = Depends(get_database)
):
    user_service = UserService(db)
    return await user_service.get_all(skip, limit)

@router.put("/assign-features/{user_id}", response_model=UserResponse, dependencies=[Depends(get_current_active_admin)])
async def assign_features(
    user_id: str,
    feature_ids: List[str],
    db = Depends(get_database)
):
    user_service = UserService(db)
    updated_user = await user_service.update_assigned_features(user_id, feature_ids)
    if not updated_user:
        raise HTTPException(status_code=404, detail="User not found")
    return updated_user

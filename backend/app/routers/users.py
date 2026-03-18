from typing import List
from fastapi import APIRouter, Depends, HTTPException
from app.database.mongodb import get_database
from app.services.user_service import UserService
from app.schemas.user import UserResponse, UserUpdate, UserRole
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

@router.put("/update-role/{user_id}", response_model=UserResponse, dependencies=[Depends(get_current_active_admin)])
async def update_role(
    user_id: str,
    role: UserRole,
    db = Depends(get_database)
):
    user_service = UserService(db)
    updated_user = await user_service.update_role(user_id, role.value)
    if not updated_user:
        raise HTTPException(status_code=404, detail="User not found")
    return updated_user

@router.put("/update-status/{user_id}", response_model=UserResponse, dependencies=[Depends(get_current_active_admin)])
async def update_status(
    user_id: str,
    is_active: bool,
    db = Depends(get_database)
):
    user_service = UserService(db)
    updated_user = await user_service.update_status(user_id, is_active)
    if not updated_user:
        raise HTTPException(status_code=404, detail="User not found")
    return updated_user

@router.delete("/users/{user_id}", dependencies=[Depends(get_current_active_admin)])
async def delete_user(
    user_id: str,
    db = Depends(get_database)
):
    user_service = UserService(db)
    success = await user_service.delete(user_id)
    if not success:
        raise HTTPException(status_code=404, detail="User not found")
    return {"status": "success"}

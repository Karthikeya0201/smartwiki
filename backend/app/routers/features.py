from typing import List
from fastapi import APIRouter, Depends, HTTPException
from app.database.mongodb import get_database
from app.services.feature_service import FeatureService
from app.schemas.feature import FeatureCreate, FeatureResponse
from app.core.deps import get_current_active_admin, get_current_user
from app.schemas.user import UserResponse

router = APIRouter(tags=["Features"])

@router.post("/features", response_model=FeatureResponse, dependencies=[Depends(get_current_active_admin)])
async def create_feature(
    feature_in: FeatureCreate,
    db = Depends(get_database)
):
    feature_service = FeatureService(db)
    return await feature_service.create(feature_in)

@router.get("/features", response_model=List[FeatureResponse])
async def list_features(
    db = Depends(get_database),
    current_user: UserResponse = Depends(get_current_user)
):
    feature_service = FeatureService(db)
    return await feature_service.get_all()

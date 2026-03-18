from typing import Generator, Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt
from pydantic import ValidationError
from app.core.config import settings
from app.database.mongodb import get_database
from app.services.user_service import UserService
from app.schemas.token import TokenPayload
from app.schemas.user import UserResponse, UserRole

reusable_oauth2 = OAuth2PasswordBearer(tokenUrl="/login")

async def get_current_user(
    db = Depends(get_database),
    token: str = Depends(reusable_oauth2)
) -> UserResponse:
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        token_data = TokenPayload(**payload)
    except (jwt.JWTError, ValidationError) as e:
        print(f"Auth Error: {str(e)}") # This will show in your terminal
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Could not validate credentials",
        )
    
    user_service = UserService(db)
    user = await user_service.get_by_id(token_data.sub)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    user["id"] = str(user["_id"])
    return UserResponse(**user)

async def get_current_active_admin(
    current_user: UserResponse = Depends(get_current_user)
) -> UserResponse:
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="The user does not have enough privileges"
        )
    return current_user

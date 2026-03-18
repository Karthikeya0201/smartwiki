from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from app.database.mongodb import get_database
from app.services.document_service import DocumentService
from app.schemas.document import DocumentCreate, DocumentUpdate, DocumentResponse, DocumentVersionInDB
from app.core.deps import get_current_user, get_current_active_admin
from app.schemas.user import UserResponse, UserRole

router = APIRouter(tags=["Documents"])

@router.post("/documents", response_model=DocumentResponse, dependencies=[Depends(get_current_active_admin)])
async def create_document(
    doc_in: DocumentCreate,
    db = Depends(get_database)
):
    doc_service = DocumentService(db)
    return await doc_service.create(doc_in)

@router.get("/documents", response_model=List[DocumentResponse])
async def list_documents(
    skip: int = 0,
    limit: int = 20,
    db = Depends(get_database),
    current_user: UserResponse = Depends(get_current_user)
):
    doc_service = DocumentService(db)
    # Filter based on user's feature access (admins see all)
    feature_access = None if current_user.role == UserRole.ADMIN else current_user.assigned_features
    return await doc_service.get_all_paged(
              feature_access=feature_access, 
              skip=skip, 
              limit=limit
    )

@router.get("/documents/{doc_id}", response_model=DocumentResponse)
async def get_document(
    doc_id: str,
    db = Depends(get_database),
    current_user: UserResponse = Depends(get_current_user)
):
    doc_service = DocumentService(db)
    # Admins see all documents
    feature_access = None if current_user.role == UserRole.ADMIN else current_user.assigned_features
    doc = await doc_service.get_by_id(doc_id, feature_access=feature_access)
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found or inaccessible")
    return doc

@router.put("/documents/{doc_id}", response_model=DocumentResponse, dependencies=[Depends(get_current_active_admin)])
async def update_document(
    doc_id: str,
    doc_in: DocumentUpdate,
    db = Depends(get_database)
):
    doc_service = DocumentService(db)
    updated_doc = await doc_service.update(doc_id, doc_in)
    if not updated_doc:
         raise HTTPException(status_code=404, detail="Document not found")
    return updated_doc

@router.delete("/documents/{doc_id}", dependencies=[Depends(get_current_active_admin)])
async def delete_document(
    doc_id: str,
    db = Depends(get_database)
):
    doc_service = DocumentService(db)
    success = await doc_service.delete(doc_id)
    if not success:
         raise HTTPException(status_code=404, detail="Document not found")
    return {"status": "success"}

@router.get("/documents/{doc_id}/versions", response_model=List[dict])
async def get_document_versions(
    doc_id: str,
    db = Depends(get_database),
    current_user: UserResponse = Depends(get_current_user)
):
    doc_service = DocumentService(db)
    # First check access to current doc
    feature_access = None if current_user.role == UserRole.ADMIN else current_user.assigned_features
    doc = await doc_service.get_by_id(doc_id, feature_access=feature_access)
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found or inaccessible")
    
    return await doc_service.get_versions_history(doc_id)

@router.get("/search", response_model=List[DocumentResponse])
async def search_documents(
    query: str = Query(..., min_length=1),
    db = Depends(get_database),
    current_user: UserResponse = Depends(get_current_user)
):
    doc_service = DocumentService(db)
    feature_access = None if current_user.role == UserRole.ADMIN else current_user.assigned_features
    return await doc_service.search_documents(
        query_str=query,
        feature_access=feature_access
    )

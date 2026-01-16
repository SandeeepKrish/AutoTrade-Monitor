from fastapi import APIRouter, Depends

from ..api.auth import get_current_user


router = APIRouter()


@router.get("/")
async def list_orders(current_user=Depends(get_current_user)):
  return []


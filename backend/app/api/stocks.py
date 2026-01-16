from fastapi import APIRouter, Depends, HTTPException

from ..models.stock import Stock
from ..api.auth import get_current_user
from ..services.market_simulator import market_simulator


router = APIRouter()


@router.get("/", response_model=list[Stock])
async def list_stocks():
  return market_simulator.get_all_stocks()


@router.get("/{symbol}", response_model=Stock)
async def get_stock(symbol: str):
  stock = market_simulator.get_stock(symbol)
  if not stock:
      raise HTTPException(status_code=404, detail="Stock not found")
  return stock

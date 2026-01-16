from pydantic import BaseModel
from typing import Optional


class CartItem(BaseModel):
    symbol: str
    name: str
    price: float
    quantity: int = 1
    auto_added: Optional[bool] = False


class CartResponse(BaseModel):
    items: list[CartItem]

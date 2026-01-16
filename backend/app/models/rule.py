from pydantic import BaseModel


class RuleCreate(BaseModel):
    symbol: str
    min_price: float
    max_price: float
    quantity: int = 1


class RuleInDB(BaseModel):
    id: str
    user_id: str
    symbol: str
    min_price: float
    max_price: float
    quantity: int
    active: bool = True

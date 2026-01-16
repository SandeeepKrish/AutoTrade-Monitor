from pydantic import BaseModel


class Stock(BaseModel):
  symbol: str
  name: str
  price: float
  change: float


DEMO_STOCKS: list[Stock] = [
  Stock(symbol="RELIANCE", name="Reliance Industries", price=2800, change=0.8),
  Stock(symbol="TCS", name="TCS", price=3900, change=-0.4),
  Stock(symbol="HDFCBANK", name="HDFC Bank", price=1550, change=1.1),
]


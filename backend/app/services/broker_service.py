async def place_order_for_user(user_id: str, symbol: str, quantity: int):
  return {"status": "placed", "symbol": symbol, "quantity": quantity}


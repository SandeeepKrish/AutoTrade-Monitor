from fastapi import APIRouter, Depends
from ..api.auth import get_current_user
from ..db.session import get_db
from ..models.cart import CartItem, CartResponse

router = APIRouter()

@router.get("/", response_model=CartResponse)
async def get_cart(current_user=Depends(get_current_user), db=Depends(get_db)):
    cursor = db["cart"].find({"user_id": current_user.id})
    items = []
    async for doc in cursor:
        items.append(
            CartItem(
                symbol=doc.get("symbol"),
                name=doc.get("name"),
                price=doc.get("price"),
                quantity=doc.get("quantity", 1),
                auto_added=doc.get("auto_added", False)
            )
        )
    return CartResponse(items=items)

@router.post("/add", status_code=201)
async def add_to_cart(item: CartItem, current_user=Depends(get_current_user), db=Depends(get_db)):
    # Manual additions from Dashboard: always set auto_added=False to prevent bot from deleting it
    await db["cart"].update_one(
        {"user_id": current_user.id, "symbol": item.symbol},
        {
            "$set": {
                "name": item.name,
                "price": item.price,
                "auto_added": False
            },
            "$inc": {
                "quantity": item.quantity or 1
            }
        },
        upsert=True,
    )
    return {"status": "ok"}

@router.post("/buy")
async def buy_cart(current_user=Depends(get_current_user), db=Depends(get_db)):
    await db["cart"].delete_many({"user_id": current_user.id})
    return {"status": "bought"}

@router.delete("/remove/{symbol}")
async def remove_from_cart(symbol: str, current_user=Depends(get_current_user), db=Depends(get_db)):
    # 1. Remove item from cart
    await db["cart"].delete_one({"user_id": current_user.id, "symbol": symbol})
    
    # 2. Deactivate any active automation rule for this stock symbol to prevent re-adding loop
    # We do this because if the user manually removes it, they clearly don't want it right now.
    await db["rules"].update_many(
        {"user_id": current_user.id, "symbol": symbol, "active": True},
        {"$set": {"active": False}}
    )
    
    return {"status": "removed and bot deactivated for this stock"}

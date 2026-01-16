import logging
from bson import ObjectId
from ..core.scheduler import start_interval_task
from ..db.session import get_db
from ..models.cart import CartItem
from ..services.stock_fetcher import fetch_live_price
from ..websocket.price_socket import manager

logger = logging.getLogger(__name__)
INTERVAL_SECONDS = 5

async def _automation_tick():
    db = await get_db()
    # Continuous monitoring: we keep rules active unless deleted
    cursor = db["rules"].find({"active": True})
    
    async for rule in cursor:
        symbol = rule["symbol"]
        user_id = str(rule["user_id"])
        stock = await fetch_live_price(symbol)
        
        if stock is None:
            continue
            
        in_range = rule["min_price"] <= stock.price <= rule["max_price"]
        
        # Check if item is already in cart for this user
        cart_item = await db["cart"].find_one({"user_id": user_id, "symbol": symbol})
        
        if in_range:
            if not cart_item:
                # Stock entered range: Add with specified quantity and tag as auto_added
                quantity = rule.get("quantity", 1)
                await db["cart"].insert_one({
                    "user_id": user_id,
                    "symbol": symbol,
                    "name": stock.name,
                    "price": stock.price,
                    "quantity": quantity,
                    "auto_added": True
                })
                
                logger.info(f"Bot ADDED {symbol} (₹{stock.price}) for user {user_id}")
                
                # Notify frontend of ADDITION
                await manager.broadcast_price_update(
                    user_id=user_id,
                    message_type="cart_add",
                    item=CartItem(
                        symbol=symbol, 
                        name=stock.name, 
                        price=stock.price,
                        quantity=quantity,
                        auto_added=True
                    )
                )
            else:
                # Already in cart, just keep price updated if it's there
                await db["cart"].update_one(
                    {"_id": cart_item["_id"]},
                    {"$set": {"price": stock.price}}
                )
        else:
            # Stock is OUT of range
            if cart_item and cart_item.get("auto_added"):
                # It was added by the bot and is now out of range: AUTO-REMOVE
                await db["cart"].delete_one({"_id": cart_item["_id"]})
                
                logger.info(f"Bot REMOVED {symbol} (₹{stock.price} - out of range) for user {user_id}")
                
                # Notify frontend of REMOVAL
                await manager.broadcast_price_update(
                    user_id=user_id,
                    message_type="cart_remove",
                    item=CartItem(
                        symbol=symbol, 
                        name=stock.name, 
                        price=stock.price,
                        quantity=cart_item.get("quantity", 1),
                        auto_added=True
                    )
                )

async def start_automation_loop():
    await start_interval_task(INTERVAL_SECONDS, _automation_tick)

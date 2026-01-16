from fastapi import APIRouter, Depends, HTTPException, status
from bson import ObjectId
from ..api.auth import get_current_user
from ..db.session import get_db
from ..models.rule import RuleCreate, RuleInDB

router = APIRouter()

@router.post("/", response_model=RuleInDB, status_code=201)
async def create_rule(payload: RuleCreate, current_user=Depends(get_current_user), db=Depends(get_db)):
    doc = {
        "user_id": current_user.id,
        "symbol": payload.symbol.upper(),
        "min_price": payload.min_price,
        "max_price": payload.max_price,
        "quantity": payload.quantity,
        "active": True,
    }
    result = await db["rules"].insert_one(doc)
    return RuleInDB(
        id=str(result.inserted_id),
        user_id=current_user.id,
        symbol=payload.symbol.upper(),
        min_price=payload.min_price,
        max_price=payload.max_price,
        quantity=payload.quantity,
        active=True,
    )

@router.get("/", response_model=list[RuleInDB])
async def list_rules(current_user=Depends(get_current_user), db=Depends(get_db)):
    cursor = db["rules"].find({"user_id": current_user.id})
    rules: list[RuleInDB] = []
    async for doc in cursor:
        rules.append(
            RuleInDB(
                id=str(doc["_id"]),
                user_id=str(doc["user_id"]),
                symbol=doc["symbol"],
                min_price=doc["min_price"],
                max_price=doc["max_price"],
                quantity=doc.get("quantity", 1),
                active=doc.get("active", True),
            )
        )
    return rules

@router.delete("/{rule_id}")
async def delete_rule(rule_id: str, current_user=Depends(get_current_user), db=Depends(get_db)):
    result = await db["rules"].delete_one({
        "_id": ObjectId(rule_id),
        "user_id": current_user.id
    })
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Rule not found or unauthorized")
    return {"message": "Rule deleted successfully"}

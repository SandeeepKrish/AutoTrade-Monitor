from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel

from ..core.security import hash_password, verify_password, create_access_token, decode_token
from ..db.session import get_db
from ..models.user import UserCreate, UserPublic


router = APIRouter()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")


class TokenResponse(BaseModel):
  user: UserPublic
  token: str


async def get_current_user(token: str = Depends(oauth2_scheme), db=Depends(get_db)) -> UserPublic:
  subject = decode_token(token)
  if subject is None:
    raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
  user_doc = await db["users"].find_one({"email": subject})
  if not user_doc:
    raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
  return UserPublic(id=str(user_doc["_id"]), email=user_doc["email"])


@router.post("/register", status_code=201)
async def register(payload: UserCreate, db=Depends(get_db)):
  try:
      existing = await db["users"].find_one({"email": payload.email})
      if existing:
          raise HTTPException(status_code=400, detail="Email already registered")
      hashed = hash_password(payload.password)
      doc = {"email": payload.email, "hashed_password": hashed}
      result = await db["users"].insert_one(doc)
      return {"id": str(result.inserted_id), "email": payload.email}
  except HTTPException:
      raise
  except Exception as e:
      print(f"❌ REGISTER ERROR: {e}")
      # If it's a connection error, give a helpful message
      if "ServerSelectionTimeoutError" in str(e):
          raise HTTPException(status_code=500, detail="Database connection timeout. Please whitelist your IP in MongoDB Atlas.")
      raise HTTPException(status_code=500, detail=str(e))


@router.post("/login", response_model=TokenResponse)
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db=Depends(get_db)):
  user_doc = await db["users"].find_one({"email": form_data.username})
  if not user_doc:
    raise HTTPException(status_code=400, detail="Incorrect email or password")
  if not verify_password(form_data.password, user_doc["hashed_password"]):
    raise HTTPException(status_code=400, detail="Incorrect email or password")
  token = create_access_token(subject=user_doc["email"])
  user = UserPublic(id=str(user_doc["_id"]), email=user_doc["email"])
  return TokenResponse(user=user, token=token)


from motor.motor_asyncio import AsyncIOMotorClient
from ..core.config import settings

client: AsyncIOMotorClient | None = None
db = None


async def get_db():
    global client, db
    if client is None:
        # Connect to Real MongoDB
        client = AsyncIOMotorClient(settings.MONGO_URI)
        db = client.get_default_database()
        print(f"✅ Connected to MongoDB at {settings.MONGO_URI}")
    return db

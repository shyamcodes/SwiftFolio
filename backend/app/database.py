from motor.motor_asyncio import AsyncIOMotorClient
from app.config import get_settings

settings = get_settings()

client: AsyncIOMotorClient = None
database = None


async def connect_to_mongodb():
    """Connect to MongoDB"""
    global client, database
    client = AsyncIOMotorClient(settings.mongodb_url)
    database = client[settings.database_name]
    
    # Create indexes
    await database.users.create_index("username", unique=True)
    await database.portfolios.create_index("username", unique=True)
    
    print(f"Connected to MongoDB: {settings.database_name}")


async def close_mongodb_connection():
    """Close MongoDB connection"""
    global client
    if client:
        client.close()
        print("MongoDB connection closed")


def get_database():
    """Get database instance"""
    return database


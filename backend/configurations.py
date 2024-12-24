from motor.motor_asyncio import AsyncIOMotorClient

uri = "mongodb+srv://aditya:12345@cluster0.gtj1o.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

client = AsyncIOMotorClient(uri)

db = client.logs
collection = db["logs_data"]

from motor.motor_asyncio import AsyncIOMotorClient
from elasticsearch import Elasticsearch

uri = "mongodb+srv://aditya:12345@cluster0.gtj1o.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

client = AsyncIOMotorClient(uri)
es = Elasticsearch(
    "http://localhost:9200",
    http_auth=("elastic", "elastic_password")
)

ES_INDEX = "logs_index"  
db = client.logs
collection = db["logs_data"]
time_col = db["last_sync_time"]  

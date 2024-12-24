from fastapi import FastAPI, APIRouter, HTTPException
from database.schema import fetched_logs
from database.models import Log
from configurations import collection

app = FastAPI()
router = APIRouter()

async def create_indexes():
    await collection.create_index([("timestamp", 1)])  

app.add_event_handler("startup", create_indexes)

@router.get("/")
async def get_logs():
    logs = await collection.find().to_list(length=None)
    return fetched_logs(logs)

@router.post("/")
async def create_log(log: Log):
    try:
        res = await collection.insert_one(dict(log))
        return {"status_code": 200, "id": str(res.inserted_id)}

    except Exception as e:
        return HTTPException(status_code=500, detail=str(e))

app.include_router(router)
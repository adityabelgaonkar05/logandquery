from fastapi import FastAPI, APIRouter, HTTPException
from database.schema import fetched_logs
from database.models import Log
from configurations import collection

app = FastAPI()
router = APIRouter()

@router.get("/")
async def get_logs():
    logs = collection.find()
    return fetched_logs(logs)

@router.post("/")
async def create_log(log: Log):
    try:
        res = collection.insert_one(dict(log))
        return {"status_code": 200, "id": str(res.inserted_id)}

    except Exception as e:
        return HTTPException(status_code=500, detail=str(e))

app.include_router(router)


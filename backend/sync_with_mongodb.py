from configurations import time_col, collection, es, ES_INDEX
from database.schema import fetched_logs
import datetime

async def sync_logs():
    try: 
        last_sync_doc = await time_col.find_one()
        last_sync_time = last_sync_doc["last_sync_time"] if last_sync_doc else datetime.datetime(1970, 1, 1)
        if last_sync_doc is None:
            await time_col.insert_one({"last_sync_time": last_sync_time})

        logs = await collection.find({"timestamp": {"$gt": last_sync_time}}).to_list(length=None)        
        for to_add_log in fetched_logs(logs):
            print("Adding log to ES")
            es.index(index=ES_INDEX, body=to_add_log)

        if logs:
            await time_col.update_one({}, {"$set": {"last_sync_time": logs[-1]["timestamp"]}}, upsert=True)

    except Exception as e:
        print(str(e))
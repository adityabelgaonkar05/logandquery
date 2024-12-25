from configurations import time_col, collection, es, ES_INDEX
from database.schema import fetched_logs
import datetime

async def sync_logs():
    try:
        print("Sync logs task started.")

        if not es.ping():
            print("Elasticsearch is unreachable. Check your configuration.")
            return

        last_sync_doc = await time_col.find_one()
        last_sync_time = last_sync_doc["last_sync_time"] if last_sync_doc else datetime.datetime(1970, 1, 1)
        if last_sync_doc is None:
            await time_col.insert_one({"last_sync_time": last_sync_time})
            print("Initialized last_sync_time.")

        logs = await collection.find({"timestamp": {"$gt": last_sync_time}}).to_list(length=None)
        print(f"Found {len(logs)} new logs to sync.")
        print(f"Last sync time: {last_sync_time}")

        for to_add_log in fetched_logs(logs):
            print(f"Adding log to Elasticsearch: {to_add_log}")
            es.index(index=ES_INDEX, body=to_add_log)

        if logs:
            new_sync_time = logs[-1]["timestamp"]
            await time_col.update_one({}, {"$set": {"last_sync_time": new_sync_time}}, upsert=True)
            print(f"Updated last_sync_time to {new_sync_time}.")
        else:
            print("No new logs to sync.")

    except Exception as e:
        print(f"Error during sync_logs: {e}", exc_info=True)

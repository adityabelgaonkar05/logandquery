from typing import Dict

def fetched_log(log):
    return {
        "id": str(log["_id"]),
        "level" : log["level"],
        "message" : log["message"],
        "resourceId":  log["resourceId"],
        "timestamp": log["timestamp"],
        "traceId": str(log["traceId"]),
        "spanId": str(log["spanId"]),
        "commit": log["commit"],
        "metadata": log["metadata"],
    }

def fetched_logs(logs):
    return [fetched_log(log) for log in logs]
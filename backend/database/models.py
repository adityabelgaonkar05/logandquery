from datetime import datetime
from typing import Dict
from pydantic import BaseModel

class Log(BaseModel):
    level: str 
    message: str
    resourceId: str
    timestamp: datetime
    traceId: str 
    spanId: str
    commit: str 
    metadata: Dict[str, str]

# Log and Query

## How to Run This Project

Ensure the following tools are installed and working on your system:
- [Python](https://www.python.org/downloads/)
- [Pip](https://pypi.org/project/pip/)
- [Docker](https://www.docker.com/products/docker-desktop/)
- [NPM](https://nodejs.org/en/download/package-manager)

Open three terminals for ElasticSearch, frontend, and backend, and follow these steps:

### Step 1: Run ElasticSearch
In the root directory, run:
```
docker-compose up
```


### Step 2: Run Backend
1. Open another terminal and navigate to the `backend` directory:
    ```
    cd backend
    ```
2. Run these commands in order:
    ```
    pip install -r requirements.txt  # Run only on the first start
    python -m uvicorn main:app --port 3000 --reload
    ```

### Step 3: Run Frontend
1. Open another terminal and navigate to the `frontend` directory:
    ```
    cd frontend
    ```
2. Run these commands in order:
    ```
    npm i  # Run only on the first start
    npm run dev
    ```

The frontend should now be running on port **5173**.

### Usage
- **Backend:** Requests can be sent to `http://127.0.0.1:3000/`.
- **Frontend:** The React-based query interface is available at `http://127.0.0.1:5173/`.

In `App.tsx`, the current limit on search queries is set to **100**. This can be modified or removed by changing the `&size=100` parameter in the fetch URL within the `useEffect` hook.

---

## System Design

### Overview
- **MongoDB:** Used for ingesting logs quickly, leveraging its fast write speeds.  
- **ElasticSearch:** Used as the search engine due to its advanced querying capabilities.  

The system ensures optimal performance by:
1. Storing logs in MongoDB as soon as they are ingested.
2. Running a scheduled task every minute to sync new logs to ElasticSearch. This is done by fetching documents from MongoDB with a timestamp greater than the last sync time.

### MongoDB Optimization
- Indexed on the `timestamp` field to improve the efficiency of fetching new logs for syncing.

### Frontend
- Built with React.
- Provides dynamic filters and allows users to query logs using complex combinations of filters.

---

## Features Implemented

### Basic Features
1. **Log Ingestion:** Handles high-volume data ingestion.
2. **Query Capability:** Allows complex filter-based searches.
3. **Optimized Design:** Avoids bottlenecks by using MongoDB for storage and ElasticSearch for queries.
4. **Server:** Backend runs on port **3000** using the provided commands.
5. **Web Interface:** Includes dynamic filters for querying logs.
6. **Date Filtering:** Supports filtering logs between two dates.

### Advanced Features
1. Supports multiple filters at once.
2. Allows searches within specific date ranges.
3. Provides near real-time log ingestion and search capabilities (1-minute sync interval).

---

## Potential Issues
- **Storage Limitation:** MongoDB space may eventually run out since the free version is being used.
- No other known issues.

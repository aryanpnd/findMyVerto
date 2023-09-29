import uvicorn
from fastapi import FastAPI,Path
from pydantic import BaseModel, Field
from typing import List
from pymongo import MongoClient

app = FastAPI()

uri = "mongodb+srv://hackergod9870:RgPygwPjdRe7Dg1G@cluster0.hced8n0.mongodb.net/?retryWrites=true&w=majority"
client = MongoClient(uri)
db = client["your_database_name"]

@app.get("/")
async def index():
   return {"message": "Hello World"}

if __name__ == "__main__":
   uvicorn.run("mongoCRUD:app", host="127.0.0.1", port=8000, reload=True)
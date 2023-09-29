from pymongo import MongoClient
from fastapi import FastAPI, status
from pydantic import BaseModel
from typing import List

DB = "FindMyVertoTest"
MSG_COLLECTION = "messages"
uri = "mongodb+srv://hackergod9870:RgPygwPjdRe7Dg1G@cluster0.hced8n0.mongodb.net/?retryWrites=true&w=majority"

# Message class defined in Pydantic
class Message(BaseModel):
    channel: str
    author: str
    text: str

# Instantiate the FastAPI
app = FastAPI()

# Create a global MongoClient instance using the provided MongoDB Atlas URI
client = MongoClient(uri)

# Define a reference to the database and collection
db = client[DB]
msg_collection = db[MSG_COLLECTION]

@app.get("/status")
def get_status():
    """Get status of messaging server."""
    return {"status": "running"}

@app.get("/channels", response_model=List[str])
def get_channels():
    """Get all channels in list form."""
    distinct_channel_list = msg_collection.distinct("channel")
    return distinct_channel_list

@app.get("/messages/{channel}", response_model=List[Message])
def get_messages(channel: str):
    """Get all messages for the specified channel."""
    msg_list = msg_collection.find({"channel": channel})
    response_msg_list = []
    for msg in msg_list:
        response_msg_list.append(Message(**msg))
    return response_msg_list

@app.post("/post_message", status_code=status.HTTP_201_CREATED)
def post_message(message: Message):
    """Post a new message to the specified channel."""
    result = msg_collection.insert_one(message.dict())
    ack = result.acknowledged
    return {"insertion": ack}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("basicMongoConnect:app", host="127.0.0.1", port=8000, reload=True)

import uvicorn
from fastapi import FastAPI,Path
from pydantic import BaseModel, Field
from typing import List

app = FastAPI()

@app.get("/")
async def index():
   return {"message": "Hello World"}

@app.get("/add/{num1}/{num2}")
async def sum(num1:int,num2:int):
   result = num1+num2
   return {"sum": result}

@app.get("/name/{name}")
async def name(name:str=Path(min_length=3,
max_length=10)):
   return {"hello":name}


class Student(BaseModel):
   id: int
   name :str = Field(None, title="name of student", max_length=10)
   subjects: List[str] = []
@app.post("/students/")
async def student_data(s1: Student):
   return s1



if __name__ == "__main__":
   uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
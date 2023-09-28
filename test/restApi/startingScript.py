import uvicorn
from fastapi import FastAPI,Path
from scrapper import UmsScrapper

app = FastAPI()


@app.get("/")
async def hello():
    str = "hello"
    return str

@app.get("/getTimeTable")
async def getTT(regno:int,password:str):
    umsScrapper = UmsScrapper(username=regno,password=password)
    umsScrapper.login()
    timeTable = umsScrapper.get_time_table()
    umsScrapper.close()
    return timeTable


if __name__ == "__main__":
   uvicorn.run("startingScript:app", host="127.0.0.1", port=8000, reload=True)
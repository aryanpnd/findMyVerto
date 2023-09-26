import uvicorn
from fastapi import FastAPI,Path
from scrapper import UmsScrapper

app = FastAPI()


@app.get("/getTimeTable")
async def sum(regno:int,password:str):
    umsScrapper = UmsScrapper(username=regno,password=password)
    timeTable = umsScrapper.get_time_table()
    umsScrapper.close()
    return timeTable


if __name__ == "__main__":
   uvicorn.run("startingScript:app", host="127.0.0.1", port=8000, reload=True)
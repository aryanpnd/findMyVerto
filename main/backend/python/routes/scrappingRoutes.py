from fastapi import APIRouter, Depends, HTTPException
# from main.models.studentModels import Message
from middleware.scrapper import UmsScrapper

router = APIRouter()

@router.get("/StudentInfo")
def getStudentInfo(regno:int,password:str):
    umsScrapper = UmsScrapper(username=regno,password=password)
    umsScrapper.login()
    userInfo = umsScrapper.get_user_info()
    umsScrapper.close()
    return userInfo

@router.get("/TimeTable")
async def getTT(regno:int,password:str):
    umsScrapper = UmsScrapper(username=regno,password=password)
    umsScrapper.login()
    timeTable = umsScrapper.get_time_table()
    umsScrapper.close()
    return timeTable


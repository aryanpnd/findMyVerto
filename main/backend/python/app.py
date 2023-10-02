import uvicorn
from fastapi import FastAPI,Path
from routes import scrappingRoutes 

app = FastAPI()

app.include_router(scrappingRoutes.router, prefix="/scrap")


if __name__ == "__main__":
   uvicorn.run("app:app", host="127.0.0.1", port=8000, reload=True)
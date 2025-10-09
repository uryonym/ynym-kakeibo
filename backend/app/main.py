from fastapi import FastAPI
from .api import router as api_router

app = FastAPI()
app.include_router(api_router)


async def root():
    return {"message": "Welcome to the ynym-kakeibo API"}

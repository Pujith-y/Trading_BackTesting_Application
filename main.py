from fastapi import FastAPI
from database import Base,engine
from routes import auth,startegies,backtests

app = FastAPI(root_path="/api/v1")

Base.metadata.create_all(engine)

app.include_router(auth.router)
app.include_router(startegies.router)
app.include_router(backtests.router)

@app.get("/")
def root():
    return {"message" : "root endpoint"}



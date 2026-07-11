from fastapi import FastAPI
from database import Base,engine
from routes import auth,startegies,backtests,marketdata,trades,analytics,dashboard
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(root_path="/api/v1")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://trading-backtesting-application.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(engine)

app.include_router(auth.router)
app.include_router(startegies.router)
app.include_router(backtests.router)
app.include_router(marketdata.router)
app.include_router(trades.router)
app.include_router(analytics.router)
app.include_router(dashboard.router)

@app.get("/")
def root():
    return {"message" : "root endpoint"}



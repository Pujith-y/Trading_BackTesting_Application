from http.client import HTTPException

from fastapi import APIRouter, Depends
from database import get_db
from sqlalchemy.orm import Session
from models import Strategy, User
from schemas import New_Strategy, Change_Strategy
from services.security.token_creation import get_current_user


router = APIRouter(tags=["strategies"])

@router.post("/strategy")
def create_new_startegy(body : New_Strategy, curr_user : User = Depends(get_current_user), db : Session = Depends(get_db)):
    disc = ""
    if body.description:
        disc = body.description
    new_startegy = Strategy(
        name = body.name, 
        description = disc, 
        ema_slow = body.ema_slow, 
        ema_fast = body.ema_fast,
        user_id = curr_user.id
        )
    db.add(new_startegy)
    db.commit()
    db.refresh(new_startegy)
    return new_startegy

@router.get("/strategies")
def get_all_strategies(curr_user : User = Depends(get_current_user), db : Session = Depends(get_db), name : str = None):
    strategies = db.query(Strategy).filter(Strategy.user_id == curr_user.id).all()
    if name:
        strategies = [strategy for strategy in strategies if name.lower() in strategy.name.lower()]
    return strategies

@router.get("/strategy/{id}")
def get_a_strategy(id : int, curr_user : User = Depends(get_current_user), db : Session = Depends(get_db)):
    strategy = (db.query(Strategy)
                    .filter(
                        Strategy.id == id,
                        Strategy.user_id == curr_user.id
                    ).first()
                )
    if not strategy:
        raise HTTPException(
            status_code=404,
            detail="Strategy not found"
        )
    return strategy

@router.put("/strategy/{id}")
def update_a_strategy(id : int, body : Change_Strategy, curr_user : User = Depends(get_current_user), db : Session = Depends(get_db)):

    curr_strategy = (db.query(Strategy)
                        .filter(
                            Strategy.id == id, 
                            Strategy.user_id == curr_user.id
                        ).first()
                    )
    if not curr_strategy:
        raise HTTPException(
            status_code=404,
            detail="Strategy not found"
        )
    if body.name is not None:
        curr_strategy.name = body.name

    if body.description is not None:
        curr_strategy.description = body.description

    if body.ema_slow is not None:
        curr_strategy.ema_slow = body.ema_slow

    if body.ema_fast is not None:
        curr_strategy.ema_fast = body.ema_fast

    db.commit()
    db.refresh(curr_strategy)
    return curr_strategy

@router.delete("/strategy/{id}")
def delete_a_strategy(id : int, curr_user : User = Depends(get_current_user), db : Session = Depends(get_db)):

    curr_strategy = (db.query(Strategy)
                        .filter(
                            Strategy.id == id, 
                            Strategy.user_id == curr_user.id
                        ).first()
                    )
    if not curr_strategy:
        raise HTTPException(
            status_code=404,
            detail="Strategy not found"
        )
    
    db.delete(curr_strategy)
    db.commit()

    return {"message" : "Strategy deleted successfully"}


    
    
    
    
from database import Base
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(255), nullable=False, unique=True, index=True)
    password_hash = Column(String(225), nullable=False) 
    created_at = Column(DateTime, default=datetime.utcnow)

    backtests = relationship("Backtest", back_populates="user", cascade="all, delete-orphan")
    strategies = relationship("Strategy", back_populates="user", cascade="all, delete-orphan")


class Strategy(Base):
    __tablename__ = "strategies"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    description = Column(String(255), nullable=True)
    ema_slow = Column(Integer, nullable=False)
    ema_fast = Column(Integer, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    user_id = Column(Integer, ForeignKey("users.id"))

    user = relationship("User", back_populates="strategies")
    backtests = relationship("Backtest", back_populates="strategy", cascade="all, delete-orphan")

class Backtest(Base):
    __tablename__ = "backtests"

    id = Column(Integer, primary_key=True, index=True)
    market = Column(String(100), nullable=False)
    symbol = Column(String(100), nullable=False)
    timeframe = Column(Integer, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    strategy_id = Column(Integer, ForeignKey("strategies.id"))
    strategy_name = Column(String(100), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"))

    user = relationship("User", back_populates="backtests")
    strategy = relationship("Strategy", back_populates="backtests")
    trades = relationship("Trade", back_populates="backtest", cascade="all, delete-orphan")
    
    
class Trade(Base):
    __tablename__ = "trades"

    id = Column(Integer, primary_key=True, index=True)
    entry_price = Column(Integer, nullable=False)
    entry_datetime = Column(DateTime, nullable=False)
    entry_discription = Column(String(255), nullable=False)
    exit_price = Column(Integer, nullable=True)
    exit_datetime = Column(DateTime, nullable=True)
    exit_discription = Column(String(255), nullable=True)
    backtest_id = Column(Integer, ForeignKey("backtests.id"))

    backtest = relationship("Backtest", back_populates="trades")

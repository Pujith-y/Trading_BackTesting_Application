from rq import Queue
from services.queue.redis_queue import redis_conn

backtest_queue = Queue(connection=redis_conn)
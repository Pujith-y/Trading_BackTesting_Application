from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password : str):
    return pwd_context.hash(password)

def verify_password(plan_pwd : str, hashed_pwd : str):
    return pwd_context.verify(plan_pwd, hashed_pwd)                                                         
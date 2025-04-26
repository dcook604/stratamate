from fastapi import APIRouter
from sqlalchemy import text
from database import engine

router = APIRouter()

@router.get("/health/db")
def db_health():
    try:
        with engine.connect() as conn:
            result = conn.execute(text("SELECT name FROM sqlite_master WHERE type='table';"))
            tables = [row[0] for row in result]
        return {"status": "ok", "tables": tables}
    except Exception as e:
        return {"status": "error", "detail": str(e)}

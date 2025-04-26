import logging
import traceback
from logging.handlers import RotatingFileHandler
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response

# Set up loggers for info, warning, error
log_format = '%(asctime)s %(levelname)s %(name)s %(message)s'
log_handlers = [
    RotatingFileHandler('info.log', maxBytes=2*1024*1024, backupCount=5),
    RotatingFileHandler('warning.log', maxBytes=2*1024*1024, backupCount=5),
    RotatingFileHandler('error.log', maxBytes=2*1024*1024, backupCount=5),
]
class LevelFilter(logging.Filter):
    def __init__(self, level):
        self.level = level
    def filter(self, record):
        return record.levelno == self.level

info_handler = RotatingFileHandler('info.log', maxBytes=2*1024*1024, backupCount=5)
info_handler.setLevel(logging.INFO)
info_handler.setFormatter(logging.Formatter(log_format))
info_handler.addFilter(LevelFilter(logging.INFO))

warning_handler = RotatingFileHandler('warning.log', maxBytes=2*1024*1024, backupCount=5)
warning_handler.setLevel(logging.WARNING)
warning_handler.setFormatter(logging.Formatter(log_format))
warning_handler.addFilter(LevelFilter(logging.WARNING))

error_handler = RotatingFileHandler('error.log', maxBytes=2*1024*1024, backupCount=5)
error_handler.setLevel(logging.ERROR)
error_handler.setFormatter(logging.Formatter(log_format))
error_handler.addFilter(LevelFilter(logging.ERROR))

logging.basicConfig(
    level=logging.INFO,
    format=log_format,
    handlers=[info_handler, warning_handler, error_handler]
)
logger = logging.getLogger("stratamate")

app = FastAPI(
    title="Condo Lite Backend",
    description="A lightweight property management backend.",
    version="0.1.0"
)

# CORS configuration (adjust origins as needed)
app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=r"https://.*\\.windsurf\\.build|https://.*\\.ngrok-free\\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)
# Import and include routers (to be implemented)
from routers import auth, units, residents, requests, announcements, diagnostic

# Add Chrome private network access CORS header for preflight
@app.middleware("http")
async def add_private_network_header(request: Request, call_next):
    response = await call_next(request)
    if request.method == "OPTIONS":
        response.headers["Access-Control-Allow-Private-Network"] = "true"
    return response

app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(units.router, prefix="/units", tags=["units"])
app.include_router(residents.router, prefix="/residents", tags=["residents"])
app.include_router(requests.router, prefix="/requests", tags=["requests"])
app.include_router(announcements.router, prefix="/announcements", tags=["announcements"])
app.include_router(diagnostic.router, prefix="/diagnostic", tags=["diagnostic"])

# Global error handler for logging
from fastapi.responses import JSONResponse
from fastapi.exception_handlers import RequestValidationError
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
from fastapi import Body
import json

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled Exception: {exc}\n" + traceback.format_exc())
    return JSONResponse(status_code=500, content={"detail": "Internal server error"})

@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    logger.warning(f"HTTPException: {exc.detail}")
    return JSONResponse(status_code=exc.status_code, content={"detail": exc.detail})

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    logger.warning(f"Validation error: {exc.errors()}")
    return JSONResponse(status_code=422, content={"detail": exc.errors()})

@app.post("/logs")
async def receive_frontend_log(
    level: str = Body(...),
    context: str = Body(...),
    message: str = Body(...),
    userAgent: str = Body(None),
    url: str = Body(None),
    timestamp: str = Body(None)
):
    log_entry = {
        "level": level,
        "context": context,
        "message": message,
        "userAgent": userAgent,
        "url": url,
        "timestamp": timestamp
    }
    try:
        with open("frontend.log", "a") as f:
            f.write(json.dumps(log_entry) + "\n")
        logger.info(f"Frontend log received: {level} {context} {message}")
        return {"status": "ok"}
    except Exception as e:
        logger.error(f"Failed to write frontend log: {e}")
        return JSONResponse(status_code=500, content={"detail": "Failed to write log"})

@app.get("/")
async def root():
    return {"message": "Welcome to Condo Lite Backend!"}

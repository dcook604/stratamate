from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import Base

import os

SQLALCHEMY_DATABASE_URL = os.environ.get(
    "DATABASE_URL",
    "sqlite:///./condo_lite.db"
)

if SQLALCHEMY_DATABASE_URL.startswith("sqlite"):
    engine = create_engine(
        SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
    )
else:
    # Add SSL support for Postgres (Aiven)
    ca_cert_path = os.environ.get("PGSSLROOTCERT", "ca.pem")
    if SQLALCHEMY_DATABASE_URL.startswith("postgres"):
        engine = create_engine(
            SQLALCHEMY_DATABASE_URL,
            connect_args={
                "sslmode": "require",
                "sslrootcert": ca_cert_path
            }
        )
    else:
        engine = create_engine(SQLALCHEMY_DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create tables
Base.metadata.create_all(bind=engine)

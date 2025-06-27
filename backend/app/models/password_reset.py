# app/models/password_reset.py
from sqlalchemy import Column, String, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from app.database import Base
from sqlalchemy.sql import func
import uuid

class PasswordResetCode(Base):
    __tablename__ = "password_reset_codes"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String(255), nullable=False, index=True)
    code = Column(String(6), nullable=False)
    created_at = Column(DateTime(timezone=True), nullable=False)  # ⚠️ Sin server_default
    used = Column(Boolean, default=False)
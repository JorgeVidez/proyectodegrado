# app/schemas/password_reset.py
from pydantic import BaseModel, EmailStr, Field

class PasswordResetRequest(BaseModel):
    email: EmailStr

class PasswordResetVerify(BaseModel):
    email: EmailStr
    code: str = Field(..., min_length=6, max_length=6)

class PasswordResetComplete(BaseModel):
    email: EmailStr
    code: str
    new_password: str

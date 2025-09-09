from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, EmailStr
from app.shared.database.supabase_client import supabase
import logging

# 로거 설정
logger = logging.getLogger(__name__)

# 라우터 생성
router = APIRouter(prefix="/waitlist", tags=["waitlist"])

# 요청 모델
class WaitlistRequest(BaseModel):
    email: EmailStr

# 응답 모델
class WaitlistResponse(BaseModel):
    id: str
    email: str
    message: str

@router.post("/", response_model=WaitlistResponse, status_code=status.HTTP_201_CREATED)
async def add_to_waitlist(request: WaitlistRequest):
    
    try:
        # 웨이트리스트에 이메일 추가
        result = supabase.table("waitlist").insert({
            "email": request.email
        }).execute()
        
        if not result.data:
            logger.error(f"Failed to insert email: {request.email}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to add email to waitlist"
            )
        
        created_entry = result.data[0]
        logger.info(f"Successfully added email to waitlist: {request.email}")
        
        return WaitlistResponse(
            id=created_entry["id"],
            email=created_entry["email"],
            message="Successfully added to waitlist"
        )
        
    except Exception as e:
        logger.error(f"Unexpected error adding email to waitlist: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred"
        )


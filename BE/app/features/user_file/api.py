from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, status
from typing import Optional
import json
import logging

from app.features.auth.deps import get_current_user_id
from app.features.user_file.services import FileUploadService
from app.features.user_file.models import ImageUploadResponse, FileDeleteResponse

logger = logging.getLogger(__name__)

# 라우터 생성
router = APIRouter(prefix="/upload", tags=["file_upload"])


@router.post(
    "/image",
    response_model=ImageUploadResponse,
    status_code=status.HTTP_200_OK,
    summary="캐릭터 프로필 이미지 업로드",
    description="캐릭터 프로필용 이미지 파일을 서버에 업로드하고 공개 URL을 반환합니다.",
    responses={
        200: {
            "description": "이미지 업로드 성공",
            "content": {
                "application/json": {
                    "example": {
                        "id": "file_abc123",
                        "url": "https://storage.example.com/images/abc123.jpg",
                        "filename": "character_avatar.jpg",
                        "size": 245760,
                        "mimeType": "image/jpeg",
                        "uploadedAt": "2025-01-15T10:30:00Z",
                        "metadata": {
                            "description": "Main character avatar",
                            "tags": ["avatar", "character"]
                        }
                    }
                }
            }
        },
        400: {
            "description": "잘못된 파일 형식",
            "content": {
                "application/json": {
                    "example": {
                        "detail": {
                            "code": "INVALID_FILE_TYPE",
                            "message": "Invalid file type. Only image files are allowed.",
                            "details": {
                                "allowedTypes": ["image/jpeg", "image/png", "image/webp", "image/gif"]
                            }
                        }
                    }
                }
            }
        },
        401: {
            "description": "인증 실패"
        },
        413: {
            "description": "파일 크기 제한 초과",
            "content": {
                "application/json": {
                    "example": {
                        "detail": {
                            "code": "FILE_TOO_LARGE",
                            "message": "File size exceeds maximum allowed size",
                            "details": {
                                "maxSize": 10485760,
                                "currentSize": 15728640
                            }
                        }
                    }
                }
            }
        }
    }
)
async def upload_character_image(
    file: UploadFile = File(..., description="캐릭터 프로필 이미지 파일"),
    metadata: Optional[str] = Form(None, description="JSON 문자열로 메타데이터 전달"),
    user_id: str = Depends(get_current_user_id)
):
    """
    캐릭터 프로필 이미지를 업로드합니다.
    
    - **file**: 업로드할 이미지 파일 (필수)
    - **metadata**: 메타데이터 (선택사항, JSON 문자열)
    - **Authorization**: Bearer {token} (필수)
    
    **제한사항:**
    - 최대 파일 크기: 10MB
    - 허용 형식: JPG, JPEG, PNG, WebP, GIF
    """
    
    # metadata JSON 파싱
    parsed_metadata = None
    if metadata:
        try:
            parsed_metadata = json.loads(metadata)
        except json.JSONDecodeError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail={
                    "code": "INVALID_METADATA",
                    "message": "Metadata must be a valid JSON string"
                }
            )
    
    # 파일 업로드 처리
    result = await FileUploadService.upload_character_image(
        file=file,
        user_id=user_id,
        metadata=parsed_metadata
    )
    
    return result


@router.delete(
    "/delete/{file_id}",
    response_model=FileDeleteResponse,
    status_code=status.HTTP_200_OK,
    summary="업로드된 파일 삭제",
    description="업로드된 파일을 서버에서 삭제합니다.",
    responses={
        200: {
            "description": "파일 삭제 성공",
            "content": {
                "application/json": {
                    "example": {
                        "message": "File deleted successfully",
                        "deletedId": "file_abc123",
                        "deletedAt": "2025-01-15T11:00:00Z"
                    }
                }
            }
        },
        401: {
            "description": "인증 실패"
        },
        403: {
            "description": "파일 소유자가 아님"
        },
        404: {
            "description": "파일을 찾을 수 없음",
            "content": {
                "application/json": {
                    "example": {
                        "detail": {
                            "code": "FILE_NOT_FOUND",
                            "message": "File not found or you do not have permission to delete it"
                        }
                    }
                }
            }
        }
    }
)
async def delete_file(
    file_id: str,
    user_id: str = Depends(get_current_user_id)
):
    """
    업로드된 파일을 삭제합니다.
    
    - **file_id**: 삭제할 파일의 고유 ID
    - **Authorization**: Bearer {token} (필수)
    
    파일 소유자만 삭제할 수 있습니다.
    """
    
    result = await FileUploadService.delete_file(
        file_id=file_id,
        user_id=user_id
    )
    
    return result

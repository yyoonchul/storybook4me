from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class ImageUploadResponse(BaseModel):
    """이미지 업로드 성공 응답"""
    id: str = Field(..., description="파일 고유 ID")
    url: str = Field(..., description="업로드된 파일의 공개 URL")
    filename: str = Field(..., description="원본 파일명")
    size: int = Field(..., description="파일 크기 (bytes)")
    mimeType: str = Field(..., description="MIME 타입", alias="mime_type")
    uploadedAt: str = Field(..., description="업로드 시간 (ISO 8601)", alias="uploaded_at")
    metadata: Optional[dict] = Field(None, description="저장된 메타데이터")

    class Config:
        populate_by_name = True
        json_schema_extra = {
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


class FileDeleteResponse(BaseModel):
    """파일 삭제 성공 응답"""
    message: str = Field(..., description="삭제 성공 메시지")
    deletedId: str = Field(..., description="삭제된 파일 ID", alias="deleted_id")
    deletedAt: str = Field(..., description="삭제 시간 (ISO 8601)", alias="deleted_at")

    class Config:
        populate_by_name = True
        json_schema_extra = {
            "example": {
                "message": "File deleted successfully",
                "deletedId": "file_abc123",
                "deletedAt": "2025-01-15T11:00:00Z"
            }
        }


class FileUploadErrorResponse(BaseModel):
    """파일 업로드 에러 응답"""
    error: dict = Field(..., description="에러 정보")

    class Config:
        json_schema_extra = {
            "example": {
                "error": {
                    "code": "FILE_TOO_LARGE",
                    "message": "File size exceeds maximum allowed size",
                    "details": {
                        "maxSize": 10485760,
                        "currentSize": 15728640
                    }
                }
            }
        }


class FileUploadRecord(BaseModel):
    """file_uploads 테이블 레코드"""
    id: str
    user_id: str
    file_name: str
    file_size: int
    file_type: str
    mime_type: str
    file_url: str
    category: Optional[str] = None
    created_at: datetime

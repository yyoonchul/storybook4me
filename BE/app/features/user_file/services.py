import logging
import uuid
import mimetypes
from datetime import datetime
from typing import Optional, Tuple
from fastapi import UploadFile, HTTPException, status

from app.shared.database.supabase_client import supabase
from app.core.config import settings
from supabase import create_client, Client
from app.features.user_file.models import ImageUploadResponse, FileDeleteResponse

logger = logging.getLogger(__name__)


class FileUploadService:
    """파일 업로드 관련 비즈니스 로직을 처리하는 서비스"""
    
    # 허용된 이미지 MIME 타입
    ALLOWED_IMAGE_TYPES = {
        "image/jpeg",
        "image/jpg", 
        "image/png",
        "image/webp",
        "image/gif"
    }
    
    # 최대 파일 크기 (10MB)
    MAX_FILE_SIZE = 10 * 1024 * 1024
    
    # Supabase Storage 버킷명
    BUCKET_NAME = "user_images"
    
    
    @staticmethod
    def validate_image_file(file: UploadFile, content: bytes) -> None:
        """이미지 파일 유효성 검증"""
        
        # 파일 크기 확인
        file_size = len(content)
        if file_size > FileUploadService.MAX_FILE_SIZE:
            raise HTTPException(
                status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                detail={
                    "code": "FILE_TOO_LARGE",
                    "message": "File size exceeds maximum allowed size",
                    "details": {
                        "maxSize": FileUploadService.MAX_FILE_SIZE,
                        "currentSize": file_size,
                        "allowedTypes": list(FileUploadService.ALLOWED_IMAGE_TYPES)
                    }
                }
            )
        
        # MIME 타입 확인
        mime_type = file.content_type
        if mime_type not in FileUploadService.ALLOWED_IMAGE_TYPES:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail={
                    "code": "INVALID_FILE_TYPE",
                    "message": "Invalid file type. Only image files are allowed.",
                    "details": {
                        "allowedTypes": list(FileUploadService.ALLOWED_IMAGE_TYPES),
                        "receivedType": mime_type
                    }
                }
            )
        
        # 파일 확장자 이중 검증
        if file.filename:
            extension = file.filename.split(".")[-1].lower() if "." in file.filename else ""
            guessed_type, _ = mimetypes.guess_type(file.filename)
            
            if guessed_type and guessed_type not in FileUploadService.ALLOWED_IMAGE_TYPES:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail={
                        "code": "INVALID_FILE_EXTENSION",
                        "message": "File extension does not match allowed image types.",
                        "details": {
                            "allowedTypes": list(FileUploadService.ALLOWED_IMAGE_TYPES)
                        }
                    }
                )
    
    
    @staticmethod
    async def upload_character_image(
        file: UploadFile,
        user_id: str,
        metadata: Optional[dict] = None
    ) -> ImageUploadResponse:
        """캐릭터 프로필 이미지를 Supabase Storage에 업로드"""
        
        try:
            # 파일 내용 읽기
            content = await file.read()
            
            # 파일 유효성 검증
            FileUploadService.validate_image_file(file, content)
            
            # 고유한 파일명 생성 (UUID + 확장자)
            file_id = str(uuid.uuid4())
            file_extension = file.filename.split(".")[-1] if file.filename and "." in file.filename else "jpg"
            storage_path = f"{user_id}/{file_id}.{file_extension}"
            
            # Supabase Storage에 업로드 (서버 사이드에서 직접 사용)
            upload_result = supabase.storage.from_(FileUploadService.BUCKET_NAME).upload(
                path=storage_path,
                file=content,
                file_options={
                    "content-type": file.content_type,
                    "upsert": "false"
                }
            )
            
            # 업로드 실패 체크
            if not upload_result:
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail="Failed to upload file to storage"
                )
            
            # 파일의 공개 URL 가져오기
            public_url_result = supabase.storage.from_(FileUploadService.BUCKET_NAME).get_public_url(storage_path)
            file_url = public_url_result
            
            if not file_url:
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail="Failed to get public URL for uploaded file"
                )
            
            # file_uploads 테이블에 레코드 저장 (file_name을 Storage ID로 사용)
            file_record = {
                "user_id": user_id,
                "file_name": file_id,  # Storage ID를 file_name으로 저장
                "file_size": len(content),
                "file_type": "image",
                "mime_type": file.content_type,
                "file_url": file_url,
                "category": "character"
                # id와 created_at은 PostgreSQL DEFAULT가 자동 처리
            }
            
            # file_uploads 테이블에 레코드 저장 (다른 피쳐들과 동일한 방식)
            db_result = supabase.table("file_uploads").insert(file_record).execute()
            
            if not db_result.data:
                logger.error(f"Failed to save file record to database for file_id: {file_id}")
                # Storage에서 파일 삭제 (롤백)
                supabase.storage.from_(FileUploadService.BUCKET_NAME).remove([storage_path])
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail="Failed to save file metadata"
                )
            
            # DB에서 생성된 실제 ID 가져오기
            db_file_id = db_result.data[0]["id"]
            logger.info(f"Successfully uploaded file: {db_file_id} for user: {user_id}")
            
            # 응답 생성 (DB ID 반환, file_name은 Storage ID)
            from datetime import datetime
            now = datetime.utcnow().isoformat()
            return ImageUploadResponse(
                id=db_file_id,  # DB에서 생성된 실제 ID
                url=file_url,
                filename=file_id,  # Storage ID를 filename으로 반환
                size=len(content),
                mime_type=file.content_type,
                uploaded_at=now,
                metadata=metadata
            )
            
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Unexpected error uploading file: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="An unexpected error occurred while uploading file"
            )
    
    
    @staticmethod
    async def delete_file(file_id: str, user_id: str) -> FileDeleteResponse:
        """업로드된 파일 삭제"""
        
        try:
            # 1. DB에서 파일 정보 조회 (소유권 확인)
            try:
                # file_name으로 조회 (Storage ID가 file_name에 저장됨)
                file_result = supabase.table("file_uploads").select("*").eq("file_name", file_id).eq("user_id", user_id).execute()
                
                # 만약 file_name으로 찾지 못했다면, 기존 방식으로도 시도
                if not file_result.data or len(file_result.data) == 0:
                    file_result = supabase.table("file_uploads").select("*").eq("id", file_id).eq("user_id", user_id).execute()
                
            except Exception as e:
                logger.error(f"Database query failed: {e}")
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail=f"Database query failed: {str(e)}"
                )
            
            if not file_result.data or len(file_result.data) == 0:
                logger.error(f"File not found: {file_id} for user: {user_id}")
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail={
                        "code": "FILE_NOT_FOUND",
                        "message": "File not found or you do not have permission to delete it"
                    }
                )
            
            file_record = file_result.data[0]
            
            # 2. Storage에서 파일 경로 추출
            file_url = file_record["file_url"]
            # URL에서 경로 추출 (예: https://.../storage/v1/object/public/user_images/user123/file.jpg -> user123/file.jpg)
            storage_path = file_url.split(f"/{FileUploadService.BUCKET_NAME}/")[-1]
            # URL 파라미터 제거 (? 이후 제거)
            storage_path = storage_path.split("?")[0]
            
            # 3. Supabase Storage에서 파일 삭제
            delete_storage_result = supabase.storage.from_(FileUploadService.BUCKET_NAME).remove([storage_path])
            
            if not delete_storage_result:
                logger.warning(f"Storage deletion may have failed for file: {storage_path}")
            
            # 4. file_uploads 테이블에서 레코드 삭제
            db_file_id = file_record["id"]
            delete_db_result = supabase.table("file_uploads").delete().eq("id", db_file_id).execute()
            
            if not delete_db_result.data:
                logger.error(f"Failed to delete file record from database: {file_id}")
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail="Failed to delete file metadata"
                )
            
            logger.info(f"Successfully deleted file: {file_id} for user: {user_id}")
            
            now = datetime.utcnow().isoformat()
            return FileDeleteResponse(
                message="File deleted successfully",
                deleted_id=file_id,
                deleted_at=now
            )
            
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Unexpected error deleting file: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="An unexpected error occurred while deleting file"
            )

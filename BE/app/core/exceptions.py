"""Custom exceptions for the application."""

from fastapi import HTTPException, status


class BaseAppException(HTTPException):
    """Base exception class for the application."""
    
    def __init__(self, detail: str = "An error occurred"):
        super().__init__(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=detail)


class NotFoundError(HTTPException):
    """Exception for resource not found errors."""
    
    def __init__(self, detail: str = "Resource not found"):
        super().__init__(status_code=status.HTTP_404_NOT_FOUND, detail=detail)


class ValidationError(HTTPException):
    """Exception for validation errors."""
    
    def __init__(self, detail: str = "Validation error"):
        super().__init__(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=detail)

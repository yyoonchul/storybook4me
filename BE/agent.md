---
description: fastAPI project rules
globs: 
alwaysApply: false
---
You are an expert Python developer specializing in **FastAPI**, **Supabase** integration, and **LLM (Large Language Model)** novel generation systems.

## Project Overview

## Key Principles

* Write concise, technical responses with accurate Python examples.
* Emphasize **functional, declarative programming**; avoid classes unless necessary for pipeline steps.
* Prefer iteration and modularization over code duplication.
* Use descriptive variable names with auxiliary verbs (`is_active`, `has_permission`).
* Use `lowercase_with_underscores` for directories and files (e.g., `features/auth/api.py`).
* Prefer named exports for routes and utility functions.
* Follow **feature-based architecture** for better maintainability and scalability.

## Feature-Based Project Structure

Organize code by business domains/features rather than technical layers:

```
app/
├── core/           # Shared core functionality
│   ├── config.py
│   ├── exceptions.py
│   └── middleware/
├── shared/         # Shared utilities and common code
│   ├── database/
│   ├── auth/
│   └── utils/
└── features/       # Feature-based modules
    ├── feature_1/
    │   ├── api.py          # FastAPI routes
    │   ├── models.py       # Pydantic models
    │   ├── service.py      # Business logic
    │   └── repository.py   # Data access
```

## Python & FastAPI

* Use `def` for synchronous functions, `async def` for asynchronous ones.
* Add **type hints** for all function signatures.
* Use **Pydantic** models for input validation and response schemas, following project patterns.
* Organize code into feature-based structure:
  * `app/features/{feature}/api.py` - API route handlers
  * `app/features/{feature}/service.py` - Business logic and service layer
  * `app/features/{feature}/models.py` - Pydantic models
  * `app/features/{feature}/repository.py` - Data access layer
  * `app/core/` - Core application setup
  * `app/shared/` - Shared utilities and common code
* Write compact conditional expressions; avoid unnecessary braces.

## Error Handling & Validation

* Handle edge cases **early** with guard clauses.
* Use **early returns** to reduce nesting and enhance clarity.
* Place the "happy path" **at the bottom** of the function.
* Avoid unnecessary `else` blocks (prefer `if-return`).
* Log errors properly and return **user-friendly** messages.
* Use the existing custom exceptions from `app/core/exceptions/`.

## Dependencies & Integrations

* `fastapi` for API framework
* `hypercorn` for ASGI server
* `supabase` for database and authentication
* `python-jose` and `pyjwt` for JWT handling

## Supabase Integration

* Use the established Supabase client from the project.
* Properly handle authentication with OAuth providers (Google, Apple).
* Follow the project's pattern for user management.
* Use proper error handling for Supabase operations.


## FastAPI Best Practices

* Use **declarative route definitions** with response type annotations.
* Apply project middleware for logging and error handling.
* Rely on **dependency injection** for state/shared resources.
* Follow the established authentication pattern.

## Performance Optimization

* Make I/O operations **async** when possible.
* Implement proper error handling for LLM timeouts.
* Use token tracking for efficient LLM usage.
* Monitor performance, especially during novel generation.

## LLM Service Integration

* Use the established `LLMProvider` abstraction.
* Follow error handling patterns for API errors.
* Properly manage context and maintain generation coherence.
* Track token usage for costs and quota management.

## Documentation & Maintenance

* Keep documentation consistent with API models.
* Document novel generation steps clearly.
* Maintain consistent error patterns across the application.

## Project Structure Guidelines

* Follow **feature-based architecture** (Features → Shared → Core).
* Each feature should be self-contained with minimal cross-feature dependencies.
* Maintain separation of concerns within each feature (API → Service → Repository).
* Use dependency injection for services.
* Keep authentication logic in the dedicated auth feature.
* Organize novel generation code according to the pipeline steps within the feature.
* Place shared utilities in `app/shared/` for cross-feature usage.
* Keep core application setup and configuration in `app/core/`. 
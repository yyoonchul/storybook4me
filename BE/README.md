# Nova Labs Storybook Backend

FastAPI backend application following feature-based architecture.

## Setup

1. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Run the application:
```bash
python main.py
```

The API will be available at `http://localhost:8000`

## Project Structure

```
app/
├── core/           # Shared core functionality
│   ├── config.py   # Application configuration
│   └── exceptions.py # Custom exceptions
├── shared/         # Shared utilities and common code
│   ├── database/
│   ├── auth/
│   └── utils/
└── features/       # Feature-based modules
    └── (features will be added here)
```

## API Documentation

- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

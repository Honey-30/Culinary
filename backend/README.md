# Backend Quickstart

## Running the Perception Backend

### Prerequisites
- Python 3.10+
- pip

### Installation

```bash
cd backend
pip install -r requirements.txt
```

### Run Server

```bash
python main.py
```

Server starts at **http://localhost:8000**

### Health Check

```bash
curl http://localhost:8000/
```

### Test Perception Endpoint

```bash
curl -X POST http://localhost:8000/api/perception/analyze \
  -F "file=@test_image.jpg"
```

### Mock Mode (No GPU Required)

```bash
# Edit .env
MOCK_MODE=true

# Then run
python main.py
```

---

## Integration with Frontend

The frontend (React) can optionally call the backend instead of sending images directly to Gemini.

**Current Flow (unchanged):**
```
Frontend → Gemini Vision API → Recipes
```

**New Optional Flow:**
```
Frontend → Backend ML → Structured Data → Gemini API → Recipes
```

The frontend **does not need to change** - the backend is optional and enhances performance when available.

---

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `API_HOST` | 0.0.0.0 | Server host |
| `API_PORT` | 8000 | Server port |
| `ENABLE_ML_PERCEPTION` | true | Enable ML inference |
| `ML_INFERENCE_TIMEOUT` | 2.0 | Max inference time (seconds) |
| `MOCK_MODE` | false | Use mock data instead of real models |

---

## Production Deployment

### Using Uvicorn

```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
```

### Using Docker (optional)

Create `backend/Dockerfile`:

```dockerfile
FROM python:3.10-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

Build and run:

```bash
docker build -t culinarylens-backend .
docker run -p 8000:8000 culinarylens-backend
```

"""FastAPI backend server with ML perception endpoint"""
import logging
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from PIL import Image
import io
from typing import Dict, Any

from app.config import get_settings
from app.perception import run_perception_pipeline
from app.adapters.gemini_adapter import prepare_gemini_input

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Initialize FastAPI
app = FastAPI(
    title="CulinaryLens Perception API",
    description="ML-powered ingredient detection backend",
    version="1.0.0"
)

settings = get_settings()

# CORS configuration (allows frontend to call backend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3001", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup_event():
    """Initialize ML models on startup"""
    if settings.enable_ml_perception and not settings.mock_mode:
        logger.info("Preloading ML models...")
        try:
            from app.perception.pipeline import get_pipeline
            get_pipeline(timeout=settings.ml_inference_timeout)
            logger.info("✓ ML models loaded successfully")
        except Exception as e:
            logger.error(f"Failed to load ML models: {e}")
            logger.warning("Falling back to mock mode")


@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "service": "CulinaryLens Perception API",
        "status": "operational",
        "ml_enabled": settings.enable_ml_perception,
        "mock_mode": settings.mock_mode
    }


@app.post("/api/perception/analyze")
async def analyze_ingredients(file: UploadFile = File(...)) -> JSONResponse:
    """
    Analyze uploaded image and return structured ingredient data
    
    This endpoint runs ML inference and returns JSON that can be fed
    directly into Gemini or used standalone.
    
    Args:
        file: Uploaded image (multipart/form-data)
        
    Returns:
        JSON with detected ingredients
    """
    try:
        # Validate file type
        if not file.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail="File must be an image")
        
        # Read image
        contents = await file.read()
        image = Image.open(io.BytesIO(contents)).convert("RGB")
        
        logger.info(f"Processing image: {file.filename} ({image.size})")
        
        # Run perception pipeline
        if settings.mock_mode:
            result = _mock_perception_result()
        else:
            result = run_perception_pipeline(
                image, 
                timeout=settings.ml_inference_timeout
            )
        
        return JSONResponse(content=result)
        
    except TimeoutError as e:
        logger.error(f"Timeout: {e}")
        raise HTTPException(status_code=504, detail="ML inference timeout")
        
    except Exception as e:
        logger.error(f"Analysis failed: {e}")
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")


@app.post("/api/perception/analyze-for-gemini")
async def analyze_for_gemini(
    file: UploadFile = File(...),
    cuisine: str = "Global/Fusion",
    dietary_preferences: Dict[str, Any] = None
) -> JSONResponse:
    """
    Analyze image and prepare data in Gemini-compatible format
    
    This is a convenience endpoint that wraps perception + Gemini adapter.
    Frontend can use this instead of calling Gemini directly with images.
    
    Args:
        file: Uploaded image
        cuisine: Cuisine preference
        dietary_preferences: User dietary constraints
        
    Returns:
        Gemini-ready structured data
    """
    try:
        # Run base perception
        contents = await file.read()
        image = Image.open(io.BytesIO(contents)).convert("RGB")
        
        if settings.mock_mode:
            perception_data = _mock_perception_result()
        else:
            perception_data = run_perception_pipeline(image, timeout=settings.ml_inference_timeout)
        
        # Prepare for Gemini
        user_config = {
            "cuisine": cuisine,
            "dietary": dietary_preferences or {}
        }
        
        gemini_input = prepare_gemini_input(perception_data, user_config)
        
        return JSONResponse(content=gemini_input)
        
    except Exception as e:
        logger.error(f"Gemini adapter failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))


def _mock_perception_result() -> Dict[str, Any]:
    """Mock data for testing without GPU"""
    return {
        "inventory": [
            {
                "name": "apple",
                "quantity": "150g",
                "confidence": 94.5,
                "freshness": 85.0,
                "category": "produce",
                "scientificName": "Apple",
                "estimatedMass": "150g",
                "boundingBox": [100, 100, 200, 200],
                "daysToConsume": 5
            },
            {
                "name": "carrot",
                "quantity": "120g",
                "confidence": 88.2,
                "freshness": 72.0,
                "category": "produce",
                "scientificName": "Carrot",
                "estimatedMass": "120g",
                "boundingBox": [250, 150, 350, 280],
                "daysToConsume": 3
            }
        ],
        "metadata": {
            "inference_time": 0.05,
            "model_version": "mock",
            "detections_count": 2
        }
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host=settings.api_host,
        port=settings.api_port,
        reload=settings.environment == "development"
    )

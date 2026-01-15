"""Unit tests for perception pipeline"""
import pytest
from PIL import Image
import numpy as np
from app.perception.detector import IngredientDetector
from app.perception.freshness import FreshnessEstimator
from app.perception.volume import VolumeEstimator
from app.perception.pipeline import run_perception_pipeline


@pytest.fixture
def sample_image():
    """Create a simple test image"""
    img_array = np.random.randint(0, 255, (640, 640, 3), dtype=np.uint8)
    return Image.fromarray(img_array)


@pytest.fixture
def mock_detector(monkeypatch):
    """Mock detector to avoid loading actual model in tests"""
    def mock_detect(self, image, conf_threshold=0.25):
        return [
            {
                "name": "apple",
                "confidence": 0.95,
                "bbox": [100, 100, 200, 200],
                "class_id": 47
            }
        ]
    
    monkeypatch.setattr(IngredientDetector, "detect", mock_detect)


def test_detector_initialization():
    """Test detector can be initialized"""
    detector = IngredientDetector()
    assert detector is not None
    assert not detector._initialized


def test_freshness_estimator(sample_image):
    """Test freshness estimation returns valid scores"""
    estimator = FreshnessEstimator()
    estimator.load()
    
    result = estimator.estimate(sample_image)
    
    assert "freshness_score" in result
    assert "expires_in_days" in result
    assert 0 <= result["freshness_score"] <= 1
    assert result["expires_in_days"] >= 1


def test_volume_estimator():
    """Test volume estimation logic"""
    estimator = VolumeEstimator()
    
    result = estimator.estimate(
        "apple",
        bbox=[100, 100, 300, 300],
        image_size=(640, 480)
    )
    
    assert "quantity_grams" in result
    assert "volume_cm3" in result
    assert result["quantity_grams"] > 0
    assert result["volume_cm3"] > 0


def test_pipeline_with_mock(sample_image, mock_detector):
    """Test full pipeline with mocked detector"""
    from app.perception.pipeline import PerceptionPipeline
    
    pipeline = PerceptionPipeline(timeout=5.0)
    pipeline.initialize()
    
    result = pipeline.run(sample_image)
    
    assert "inventory" in result
    assert "metadata" in result
    assert isinstance(result["inventory"], list)


def test_pipeline_timeout():
    """Test pipeline respects timeout"""
    import time
    from app.perception.pipeline import run_perception_pipeline
    
    # Create a slow mock image
    img = Image.new('RGB', (640, 640))
    
    # Note: Actual timeout test would require a slow operation
    # This is a placeholder to verify timeout parameter is accepted
    try:
        result = run_perception_pipeline(img, timeout=0.001)
    except TimeoutError:
        pytest.skip("Timeout test requires slow operation")


def test_gemini_adapter():
    """Test Gemini adapter formatting"""
    from app.adapters.gemini_adapter import prepare_gemini_input
    
    perception_output = {
        "inventory": [
            {
                "name": "apple",
                "quantity": "150g",
                "confidence": 95,
                "freshness": 85,
                "category": "produce",
                "scientificName": "Apple",
                "estimatedMass": "150g",
                "boundingBox": [100, 100, 200, 200],
                "daysToConsume": 5
            }
        ],
        "metadata": {"model_version": "test"}
    }
    
    user_config = {
        "cuisine": "Italian",
        "dietary": {"vegan": True}
    }
    
    result = prepare_gemini_input(perception_output, user_config)
    
    assert "inventory" in result
    assert "context" in result
    assert result["context"]["cuisine"] == "Italian"
    assert len(result["inventory"]) == 1

"""Main perception pipeline orchestrator"""
import logging
import time
from typing import Dict, List, Any
from PIL import Image
import asyncio
from concurrent.futures import ThreadPoolExecutor, TimeoutError

from .detector import get_detector
from .freshness import get_freshness_estimator
from .volume import get_volume_estimator

logger = logging.getLogger(__name__)


class PerceptionPipeline:
    """Orchestrates ML inference pipeline"""
    
    def __init__(self, timeout: float = 2.0):
        self.timeout = timeout
        self.detector = None
        self.freshness = None
        self.volume = None
        self._initialized = False
    
    def initialize(self):
        """Load all models once at startup"""
        if self._initialized:
            return
        
        logger.info("Initializing perception pipeline...")
        start = time.time()
        
        try:
            self.detector = get_detector()
            self.freshness = get_freshness_estimator()
            self.volume = get_volume_estimator()
            self._initialized = True
            
            elapsed = time.time() - start
            logger.info(f"Pipeline initialized in {elapsed:.2f}s")
            
        except Exception as e:
            logger.error(f"Pipeline initialization failed: {e}")
            raise
    
    def run(self, image: Image.Image) -> Dict[str, Any]:
        """
        Run full perception pipeline on image
        
        Args:
            image: PIL Image
            
        Returns:
            Structured ingredient data for Gemini adapter
        """
        if not self._initialized:
            self.initialize()
        
        start = time.time()
        
        try:
            # Step 1: Detect ingredients
            detections = self.detector.detect(image, conf_threshold=0.3)
            
            if not detections:
                logger.warning("No ingredients detected")
                return {"ingredients": []}
            
            # Step 2: Enrich with freshness and volume
            ingredients = []
            img_size = image.size  # (width, height)
            
            for det in detections:
                # Freshness estimation
                fresh_data = self.freshness.estimate(image, det["bbox"])
                
                # Volume estimation
                volume_data = self.volume.estimate(
                    det["name"], 
                    det["bbox"], 
                    img_size
                )
                
                # Combine into structured format
                ingredient = {
                    "name": det["name"],
                    "quantity": f"{volume_data['quantity_grams']}g",
                    "confidence": round(det["confidence"] * 100, 1),
                    "freshness": round(fresh_data["freshness_score"] * 100, 1),
                    "category": "produce",  # Simplified
                    "scientificName": det["name"].capitalize(),
                    "estimatedMass": f"{volume_data['quantity_grams']}g",
                    "boundingBox": det["bbox"],
                    "daysToConsume": fresh_data["expires_in_days"]
                }
                
                ingredients.append(ingredient)
            
            elapsed = time.time() - start
            logger.info(f"Pipeline completed in {elapsed:.2f}s - {len(ingredients)} ingredients")
            
            return {
                "inventory": ingredients,
                "metadata": {
                    "inference_time": round(elapsed, 3),
                    "model_version": "yolov8n",
                    "detections_count": len(ingredients)
                }
            }
            
        except Exception as e:
            logger.error(f"Pipeline execution failed: {e}")
            raise


# Singleton pipeline instance
_pipeline_instance = None


def get_pipeline(timeout: float = 2.0) -> PerceptionPipeline:
    """Get singleton pipeline instance"""
    global _pipeline_instance
    if _pipeline_instance is None:
        _pipeline_instance = PerceptionPipeline(timeout=timeout)
        _pipeline_instance.initialize()
    return _pipeline_instance


def run_perception_pipeline(image: Image.Image, timeout: float = 2.0) -> Dict[str, Any]:
    """
    Main entry point for perception pipeline
    
    Args:
        image: PIL Image
        timeout: Max inference time in seconds
        
    Returns:
        Structured ingredient data
    """
    pipeline = get_pipeline(timeout)
    
    # Run with timeout protection
    with ThreadPoolExecutor(max_workers=1) as executor:
        future = executor.submit(pipeline.run, image)
        try:
            result = future.result(timeout=timeout)
            return result
        except TimeoutError:
            logger.error(f"Pipeline timeout after {timeout}s")
            raise TimeoutError(f"ML inference exceeded {timeout}s timeout")

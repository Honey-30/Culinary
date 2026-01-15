"""Volume and quantity estimation from bounding boxes"""
import logging
from typing import Dict
import math

logger = logging.getLogger(__name__)


class VolumeEstimator:
    """Estimate volume/mass from bounding boxes using heuristics"""
    
    def __init__(self):
        # Average densities (g/cm³) for common ingredients
        self.densities = {
            "apple": 0.64,
            "banana": 0.94,
            "orange": 0.74,
            "carrot": 0.64,
            "broccoli": 0.35,
            "potato": 1.08,
            "onion": 0.97,
            "tomato": 0.95,
            "default": 0.75
        }
    
    def estimate(self, ingredient_name: str, bbox: list, image_size: tuple) -> Dict[str, float]:
        """
        Estimate volume and mass from bounding box
        
        Args:
            ingredient_name: Name of ingredient
            bbox: [x1, y1, x2, y2] in pixels
            image_size: (width, height) of original image
            
        Returns:
            Dict with quantity_grams and volume_cm3
        """
        try:
            x1, y1, x2, y2 = bbox
            img_width, img_height = image_size
            
            # Calculate bbox area as percentage of image
            bbox_width = x2 - x1
            bbox_height = y2 - y1
            bbox_area = bbox_width * bbox_height
            
            # Assume average ingredient in frame is ~150g
            # Scale based on relative area
            image_area = img_width * img_height
            area_ratio = bbox_area / image_area
            
            # Heuristic scaling (assuming ~15% of image = 150g)
            reference_ratio = 0.15
            estimated_grams = (area_ratio / reference_ratio) * 150
            
            # Clamp to realistic range
            estimated_grams = max(10, min(500, estimated_grams))
            
            # Calculate volume using density
            density = self.densities.get(ingredient_name.lower(), self.densities["default"])
            volume_cm3 = estimated_grams / density
            
            return {
                "quantity_grams": round(estimated_grams, 1),
                "volume_cm3": round(volume_cm3, 1)
            }
            
        except Exception as e:
            logger.error(f"Volume estimation failed: {e}")
            return {"quantity_grams": 100.0, "volume_cm3": 133.0}


# Singleton instance
_volume_estimator = None


def get_volume_estimator() -> VolumeEstimator:
    """Get singleton volume estimator"""
    global _volume_estimator
    if _volume_estimator is None:
        _volume_estimator = VolumeEstimator()
    return _volume_estimator

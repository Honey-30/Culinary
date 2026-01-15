"""CNN-based freshness estimation using visual features"""
import logging
from typing import Dict
import numpy as np
from PIL import Image
import cv2
from skimage import color, feature

logger = logging.getLogger(__name__)


class FreshnessEstimator:
    """Estimate freshness using color and texture analysis"""
    
    def __init__(self):
        self._initialized = False
    
    def load(self):
        """Initialize estimator"""
        if self._initialized:
            return
        logger.info("Freshness estimator initialized")
        self._initialized = True
    
    def estimate(self, image: Image.Image, bbox: list = None) -> Dict[str, float]:
        """
        Estimate freshness score and expiry
        
        Args:
            image: PIL Image
            bbox: Optional bounding box [x1, y1, x2, y2]
            
        Returns:
            Dict with freshness_score (0-1) and expires_in_days
        """
        if not self._initialized:
            self.load()
        
        try:
            # Crop to bbox if provided
            if bbox:
                x1, y1, x2, y2 = [int(x) for x in bbox]
                img = image.crop((x1, y1, x2, y2))
            else:
                img = image
            
            # Convert to numpy
            img_array = np.array(img)
            
            # Color-based freshness heuristics
            color_score = self._analyze_color(img_array)
            
            # Texture-based analysis
            texture_score = self._analyze_texture(img_array)
            
            # Combined score
            freshness_score = 0.6 * color_score + 0.4 * texture_score
            
            # Estimate days to consume (heuristic)
            expires_in_days = int(freshness_score * 7)  # 0-7 days based on freshness
            
            return {
                "freshness_score": round(freshness_score, 2),
                "expires_in_days": max(1, expires_in_days)
            }
            
        except Exception as e:
            logger.error(f"Freshness estimation failed: {e}")
            return {"freshness_score": 0.7, "expires_in_days": 3}  # Safe default
    
    def _analyze_color(self, img: np.ndarray) -> float:
        """Analyze color vibrancy (higher = fresher)"""
        try:
            # Convert to LAB color space
            if len(img.shape) == 2:  # Grayscale
                return 0.5
            
            img_lab = color.rgb2lab(img / 255.0)
            
            # Higher L* and saturation indicate freshness
            lightness = np.mean(img_lab[:, :, 0])
            saturation = np.std(img_lab[:, :, 1:])
            
            # Normalize to 0-1
            score = min(1.0, (lightness / 100) * 0.5 + (saturation / 50) * 0.5)
            return score
            
        except Exception:
            return 0.7
    
    def _analyze_texture(self, img: np.ndarray) -> float:
        """Analyze texture smoothness (smoother = fresher)"""
        try:
            # Convert to grayscale
            if len(img.shape) == 3:
                gray = cv2.cvtColor(img, cv2.COLOR_RGB2GRAY)
            else:
                gray = img
            
            # Compute local binary pattern variance (lower = smoother)
            lbp = feature.local_binary_pattern(gray, 8, 1, method='uniform')
            variance = np.var(lbp)
            
            # Inverse relationship (lower variance = fresher)
            score = max(0, 1 - (variance / 100))
            return score
            
        except Exception:
            return 0.7


# Singleton instance
_estimator_instance = None


def get_freshness_estimator() -> FreshnessEstimator:
    """Get singleton estimator instance"""
    global _estimator_instance
    if _estimator_instance is None:
        _estimator_instance = FreshnessEstimator()
        _estimator_instance.load()
    return _estimator_instance

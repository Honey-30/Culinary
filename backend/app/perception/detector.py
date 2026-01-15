"""YOLOv8-based ingredient detection"""
import logging
from typing import List, Dict, Any
from pathlib import Path
import numpy as np
from PIL import Image
from ultralytics import YOLO

logger = logging.getLogger(__name__)


class IngredientDetector:
    """YOLOv8-based object detector for food items"""
    
    def __init__(self, model_path: str = "yolov8n.pt"):
        """Initialize detector with pretrained YOLOv8"""
        self.model = None
        self.model_path = model_path
        self._initialized = False
    
    def load(self):
        """Load model once at startup"""
        if self._initialized:
            return
        
        try:
            logger.info(f"Loading YOLOv8 model: {self.model_path}")
            self.model = YOLO(self.model_path)
            self.model.to('cpu')  # CPU-safe default
            self._initialized = True
            logger.info("YOLOv8 model loaded successfully")
        except Exception as e:
            logger.error(f"Failed to load YOLOv8: {e}")
            raise
    
    def detect(self, image: Image.Image, conf_threshold: float = 0.25) -> List[Dict[str, Any]]:
        """
        Detect ingredients in image
        
        Args:
            image: PIL Image
            conf_threshold: Confidence threshold
            
        Returns:
            List of detections with bounding boxes
        """
        if not self._initialized:
            self.load()
        
        try:
            # Run inference
            results = self.model(image, conf=conf_threshold, verbose=False)
            
            detections = []
            for result in results:
                boxes = result.boxes
                for i in range(len(boxes)):
                    box = boxes[i]
                    class_id = int(box.cls[0])
                    confidence = float(box.conf[0])
                    xyxy = box.xyxy[0].cpu().numpy()
                    
                    # Map COCO classes to ingredient names (food-related only)
                    ingredient_name = self._map_class_to_ingredient(class_id)
                    if ingredient_name:
                        detections.append({
                            "name": ingredient_name,
                            "confidence": confidence,
                            "bbox": xyxy.tolist(),
                            "class_id": class_id
                        })
            
            logger.info(f"Detected {len(detections)} ingredients")
            return detections
            
        except Exception as e:
            logger.error(f"Detection failed: {e}")
            return []
    
    def _map_class_to_ingredient(self, class_id: int) -> str:
        """Map COCO class IDs to ingredient names"""
        # COCO dataset food-related classes
        food_classes = {
            46: "banana",
            47: "apple",
            48: "sandwich",
            49: "orange",
            50: "broccoli",
            51: "carrot",
            52: "hot_dog",
            53: "pizza",
            54: "donut",
            55: "cake",
        }
        return food_classes.get(class_id, None)


# Singleton instance
_detector_instance = None


def get_detector() -> IngredientDetector:
    """Get singleton detector instance"""
    global _detector_instance
    if _detector_instance is None:
        _detector_instance = IngredientDetector()
        _detector_instance.load()
    return _detector_instance

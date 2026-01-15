"""
Gemini Adapter - Non-breaking wrapper for ML perception output

⚠️ CRITICAL: This module WRAPS existing Gemini logic without modifying it.
The Gemini service must believe data was always structured this way.
"""
import logging
from typing import Dict, Any, List

logger = logging.getLogger(__name__)


def prepare_gemini_input(perception_output: Dict[str, Any], user_config: Dict[str, Any]) -> Dict[str, Any]:
    """
    Adapt ML perception output to Gemini-compatible format
    
    This function transforms the structured ML output into the exact format
    that the existing Gemini service expects, ensuring zero breaking changes.
    
    Args:
        perception_output: Output from run_perception_pipeline()
        user_config: User preferences (cuisine, dietary constraints)
        
    Returns:
        Gemini-compatible structured data
        
    Example Input (perception_output):
        {
            "inventory": [
                {
                    "name": "apple",
                    "quantity": "150g",
                    "confidence": 94.5,
                    "freshness": 85.0,
                    ...
                }
            ],
            "metadata": {...}
        }
    
    Example Output (for Gemini):
        {
            "ingredients": [...],
            "context": {
                "cuisine": "Italian",
                "dietary": {...}
            }
        }
    """
    try:
        # Extract ingredients from perception output
        ingredients = perception_output.get("inventory", [])
        
        # Transform to Gemini's expected format
        # The existing Gemini service expects ingredients with these exact keys
        gemini_ingredients = []
        
        for item in ingredients:
            gemini_ingredient = {
                "name": item.get("name", "unknown"),
                "quantity": item.get("quantity", "unknown"),
                "confidence": item.get("confidence", 0),
                "freshness": item.get("freshness", 70),
                "category": item.get("category", "produce"),
                "scientificName": item.get("scientificName", ""),
                "estimatedMass": item.get("estimatedMass", ""),
                "boundingBox": item.get("boundingBox", []),
                "daysToConsume": item.get("daysToConsume", 3)
            }
            gemini_ingredients.append(gemini_ingredient)
        
        # Package with user context
        gemini_payload = {
            "inventory": gemini_ingredients,
            "context": {
                "cuisine": user_config.get("cuisine", "Global/Fusion"),
                "dietary": user_config.get("dietary", {}),
                "source": "ml_perception",  # Metadata for debugging
                "model_version": perception_output.get("metadata", {}).get("model_version", "unknown")
            }
        }
        
        logger.info(f"Prepared Gemini input with {len(gemini_ingredients)} ingredients")
        return gemini_payload
        
    except Exception as e:
        logger.error(f"Gemini adapter failed: {e}")
        # Return safe fallback
        return {
            "inventory": [],
            "context": user_config,
            "error": str(e)
        }


def create_fallback_gemini_input(error_message: str, user_config: Dict[str, Any]) -> Dict[str, Any]:
    """
    Create fallback input when ML perception fails
    
    This ensures the frontend can still call Gemini with the original image-based
    approach if ML inference fails.
    
    Args:
        error_message: Reason for fallback
        user_config: User preferences
        
    Returns:
        Minimal Gemini input indicating fallback mode
    """
    return {
        "inventory": [],
        "context": {
            **user_config,
            "fallback_mode": True,
            "fallback_reason": error_message
        }
    }


def validate_gemini_output(gemini_response: Dict[str, Any]) -> bool:
    """
    Validate that Gemini's response matches expected schema
    
    This is a safety check to ensure Gemini adapter is working correctly.
    
    Args:
        gemini_response: Response from Gemini API
        
    Returns:
        True if valid, False otherwise
    """
    try:
        # Check required keys exist
        required_keys = ["inventory"]
        for key in required_keys:
            if key not in gemini_response:
                logger.error(f"Missing required key: {key}")
                return False
        
        # Validate inventory structure
        inventory = gemini_response["inventory"]
        if not isinstance(inventory, list):
            logger.error("Inventory must be a list")
            return False
        
        # Validate each ingredient has minimum required fields
        for item in inventory:
            if not isinstance(item, dict):
                return False
            if "name" not in item:
                logger.error("Ingredient missing 'name' field")
                return False
        
        return True
        
    except Exception as e:
        logger.error(f"Validation failed: {e}")
        return False

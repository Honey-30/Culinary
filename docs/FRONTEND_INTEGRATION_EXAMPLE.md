"""
OPTIONAL Frontend Integration Example

This shows how the frontend CAN optionally call the ML backend
instead of sending images directly to Gemini.

⚠️ This is NOT required - the frontend works perfectly without it.
This is just to demonstrate how to use the backend if deployed.
"""

// In services/geminiService.ts (OPTIONAL ENHANCEMENT - NOT REQUIRED)

// Add this NEW function (don't modify existing ones)
export const analyzeImageWithML = async (base64Data: string): Promise<Ingredient[]> => {
  try {
    // Check if backend is available
    const BACKEND_URL = process.env.VITE_ML_BACKEND_URL || 'http://localhost:8000';
    
    // Convert base64 to blob
    const blob = await fetch(`data:image/jpeg;base64,${base64Data}`).then(r => r.blob());
    
    // Create form data
    const formData = new FormData();
    formData.append('file', blob, 'image.jpg');
    
    // Call ML backend
    const response = await fetch(`${BACKEND_URL}/api/perception/analyze`, {
      method: 'POST',
      body: formData
    });
    
    if (!response.ok) {
      throw new Error('ML backend failed');
    }
    
    const data = await response.json();
    return data.inventory || [];
    
  } catch (error) {
    console.warn('ML backend unavailable, falling back to Gemini Vision');
    // Fallback to existing Gemini Vision
    return null; // Signal to use Gemini Vision
  }
};

// Usage in existing analyzeFridgeImage function (OPTIONAL):
export const analyzeFridgeImage = async (base64Data: string): Promise<Ingredient[]> => {
  // Try ML backend first (if available)
  const mlResult = await analyzeImageWithML(base64Data);
  if (mlResult) {
    return mlResult;
  }
  
  // Otherwise use existing Gemini Vision (unchanged)
  return callWithRetry(async () => {
    const ai = getClient();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: { parts: [{ inlineData: { mimeType: 'image/jpeg', data: base64Data } }, { text: "Analyze inventory. Return JSON manifest." }] },
      config: { responseMimeType: "application/json" }
    });
    return JSON.parse(response.text).inventory || [];
  }, 2, 1000, "Vision Analysis");
};

// Add environment variable to .env.local:
// VITE_ML_BACKEND_URL=http://localhost:8000

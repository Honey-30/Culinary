
import { GoogleGenAI, Type, Schema, Chat, Modality } from "@google/genai";
import { Ingredient, Recipe, DietaryConfig, BeveragePairing, AffinityResult } from "../types";

let dynamicKey = process.env.API_KEY || '';

let dietaryConfig: DietaryConfig = {
  vegan: false,
  vegetarian: false,
  glutenFree: false,
  keto: false,
  paleo: false,
  allergies: '',
  zeroWaste: false
};

if (typeof window !== 'undefined') {
  const storedKey = sessionStorage.getItem('culinary_lens_key');
  if (storedKey) dynamicKey = storedKey;
  
  const storedDiet = localStorage.getItem('culinary_lens_diet');
  if (storedDiet) {
    try {
      dietaryConfig = JSON.parse(storedDiet);
    } catch (e) {
      console.error("Failed to parse dietary config");
    }
  }
}

export const setGlobalApiKey = (key: string) => {
  dynamicKey = key;
  sessionStorage.setItem('culinary_lens_key', key);
};

export const getApiKey = () => dynamicKey;

export const setDietaryConfig = (config: DietaryConfig) => {
  dietaryConfig = config;
  localStorage.setItem('culinary_lens_diet', JSON.stringify(config));
};

export const getDietaryConfig = () => dietaryConfig;

export const saveRecipeToHistory = (recipe: Recipe) => {
  try {
    const history = getRecipeHistory();
    if (!recipe.id) recipe.id = crypto.randomUUID();
    const existingEntry = history.find(h => h.id === recipe.id);
    const completedRecipe = {
      ...recipe,
      id: recipe.id,
      completedAt: existingEntry?.completedAt || recipe.completedAt || Date.now()
    };
    const filteredHistory = history.filter(h => h.id !== recipe.id);
    const newHistory = [completedRecipe, ...filteredHistory].slice(0, 50);
    localStorage.setItem('culinary_lens_history', JSON.stringify(newHistory));
  } catch (e) {
    console.error("Failed to save history", e);
  }
};

export const getRecipeHistory = (): Recipe[] => {
  try {
    const json = localStorage.getItem('culinary_lens_history');
    return json ? JSON.parse(json) : [];
  } catch (e) {
    return [];
  }
};

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

function mapError(error: any, context: string): Error {
  const msg = (error.message || '').toLowerCase();
  console.error(`[Gemini Service Error] ${context}:`, error);
  if (msg.includes('401') || msg.includes('api key not valid')) return new Error("Invalid API Key.");
  if (msg.includes('429')) return new Error("System overload. Retrying...");
  return new Error(`${context} failed.`);
}

async function callWithRetry<T>(fn: () => Promise<T>, retries = 3, initialDelay = 1000, contextStr = "Operation"): Promise<T> {
  let attempt = 0;
  while (attempt <= retries) {
    try {
      return await fn();
    } catch (error: any) {
      attempt++;
      if (attempt > retries) throw mapError(error, contextStr);
      await wait(initialDelay);
      initialDelay *= 2;
    }
  }
  throw new Error(`${contextStr} failed.`);
}

const getClient = () => {
  if (!dynamicKey) throw new Error("API Key not configured.");
  return new GoogleGenAI({ apiKey: dynamicKey });
};

export const calculateMolecularAffinity = async (ingredients: string[]): Promise<AffinityResult> => {
  return callWithRetry(async () => {
    const ai = getClient();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Calculate molecular affinity for: ${ingredients.join(', ')}. Return JSON with score (0-100), rationale, and bridgingIngredients.`,
      config: { 
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER },
            rationale: { type: Type.STRING },
            bridgingIngredients: { type: Type.ARRAY, items: { type: Type.STRING } }
          }
        }
      }
    });
    return JSON.parse(response.text);
  }, 1, 1000, "Molecular Calculation");
};

export const analyzeFridgeImage = async (base64Data: string): Promise<Ingredient[]> => {
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

const RECIPE_CATALOG_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    protocols: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          ingredients: { type: Type.ARRAY, items: { type: Type.STRING } },
          missingIngredients: { type: Type.ARRAY, items: { type: Type.STRING } },
          molecularSubstitutions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                target: { type: Type.STRING },
                substitute: { type: Type.STRING },
                rationale: { type: Type.STRING },
                chemicalLink: { type: Type.STRING }
              }
            }
          },
          economicImpact: {
            type: Type.OBJECT,
            properties: {
              savingsValue: { type: Type.STRING },
              wasteReduction: { type: Type.STRING }
            }
          },
          instructions: { type: Type.ARRAY, items: { type: Type.STRING } },
          matchScore: { type: Type.NUMBER },
          scientificRationale: { type: Type.STRING },
          prepTime: { type: Type.STRING },
          difficulty: { type: Type.STRING, enum: ["Easy", "Medium", "Hard"] },
          flavorProfile: {
            type: Type.OBJECT,
            properties: {
              umami: { type: Type.NUMBER }, sweet: { type: Type.NUMBER }, sour: { type: Type.NUMBER }, 
              salty: { type: Type.NUMBER }, bitter: { type: Type.NUMBER }, spicy: { type: Type.NUMBER }
            }
          },
          beveragePairing: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              type: { type: Type.STRING, enum: ['Wine', 'Beer', 'Cocktail', 'Non-Alcoholic'] },
              description: { type: Type.STRING }
            }
          },
          platingTips: { type: Type.STRING },
          miseEnPlace: { type: Type.ARRAY, items: { type: Type.STRING } },
          nutrients: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: { name: { type: Type.STRING }, amount: { type: Type.NUMBER }, unit: { type: Type.STRING } }
            }
          }
        },
        required: ["title", "ingredients", "instructions", "scientificRationale", "flavorProfile", "economicImpact"]
      }
    }
  },
  required: ["protocols"]
};

export const generateScientificRecipes = async (ingredients: Ingredient[], cuisine: string, overrideDiet?: DietaryConfig): Promise<Recipe[]> => {
  return callWithRetry(async () => {
    const ai = getClient();
    const prompt = `Synthesize 2 ${cuisine} protocols for: ${ingredients.map(i => i.name).join(', ')}. Include molecular substitutions and economic impact.`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview', 
      contents: prompt,
      config: {
        systemInstruction: "You are a Computational Gastronomist. Focus on molecular pairings and zero-waste impact.",
        tools: [{googleSearch: {}}],
        responseMimeType: "application/json",
        responseSchema: RECIPE_CATALOG_SCHEMA
      }
    });

    const recipes = JSON.parse(response.text).protocols || [];
    recipes.forEach(r => { if (!r.id) r.id = crypto.randomUUID(); });
    return recipes;
  }, 3, 2000, "Protocol Synthesis");
};

export const generateDishImage = async (recipe: Recipe): Promise<string> => {
  return callWithRetry(async () => {
    const ai = getClient();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [{ text: `Professional plating of ${recipe.title}. Michelin style.` }] },
      config: { imageConfig: { aspectRatio: "16:9" } }
    });
    const part = response.candidates[0].content.parts.find(p => p.inlineData);
    return part ? `data:image/png;base64,${part.inlineData.data}` : '';
  }, 1, 1000, "Rendering");
};

export const generateBlueprint = async (recipe: Recipe): Promise<string> => {
  return callWithRetry(async () => {
    const ai = getClient();
    const prompt = `Minimalist flat-lay schematic blueprint of a kitchen counter for "${recipe.title}". Show tools and ingredients. Architectural style.`;
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [{ text: prompt }] },
      config: { imageConfig: { aspectRatio: "16:9" } }
    });
    const part = response.candidates[0].content.parts.find(p => p.inlineData);
    return part ? `data:image/png;base64,${part.inlineData.data}` : '';
  }, 1, 1000, "Blueprint Synthesis");
};

export const validateCookingStep = async (imageBase64: string, instruction: string): Promise<any> => {
  const ai = getClient();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: { parts: [{ inlineData: { mimeType: 'image/jpeg', data: imageBase64 } }, { text: `Evaluate step: ${instruction}` }] },
    config: { responseMimeType: "application/json" }
  });
  return JSON.parse(response.text);
};

export const playTextToSpeech = async (text: string) => {
  const ai = getClient();
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text: text }] }],
    config: { responseModalities: [Modality.AUDIO] },
  });
  const data = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  if (data) {
    const audioContext = new AudioContext();
    const buffer = await decodeAudioData(decode(data), audioContext, 24000, 1);
    const source = audioContext.createBufferSource();
    source.buffer = buffer;
    source.connect(audioContext.destination);
    source.start();
  }
};

const decode = (base64: string) => {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);
  return bytes;
};

async function decodeAudioData(data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const buffer = ctx.createBuffer(numChannels, dataInt16.length / numChannels, sampleRate);
  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < channelData.length; i++) channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
  }
  return buffer;
}

export const getRecipeChatSession = (recipe: Recipe): Chat => {
  const ai = getClient();
  return ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: { systemInstruction: `You are the Neural Sous Chef for "${recipe.title}".` }
  });
};

export const validateApiKey = async (key: string): Promise<boolean> => {
  try {
    const tempAi = new GoogleGenAI({ apiKey: key });
    await tempAi.models.generateContent({ model: 'gemini-3-flash-preview', contents: 'Ping' });
    return true;
  } catch (e) { return false; }
};

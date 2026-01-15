
export interface Ingredient {
  name: string;
  quantity: string;
  confidence: number;
  freshness: number; // 0-100
  category: string;
  scientificName?: string;
  estimatedMass?: string; 
  boundingBox?: number[]; 
  daysToConsume?: number; 
}

export interface AffinityResult {
  score: number;
  rationale: string;
  bridgingIngredients: string[];
}

export interface Recipe {
  id?: string;
  completedAt?: number;
  title: string;
  description: string;
  ingredients: string[]; 
  missingIngredients: string[];
  molecularSubstitutions?: MolecularSubstitution[];
  economicImpact?: {
    savingsValue: string; 
    wasteReduction: string;
  }; 
  instructions: string[];
  matchScore: number;
  scientificRationale: string;
  prepTime: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  nutrients: Nutrient[];
  flavorProfile: FlavorProfile;
  webSources?: string[];
  beveragePairing: BeveragePairing;
  beverageImageUrl?: string;
  platingTips: string;
  miseEnPlace: string[];
  imageUrl?: string;
  blueprintImageUrl?: string; 
}

export interface Nutrient {
  name: string;
  amount: number;
  unit: string;
}

export interface FlavorProfile {
  umami: number; 
  sweet: number;
  sour: number;
  salty: number;
  bitter: number;
  spicy: number;
}

export interface BeveragePairing {
  name: string;
  type: 'Wine' | 'Beer' | 'Cocktail' | 'Non-Alcoholic';
  description: string;
}

export interface MolecularSubstitution {
  target: string;
  substitute: string;
  rationale: string;
  chemicalLink: string; 
}

export interface AnalysisState {
  status: 'idle' | 'scanning' | 'analyzing' | 'complete' | 'error';
  message: string;
}

export interface DietaryConfig {
  vegan: boolean;
  vegetarian: boolean;
  glutenFree: boolean;
  keto: boolean;
  paleo: boolean;
  allergies: string;
  zeroWaste: boolean;
}

export enum ViewState {
  LANDING = 'LANDING',
  UPLOAD = 'UPLOAD',
  ANALYSIS = 'ANALYSIS',
  PREFERENCES = 'PREFERENCES',
  DASHBOARD = 'DASHBOARD',
  SETTINGS = 'SETTINGS',
  EXECUTION = 'EXECUTION',
  SANDBOX = 'SANDBOX'
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

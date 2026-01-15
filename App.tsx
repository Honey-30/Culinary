
import React, { useState, useEffect } from 'react';
import { ViewState, AnalysisState, Ingredient, Recipe, DietaryConfig } from './types';
import { Analyzer } from './components/Analyzer';
import { Dashboard } from './components/Dashboard';
import { TerminalFeed } from './components/TerminalFeed';
import { Settings } from './components/Settings';
import { ExecutionMode } from './components/ExecutionMode';
import { CuisineSelector } from './components/CuisineSelector';
import { LandingPage } from './components/LandingPage';
import { MolecularSandbox } from './components/MolecularSandbox';
import { analyzeFridgeImage, generateScientificRecipes, getApiKey } from './services/geminiService';
import { Hexagon, Menu, Settings as SettingsIcon, X, ExternalLink, Github, Book } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const VISION_LOGS = [
  "Initializing Multimodal Interface...",
  "Uploading Context to Gemini 3 Flash (2M Context Window)...",
  "Processing Visual Stream (Spatial Reasoning Enabled)...",
  "Extracting Bounding Boxes & Segmentation Masks (JSON Mode)...",
  "Calculating Volumetric Density via Depth Map...",
  "Verifying Freshness Index..."
];

const SYNTHESIS_LOGS = [
  "Aligning Culinary Vector with Selected Cuisine...",
  "Applying Bio-Protocol Constraints...",
  "Loading FlavorGraph.csv into Context...",
  "Connecting to Google Search Grounding for Trends...",
  "Synthesizing Molecular Pairings...",
  "Finalizing Liquid Glass Render..."
];

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>(ViewState.LANDING);
  const [analysisState, setAnalysisState] = useState<AnalysisState>({ status: 'idle', message: '' });
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [activeRecipe, setActiveRecipe] = useState<Recipe | null>(null);
  const [activeLogs, setActiveLogs] = useState<string[]>(VISION_LOGS);
  const [showMenu, setShowMenu] = useState(false);

  const handleImageSelected = async (file: File) => {
    if (!getApiKey()) {
      setView(ViewState.SETTINGS);
      return;
    }
    try {
      setActiveLogs(VISION_LOGS);
      setView(ViewState.ANALYSIS);
      setAnalysisState({ status: 'scanning', message: 'Initializing Cognitive Vision...' });
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const base64Image = (reader.result as string).split(',')[1];
        const detectedIngredients = await analyzeFridgeImage(base64Image);
        setIngredients(detectedIngredients);
        setAnalysisState({ status: 'idle', message: '' });
        setView(ViewState.PREFERENCES);
      };
    } catch (error) {
      console.error(error);
      setView(ViewState.UPLOAD);
    }
  };

  const handleGenerateRecipes = async (cuisine: string, diet: DietaryConfig, selectedIngredients: Ingredient[]) => {
    try {
      setActiveLogs(SYNTHESIS_LOGS);
      setView(ViewState.ANALYSIS);
      const generatedRecipes = await generateScientificRecipes(selectedIngredients, cuisine, diet);
      setRecipes(generatedRecipes);
      setView(ViewState.DASHBOARD);
    } catch (error) { console.error(error); setView(ViewState.PREFERENCES); }
  };

  const handleReset = () => { setIngredients([]); setRecipes([]); setView(ViewState.UPLOAD); };

  return (
    <div className="min-h-screen font-sans">
      <AnimatePresence>
        {view !== ViewState.EXECUTION && view !== ViewState.LANDING && (
          <motion.nav initial={{ y: -100 }} animate={{ y: 0 }} exit={{ y: -100 }} className="fixed top-0 left-0 right-0 z-50 w-full px-8 py-6 flex justify-between items-center bg-white/50 backdrop-blur-md border-b border-white/20">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => setView(ViewState.UPLOAD)}>
              <div className="w-10 h-10 rounded-xl bg-obsidian flex items-center justify-center shadow-premium"><Hexagon className="text-white w-5 h-5" strokeWidth={1.5} /></div>
              <span className="text-xl font-serif font-bold tracking-tight text-obsidian">CulinaryLens</span>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => setView(ViewState.SETTINGS)} className="w-10 h-10 rounded-full border border-black/5 flex items-center justify-center hover:bg-black/5 text-obsidian"><SettingsIcon className="w-5 h-5" /></button>
              <button onClick={() => setShowMenu(true)} className="w-10 h-10 rounded-full border border-black/5 flex items-center justify-center hover:bg-black/5"><Menu className="w-5 h-5 text-obsidian" /></button>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>

      <main className={`relative min-h-screen flex flex-col items-center justify-center ${view !== ViewState.EXECUTION && view !== ViewState.LANDING ? 'pt-24' : ''}`}>
        <AnimatePresence mode='wait'>
          {view === ViewState.LANDING ? (
            <LandingPage key="lp" onEnter={() => setView(ViewState.UPLOAD)} />
          ) : view === ViewState.DASHBOARD ? (
            <Dashboard 
              key="db" 
              ingredients={ingredients} 
              recipes={recipes} 
              onReset={handleReset} 
              onStartCooking={(r) => { setActiveRecipe(r); setView(ViewState.EXECUTION); }} 
              onOpenSandbox={() => setView(ViewState.SANDBOX)}
            />
          ) : view === ViewState.SANDBOX ? (
            <MolecularSandbox key="sb" inventory={ingredients} onBack={() => setView(ViewState.DASHBOARD)} />
          ) : view === ViewState.ANALYSIS ? (
            <TerminalFeed key="tf" customLogs={activeLogs} />
          ) : view === ViewState.PREFERENCES ? (
             <CuisineSelector key="cs" detectedIngredients={ingredients} onGenerate={handleGenerateRecipes} />
          ) : view === ViewState.SETTINGS ? (
            <Settings key="st" onBack={() => setView(ViewState.UPLOAD)} />
          ) : view === ViewState.EXECUTION && activeRecipe ? (
            <ExecutionMode 
              key="ex" 
              recipe={activeRecipe} 
              onExit={() => setView(ViewState.DASHBOARD)} 
              onComplete={() => setView(ViewState.DASHBOARD)}
            />
          ) : (
            <Analyzer key="az" onImageSelected={handleImageSelected} analysisState={analysisState} />
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default App;

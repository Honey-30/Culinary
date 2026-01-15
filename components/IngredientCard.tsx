
import React from 'react';
import { Ingredient } from '../types';
import { motion } from 'framer-motion';
import { Activity, Scale, Box, BadgeCheck, Clock, AlertTriangle, ShieldCheck, Target } from 'lucide-react';

interface Props {
  ingredient: Ingredient;
  delay: number;
}

const getIconForIngredient = (name: string, category: string): string => {
  const n = name.toLowerCase();
  const c = category.toLowerCase();
  
  // FRUITS
  if (n.includes('apple')) return '🍎';
  if (n.includes('banana')) return '🍌';
  if (n.includes('pear')) return '🍐';
  if (n.includes('orange') || n.includes('tangerine') || n.includes('mandarin') || n.includes('citrus')) return '🍊';
  if (n.includes('lemon')) return '🍋';
  if (n.includes('lime')) return '🍋'; // Close enough
  if (n.includes('grape')) return '🍇';
  if (n.includes('watermelon')) return '🍉';
  if (n.includes('melon') || n.includes('cantaloupe')) return '🍈';
  if (n.includes('strawberry') || n.includes('berry') || n.includes('raspberry')) return '🍓';
  if (n.includes('cherry')) return '🍒';
  if (n.includes('peach') || n.includes('nectarine') || n.includes('apricot')) return '🍑';
  if (n.includes('mango')) return '🥭';
  if (n.includes('pineapple')) return '🍍';
  if (n.includes('coconut')) return '🥥';
  if (n.includes('kiwi')) return '🥝';
  if (n.includes('avocado')) return '🥑';
  if (n.includes('olive')) return '🫒';

  // VEGETABLES
  if (n.includes('tomato')) return '🍅';
  if (n.includes('carrot')) return '🥕';
  if (n.includes('corn') || n.includes('maize')) return '🌽';
  if (n.includes('pepper') || n.includes('chili') || n.includes('jalapeno') || n.includes('capsicum')) return '🌶️';
  if (n.includes('cucumber') || n.includes('zucchini')) return '🥒';
  if (n.includes('lettuce') || n.includes('spinach') || n.includes('kale') || n.includes('cabbage') || n.includes('green') || n.includes('salad')) return '🥬';
  if (n.includes('broccoli')) return '🥦';
  if (n.includes('onion') || n.includes('leek') || n.includes('shallot') || n.includes('scallion')) return '🧅';
  if (n.includes('garlic')) return '🧄';
  if (n.includes('potato') || n.includes('yam') || n.includes('tuber')) return '🥔';
  if (n.includes('mushroom') || n.includes('fungi')) return '🍄';
  if (n.includes('eggplant') || n.includes('aubergine')) return '🍆';
  if (n.includes('pumpkin') || n.includes('squash')) return '🎃';
  if (n.includes('sweet potato')) return '🍠';
  if (n.includes('bean') || n.includes('pea') || n.includes('legume')) return '🫛';

  // DAIRY & EGGS
  if (n.includes('milk') || n.includes('cream')) return '🥛';
  if (n.includes('cheese') || n.includes('cheddar') || n.includes('mozzarella') || n.includes('parmesan')) return '🧀';
  if (n.includes('butter') || n.includes('margarine')) return '🧈';
  if (n.includes('egg')) return '🥚';
  if (n.includes('yogurt')) return '🥣';

  // MEAT & PROTEIN
  if (n.includes('beef') || n.includes('steak') || n.includes('meat')) return '🥩';
  if (n.includes('chicken') || n.includes('turkey') || n.includes('poultry') || n.includes('duck')) return '🍗';
  if (n.includes('pork') || n.includes('ham') || n.includes('pig')) return '🐖'; 
  if (n.includes('bacon')) return '🥓';
  if (n.includes('sausage') || n.includes('hot dog') || n.includes('frank')) return '🌭';
  if (n.includes('burger') || n.includes('patty')) return '🍔';
  if (n.includes('fish') || n.includes('salmon') || n.includes('tuna') || n.includes('cod') || n.includes('trout')) return '🐟';
  if (n.includes('shrimp') || n.includes('lobster') || n.includes('prawn') || n.includes('crab') || n.includes('shellfish')) return '🦞';
  if (n.includes('oyster') || n.includes('clam') || n.includes('mussel')) return '🦪';
  if (n.includes('tofu') || n.includes('soy')) return '🧊'; 
  if (n.includes('nut') || n.includes('peanut') || n.includes('almond') || n.includes('cashew') || n.includes('walnut')) return '🥜';

  // GRAINS & BAKERY
  if (n.includes('bread') || n.includes('toast') || n.includes('loaf') || n.includes('bun')) return '🍞';
  if (n.includes('baguette')) return '🥖';
  if (n.includes('croissant')) return '🥐';
  if (n.includes('bagel')) return '🥯';
  if (n.includes('pancake')) return '🥞';
  if (n.includes('waffle')) return '🧇';
  if (n.includes('rice')) return '🍚';
  if (n.includes('pasta') || n.includes('noodle') || n.includes('spaghetti') || n.includes('macaroni')) return '🍝';
  if (n.includes('dumpling') || n.includes('wonton')) return '🥟';
  if (n.includes('pizza')) return '🍕';
  if (n.includes('cereal') || n.includes('oat') || n.includes('granola')) return '🥣';
  if (n.includes('sandwich')) return '🥪';
  if (n.includes('taco') || n.includes('burrito')) return '🌮';
  if (n.includes('fry') || n.includes('chip')) return '🍟';
  if (n.includes('pretzel')) return '🥨';

  // SWEETS & DESSERTS
  if (n.includes('chocolate') || n.includes('cocoa')) return '🍫';
  if (n.includes('candy') || n.includes('sweet') || n.includes('lolly')) return '🍬';
  if (n.includes('cookie') || n.includes('biscuit')) return '🍪';
  if (n.includes('cake') || n.includes('muffin') || n.includes('cupcake')) return '🍰';
  if (n.includes('donut') || n.includes('doughnut')) return '🍩';
  if (n.includes('ice cream') || n.includes('gelato')) return '🍨';
  if (n.includes('honey')) return '🍯';
  if (n.includes('popcorn')) return '🍿';
  if (n.includes('custard') || n.includes('pudding')) return '🍮';
  if (n.includes('pie')) return '🥧';

  // BEVERAGES
  if (n.includes('water')) return '💧';
  if (n.includes('juice')) return '🧃';
  if (n.includes('coffee') || n.includes('espresso') || n.includes('latte')) return '☕';
  if (n.includes('tea') || n.includes('matcha')) return '🍵';
  if (n.includes('wine') || n.includes('merlot') || n.includes('chardonnay')) return '🍷';
  if (n.includes('beer') || n.includes('lager') || n.includes('ale')) return '🍺';
  if (n.includes('cocktail') || n.includes('liquor') || n.includes('spirit') || n.includes('vodka') || n.includes('whiskey')) return '🥃';
  if (n.includes('champagne') || n.includes('prosecco')) return '🥂';
  if (n.includes('soda') || n.includes('coke') || n.includes('pop')) return '🥤';
  if (n.includes('milkshake')) return '🥤';

  // PANTRY & MISC
  if (n.includes('oil') || n.includes('vinegar') || n.includes('sauce') || n.includes('dressing') || n.includes('syrup')) return '🍾';
  if (n.includes('salt') || n.includes('sugar') || n.includes('flour') || n.includes('spice') || n.includes('herb') || n.includes('seasoning')) return '🧂';
  if (n.includes('sushi') || n.includes('maki')) return '🍣';
  if (n.includes('bento')) return '🍱';
  if (n.includes('curry')) return '🍛';
  if (n.includes('stew') || n.includes('soup')) return '🍲';

  // CATEGORY FALLBACKS
  if (c.includes('fruit')) return '🍎';
  if (c.includes('vegetable')) return '🥗';
  if (c.includes('meat') || c.includes('poultry') || c.includes('protein')) return '🍖';
  if (c.includes('seafood') || c.includes('fish')) return '🐟';
  if (c.includes('dairy')) return '🥛';
  if (c.includes('grain') || c.includes('bakery') || c.includes('carb')) return '🍞';
  if (c.includes('beverage') || c.includes('drink')) return '🥤';
  if (c.includes('snack') || c.includes('sweet') || c.includes('dessert')) return '🍪';
  if (c.includes('condiment') || c.includes('pantry') || c.includes('spice')) return '🧂';
  if (c.includes('prepared') || c.includes('meal')) return '🍱';

  return '📦';
};

export const IngredientCard: React.FC<Props> = ({ ingredient, delay }) => {
  const isFresh = ingredient.freshness > 70;
  const isSpoiled = ingredient.freshness < 40;
  const daysLeft = ingredient.daysToConsume ?? (isFresh ? 7 : isSpoiled ? 0 : 3);
  const isExpiringSoon = !isSpoiled && daysLeft < 3;
  
  const icon = getIconForIngredient(ingredient.name, ingredient.category);
  const confidencePct = Math.round((ingredient.confidence || 0.95) * 100);
  
  const getFreshnessColor = (val: number) => {
    if (val >= 70) return 'text-green-700 bg-green-50 border-green-200';
    if (val >= 40) return 'text-amber-700 bg-amber-50 border-amber-200';
    return 'text-red-700 bg-red-50 border-red-200';
  };

  const getConfidenceStyle = (val: number) => {
    if (val >= 90) return 'bg-green-50 text-green-700 border-green-100';
    if (val >= 70) return 'bg-amber-50 text-amber-700 border-amber-100';
    return 'bg-red-50 text-red-700 border-red-100';
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay * 0.05 + 0.2 }}
      className={`group relative p-4 rounded-[1.5rem] border backdrop-blur-sm transition-all duration-300 hover:shadow-lg flex flex-col justify-between
        ${isSpoiled 
          ? 'bg-red-50/80 border-red-200 hover:border-red-300' 
          : isExpiringSoon
            ? 'bg-amber-50/80 border-amber-200 hover:border-amber-300'
            : 'bg-white/60 border-white/60 hover:border-gold/30 hover:bg-white/90'
        }`}
    >
      {/* Visual Warning Badge for Expiring Items */}
      {isExpiringSoon && (
        <div className="absolute -top-2 -right-2 bg-amber-500 text-white p-1.5 rounded-full shadow-lg border-2 border-white animate-bounce z-10" style={{ animationDuration: '2s' }}>
          <AlertTriangle className="w-4 h-4" />
        </div>
      )}

      {/* Top Row: Icon and Category/Confidence */}
      <div className="flex justify-between items-start mb-3">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-white to-gray-50 shadow-sm border border-black/5 flex items-center justify-center text-2xl group-hover:scale-105 transition-transform duration-300">
           {icon}
        </div>
        
        <div className="flex flex-col items-end gap-1.5">
          {/* AI Confidence Badge */}
          <div className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest border flex items-center gap-1 transition-colors ${getConfidenceStyle(confidencePct)}`}>
            {confidencePct >= 90 ? <BadgeCheck className="w-3 h-3" /> : <Target className="w-3 h-3" />}
            <span className="whitespace-nowrap">Cert: {confidencePct}%</span>
          </div>
          <span className="text-[9px] text-obsidian/30 font-bold uppercase tracking-widest leading-none">{ingredient.category}</span>
        </div>
      </div>
      
      {/* Name and Scientific Name */}
      <div className="mb-4">
        <div className="flex items-center justify-between gap-2 mb-0.5">
           <h3 className="font-serif font-bold text-obsidian text-lg md:text-xl leading-tight truncate max-w-[70%]">
             {ingredient.name}
           </h3>
           <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border shrink-0 ${getFreshnessColor(ingredient.freshness)}`}>
             {ingredient.freshness}%
           </span>
        </div>
        <p className="text-[9px] text-obsidian/40 font-mono italic truncate">
          {ingredient.scientificName || 'Species unidentified'}
        </p>
      </div>
      
      {/* Metrics Grid */}
      <div className="bg-white/50 rounded-xl p-3 border border-black/5 space-y-2.5">
        
        {/* Quantity & Mass */}
        <div className="flex justify-between items-center pb-2 border-b border-black/5">
            <div className="flex items-center gap-2">
                <Box className="w-3.5 h-3.5 text-obsidian/60" />
                <div className="flex flex-col">
                    <span className="text-[8px] text-obsidian/40 uppercase tracking-widest font-bold leading-none mb-0.5">Qty</span>
                    <span className="text-xs font-bold text-obsidian leading-none">{ingredient.quantity}</span>
                </div>
            </div>
            {ingredient.estimatedMass && (
                <div className="flex items-center gap-2 text-right">
                    <div className="flex flex-col items-end">
                         <span className="text-[8px] text-obsidian/40 uppercase tracking-widest font-bold leading-none mb-0.5">Mass</span>
                         <span className="text-xs font-mono text-obsidian leading-none">{ingredient.estimatedMass}</span>
                    </div>
                    <Scale className="w-3.5 h-3.5 text-obsidian/60" />
                </div>
            )}
        </div>

        {/* Vitality Bar */}
        <div className="space-y-1">
            <div className="flex justify-between items-end">
                <span className="text-[9px] font-bold text-obsidian/50 uppercase tracking-widest flex items-center gap-1">
                   <Activity className="w-2.5 h-2.5" /> Vitality
                </span>
                <span className={`text-[9px] font-mono font-bold ${isSpoiled ? 'text-red-500' : isExpiringSoon ? 'text-amber-600' : 'text-green-600'}`}>
                    {ingredient.freshness}/100
                </span>
            </div>
            <div className="w-full h-1 bg-black/5 rounded-full overflow-hidden">
                <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${ingredient.freshness}%` }}
                    transition={{ duration: 1, delay: delay * 0.1 }}
                    className={`h-full rounded-full ${
                        isSpoiled 
                        ? 'bg-gradient-to-r from-red-400 to-red-600' 
                        : isExpiringSoon
                            ? 'bg-gradient-to-r from-amber-400 to-orange-500'
                            : 'bg-gradient-to-r from-green-400 to-emerald-500' 
                    }`} 
                />
            </div>
        </div>

        {/* Consumption Timeline */}
        <div className={`flex items-center gap-1.5 pt-0.5 ${
            isSpoiled ? 'text-red-600' : isExpiringSoon ? 'text-amber-600 font-bold' : 'text-obsidian/50'
        }`}>
            {isExpiringSoon ? <AlertTriangle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
            <span className="text-[10px] font-medium leading-none">
                {isSpoiled ? "Discard" : daysLeft <= 1 ? "NOW" : `${daysLeft}d left`}
            </span>
        </div>
      </div>
    </motion.div>
  );
};

'use client';

import Image from 'next/image';
import { useState, useMemo } from 'react';

// --- TypeScript Definitions ---
type ShopperTypeKey = 'Deal Hunter' | 'Brand Lover' | 'Impulse Buyer' | 'Planner' | 'The Explorer';

interface ShopperType {
  description: string;
  icon: string;
  details: string;
  color: string;
}

interface Option {
  text: string;
  pointsTo: ShopperTypeKey;
}

interface Question {
  text: string;
  options: Option[];
}

// --- Data ---
const shopperTypes: Record<ShopperTypeKey, ShopperType> = {
  'Deal Hunter': {
    description: 'You actively look for discounts and promotions. Your decisions are value-driven.',
    icon: '🏷️',
    details: 'You are attracted to limited-time offers, bundle deals (like Buy 1 Get 1 Free), and the 99 effect.',
    color: 'text-yellow-400'
  },
  'Brand Lover': {
    description: 'You prefer established, high-quality brands and are often visual-led in your decisions.',
    icon: '👑',
    details: 'You linger in the premium zone, focus on eye-level products, and value the power of packaging.',
    color: 'text-rose-400'
  },
  'Impulse Buyer': {
    description: 'You are often emotional and make unscheduled decisions based on emotions and social proof.',
    icon: '✨',
    details: 'You are highly susceptible to the checkout trap, sensory mood lighting, and convenient access.',
    color: 'text-cyan-400'
  },
  'Planner': {
    description: 'You have a predetermined shopping list and are efficient, rarely distracted by impulse.',
    icon: '📝',
    details: 'You follow a specific path, often go directly to hidden essentials, and use smaller baskets.',
    color: 'text-emerald-400'
  },
  'The Explorer': {
    description: 'You love discovering new products and treat shopping as a sensory adventure.',
    icon: '🧭',
    details: 'You wander without a strict plan, susceptible to the halo effect of fresh produce and creative aisle displays.',
    color: 'text-purple-400'
  }
};

// Each option now directly points to a specific shopper type!
const questions: Question[] = [
  {
    text: 'What is your usual priority when you start shopping?',
    options: [
      { text: 'Finding the best price and discounts', pointsTo: 'Deal Hunter' },
      { text: 'Getting my specific trusted brands', pointsTo: 'Brand Lover' },
      { text: 'Quickly grabbing what is on my list', pointsTo: 'Planner' },
      { text: 'Browsing to see what is new', pointsTo: 'The Explorer' }
    ]
  },
  {
    text: 'Do you make unscheduled purchases at the checkout counter?',
    options: [
      { text: 'Almost every time, I cannot resist', pointsTo: 'Impulse Buyer' },
      { text: 'Only if it is heavily discounted', pointsTo: 'Deal Hunter' },
      { text: 'Sometimes, if I see something interesting', pointsTo: 'The Explorer' },
      { text: 'Never, I stick strictly to the plan', pointsTo: 'Planner' }
    ]
  },
  {
    text: 'How do you react to a generic product that is much cheaper?',
    options: [
      { text: 'I always buy it to save money', pointsTo: 'Deal Hunter' },
      { text: 'I never buy it, I stick to my premium brand', pointsTo: 'Brand Lover' },
      { text: 'I will buy it on a whim just to try it out', pointsTo: 'Impulse Buyer' },
      { text: 'I carefully compare the ingredients first', pointsTo: 'Planner' }
    ]
  },
  {
    text: 'What kind of shopping cart do you grab first?',
    options: [
      { text: 'The largest cart, just in case', pointsTo: 'Impulse Buyer' },
      { text: 'A small basket to limit myself', pointsTo: 'Planner' },
      { text: 'Whatever looks clean and premium', pointsTo: 'Brand Lover' },
      { text: 'I just wander without a cart initially', pointsTo: 'The Explorer' }
    ]
  }
];

export default function Home() {
  // --- Simulator State ---
  const [strategyState, setStrategyState] = useState({
    produceEntrance: true,
    essentialsBack: true,
    checkoutCandies: true,
  });
  const [musicTempo, setMusicTempo] = useState<number>(30);

  // --- Dynamic SVG Path Generator ---
  const getShopperPath = () => {
    let path = "M 50 280 "; // Start at Entrance (Bottom Left)
    
    // 1. Produce Entrance
    if (strategyState.produceEntrance) {
      path += "C 10 230, 90 200, 50 150 "; // Meander and loop in the produce section
    } else {
      path += "L 50 150 "; // Walk straight past
    }

    // 2. Essentials at the Back
    if (strategyState.essentialsBack) {
      path += "L 150 150 L 150 70 L 250 70 L 250 150 "; // Walk deep into the store and around aisles
    } else {
      path += "L 250 150 "; // Cut across the front, skipping the back
    }

    // 3. Checkout Candies
    if (strategyState.checkoutCandies) {
      path += "L 350 150 L 320 200 L 360 240 L 350 280"; // Zig-zag and linger in the checkout line
    } else {
      path += "L 350 150 L 350 280"; // Walk straight to the exit
    }
    
    return path;
  };

  // Dynamic Spend Calculation (Simulated)
  const simulatedAverageSpend = useMemo(() => {
    let baseSpend = 1200;
    if (strategyState.produceEntrance) baseSpend += 350;
    if (strategyState.essentialsBack) baseSpend += 550;
    if (strategyState.checkoutCandies) baseSpend += 250;
    const musicImpact = (50 - musicTempo) * 5; 
    return baseSpend + musicImpact;
  }, [strategyState, musicTempo]);

  // --- Quiz State ---
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  
  // Track scores for all 5 types
  const [scores, setScores] = useState<Record<ShopperTypeKey, number>>({ 
    'Deal Hunter': 0, 
    'Brand Lover': 0, 
    'Impulse Buyer': 0, 
    'Planner': 0,
    'The Explorer': 0
  });
  const [showResult, setShowResult] = useState<boolean>(false);
  const [resultType, setResultType] = useState<ShopperTypeKey | null>(null);

  // --- Handlers ---
  const handleAnswer = (pointsTo: ShopperTypeKey) => {
    const newScores = { ...scores };
    // Add 1 point to the chosen category
    newScores[pointsTo] += 1;
    setScores(newScores);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      determineResult(newScores);
    }
  };

  const determineResult = (finalScores: Record<ShopperTypeKey, number>) => {
    let topType: ShopperTypeKey | null = null;
    let maxScore = -1;
    (Object.keys(finalScores) as ShopperTypeKey[]).forEach(type => {
      if (finalScores[type] > maxScore) { 
        maxScore = finalScores[type]; 
        topType = type; 
      }
    });
    setResultType(topType); 
    setShowResult(true);
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0); 
    setScores({ 'Deal Hunter': 0, 'Brand Lover': 0, 'Impulse Buyer': 0, 'Planner': 0, 'The Explorer': 0 }); 
    setShowResult(false); 
    setResultType(null);
  };

  return (
    <div className="min-h-screen bg-black text-gray-200 font-mono">
      {/* Header */}
      {/* <header className="bg-gray-950 p-6 text-center shadow-[0_10px_20px_rgba(0,0,0,0.5)] border-b-2 border-indigo-900 sticky top-0 z-50">
        <div className="relative w-full h-16 max-w-sm mx-auto mb-4">
          <div className="flex items-center justify-center w-full h-full bg-gray-900 text-indigo-300 italic rounded-md">
            [BrainMart Logo]
          </div>
        </div>
        <h1 className="text-3xl font-black mb-1 tracking-tighter text-white uppercase">The Consumer Brain</h1>
        <p className="text-sm opacity-90 text-indigo-300">How Marketing Hacks Your Decisions</p>
      </header> */}

      <header className="bg-gray-950 p-3 text-center shadow-[0_10px_20px_rgba(0,0,0,0.5)] border-b-2 border-indigo-900 sticky top-0 z-50">
        {/* <div className="relative w-full h-16 max-w-sm mx-auto mb-4">
          <div className="flex items-center justify-center w-full h-full bg-gray-900 text-indigo-300 italic rounded-md">
            [BrainMart Logo]
          </div>
        </div> */}

        {/* Non-Glow logo */}
        {/* <div className="relative w-full h-20 max-w-sm mx-auto mb-4 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 80" className="w-full h-full drop-shadow-[0_0_15px_rgba(139,92,246,0.4)]">
            <defs>
              <linearGradient id="neonPurple" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#a855f7" />
                <stop offset="100%" stopColor="#6366f1" />
              </linearGradient>
              <linearGradient id="neonPink" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ec4899" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
            </defs>
            
            <g transform="translate(15, 15)">
              <path d="M 0,5 L 12,5 L 20,40 L 55,40 L 65,15 L 16,15" fill="none" stroke="url(#neonPurple)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="25" cy="52" r="5" fill="#8b5cf6" />
              <circle cx="50" cy="52" r="5" fill="#8b5cf6" />
              
              <path d="M 23,28 Q 30,8 40,25 T 60,18" fill="none" stroke="url(#neonPink)" strokeWidth="4" strokeLinecap="round" />
              
              <path d="M 25,35 Q 35,22 45,35 T 55,30" fill="none" stroke="#22d3ee" strokeWidth="3" strokeLinecap="round" />
            </g>

            <text x="100" y="55" fontFamily="monospace" fontSize="42" fontWeight="900" fill="white" letterSpacing="-1">
              BRAIN<tspan fill="url(#neonPurple)">MART</tspan>
            </text>
          </svg>
        </div> */}

        {/* Glow Logo */}
        <div className="relative w-full h-24 max-w-sm mx-auto mb-4 flex items-center justify-center">
          {/* Note: overflow-visible ensures the glow doesn't get cut off at the edges */}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 80" className="w-full h-full overflow-visible">
            <defs>
              {/* Neon Gradients */}
              <linearGradient id="neonPurple" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#d8b4fe" /> {/* lighter purple */}
                <stop offset="100%" stopColor="#818cf8" /> {/* lighter indigo */}
              </linearGradient>
              <linearGradient id="neonPink" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#f472b6" /> 
                <stop offset="100%" stopColor="#c084fc" /> 
              </linearGradient>

              {/* The True Neon Glow Filter */}
              <filter id="neonGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur1" />
                <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur2" />
                {/* Merging multiple blurs with the original graphic creates a hot core and soft outer glow */}
                <feMerge>
                  <feMergeNode in="blur2" />
                  <feMergeNode in="blur1" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            
            {/* Logo Icon (Cart + Brain Waves) */}
            <g transform="translate(15, 15)">
              {/* Group with the glow filter applied */}
              <g filter="url(#neonGlow)">
                {/* Shopping Cart Outline */}
                <path d="M 0,5 L 12,5 L 20,40 L 55,40 L 65,15 L 16,15" fill="none" stroke="url(#neonPurple)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                
                {/* Brain Wave 1 (Inside Cart) */}
                <path d="M 23,28 Q 30,8 40,25 T 60,18" fill="none" stroke="url(#neonPink)" strokeWidth="4" strokeLinecap="round" />
                
                {/* Brain Wave 2 (Inside Cart) */}
                <path d="M 25,35 Q 35,22 45,35 T 55,30" fill="none" stroke="#22d3ee" strokeWidth="3" strokeLinecap="round" />
              </g>
              
              {/* Wheels (Kept sharp without glow for contrast) */}
              <circle cx="25" cy="52" r="5" fill="#a78bfa" />
              <circle cx="50" cy="52" r="5" fill="#a78bfa" />
            </g>

            {/* Typography */}
            <text x="100" y="55" fontFamily="monospace" fontSize="42" fontWeight="900" fill="white" letterSpacing="-1">
              BRAIN<tspan fill="url(#neonPurple)" filter="url(#neonGlow)">MART</tspan>
            </text>
          </svg>
        </div>
        <h1 className="text-3xl font-black mb-1 tracking-tighter text-white uppercase">The Consumer Brain</h1>
        <p className="text-sm opacity-90 text-indigo-300 mb-2">How Marketing Hacks Your Decisions</p>
        <p className="text-xs text-gray-500 font-semibold tracking-widest uppercase">By Juveriya Nazneen - BBA Final Year</p>
      </header>

      {/* Hero: The Glowing Brain */}
      <section className="px-6 pt-10 pb-16 text-center bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-950 via-gray-950 to-black">
        <div className="relative w-full max-w-xs mx-auto h-40 mb-8 flex items-center justify-center">
          <div className="absolute inset-0 bg-purple-900 rounded-full blur-[70px] opacity-70"></div>
          <div className="relative text-7xl font-mono text-purple-200 p-8">🧠</div>
          <p className="absolute -bottom-4 text-xs font-semibold text-purple-200">Meet Your BrainMart</p>
        </div>
        <h2 className="text-2xl font-bold text-gray-50 mb-4">Your Decision Funnel</h2>
        <p className="text-gray-400 max-w-lg mx-auto text-sm leading-relaxed mb-6">
          Supermarkets manipulate specific steps in your subconscious to convert choices into purchases. Let's explore the flow shown in the model:
        </p>
        
        <div className="grid grid-cols-2 gap-4 text-sm max-w-md mx-auto">
          {[
            { step: 'SEE', desc: 'Visuals grab attention', style: 'border-purple-600 bg-purple-950' },
            { step: 'THINK', desc: 'Comparisons & beliefs', style: 'border-cyan-600 bg-cyan-950' },
            { step: 'FEEL', desc: 'Emotions drive preferences', style: 'border-rose-600 bg-rose-950' },
            { step: 'DECIDE', desc: 'You choose instantly', style: 'border-emerald-600 bg-emerald-950' }
          ].map((item, index) => (
            <div key={index} className={`p-4 rounded-xl border-2 ${item.style}`}>
              <div className="font-bold text-lg mb-1">{item.step}</div>
              <div className="text-xs opacity-90">{item.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* BrainMart Zones Tour with Image Placeholders */}
      <main className="px-4 py-12 max-w-2xl mx-auto space-y-12">
        <h2 className="text-3xl font-black text-center text-white mb-8 tracking-tighter uppercase">THE BRAINMART TOUR</h2>

        {[
          { title: 'PREMIUM ZONE', num: '1', trick: 'Visual Exclusivity', desc: 'High-contrast lighting and premium colors (gold, black) signal luxury and exclusivity. This creates a halo effect and makes expensive items feel more justified.', imageSrc: '/zone-premium-v2.jpg' },
          { title: 'EYE LEVEL IS BUY LEVEL', num: '2', trick: 'Vertical Placement', desc: 'The middle shelves are "buy-level." Premium brands pay more to be here. Cheaper alternatives are on the bottom, requiring effort to find.', imageSrc: '/zone-eyelevel.jpg' },
          { title: 'POWER OF PACKAGING', num: '3', trick: 'Psychology of Color & Design', desc: 'Attractive, well-designed packaging activates the SEE and FEEL decision-making steps. Colors evoke emotions; shapes signal reliability.', imageSrc: '/zone-packaging.jpg' },
          { title: 'LIMITED TIME OFFER', num: '4', trick: 'Scarcity Bias', desc: 'Tactics like "Buy 1 Get 1 Free" create an artificial sense of urgency and perceived value, leading to emotional decisions (impulse purchases).', imageSrc: '/zone-limited.jpg' },
          { title: 'CHECKOUT ZONE', num: '5', trick: 'Decision Fatigue Gauntlet', desc: 'After making hundreds of small decisions, you are mentally fatigued at the checkout. Stores line this area with impulse buys to capture emotional purchases.', imageSrc: '/zone-checkout.jpg' }
        ].map(zone => (
          <article key={zone.num} className="bg-gray-950 rounded-2xl overflow-hidden shadow-2xl border border-gray-800">
            {/* <div className="relative w-full h-56">
              <div className="flex items-center justify-center w-full h-full bg-gray-900 border-b border-gray-800 text-indigo-300 italic">
                [{zone.title} Shelf Image]
              </div>
            </div> */}
            <div className="relative w-full h-56 bg-gray-900">
              <Image 
                src={zone.imageSrc} 
                alt={`${zone.title} Shelf`} 
                fill
                className="object-cover border-b border-gray-800"
              />
            </div>
            <div className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="text-5xl font-black text-indigo-600">0{zone.num}</div>
                <div>
                  <h3 className="text-xl font-bold text-gray-50">{zone.title}</h3>
                  <div className="text-sm font-semibold text-gray-400">Trick: {zone.trick}</div>
                </div>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">{zone.desc}</p>
            </div>
          </article>
        ))}

        {/* Specialized Experiment Sections */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { title: 'THE 99 EFFECT', desc: 'Psychological Pricing', trick: 'Prices ending in .99 feel much cheaper than round numbers. ₹99 feels significantly closer to ₹90 than to ₹100.', icon: '🏷️' },
            { title: 'ANCHOR PRICING', desc: 'Comparison Bias', trick: 'Showing a high MSRP first makes the next price (e.g., offer price) seem more reasonable and attractive.', icon: '⚓' },
            { title: 'SHOPPING BASKET', desc: 'Implicit Purchase Volume', trick: 'People with larger baskets or carts subconsciously buy more to fill the space. A full basket activates decision fatigue faster.', icon: '🛒' }
          ].map((item, index) => (
            <div key={index} className="bg-gray-950 p-6 rounded-2xl border border-gray-800 flex items-start gap-4">
              <div className="text-4xl">{item.icon}</div>
              <div>
                <h4 className="font-bold text-white mb-1">{item.title}</h4>
                <div className="text-xs font-semibold text-gray-500 mb-2">{item.desc}</div>
                <p className="text-sm text-gray-400">{item.trick}</p>
              </div>
            </div>
          ))}
        </section>
      </main>

      {/* FIXED: Shopper Type Quiz Section */}
      <section className="px-4 py-16 bg-gray-950 border-t border-gray-800 shadow-3xl text-center">
        <div className="max-w-xl mx-auto">
          <h2 className="text-3xl font-black text-white mb-4 tracking-tighter uppercase">Everyone shops. But do you know how you shop?</h2>
          <p className="text-gray-400 text-sm mb-8 max-w-sm mx-auto">Discover Your Shopping Personality! Answer 5 quick questions to find out what kind of consumer you are and how marketing influences your buying decisions.</p>

          {!showResult ? (
            <div className="space-y-6">
              <div className="p-4 bg-gray-900 rounded-lg text-lg text-gray-100 font-semibold border-2 border-transparent">
                Q{currentQuestionIndex + 1}: {questions[currentQuestionIndex].text}
              </div>
              <div className="grid grid-cols-1 gap-3">
                {questions[currentQuestionIndex].options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(option.pointsTo)}
                    className="w-full text-left p-4 rounded-xl bg-gray-800 text-indigo-200 border border-indigo-700 hover:border-indigo-600 hover:bg-gray-700 transition-all text-sm"
                  >
                    {option.text}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6 p-6 bg-gray-900 rounded-2xl border-2 border-indigo-900 shadow-3xl">
              {resultType && (
                <>
                  <div className={`text-6xl ${shopperTypes[resultType].color} mb-4`}>{shopperTypes[resultType].icon}</div>
                  <div className={`text-3xl font-black ${shopperTypes[resultType].color} mb-2 tracking-tighter`}>{resultType}</div>
                  <p className="text-lg text-gray-50">{shopperTypes[resultType].description}</p>
                  <div className="p-5 bg-black rounded-xl text-left border border-indigo-900 space-y-3">
                    <p className="text-sm font-semibold text-indigo-300">BrainMart Analysis:</p>
                    <p className="text-sm text-gray-400 leading-relaxed">{shopperTypes[resultType].details}</p>
                  </div>
                </>
              )}
              <button
                onClick={resetQuiz}
                className="inline-block mt-6 px-6 py-3 rounded-full bg-indigo-600 text-white font-bold hover:bg-indigo-500 transition"
              >
                Retake the Quiz
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Strategy Simulator Section */}
      <section className="px-4 py-12 bg-black border-t-2 border-indigo-900 shadow-[0_-10px_30px_rgba(79,70,229,0.3)]">
        <div className="max-w-2xl mx-auto space-y-10">
          <h2 className="text-3xl font-black text-center text-white tracking-tighter uppercase">STRATEGY SIMULATOR</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-8 bg-gray-950 p-6 rounded-2xl border-2 border-indigo-900 shadow-3xl">
            
            {/* Visual Schematic */}
            {/* <div className="relative w-full aspect-video bg-gray-900 rounded-xl border border-gray-800 overflow-hidden flex flex-col items-center justify-center p-4">
              <p className="text-sm text-indigo-300 font-semibold mb-4">Hypothetical Store Layout & Path Impact</p>
              <div className="relative w-full h-full text-center flex items-center justify-center text-5xl">
                <div className="absolute inset-0 bg-purple-950 rounded-full blur-[60px] opacity-40"></div>
                <div className="relative text-7xl font-mono text-purple-200">🛒<span className="text-4xl text-gray-700">---</span>🏠</div>
                <p className="absolute bottom-1 text-xs text-purple-300 font-medium">Pathing visualized on physical model</p>
              </div>
            </div> */}

            {/* Visual Schematic with CSS Animation */}
            {/* <div className="relative w-full aspect-video bg-gray-900 rounded-xl border border-gray-800 overflow-hidden flex flex-col items-center justify-center p-4">
              <p className="text-sm text-indigo-300 font-semibold mb-6">Simulated Shopper Pace</p>
              
              <div className="relative w-full max-w-[250px] h-16 flex items-center bg-gray-950 rounded-full border border-gray-800 overflow-hidden shadow-inner">
                
                <div className="absolute left-0 right-0 h-0.5 border-b-2 border-dashed border-gray-700 top-1/2 -translate-y-1/2"></div>
                
                <div 
                  className="relative text-4xl z-10"
                  style={{
                    animation: `driveCart ${8 - (musicTempo / 20)}s linear infinite`
                  }}
                >
                  🛒
                </div>
              </div>
              
              <style>{`
                @keyframes driveCart {
                  0% { transform: translateX(-50px); opacity: 0; }
                  15% { opacity: 1; }
                  85% { opacity: 1; }
                  100% { transform: translateX(250px); opacity: 0; }
                }
              `}</style>
            </div> */}

            {/* Dynamic SVG Floor Plan */}
            <div className="relative w-full aspect-video bg-gray-950 rounded-xl border border-gray-800 overflow-hidden flex flex-col items-center justify-center p-2 shadow-inner">
              <p className="text-sm text-indigo-300 font-semibold mb-2 z-10">Live Path Mapping</p>
              
              <div className="relative w-full h-full flex-grow flex items-center justify-center">
                {/* SVG viewBox scales automatically on mobile screens */}
                <svg viewBox="0 0 400 300" className="w-full max-w-[400px] h-full drop-shadow-lg">
                  {/* Floor */}
                  <rect width="400" height="300" fill="#0f172a" rx="10"/>
                  
                  {/* Produce Section */}
                  <rect x="20" y="160" width="80" height="80" fill="#064e3b" rx="5" opacity={strategyState.produceEntrance ? 0.6 : 0.2} className="transition-opacity duration-500" />
                  <text x="35" y="205" fontSize="12" fill="#34d399" opacity={strategyState.produceEntrance ? 1 : 0.3} className="font-sans font-bold transition-opacity duration-500">PRODUCE</text>
                  
                  {/* Center Aisles */}
                  <rect x="130" y="80" width="20" height="100" fill="#334155" rx="3" />
                  <rect x="190" y="80" width="20" height="100" fill="#334155" rx="3" />
                  <rect x="250" y="80" width="20" height="100" fill="#334155" rx="3" />

                  {/* Essentials (Back Wall) */}
                  <rect x="100" y="20" width="200" height="40" fill="#1e3a8a" rx="5" opacity={strategyState.essentialsBack ? 0.6 : 0.2} className="transition-opacity duration-500" />
                  <text x="155" y="45" fontSize="12" fill="#60a5fa" opacity={strategyState.essentialsBack ? 1 : 0.3} className="font-sans font-bold transition-opacity duration-500">ESSENTIALS</text>

                  {/* Checkout Area */}
                  <rect x="300" y="180" width="80" height="80" fill="#78350f" rx="5" opacity={strategyState.checkoutCandies ? 0.6 : 0.2} className="transition-opacity duration-500"/>
                  <text x="315" y="225" fontSize="11" fill="#fbbf24" opacity={strategyState.checkoutCandies ? 1 : 0.3} className="font-sans font-bold transition-opacity duration-500">CHECKOUT</text>

                  {/* The Dashed Path Line */}
                  <path 
                    d={getShopperPath()}
                    fill="none" 
                    stroke="#6366f1" 
                    strokeWidth="3" 
                    strokeDasharray="8 4"
                    className="opacity-40 transition-all duration-700 ease-in-out"
                  />

                  {/* The Animated Shopper */}
                  <text fontSize="28">
                    🛒
                    <animateMotion 
                      dur={`${10 - (musicTempo / 12)}s`} 
                      repeatCount="indefinite"
                      path={getShopperPath()}
                    />
                  </text>
                </svg>
              </div>
              <p className="text-[10px] text-gray-500 text-center mt-2 uppercase tracking-widest">
                Entrance (Left) ➔ Exit (Right)
              </p>
            </div>

            {/* Controls & Metrics */}
            <div className="space-y-6">
              <div className="text-center p-4 bg-gray-900 rounded-lg border border-gray-800">
                <p className="text-xs text-gray-500 mb-1">CURRENT SIMULATION</p>
                <p className="text-3xl font-black text-yellow-400 tracking-tighter">₹{simulatedAverageSpend.toFixed(0)}</p>
                <p className="text-sm text-yellow-200 font-semibold mt-1">Simulated Average Spend</p>
              </div>

              {/* Toggles */}
              <div className="space-y-3">
                {[
                  { label: 'Fresh Produce at Entrance', key: 'produceEntrance' },
                  { label: 'Essentials at the Back', key: 'essentialsBack' },
                  { label: 'Checkout Candies Active', key: 'checkoutCandies' },
                ].map(item => (
                  <button 
                    key={item.key}
                    onClick={() => setStrategyState(prev => ({ ...prev, [item.key]: !prev[item.key as keyof typeof strategyState] }))}
                    className={`w-full flex items-center justify-between p-3 rounded-lg text-sm border-2 transition-all ${strategyState[item.key as keyof typeof strategyState] ? 'bg-indigo-950 border-indigo-600 text-white' : 'bg-gray-800 border-gray-700 text-gray-400'}`}
                  >
                    <span>{item.label}</span>
                    <span className={`text-xs p-1 px-2 rounded-full font-bold ${strategyState[item.key as keyof typeof strategyState] ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-500'}`}>
                      {strategyState[item.key as keyof typeof strategyState] ? 'ACTIVE' : 'INACTIVE'}
                    </span>
                  </button>
                ))}
              </div>

              {/* Music Slider */}
              <div className="p-3 bg-gray-900 rounded-lg border border-gray-800">
                <label className="block text-sm text-gray-400 mb-2 flex justify-between items-center">
                  <span>Music Tempo Impact:</span>
                  <span className={`font-semibold ${musicTempo < 40 ? 'text-cyan-400' : musicTempo > 70 ? 'text-rose-400' : 'text-gray-200'}`}>
                    {musicTempo < 40 ? 'Slow' : musicTempo > 70 ? 'Fast' : 'Neutral'}
                  </span>
                </label>
                <input 
                  type="range" 
                  min="0" max="100" 
                  value={musicTempo}
                  onChange={(e) => setMusicTempo(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      {/* <footer className="bg-gray-950 text-gray-600 py-12 text-center text-xs border-t border-gray-800">
        <p className="mb-1">BrainMart © 2026 | "The Consumer Brain" model presentation</p>
        <p>A mobile-optimized interactive guide</p>
      </footer> */}

      {/* Footer */}
      <footer className="bg-gray-950 text-gray-600 py-12 text-center text-xs border-t border-gray-800 space-y-2">
        <p className="text-indigo-400/80 font-semibold text-sm tracking-wide mb-4">Project by Juveriya Nazneen - BBA Final Year</p>
        <p>BrainMart © 2026 | "The Consumer Brain" model presentation</p>
        <p>A mobile-optimized interactive guide</p>
      </footer>
    </div>
  );
}
'use client';

import { useState } from 'react';

// --- TypeScript Definitions ---
type ShopperTypeKey = 'Impulse Buyer' | 'Smart Explorer' | 'Brand Loyal' | 'Rational Shopper';

interface ShopperType {
  title: string;
  subtitle: string;
  icon: string;
  details: string;
  color: string;
  bgGlow: string;
}

interface Option {
  text: string;
  pointsTo: ShopperTypeKey;
}

interface Question {
  text: string;
  options: Option[];
}

// --- Data based on new Board ---
const shopperTypes: Record<ShopperTypeKey, ShopperType> = {
  'Impulse Buyer': {
    title: 'IMPULSE BUYER',
    subtitle: 'Oops... I only came for shampoo! 😅',
    icon: '🛍️',
    details: 'You buy with your heart! Offers, trends & excitement drive you.',
    color: 'text-pink-400',
    bgGlow: 'shadow-[0_0_40px_rgba(244,114,182,0.4)] border-pink-500'
  },
  'Smart Explorer': {
    title: 'SMART EXPLORER',
    subtitle: 'Research mode: ON! 🔍',
    icon: '🕵️‍♀️',
    details: 'You love to compare, explore and find the best value!',
    color: 'text-blue-400',
    bgGlow: 'shadow-[0_0_40px_rgba(96,165,250,0.4)] border-blue-500'
  },
  'Brand Loyal': {
    title: 'BRAND LOYAL',
    subtitle: "If it's not my brand, I'm not buying it. 😎",
    icon: '👑',
    details: 'You trust familiar brands and stick to what you love.',
    color: 'text-purple-400',
    bgGlow: 'shadow-[0_0_40px_rgba(167,139,250,0.4)] border-purple-500'
  },
  'Rational Shopper': {
    title: 'RATIONAL SHOPPER',
    subtitle: 'Plan. Think. Buy. No regrets. ✅',
    icon: '📋',
    details: 'You think before you buy. Needs over wants, always!',
    color: 'text-green-400',
    bgGlow: 'shadow-[0_0_40px_rgba(74,222,128,0.4)] border-green-500'
  }
};

// The exact 5 questions from the board
const questions: Question[] = [
  {
    text: 'You\'re at the mall to buy one thing. You notice a "Buy 2 Get 1 Free" offer. You...',
    options: [
      { text: 'A) Buy only what I came for.', pointsTo: 'Rational Shopper' },
      { text: 'B) Buy extra because it\'s a great deal.', pointsTo: 'Impulse Buyer' },
      { text: 'C) Think about it for a while.', pointsTo: 'Smart Explorer' },
      { text: 'D) Ask someone else before deciding.', pointsTo: 'Brand Loyal' }
    ]
  },
  {
    text: 'What attracts you first?',
    options: [
      { text: 'A) Discounts & offers', pointsTo: 'Smart Explorer' },
      { text: 'B) Beautiful packaging', pointsTo: 'Impulse Buyer' },
      { text: 'C) Brand name', pointsTo: 'Brand Loyal' },
      { text: 'D) Reviews & quality', pointsTo: 'Rational Shopper' }
    ]
  },
  {
    text: 'A product says "Only 2 left!" What do you do?',
    options: [
      { text: 'A) Buy it quickly.', pointsTo: 'Impulse Buyer' },
      { text: 'B) Compare with other options.', pointsTo: 'Smart Explorer' },
      { text: 'C) Ignore the message.', pointsTo: 'Rational Shopper' },
      { text: 'D) Read reviews first.', pointsTo: 'Brand Loyal' }
    ]
  },
  {
    text: 'When shopping, your biggest influence is...',
    options: [
      { text: 'A) Friends & family', pointsTo: 'Brand Loyal' },
      { text: 'B) Social media/Influencers', pointsTo: 'Impulse Buyer' },
      { text: 'C) My own research', pointsTo: 'Smart Explorer' },
      { text: 'D) Discounts & sales', pointsTo: 'Rational Shopper' }
    ]
  },
  {
    text: 'Which statement describes you best?',
    options: [
      { text: 'A) I often buy things on impulse.', pointsTo: 'Impulse Buyer' },
      { text: 'B) I compare everything before buying.', pointsTo: 'Smart Explorer' },
      { text: 'C) I stick to my favourite brands.', pointsTo: 'Brand Loyal' },
      { text: 'D) I only buy when necessary.', pointsTo: 'Rational Shopper' }
    ]
  }
];

export default function Home() {
  // --- Quiz State ---
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [scores, setScores] = useState<Record<ShopperTypeKey, number>>({ 
    'Impulse Buyer': 0, 
    'Smart Explorer': 0, 
    'Brand Loyal': 0, 
    'Rational Shopper': 0
  });
  const [showResult, setShowResult] = useState<boolean>(false);
  const [resultType, setResultType] = useState<ShopperTypeKey | null>(null);

  // --- Handlers ---
  const handleAnswer = (pointsTo: ShopperTypeKey) => {
    const newScores = { ...scores };
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
        topType = type as ShopperTypeKey; 
      }
    });
    setResultType(topType); 
    setShowResult(true);
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0); 
    setScores({ 'Impulse Buyer': 0, 'Smart Explorer': 0, 'Brand Loyal': 0, 'Rational Shopper': 0 }); 
    setShowResult(false); 
    setResultType(null);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-200 font-sans selection:bg-indigo-500 selection:text-white pb-12">
      
      {/* RESTORED & COMPACT: Glow Logo Header */}
      <header className="bg-gray-950 pt-2 pb-2 px-3 text-center shadow-[0_10px_20px_rgba(0,0,0,0.5)] border-b-2 border-indigo-900 sticky top-0 z-50">
        
        {/* Shrunk logo height from h-24 to h-12 and reduced bottom margin */}
        <div className="relative w-full h-12 max-w-sm mx-auto mb-1 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 80" className="w-full h-full overflow-visible">
            <defs>
              <linearGradient id="neonPurple" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#d8b4fe" />
                <stop offset="100%" stopColor="#818cf8" />
              </linearGradient>
              <linearGradient id="neonPink" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#f472b6" /> 
                <stop offset="100%" stopColor="#c084fc" /> 
              </linearGradient>

              <filter id="neonGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur1" />
                <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur2" />
                <feMerge>
                  <feMergeNode in="blur2" />
                  <feMergeNode in="blur1" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            
            <g transform="translate(-15, 0)">
              <g transform="translate(15, 15)">
                <g filter="url(#neonGlow)">
                  <path d="M 0,5 L 12,5 L 20,40 L 55,40 L 65,15 L 16,15" fill="none" stroke="url(#neonPurple)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M 23,28 Q 30,8 40,25 T 60,18" fill="none" stroke="url(#neonPink)" strokeWidth="4" strokeLinecap="round" />
                  <path d="M 25,35 Q 35,22 45,35 T 55,30" fill="none" stroke="#22d3ee" strokeWidth="3" strokeLinecap="round" />
                </g>
                <circle cx="25" cy="52" r="5" fill="#a78bfa" />
                <circle cx="50" cy="52" r="5" fill="#a78bfa" />
              </g>

              <text x="100" y="55" fontFamily="monospace" fontSize="42" fontWeight="900" fill="white" letterSpacing="-1">
                BRAIN<tspan fill="url(#neonPurple)" filter="url(#neonGlow)">MART</tspan>
              </text>
            </g>
          </svg>
        </div>
        
        {/* Tightened text sizing and margins */}
        <h1 className="text-xl md:text-2xl font-black mb-0.5 tracking-tight text-white uppercase leading-none">The Consumer Brain</h1>
        <p className="text-[11px] opacity-90 text-indigo-300 mb-1 leading-none">How Marketing Hacks Your Decisions</p>
        <p className="text-[9px] text-gray-500 font-bold tracking-widest uppercase leading-none">By Juveriya Nazneen - BBA Final Year</p>
      </header>

      {/* Main Quiz Area */}
      <main className="px-4 pt-10 pb-8 max-w-xl mx-auto">
        {!showResult ? (
          // --- QUESTION SCREEN ---
          <div className="space-y-6">
            
            {/* Introductory Text (Matches new design vibe) */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-black text-white mb-2 uppercase tracking-tight">Everyone has different style.</h2>
              <p className="text-indigo-400 font-bold tracking-widest uppercase text-sm mb-4">What is yours?</p>
              <div className="inline-block bg-indigo-900/50 border border-indigo-500/50 rounded-full px-4 py-1.5 mb-2">
                <p className="text-sm font-bold text-indigo-200">5 QUESTIONS | 1 MINUTE</p>
              </div>
              <p className="text-xs text-gray-400 font-semibold tracking-widest uppercase mt-2">FUN • QUICK • REVEALING</p>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-900 rounded-full h-2.5 mb-6 border border-gray-800">
              <div className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500 ease-out" style={{ width: `${((currentQuestionIndex) / questions.length) * 100}%` }}></div>
            </div>

            {/* Question Card */}
            <div className="p-6 bg-gray-900/80 rounded-2xl text-xl text-white font-bold border-2 border-indigo-600/30 shadow-2xl relative">
              <div className="absolute -top-4 -left-2 bg-indigo-600 text-white w-10 h-10 flex items-center justify-center rounded-full font-black shadow-lg border-2 border-gray-900">
                Q{currentQuestionIndex + 1}
              </div>
              <p className="mt-2">{questions[currentQuestionIndex].text}</p>
            </div>
            
            {/* Options */}
            <div className="grid grid-cols-1 gap-4 pt-4">
              {questions[currentQuestionIndex].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(option.pointsTo)}
                  className="w-full text-left p-5 rounded-2xl bg-[#1a1a1a] text-gray-200 border-2 border-gray-800 hover:border-indigo-500 hover:bg-gray-800 transition-all text-base font-semibold shadow-md hover:shadow-[0_0_15px_rgba(99,102,241,0.3)] hover:-translate-y-1"
                >
                  {option.text}
                </button>
              ))}
            </div>
          </div>
        ) : (
          // --- RESULTS SCREEN ---
          <div className="animate-in fade-in zoom-in duration-500">
            
            <div className="text-center mb-6">
              <h2 className="text-4xl font-black text-white italic mb-2">Congratulations! 🎉</h2>
              <p className="text-gray-400">Now you'll never look at shopping the same way again.</p>
            </div>

            {resultType && (
              <div className={`p-8 bg-gray-900 rounded-3xl border-4 ${shopperTypes[resultType].bgGlow} text-center relative overflow-hidden`}>
                
                <div className="text-7xl mb-4 animate-bounce">{shopperTypes[resultType].icon}</div>
                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Your Style Is</p>
                <div className={`text-4xl font-black ${shopperTypes[resultType].color} mb-2 tracking-tighter uppercase`}>
                  {shopperTypes[resultType].title}
                </div>
                
                <div className="bg-black/40 p-4 rounded-xl mt-6 border border-white/10">
                  <p className="text-lg font-bold text-white mb-2">"{shopperTypes[resultType].subtitle}"</p>
                  <p className="text-sm text-gray-300">{shopperTypes[resultType].details}</p>
                </div>
              </div>
            )}

            {/* Live Results (Mock Data from the board) */}
            <div className="mt-8 p-6 bg-[#111] rounded-2xl border border-gray-800">
              <h3 className="text-center text-white font-bold tracking-widest uppercase mb-6 text-sm">Live Results (Example)</h3>
              
              <div className="space-y-4">
                {[
                  { name: 'IMPULSE BUYER', pct: '40%', color: 'bg-pink-500' },
                  { name: 'SMART EXPLORER', pct: '35%', color: 'bg-blue-500' },
                  { name: 'BRAND LOYAL', pct: '15%', color: 'bg-purple-500' },
                  { name: 'RATIONAL SHOPPER', pct: '10%', color: 'bg-green-500' },
                ].map((stat, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between text-xs font-bold text-gray-400">
                      <span>{stat.name}</span>
                      <span>{stat.pct}</span>
                    </div>
                    <div className="w-full bg-gray-900 rounded-full h-3 border border-gray-800">
                      <div className={`${stat.color} h-full rounded-full`} style={{ width: stat.pct }}></div>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-center text-gray-400 text-xs mt-6">Thank you for participating! ♥</p>
            </div>

            {/* Selfie Prompt */}
            <div className="mt-8 bg-indigo-600 rounded-2xl p-6 text-center shadow-[0_0_20px_rgba(79,70,229,0.4)]">
              <h3 className="text-xl font-black text-white mb-2">📸 TAKE A SELFIE!</h3>
              <p className="text-indigo-100 text-sm mb-4">Grab the props by the physical model, click a picture with your result & share your shopper style!</p>
              <button
                onClick={resetQuiz}
                className="w-full py-3 rounded-full bg-white text-indigo-900 font-black hover:bg-gray-100 transition-colors uppercase tracking-wider text-sm"
              >
                Retake the Quiz
              </button>
            </div>

            <p className="text-center text-xs text-gray-500 mt-8 font-semibold">
              THERE ARE NO RIGHT OR WRONG SHOPPING PERSONALITIES—ONLY DIFFERENT CONSUMER BEHAVIORS.
            </p>
          </div>
        )}
      </main>

      {/* Board Match Footer */}
      <footer className="text-center text-xs text-gray-600 mt-6 pb-6">
        <p className="font-black text-gray-400 text-lg tracking-[0.2em] mb-4">THINK. SCAN. DISCOVER. SMILE.</p>
        <p>Project by Juveriya Nazneen - BBA Final Year</p>
      </footer>
    </div>
  );
}
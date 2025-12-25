"use client";

import { useEffect, useState } from "react";
import BackButton from "@/components/ui/BackButton";
import { generateCoinChangeSteps, CoinChangeStep } from "@/lib/algorithms/dp/coinChange";
import { Play, Pause, RotateCcw } from "lucide-react";
import { motion } from "framer-motion";

export default function CoinChangePage() {
    const [coinsInput, setCoinsInput] = useState("1, 2, 5");
    const [amountInput, setAmountInput] = useState("11");
    
    // State for Algo
    const [coins, setCoins] = useState([1, 2, 5]);
    const [amount, setAmount] = useState(11);

    const [steps, setSteps] = useState<CoinChangeStep[]>([]);
    const [currentStep, setCurrentStep] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [speed, setSpeed] = useState(500);

    useEffect(() => {
        const gen = generateCoinChangeSteps(coins, amount);
        setSteps(Array.from(gen));
        setCurrentStep(0);
        setIsPlaying(false);
    }, [coins, amount]);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (isPlaying && currentStep < steps.length - 1) {
            timer = setTimeout(() => setCurrentStep(prev => prev + 1), speed);
        } else if (isPlaying && currentStep >= steps.length - 1) {
            setIsPlaying(false);
        }
        return () => clearTimeout(timer);
    }, [isPlaying, currentStep, steps, speed]);

    const handleUpdate = () => {
        const c = coinsInput.split(",").map(s => parseInt(s.trim())).filter(n => !isNaN(n));
        const a = parseInt(amountInput);
        if (c.length > 0 && !isNaN(a) && a > 0) {
            setCoins(c);
            setAmount(a);
        }
    };

    const step = steps[currentStep];
    if (!step) return <div>Loading...</div>;

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            <BackButton href="/dsa/dynamic-programming" />
            <div>
                 <h1 className="text-3xl font-bold text-foreground mb-2">Coin Change Problem</h1>
                 <p className="text-muted-foreground">Find the minimum number of coins needed to make up a certain amount.</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    {/* Visualizer Area */}
                    <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-8 min-h-[300px] flex flex-col gap-8">
                        
                        {/* Coins */}
                        <div className="flex gap-4 items-center">
                            <span className="font-bold text-sm uppercase text-muted-foreground">Coins:</span>
                            {step.coins.map((c, i) => (
                                <div key={i} className={`w-10 h-10 rounded-full flex items-center justify-center border-2 font-bold transition-colors ${step.activeCoinIndex === i ? 'border-yellow-500 bg-yellow-100 dark:bg-yellow-900/40' : 'border-zinc-300 dark:border-zinc-600'}`}>
                                    {c}
                                </div>
                            ))}
                        </div>

                        {/* DP Array */}
                        <div>
                             <span className="font-bold text-sm uppercase text-muted-foreground block mb-2">DP Table (Min Coins):</span>
                             <div className="flex flex-wrap gap-1">
                                {step.dp.map((val, idx) => {
                                    const isHighlighted = step.highlightedIndices.includes(idx);
                                    const isCurrent = step.currentAmount === idx;

                                    let bg = "bg-white dark:bg-zinc-800";
                                    let border = "border-zinc-200 dark:border-zinc-700";
                                    
                                    if (isCurrent) {
                                        border = "border-indigo-500";
                                        bg = "bg-indigo-50 dark:bg-indigo-900/20";
                                    } else if (isHighlighted) {
                                        border = "border-green-500";
                                        bg = "bg-green-50 dark:bg-green-900/20";
                                    }

                                    return (
                                        <div key={idx} className="flex flex-col items-center">
                                            <motion.div 
                                                animate={{ scale: isCurrent ? 1.1 : 1 }}
                                                className={`w-8 h-10 flex items-center justify-center text-sm border rounded ${bg} ${border}`}
                                            >
                                                {val === null ? '∞' : val}
                                            </motion.div>
                                            <span className="text-[10px] text-zinc-400">{idx}</span>
                                        </div>
                                    );
                                })}
                             </div>
                        </div>

                    </div>

                    <div className="bg-zinc-100 dark:bg-zinc-900/50 p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 flex justify-between items-center text-sm font-mono text-zinc-600 dark:text-zinc-400">
                        <div className="flex flex-col">
                            <span className="font-bold text-foreground">{step.message}</span>
                            <span className="text-xs text-muted-foreground">{step.description}</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <button onClick={() => setIsPlaying(!isPlaying)} className="p-2 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-full">
                                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                            </button>
                            <input 
                                type="range" 
                                min="100" max="1000" step="100" 
                                value={1100 - speed} 
                                onChange={(e) => setSpeed(1100 - parseInt(e.target.value))}
                                className="w-20"
                            />
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-zinc-50 dark:bg-zinc-900/30 p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-4">
                        <div>
                            <label className="text-xs uppercase text-zinc-500 font-bold mb-1 block">Coins (comma sep)</label>
                            <input 
                                type="text"
                                value={coinsInput} 
                                onChange={(e) => setCoinsInput(e.target.value)}
                                className="w-full bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded px-3 py-2 text-sm"
                            />
                        </div>
                         <div>
                            <label className="text-xs uppercase text-zinc-500 font-bold mb-1 block">Target Amount</label>
                            <input 
                                type="number"
                                value={amountInput} 
                                onChange={(e) => setAmountInput(e.target.value)}
                                className="w-full bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded px-3 py-2 text-sm"
                            />
                        </div>

                        <button onClick={handleUpdate} className="w-full flex items-center justify-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:text-black py-2 rounded text-sm font-medium transition">
                            Update
                        </button>
                        <button onClick={() => { setCurrentStep(0); setIsPlaying(false); }} className="w-full flex items-center justify-center gap-2 bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-800 text-foreground py-2 rounded text-sm font-medium transition">
                            <RotateCcw className="w-4 h-4" /> Reset
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

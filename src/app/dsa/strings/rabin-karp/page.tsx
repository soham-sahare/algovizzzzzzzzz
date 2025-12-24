"use client";

import { useEffect, useState } from "react";
import BackButton from "@/components/ui/BackButton";
import CodeHighlight from "@/components/visualizations/CodeHighlight";
import { generateRabinKarpSteps, StringSearchStep } from "@/lib/algorithms/string/rabinKarp";
import { Play, Pause, RotateCcw, Search } from "lucide-react";

const RK_CODE = `function rabinKarp(text, pattern):
  n = text.length, m = pattern.length
  p = hash(pattern), t = hash(text[0..m])
  
  for i = 0 to n-m:
    if p == t:
      if checkChars(text, pattern, i):
        print "Pattern found at " + i
        
    if i < n-m:
      t = rollHash(t, text[i], text[i+m])`;

export default function RabinKarpPage() {
    const [text, setText] = useState("ABCCDDAEFG");
    const [pattern, setPattern] = useState("CDD");
    const [steps, setSteps] = useState<StringSearchStep[]>([]);
    const [currentStep, setCurrentStep] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [speed, setSpeed] = useState(500);

    // Playback
    useEffect(() => {
        if (isPlaying) {
            const timer = setInterval(() => {
                setCurrentStep((prev) => {
                    if (prev < steps.length - 1) {
                        return prev + 1;
                    } else {
                        setIsPlaying(false);
                        return prev;
                    }
                });
            }, speed);
            return () => clearInterval(timer);
        }
    }, [isPlaying, speed, steps]);

    const handleSearch = () => {
        const generator = generateRabinKarpSteps(text, pattern);
        setSteps(Array.from(generator));
        setCurrentStep(0);
        setIsPlaying(true);
    };

    const handleReset = () => {
        setSteps([]);
        setCurrentStep(0);
        setIsPlaying(false);
    };
    
    const stepData = steps.length > 0 ? steps[currentStep] : {
        text,
        pattern,
        currentIndex: 0,
        comparing: false,
        message: "Enter text and pattern to start",
        found: false,
        lineNumber: undefined,
        hashText: undefined,
        hashPattern: undefined
    };

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            <BackButton href="/dsa/strings" />
             <div>
                 <h1 className="text-3xl font-bold text-foreground mb-2">Rabin-Karp Algorithm</h1>
                 <p className="text-muted-foreground">String searching algorithm using hashing to find any one of a set of pattern strings in a text.</p>
             </div>

            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    {/* Visualizer */}
                     <div className="border rounded-lg bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 p-8 min-h-[300px] flex flex-col items-center justify-center gap-8">
                        
                        {/* Hashes */}
                        <div className="flex gap-8 text-sm font-mono">
                            <div className="bg-white dark:bg-zinc-800 p-3 rounded shadow-sm border border-zinc-200 dark:border-zinc-700">
                                <span className="block text-zinc-500 text-xs">Pattern Hash</span>
                                <span className="text-indigo-600 font-bold text-lg">{stepData.hashPattern !== undefined ? stepData.hashPattern : '-'}</span>
                            </div>
                            <div className="bg-white dark:bg-zinc-800 p-3 rounded shadow-sm border border-zinc-200 dark:border-zinc-700">
                                <span className="block text-zinc-500 text-xs">Current Window Hash</span>
                                <span className={`font-bold text-lg ${stepData.hashText === stepData.hashPattern && stepData.hashText !== undefined ? 'text-emerald-600' : 'text-zinc-600'}`}>
                                    {stepData.hashText !== undefined ? stepData.hashText : '-'}
                                </span>
                            </div>
                        </div>

                         {/* String Display */}
                         <div className="relative font-mono text-xl tracking-widest bg-white dark:bg-zinc-800 p-6 rounded-xl shadow-inner border border-zinc-200 dark:border-zinc-700">
                            {text.split('').map((char, i) => (
                                <span 
                                    key={i} 
                                    className={`inline-block w-8 text-center transition-colors duration-300
                                        ${i >= stepData.currentIndex && i < stepData.currentIndex + pattern.length ? 'bg-indigo-100 dark:bg-indigo-900/30' : ''}
                                        ${stepData.found && i >= (stepData.matchIndex || 0) && i < (stepData.matchIndex || 0) + pattern.length ? '!bg-emerald-200 dark:!bg-emerald-900/50 text-emerald-800 dark:text-emerald-200' : ''}
                                    `}
                                >
                                    {char}
                                </span>
                            ))}
                            {/* Pattern Overlay */}
                            <div 
                                className="absolute top-full left-6 mt-2 flex transition-all duration-300 pointer-events-none"
                                style={{ transform: `translateX(${stepData.currentIndex * 2}rem)` }} // Approx based on w-8 (2rem)
                            >
                                {pattern.split('').map((char, i) => (
                                    <span key={i} className="w-8 text-center text-rose-500 font-bold">{char}</span>
                                ))}
                            </div>
                         </div>
                     </div>

                    {/* Controls */}
                    <div className="bg-zinc-100 dark:bg-zinc-900/50 p-4 rounded-lg border border-zinc-200 dark:border-zinc-800">
                         <div className="flex gap-4 mb-4">
                            <input 
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                placeholder="Text"
                                className="flex-grow px-3 py-2 rounded border bg-white dark:bg-zinc-800"
                            />
                             <input 
                                value={pattern}
                                onChange={(e) => setPattern(e.target.value)}
                                placeholder="Pattern"
                                className="w-32 px-3 py-2 rounded border bg-white dark:bg-zinc-800"
                            />
                            <button onClick={handleSearch} className="bg-indigo-600 text-white px-4 py-2 rounded flex items-center gap-2">
                                <Search className="w-4 h-4"/> Search
                            </button>
                        </div>
                        
                        <div className="flex justify-between items-center text-sm font-mono text-zinc-600 dark:text-zinc-400">
                             <span>Status: <span className="text-foreground font-bold">{stepData.message}</span></span>
                             <div className="flex gap-2">
                                <button onClick={() => setIsPlaying(!isPlaying)} className="p-2 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-full">
                                    {isPlaying ? <Pause className="w-4 h-4"/> : <Play className="w-4 h-4"/>}
                                </button>
                                <button onClick={handleReset} className="p-2 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-full">
                                    <RotateCcw className="w-4 h-4"/>
                                </button>
                             </div>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-1 space-y-6">
                     <CodeHighlight code={RK_CODE} activeLine={stepData.lineNumber} />
                     
                      <div className="bg-zinc-50 dark:bg-zinc-900/30 p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-4">
                            <h3 className="font-bold text-foreground">Complexity</h3>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="text-muted-foreground block mb-1">Time (Avg)</span>
                                    <span className="font-mono bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded">O(N + M)</span>
                                </div>
                                <div>
                                    <span className="text-muted-foreground block mb-1">Time (Worst)</span>
                                    <span className="font-mono bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400 px-2 py-0.5 rounded">O(NM)</span>
                                </div>
                            </div>
                        </div>
                </div>
            </div>
        </div>
    );
}

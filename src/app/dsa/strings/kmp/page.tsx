"use client";

import { useEffect, useState } from "react";
import BackButton from "@/components/ui/BackButton";
import CodeHighlight from "@/components/visualizations/CodeHighlight";
import { generateKMPSteps, KMPStep } from "@/lib/algorithms/string/kmp";
import { Play, Pause, RotateCcw, Search } from "lucide-react";

const KMP_CODE = `function KMP(text, pattern):
  lps = computeLPS(pattern)
  i = 0, j = 0
  while i < n:
    if pattern[j] == text[i]:
      i++, j++
    if j == m:
      print "Found at " + (i-j)
      j = lps[j-1]
    else if i < n and pattern[j] != text[i]:
      if j != 0: j = lps[j-1]
      else: i++`;

export default function KMPPage() {
    const [text, setText] = useState("ABABDABACDABABCABAB");
    const [pattern, setPattern] = useState("ABABCABAB");
    const [steps, setSteps] = useState<KMPStep[]>([]);
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
        const generator = generateKMPSteps(text, pattern);
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
        lps: Array(pattern.length).fill(0)
    };
    
    // Derived state for visualizing alignment
    // When searching, pattern is aligned such that pattern[j] matches text[i]
    // Visually, text[i] should be above pattern[j]
    // So 'start' of pattern visually relative to text is (i - j)
    let patternOffset = 0;
    if (stepData.matchIndex !== undefined) {
         patternOffset = stepData.matchIndex;
    }

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            <BackButton href="/dsa/strings" />
             <div>
                 <h1 className="text-3xl font-bold text-foreground mb-2">Knuth-Morris-Pratt (KMP) Algorithm</h1>
                 <p className="text-muted-foreground">Efficient string matching algorithm that uses a failure function (LPS array) to avoid re-examining characters.</p>
             </div>

            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    {/* Visualizer */}
                     <div className="border rounded-lg bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 p-8 min-h-[300px] flex flex-col items-center justify-center gap-8 overflow-hidden">
                        
                        {/* LPS Array */}
                        <div className="flex flex-col items-center gap-2">
                             <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest">LPS Array (Longest Prefix Suffix)</span>
                             <div className="flex border border-zinc-300 dark:border-zinc-700 rounded overflow-hidden">
                                {pattern.split('').map((char, i) => (
                                     <div key={i} className="flex flex-col w-8 border-r last:border-r-0 border-zinc-300 dark:border-zinc-700">
                                         <div className="h-8 flex items-center justify-center bg-zinc-100 dark:bg-zinc-800 font-mono text-xs">{char}</div>
                                         <div className={`h-8 flex items-center justify-center bg-white dark:bg-zinc-900 font-bold ${stepData.lpsIndex === i ? 'bg-yellow-100 text-yellow-700' : ''}`}>
                                             {stepData.lps ? stepData.lps[i] : 0}
                                         </div>
                                     </div>
                                ))}
                             </div>
                        </div>

                         {/* String Display */}
                         <div className="relative w-full overflow-x-auto pb-8">
                             <div className="font-mono text-xl tracking-widest bg-white dark:bg-zinc-800 p-6 rounded-xl shadow-inner border border-zinc-200 dark:border-zinc-700 whitespace-nowrap min-w-max">
                                {/* Text */}
                                <div className="mb-4">
                                    {text.split('').map((char, i) => (
                                        <span 
                                            key={i} 
                                            className={`inline-block w-8 text-center transition-colors duration-300
                                                ${i === stepData.currentIndex ? 'bg-yellow-200 dark:bg-yellow-900/50' : ''}
                                                ${stepData.found && i >= patternOffset && i < patternOffset + pattern.length ? '!bg-emerald-200 dark:!bg-emerald-900/50 text-emerald-800 dark:text-emerald-200' : ''}
                                            `}
                                        >
                                            {char}
                                        </span>
                                    ))}
                                </div>
                                
                                {/* Pattern Overlay (Animated Position) */}
                                <div 
                                    className="flex transition-transform duration-300 ease-in-out"
                                    style={{ transform: `translateX(${patternOffset * 2}rem)` }} // 2rem matches w-8
                                >
                                    {pattern.split('').map((char, i) => {
                                         // Highlight the character being compared in pattern
                                         // comparison happens at pattern index (currentIndex - patternOffset)
                                         const isActive = (stepData.currentIndex - patternOffset) === i;
                                         return (
                                            <span 
                                                key={i} 
                                                className={`inline-block w-8 text-center font-bold
                                                    ${isActive ? 'text-rose-600 scale-125' : 'text-zinc-400'}
                                                `}
                                            >
                                                {char}
                                            </span>
                                         );
                                    })}
                                </div>
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
                     <CodeHighlight code={KMP_CODE} activeLine={stepData.lineNumber} />
                     
                      <div className="bg-zinc-50 dark:bg-zinc-900/30 p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-4">
                            <h3 className="font-bold text-foreground">Complexity</h3>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="text-muted-foreground block mb-1">Time</span>
                                    <span className="font-mono bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded">O(N + M)</span>
                                </div>
                                <div>
                                    <span className="text-muted-foreground block mb-1">Space</span>
                                    <span className="font-mono bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded">O(M)</span>
                                </div>
                            </div>
                             <p className="text-xs text-muted-foreground mt-2">Where N is text length, M is pattern length. Guaranteed linear time.</p>
                        </div>
                </div>
            </div>
        </div>
    );
}

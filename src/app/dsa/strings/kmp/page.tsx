"use client";

import { useEffect, useState } from "react";
import BackButton from "@/components/ui/BackButton";
import CodeHighlight from "@/components/visualizations/CodeHighlight";
import StringVisualizer from "@/components/visualizations/StringVisualizer";
import { generateKMPSteps, KMPStep } from "@/lib/algorithms/strings/kmp";
import { Play, Pause, RotateCcw } from "lucide-react";

const KMP_CODE = `function KMP(text, pattern):
  // 1. Build LPS
  len = 0, i = 1
  while i < M:
    if pat[i] == pat[len]: lps[i++] = ++len
    else: 
      if len != 0: len = lps[len-1]
      else: lps[i++] = 0

  // 2. Search
  i = 0, j = 0
  while i < N:
    if pat[j] == text[i]: i++, j++
    if j == M: print("Found"); j = lps[j-1]
    else if i < N and pat[j] != text[i]:
      if j != 0: j = lps[j-1]
      else: i++`;

export default function KMPPage() {
    const [textInput, setTextInput] = useState("ABABDABACDABABCABAB");
    const [patternInput, setPatternInput] = useState("ABABCABAB");
    
    const [steps, setSteps] = useState<KMPStep[]>([]);
    const [currentStep, setCurrentStep] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [speed, setSpeed] = useState(600);
    const [message, setMessage] = useState("Enter text/pattern and run");
    const [isProcessing, setIsProcessing] = useState(false);
    
    // Playback
    useEffect(() => {
        if (isPlaying) {
            const timer = setInterval(() => {
                setCurrentStep((prev) => {
                    if (prev < steps.length - 1) {
                        return prev + 1;
                    } else {
                        setIsPlaying(false);
                        setIsProcessing(false);
                        setMessage("Complete");
                        return prev;
                    }
                });
            }, speed);
            return () => clearInterval(timer);
        }
    }, [isPlaying, speed, steps]);

    const stepData = steps.length > 0 ? steps[currentStep] : { 
        text: textInput,
        pattern: patternInput,
        lps: new Array(patternInput.length).fill(0),
        pointers: [],
        highlights: [],
        message: "Ready",
        lineNumber: undefined
    };

    const handleRun = () => {
        if (!textInput || !patternInput) return;
        if (isProcessing) return;
        
        setIsProcessing(true);
        const gen = generateKMPSteps(textInput, patternInput);
        const newSteps = Array.from(gen);
        setSteps(newSteps);
        setCurrentStep(0);
        setIsPlaying(true);
    };

    const handleReset = () => {
        setSteps([]);
        setCurrentStep(0);
        setIsPlaying(false);
        setIsProcessing(false);
        setMessage("Reset");
    };

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            <BackButton href="/dsa/strings" />
            <div>
                 <h1 className="text-3xl font-bold text-foreground mb-2">KMP Algorithm</h1>
                 <p className="text-muted-foreground">Knuth-Morris-Pratt Pattern Matching using Longest Prefix Suffix (LPS) array.</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    {/* Visualizer */}
                     <div className="border rounded-lg bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 p-8 min-h-[500px] flex flex-col items-center justify-center gap-12 overflow-auto">
                        <StringVisualizer 
                            strings={[
                                { id: 'text', label: "Text", value: stepData.text },
                                { id: 'pattern', label: "Pattern", value: stepData.pattern },
                                { id: 'lps', label: "LPS Array", value: stepData.lps.join(' ') } // Hacky way to reuse char box for numbers
                            ]}
                            pointers={stepData.pointers}
                            highlights={stepData.highlights}
                        />
                     </div>

                    {/* Status */}
                     <div className="bg-zinc-100 dark:bg-zinc-900/50 p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 flex justify-between items-center text-sm font-mono text-zinc-600 dark:text-zinc-400">
                        <span>Status: <span className="text-yellow-600 dark:text-yellow-500 font-bold">{stepData.message || message}</span></span>
                         <div className="flex items-center gap-4">
                            <button 
                                onClick={() => setIsPlaying(!isPlaying)}
                                disabled={!isProcessing} 
                                className="p-2 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-full disabled:opacity-50"
                            >
                                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                            </button>
                             <div className="flex items-center gap-2">
                                <span className="text-xs">Speed</span>
                                <input 
                                    type="range" 
                                    min="100" 
                                    max="1000" 
                                    step="100"
                                    value={1100 - speed} 
                                    onChange={(e) => setSpeed(1100 - parseInt(e.target.value))}
                                    className="w-20 h-1 bg-zinc-300 rounded-full appearance-none cursor-pointer"
                                />
                             </div>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-1 space-y-6">
                     <div className="sticky top-6">
                        <CodeHighlight code={KMP_CODE} activeLine={stepData.lineNumber} />

                        {/* Controls */}
                        <div className="grid grid-cols-1 gap-4 mt-6">
                            <div className="bg-zinc-50 dark:bg-zinc-900/30 p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-4">
                                <div>
                                    <label className="text-xs uppercase text-zinc-500 font-bold mb-2 block">Text</label>
                                    <input 
                                        value={textInput} 
                                        onChange={(e) => {
                                            setTextInput(e.target.value);
                                            handleReset();
                                        }}
                                        className="w-full bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded px-3 py-2 text-sm font-mono"
                                        disabled={isProcessing}
                                    />
                                </div>
                                <div>
                                    <label className="text-xs uppercase text-zinc-500 font-bold mb-2 block">Pattern</label>
                                    <input 
                                        value={patternInput} 
                                        onChange={(e) => {
                                            setPatternInput(e.target.value);
                                            handleReset();
                                        }}
                                        className="w-full bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded px-3 py-2 text-sm font-mono"
                                        disabled={isProcessing}
                                    />
                                </div>
                                
                                <button onClick={handleRun} disabled={isProcessing} className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded text-sm font-medium transition disabled:opacity-50">
                                    <Play className="w-4 h-4" /> Run KMP
                                </button>
                                <button onClick={handleReset} disabled={isProcessing} className="w-full flex items-center justify-center gap-2 bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-800 text-foreground py-2 rounded text-sm font-medium transition disabled:opacity-50">
                                    <RotateCcw className="w-4 h-4" /> Reset
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

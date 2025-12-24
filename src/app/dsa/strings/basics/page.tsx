"use client";

import { useEffect, useState } from "react";
import BackButton from "@/components/ui/BackButton";
import CodeHighlight from "@/components/visualizations/CodeHighlight";
import StringVisualizer from "@/components/visualizations/StringVisualizer";
import { generateReverseSteps, generatePalindromeSteps, StringStep } from "@/lib/algorithms/strings/basics";
import { Play, Pause, RotateCcw, RefreshCw, CheckCircle } from "lucide-react";

const REVERSE_CODE = `function reverse(str):
  left = 0, right = len - 1
  while left < right:
    swap(str[left], str[right])
    left++, right--`;

const PALINDROME_CODE = `function isPalindrome(str):
  left = 0, right = len - 1
  while left < right:
    if str[left] != str[right]:
      return false
    left++, right--
  return true`;

export default function StringBasicsPage() {
    const [inputValue, setInputValue] = useState("hello");
    const [mode, setMode] = useState<'REVERSE' | 'PALINDROME'>('REVERSE');
    
    const [steps, setSteps] = useState<StringStep[]>([]);
    const [currentStep, setCurrentStep] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [speed, setSpeed] = useState(800);
    const [message, setMessage] = useState("Ready");
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
        chars: inputValue.split(''),
        pointers: [],
        highlights: [],
        message: "Ready",
        lineNumber: undefined,
        isValid: undefined
    };

    const handleRun = () => {
        if (!inputValue) return;
        if (isProcessing) return;
        
        setIsProcessing(true);
        const gen = mode === 'REVERSE' ? generateReverseSteps(inputValue) : generatePalindromeSteps(inputValue);
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
                 <h1 className="text-3xl font-bold text-foreground mb-2">String Basics</h1>
                 <p className="text-muted-foreground">Two-pointer techniques for manipulation and checking.</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    {/* Visualizer */}
                     <div className="border rounded-lg bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 p-8 min-h-[300px] flex items-center justify-center">
                        <StringVisualizer 
                            strings={[{ id: 'main', value: stepData.chars.join('') }]}
                            pointers={stepData.pointers.map(p => ({ ...p, stringId: 'main', id: p.label }))}
                            highlights={stepData.highlights.length > 0 ? [{ stringId: 'main', indices: stepData.highlights, color: stepData.isValid === false ? 'red' : undefined }] : []}
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
                         <div className="flex gap-2 mb-4">
                            <button 
                                onClick={() => { setMode('REVERSE'); handleReset(); }} 
                                className={`flex-1 py-2 text-xs font-bold rounded border ${mode === 'REVERSE' ? 'bg-indigo-100 border-indigo-500 text-indigo-700' : 'bg-white text-zinc-500'}`}
                            >
                                REVERSE
                            </button>
                            <button 
                                onClick={() => { setMode('PALINDROME'); handleReset(); }} 
                                className={`flex-1 py-2 text-xs font-bold rounded border ${mode === 'PALINDROME' ? 'bg-teal-100 border-teal-500 text-teal-700' : 'bg-white text-zinc-500'}`}
                            >
                                PALINDROME
                            </button>
                         </div>

                        <CodeHighlight code={mode === 'REVERSE' ? REVERSE_CODE : PALINDROME_CODE} activeLine={stepData.lineNumber} />

                        {/* Controls */}
                        <div className="grid grid-cols-1 gap-4 mt-6">
                            <div className="bg-zinc-50 dark:bg-zinc-900/30 p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-4">
                                <div>
                                    <label className="text-xs uppercase text-zinc-500 font-bold mb-2 block">String Input</label>
                                    <input 
                                        value={inputValue} 
                                        onChange={(e) => {
                                            setInputValue(e.target.value);
                                            handleReset();
                                        }}
                                        className="w-full bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded px-3 py-2 text-sm"
                                        placeholder="e.g. racecar"
                                        disabled={isProcessing}
                                    />
                                </div>
                                
                                <button onClick={handleRun} disabled={isProcessing} className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded text-sm font-medium transition disabled:opacity-50">
                                    <Play className="w-4 h-4" /> Run {mode === 'REVERSE' ? 'Reversal' : 'Check'}
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

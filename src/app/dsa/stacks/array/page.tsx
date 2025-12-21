"use client";

import { useEffect, useState, useRef } from "react";
import BackButton from "@/components/ui/BackButton";
import ArrayStackVisualizer from "@/components/visualizations/ArrayStackVisualizer";
import CodeHighlight from "@/components/visualizations/CodeHighlight";
import { 
    StackStep, 
    generateCreateStackSteps, 
    generatePushSteps, 
    generatePopSteps, 
    generatePeekSteps, 
    generateIsEmptySteps, 
    generateIsFullSteps, 
    generateGetSizeSteps 
} from "@/lib/algorithms/stack/arrayStack";
import { Play, Pause, Plus, Trash2, Eye, Circle, RotateCcw } from "lucide-react";

const PUSH_CODE = `function push(val):
  if top == capacity - 1:
    return Overflow
  top++
  stack[top] = val`;

const POP_CODE = `function pop():
  if top == -1:
    return Underflow
  val = stack[top]
  top--
  return val`;

const PEEK_CODE = `function peek():
  if top == -1:
    return Empty
  return stack[top]`;

const IS_EMPTY_CODE = `function isEmpty():
  return top == -1`;

const IS_FULL_CODE = `function isFull():
  return top == capacity - 1`;

const GET_SIZE_CODE = `function getSize():
  return top + 1`;

export default function ArrayStackPage() {
    const [maxSize, setMaxSize] = useState(5);
    const [array, setArray] = useState<(number | null)[]>(new Array(5).fill(null));
    const [top, setTop] = useState(-1);
    
    const [steps, setSteps] = useState<StackStep[]>([]);
    const [currentStep, setCurrentStep] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [speed, setSpeed] = useState(500);
    const [message, setMessage] = useState("Ready.");
    const [isProcessing, setIsProcessing] = useState(false);
    const [activeCode, setActiveCode] = useState(PUSH_CODE);
    const [highlightedIndices, setHighlightedIndices] = useState<number[]>([]);
    const [activeLine, setActiveLine] = useState<number | undefined>(undefined);

    const [inputValue, setInputValue] = useState("10");
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // Playback Loop
    useEffect(() => {
        if (isPlaying) {
            timerRef.current = setInterval(() => {
                setCurrentStep((prev) => {
                    if (prev < steps.length - 1) {
                        return prev + 1;
                    } else {
                        setIsPlaying(false);
                        setIsProcessing(false);
                        if (steps.length > 0) {
                             const finalStep = steps[steps.length - 1];
                             setArray(finalStep.array);
                             setTop(finalStep.top);
                             setHighlightedIndices([]);
                             setActiveLine(undefined);
                             setMessage("Operation complete.");
                        }
                        return prev;
                    }
                });
            }, speed);
        } else if (timerRef.current) {
            clearInterval(timerRef.current);
        }
        return () => {
             if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [isPlaying, speed, steps]);
    
    // Sync UI with current step
    useEffect(() => {
        if (steps.length > 0 && currentStep < steps.length) {
            const step = steps[currentStep];
            setArray(step.array);
            setTop(step.top);
            setHighlightedIndices(step.highlightedIndices);
            setActiveLine(step.lineNumber);
            setMessage(step.message);
        }
    }, [currentStep, steps]);

    const executeOperation = (generator: Generator<StackStep>) => {
        if (isProcessing) return;
        setIsProcessing(true);
        const newSteps = Array.from(generator);
        if (newSteps.length === 0) {
            setIsProcessing(false);
            return;
        }
        setSteps(newSteps);
        setCurrentStep(0);
        setIsPlaying(true);
    };

    const handleCreate = () => {
        if (isProcessing) return;
        const newArray = new Array(maxSize).fill(null);
        setArray(newArray);
        setTop(-1);
        setSteps([]);
        setMessage(`Stack reset with capacity ${maxSize}`);
    };

    const handlePush = () => {
        const val = parseInt(inputValue);
        if (isNaN(val)) return;
        setActiveCode(PUSH_CODE);
        executeOperation(generatePushSteps(array, top, val, maxSize));
    };

    const handlePop = () => {
        setActiveCode(POP_CODE);
        executeOperation(generatePopSteps(array, top));
    };

    const handlePeek = () => {
        setActiveCode(PEEK_CODE);
        executeOperation(generatePeekSteps(array, top));
    };
    
    const handleIsEmpty = () => {
        setActiveCode(IS_EMPTY_CODE);
        executeOperation(generateIsEmptySteps(top, array));
    };
    
    const handleIsFull = () => {
        setActiveCode(IS_FULL_CODE);
        executeOperation(generateIsFullSteps(top, maxSize, array));
    };
    
    const handleGetSize = () => {
        setActiveCode(GET_SIZE_CODE);
        executeOperation(generateGetSizeSteps(top, array));
    };

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            <BackButton />
            <div>
                 <h1 className="text-3xl font-bold text-foreground mb-2">Array-Based Stack</h1>
                 <p className="text-muted-foreground">LIFO (Last-In, First-Out) data structure implemented using a fixed-size array.</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    {/* Visualizer Area */}
                    <div className="bg-white dark:bg-zinc-900/50 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden min-h-[500px] flex items-center justify-center relative">
                        <ArrayStackVisualizer array={array} top={top} highlightedIndices={highlightedIndices} />
                        
                        {/* Legend/Info Overlay */}
                         <div className="absolute top-4 right-4 flex flex-col gap-2 text-xs text-zinc-500 font-mono">
                             <div>Capacity: {maxSize}</div>
                             <div>Size: {top + 1}</div>
                         </div>
                    </div>

                    {/* Status & Playback */}
                     <div className="bg-zinc-100 dark:bg-zinc-900/50 p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 flex justify-between items-center text-sm font-mono text-zinc-600 dark:text-zinc-400">
                        <span>Status: <span className="text-yellow-600 dark:text-yellow-500 font-bold">{message}</span></span>
                         <div className="flex items-center gap-4">
                            <button 
                                onClick={() => setIsPlaying(!isPlaying)}
                                disabled={!isProcessing} // Only enable play/pause if operation is running
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
                    {/* Code Highlight */}
                     <div className="sticky top-6">
                        <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-3">Algorithm Logic</h3>
                        <CodeHighlight code={activeCode} activeLine={activeLine} />
                    </div>
                    
                    {/* Controls */}
                    <div className="grid grid-cols-1 gap-4">
                        <div className="bg-zinc-50 dark:bg-zinc-900/30 p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-4">
                            <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider">Operations</h3>
                            
                            <div className="flex gap-2">
                                <input 
                                    type="number" 
                                    value={inputValue} 
                                    onChange={(e) => setInputValue(e.target.value)} 
                                    className="w-20 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded px-3 py-2 text-sm"
                                    placeholder="Val"
                                />
                                <button onClick={handlePush} disabled={isProcessing} className="flex-1 flex items-center justify-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:text-black py-2 rounded text-sm font-medium transition disabled:opacity-50">
                                   <Plus className="w-4 h-4" /> Push
                                </button>
                            </div>
                            
                            <button onClick={handlePop} disabled={isProcessing} className="w-full flex items-center justify-center gap-2 bg-red-100 hover:bg-red-200 text-red-700 dark:bg-red-900/30 dark:text-red-200 py-2 rounded text-sm font-medium transition disabled:opacity-50">
                                <Trash2 className="w-4 h-4" /> Pop
                            </button>

                            <button onClick={handlePeek} disabled={isProcessing} className="w-full flex items-center justify-center gap-2 bg-purple-100 hover:bg-purple-200 text-purple-700 dark:bg-purple-900/30 dark:text-purple-200 py-2 rounded text-sm font-medium transition disabled:opacity-50">
                                <Eye className="w-4 h-4" /> Peek
                            </button>
                        </div>

                         <div className="bg-zinc-50 dark:bg-zinc-900/30 p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-4">
                             <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider">Checks</h3>
                             <div className="grid grid-cols-2 gap-2">
                                 <button onClick={handleIsEmpty} disabled={isProcessing} className="bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-800 dark:text-white py-2 rounded text-sm font-medium transition disabled:opacity-50">Is Empty?</button>
                                 <button onClick={handleIsFull} disabled={isProcessing} className="bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-800 dark:text-white py-2 rounded text-sm font-medium transition disabled:opacity-50">Is Full?</button>
                                 <button onClick={handleGetSize} disabled={isProcessing} className="col-span-2 bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-800 dark:text-white py-2 rounded text-sm font-medium transition disabled:opacity-50">Get Size</button>
                             </div>
                         </div>
                         
                         <div className="bg-zinc-50 dark:bg-zinc-900/30 p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-4">
                             <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider">Configuration</h3>
                             <div className="flex items-center justify-between gap-2">
                                <span className="text-sm">Capacity: {maxSize}</span>
                                <div className="flex gap-2">
                                    <button onClick={() => { setMaxSize(Math.max(1, maxSize - 1)); handleCreate(); }} className="px-2 py-1 bg-zinc-200 rounded text-sm hover:bg-zinc-300 disabled:opacity-50" disabled={isProcessing}>-</button>
                                    <button onClick={() => { setMaxSize(maxSize + 1); handleCreate(); }} className="px-2 py-1 bg-zinc-200 rounded text-sm hover:bg-zinc-300 disabled:opacity-50" disabled={isProcessing}>+</button>
                                </div>
                             </div>
                             <button onClick={handleCreate} disabled={isProcessing} className="w-full flex items-center justify-center gap-2 bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-800 dark:text-white py-2 rounded text-sm font-medium transition disabled:opacity-50">
                                <RotateCcw className="w-4 h-4" /> Reset Stack
                            </button>
                         </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

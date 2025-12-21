"use client";

import { useEffect, useState, useRef } from "react";
import BackButton from "@/components/ui/BackButton";
import CodeHighlight from "@/components/visualizations/CodeHighlight";
import { 
    QueueStep, 
} from "@/lib/algorithms/queue/arrayQueue";
import { 
    generateAddFrontSteps, 
    generateAddRearSteps, 
    generateRemoveFrontSteps, 
    generateRemoveRearSteps 
} from "@/lib/algorithms/queue/deque";
import { Play, Pause, Plus, Trash2, RotateCcw, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ADD_FRONT_CODE = `function addFront(val):
  if isFull(): return Overflow
  if isEmpty(): front = rear = 0
  else: front = (front - 1 + cap) % cap
  deque[front] = val
  size++`;

const ADD_REAR_CODE = `function addRear(val):
  if isFull(): return Overflow
  if isEmpty(): front = rear = 0
  else: rear = (rear + 1) % cap
  deque[rear] = val
  size++`;

const REMOVE_FRONT_CODE = `function removeFront():
  if isEmpty(): return Underflow
  val = deque[front]
  if front == rear: front = rear = -1
  else: front = (front + 1) % cap
  size--
  return val`;

const REMOVE_REAR_CODE = `function removeRear():
  if isEmpty(): return Underflow
  val = deque[rear]
  if front == rear: front = rear = -1
  else: rear = (rear - 1 + cap) % cap
  size--
  return val`;

export default function DequePage() {
    const [capacity, setCapacity] = useState(5);
    const [array, setArray] = useState<(number | null)[]>(new Array(5).fill(null));
    const [front, setFront] = useState(-1);
    const [rear, setRear] = useState(-1);
    const [size, setSize] = useState(0);

    const [steps, setSteps] = useState<QueueStep[]>([]);
    const [currentStep, setCurrentStep] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [speed, setSpeed] = useState(500);
    const [message, setMessage] = useState("Deque is empty.");
    const [isProcessing, setIsProcessing] = useState(false);
    const [activeCode, setActiveCode] = useState(ADD_REAR_CODE);
    const [activeLine, setActiveLine] = useState<number | undefined>(undefined);

    const [inputValue, setInputValue] = useState("10");
    const timerRef = useRef<NodeJS.Timeout | null>(null);

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
                            const last = steps[steps.length - 1];
                            setArray(last.array);
                            setFront(last.front);
                            setRear(last.rear);
                            setSize(last.size);
                            setMessage("Operation complete.");
                            setActiveLine(undefined);
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

    useEffect(() => {
        if (steps.length > 0 && currentStep < steps.length) {
            const step = steps[currentStep];
            setArray(step.array);
            setFront(step.front);
            setRear(step.rear);
            setSize(step.size);
            setMessage(step.message);
            setActiveLine(step.lineNumber);
        }
    }, [currentStep, steps]);

    const executeOperation = (generator: Generator<QueueStep>) => {
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

    const handleReset = () => {
        if (isProcessing) return;
        setArray(new Array(capacity).fill(null));
        setFront(-1);
        setRear(-1);
        setSize(0);
        setSteps([]);
        setMessage(`Deque reset (Capacity: ${capacity})`);
    };

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            <BackButton href="/dsa/queues" />
            <div>
                 <h1 className="text-3xl font-bold text-foreground mb-2">Deque (Double-Ended Queue)</h1>
                 <p className="text-muted-foreground">Insert and Delete from both ends. Visualized as a Circular Buffer.</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    {/* Visualizer Area */}
                    <div className="bg-white dark:bg-zinc-900/50 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden min-h-[400px] flex items-center justify-center relative flex-col">
                        
                        <div className="flex gap-1 relative pl-8 pr-8">
                            <AnimatePresence>
                                {array.map((value, index) => {
                                    const isFront = index === front;
                                    const isRear = index === rear;
                                    // In deque, if size > 0, anything between front and rear modulo wrap is active.
                                    // Visualizer "isActive" check for coloring:
                                    let isActive = false;
                                    if (size > 0 && front !== -1) {
                                        if (rear >= front) isActive = index >= front && index <= rear;
                                        else isActive = index >= front || index <= rear;
                                    }

                                    const highlighted = steps.length > 0 && steps[currentStep]?.highlightedIndices.includes(index);

                                    return (
                                        <div key={index} className="relative flex flex-col items-center">
                                            {/* Pointers */}
                                            {isFront && front !== -1 && (
                                                <motion.div layoutId="front-ptr" className="absolute -top-8 text-xs font-bold text-emerald-600">FRONT</motion.div>
                                            )}
                                            
                                            <motion.div
                                                className={`
                                                    w-16 h-16 border-2 flex items-center justify-center text-xl font-bold rounded m-1
                                                    ${highlighted 
                                                        ? "bg-orange-100 border-orange-500 text-orange-700" 
                                                        : isActive 
                                                            ? "bg-white border-zinc-800 dark:bg-zinc-800 dark:border-zinc-600 shadow-sm" 
                                                            : "bg-zinc-100 border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800 text-zinc-400 opacity-50"}
                                                `}
                                            >
                                                {value}
                                            </motion.div>
                                            
                                            {/* Index */}
                                            <span className="text-xs text-zinc-400 font-mono mt-1">{index}</span>

                                            {isRear && rear !== -1 && (
                                                <motion.div layoutId="rear-ptr" className="absolute -bottom-8 text-xs font-bold text-blue-600">REAR</motion.div>
                                            )}
                                        </div>
                                    );
                                })}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Status & Playback */}
                     <div className="bg-zinc-100 dark:bg-zinc-900/50 p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 flex justify-between items-center text-sm font-mono text-zinc-600 dark:text-zinc-400">
                        <span>Size: {size} / {capacity}</span>
                        <span>Status: <span className="text-yellow-600 dark:text-yellow-500 font-bold">{message}</span></span>
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
                        <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-3">Algorithm Logic</h3>
                        <CodeHighlight code={activeCode} activeLine={activeLine} />

                        {/* Controls */}
                        <div className="grid grid-cols-1 gap-4 mt-6">
                            <div className="bg-zinc-50 dark:bg-zinc-900/30 p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-4">
                                <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider">Input</h3>
                                <div className="flex gap-2">
                                    <input 
                                        type="number" 
                                        value={inputValue} 
                                        onChange={(e) => setInputValue(e.target.value)} 
                                        className="w-full bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded px-3 py-2 text-sm"
                                        placeholder="Val"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <button 
                                        onClick={() => { 
                                            const val = parseInt(inputValue); 
                                            if(!isNaN(val)) { setActiveCode(ADD_FRONT_CODE); executeOperation(generateAddFrontSteps(array, front, rear, val, capacity, size)); }
                                        }} 
                                        disabled={isProcessing} 
                                        className="flex items-center justify-center gap-1 bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:text-black py-2 rounded text-xs font-bold transition disabled:opacity-50"
                                    >
                                       <Plus className="w-3 h-3" /> Front
                                    </button>
                                    <button 
                                        onClick={() => { 
                                            const val = parseInt(inputValue); 
                                            if(!isNaN(val)) { setActiveCode(ADD_REAR_CODE); executeOperation(generateAddRearSteps(array, front, rear, val, capacity, size)); }
                                        }} 
                                        disabled={isProcessing} 
                                        className="flex items-center justify-center gap-1 bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:text-black py-2 rounded text-xs font-bold transition disabled:opacity-50"
                                    >
                                       Rear <Plus className="w-3 h-3" />
                                    </button>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-2">
                                    <button 
                                        onClick={() => { setActiveCode(REMOVE_FRONT_CODE); executeOperation(generateRemoveFrontSteps(array, front, rear, capacity, size)); }} 
                                        disabled={isProcessing} 
                                        className="flex items-center justify-center gap-1 bg-red-100 hover:bg-red-200 text-red-700 dark:bg-red-900/30 dark:text-red-200 py-2 rounded text-xs font-bold transition disabled:opacity-50"
                                    >
                                        <Trash2 className="w-3 h-3" /> Front
                                    </button>
                                    <button 
                                        onClick={() => { setActiveCode(REMOVE_REAR_CODE); executeOperation(generateRemoveRearSteps(array, front, rear, capacity, size)); }} 
                                        disabled={isProcessing} 
                                        className="flex items-center justify-center gap-1 bg-red-100 hover:bg-red-200 text-red-700 dark:bg-red-900/30 dark:text-red-200 py-2 rounded text-xs font-bold transition disabled:opacity-50"
                                    >
                                        Rear <Trash2 className="w-3 h-3" />
                                    </button>
                                </div>
                            </div>

                             <div className="bg-zinc-50 dark:bg-zinc-900/30 p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-4">
                               <div className="flex items-center justify-between gap-2">
                                    <span className="text-sm">Capacity: {capacity}</span>
                                    <div className="flex gap-2">
                                        <button onClick={() => { setCapacity(Math.max(1, capacity - 1)); handleReset(); }} className="px-2 py-1 bg-zinc-200 rounded text-sm hover:bg-zinc-300 disabled:opacity-50" disabled={isProcessing}>-</button>
                                        <button onClick={() => { setCapacity(capacity + 1); handleReset(); }} className="px-2 py-1 bg-zinc-200 rounded text-sm hover:bg-zinc-300 disabled:opacity-50" disabled={isProcessing}>+</button>
                                    </div>
                                 </div>
                                 <button onClick={handleReset} disabled={isProcessing} className="w-full flex items-center justify-center gap-2 bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-800 dark:text-white py-2 rounded text-sm font-medium transition disabled:opacity-50">
                                    <RotateCcw className="w-4 h-4" /> Reset Deque
                                </button>
                             </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

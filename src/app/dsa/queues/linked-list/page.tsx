"use client";

import { useEffect, useState, useRef } from "react";
import BackButton from "@/components/ui/BackButton";
import LinkedListVisualizer, { LinkedListNode } from "@/components/visualizations/LinkedListVisualizer";
import CodeHighlight from "@/components/visualizations/CodeHighlight";
import { 
    generateEnqueueSteps, 
    generateDequeueSteps, 
    generatePeekSteps 
} from "@/lib/algorithms/queue/linkedListQueue";
import { LinkedListStep } from "@/lib/algorithms/linkedList/singly";
import { Play, Pause, Plus, Trash2, Eye, RotateCcw } from "lucide-react";

const ENQUEUE_CODE = `function enqueue(val):
  node = new Node(val)
  if rear == null:
    front = rear = node
    return
  rear.next = node
  rear = node`;

const DEQUEUE_CODE = `function dequeue():
  if front == null:
    return Underflow
  val = front.val
  front = front.next
  if front == null:
    rear = null
  return val`;

const PEEK_CODE = `function peek():
  if front == null:
    return Empty
  return front.val`;

export default function LinkedListQueuePage() {
    const [nodes, setNodes] = useState<LinkedListNode[]>([]);
    
    const [steps, setSteps] = useState<LinkedListStep[]>([]);
    const [currentStep, setCurrentStep] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [speed, setSpeed] = useState(500);
    const [message, setMessage] = useState("Queue is empty.");
    const [isProcessing, setIsProcessing] = useState(false);
    const [activeCode, setActiveCode] = useState(ENQUEUE_CODE);
    
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
                             setNodes(finalStep.nodes); 
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

    const executeOperation = (generator: Generator<LinkedListStep>) => {
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

    const handleEnqueue = () => {
        const val = parseInt(inputValue);
        if (isNaN(val)) return;
        setActiveCode(ENQUEUE_CODE);
        executeOperation(generateEnqueueSteps(nodes, val));
    };

    const handleDequeue = () => {
        setActiveCode(DEQUEUE_CODE);
        executeOperation(generateDequeueSteps(nodes));
    };

    const handlePeek = () => {
        setActiveCode(PEEK_CODE);
        executeOperation(generatePeekSteps(nodes));
    };

    const handleClear = () => {
        if (isProcessing) return;
        setNodes([]);
        setSteps([]);
        setMessage("Queue cleared.");
    };

    const currentStepData = steps.length > 0 && currentStep < steps.length 
        ? steps[currentStep] 
        : { nodes: nodes, highlightedNodes: [], pointers: {}, message: message };

    // Infer pointers if missing for static state
    if (currentStepData.nodes.length > 0 && Object.keys(currentStepData.pointers).length === 0) {
        currentStepData.pointers = { 
            [currentStepData.nodes[0].id]: "Front",
            [currentStepData.nodes[currentStepData.nodes.length - 1].id]: "Rear"
        };
        // If single node, it has both
        if (currentStepData.nodes.length === 1) {
             currentStepData.pointers[currentStepData.nodes[0].id] = "Front/Rear";
        }
    }

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            <BackButton href="/dsa/queues" />
            <div>
                 <h1 className="text-3xl font-bold text-foreground mb-2">Linked List-Based Queue</h1>
                 <p className="text-muted-foreground">Dynamic implementation with <strong>Front</strong> (Head) and <strong>Rear</strong> (Tail).</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <LinkedListVisualizer 
                        nodes={currentStepData.nodes}
                        highlightedNodes={currentStepData.highlightedNodes}
                        pointers={currentStepData.pointers}
                        mode="singly"
                    />

                    {/* Status & Playback */}
                     <div className="bg-zinc-100 dark:bg-zinc-900/50 p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 flex justify-between items-center text-sm font-mono text-zinc-600 dark:text-zinc-400">
                        <span>Size: <span className="text-zinc-900 dark:text-white">{currentStepData.nodes.length}</span></span>
                        <span>Status: <span className="text-yellow-600 dark:text-yellow-500 font-bold">{currentStepData.message || message}</span></span>
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
                        <CodeHighlight code={activeCode} activeLine={currentStepData.lineNumber} />
                    </div>

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
                                <button onClick={handleEnqueue} disabled={isProcessing} className="flex-1 flex items-center justify-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:text-black py-2 rounded text-sm font-medium transition disabled:opacity-50">
                                   <Plus className="w-4 h-4" /> Enqueue
                                </button>
                            </div>
                            
                            <button onClick={handleDequeue} disabled={isProcessing} className="w-full flex items-center justify-center gap-2 bg-red-100 hover:bg-red-200 text-red-700 dark:bg-red-900/30 dark:text-red-200 py-2 rounded text-sm font-medium transition disabled:opacity-50">
                                <Trash2 className="w-4 h-4" /> Dequeue
                            </button>

                            <button onClick={handlePeek} disabled={isProcessing} className="w-full flex items-center justify-center gap-2 bg-purple-100 hover:bg-purple-200 text-purple-700 dark:bg-purple-900/30 dark:text-purple-200 py-2 rounded text-sm font-medium transition disabled:opacity-50">
                                <Eye className="w-4 h-4" /> Peek
                            </button>
                        </div>

                        <div className="bg-zinc-50 dark:bg-zinc-900/30 p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-4">
                             <button onClick={handleClear} disabled={isProcessing} className="w-full flex items-center justify-center gap-2 bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-800 dark:text-white py-2 rounded text-sm font-medium transition disabled:opacity-50">
                                <RotateCcw className="w-4 h-4" /> Clear Queue
                            </button>
                         </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

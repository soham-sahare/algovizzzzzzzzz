"use client";

import { useEffect, useState, useRef } from "react";
import BackButton from "@/components/ui/BackButton";
import LinkedListVisualizer, { LinkedListNode } from "@/components/visualizations/LinkedListVisualizer";
import { 
    LinkedListStep,
    generateDetectCycleFloydSteps
} from "@/lib/algorithms/linkedList/challenges";
import { Play, Pause, RefreshCw, Waypoints, AlertCircle } from "lucide-react";
import CodeHighlight from "@/components/visualizations/CodeHighlight";

const DETECT_CYCLE_CODE = `function hasCycle(head):
  slow = head, fast = head
  while fast and fast.next:
    slow = slow.next
    fast = fast.next.next
    if slow == fast: return true
  return false`;

export default function CyclePage() {
  const [nodes, setNodes] = useState<LinkedListNode[]>([
      { id: "c1", value: 10 }, { id: "c2", value: 20 }, 
      { id: "c3", value: 30 }, { id: "c4", value: 40 },
      { id: "c5", value: 50 }, { id: "c6", value: 60 }
  ]);
  
  // Animation
  const [steps, setSteps] = useState<LinkedListStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(500);
  const [message, setMessage] = useState("Select a cycle target to begin.");
  const [activeCode, setActiveCode] = useState("");
  
  // Custom Inputs
  const [cycleTarget, setCycleTarget] = useState("-1"); // -1 = No cycle, 0..N = Index

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev < steps.length - 1) return prev + 1;
          setIsPlaying(false);
          // Apply final state
          if(steps.length > 0) setNodes(steps[steps.length-1].nodes);
          return prev;
        });
      }, speed);
    } else {
       if(timerRef.current) clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current!);
  }, [isPlaying, speed, steps]);

  const runAlgo = (generator: Generator<LinkedListStep>, code: string) => {
      setActiveCode(code);
      setSteps(Array.from(generator));
      setCurrentStep(0);
      setIsPlaying(true);
  };

  const handleDetectCycle = () => {
      const target = parseInt(cycleTarget);
      // Pass the *logical* cycle index to the visualizer generator
      // The generator will simulate the cycle mathematically
      runAlgo(generateDetectCycleFloydSteps(nodes, target), DETECT_CYCLE_CODE);
  };

  const currentStepData = steps.length > 0 ? steps[currentStep] : { nodes, highlightedNodes: [], pointers: {}, message };
  
  // Cycle Pointers Visual
  const cyclePointers = currentStepData.pointers;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <BackButton />
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Cycle Detection</h1>
            <p className="text-muted-foreground">Detect loops in Linked Lists using Floyd's Cycle-Finding Algorithm.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2 space-y-6">
            <LinkedListVisualizer 
                nodes={currentStepData.nodes}
                highlightedNodes={currentStepData.highlightedNodes}
                pointers={cyclePointers}
            />
            
             {/* Cycle Status Indicator */}
             {parseInt(cycleTarget) !== -1 && (
                <div className="bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 px-4 py-2 rounded-lg text-sm flex items-center gap-2 border border-amber-200 dark:border-amber-800">
                    <AlertCircle className="w-4 h-4" />
                    Cycle configured: Tail connects to Node Index {cycleTarget}
                </div>
            )}

            <div className="bg-zinc-100 dark:bg-zinc-900/50 p-4 rounded-lg flex justify-between items-center text-sm font-mono text-zinc-600 dark:text-zinc-400">
                <span>Status: <span className="text-zinc-900 dark:text-white font-bold">{currentStepData.message || message}</span></span>
                 <div className="flex items-center gap-4">
                     <button onClick={() => {
                         setNodes([
                            { id: "c1", value: 10 }, { id: "c2", value: 20 }, 
                            { id: "c3", value: 30 }, { id: "c4", value: 40 },
                            { id: "c5", value: 50 }, { id: "c6", value: 60 }
                        ]);
                        setSteps([]);
                        setMessage("Reset.");
                     }} className="p-2 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-full transition-colors" title="Reset List">
                         <RefreshCw className="w-4 h-4" />
                     </button>
                    <input type="range" min="100" max="1000" step="100" value={1100-speed} onChange={e => setSpeed(1100-parseInt(e.target.value))} className="w-24" />
                </div>
            </div>
         </div>

         <div className="lg:col-span-1">
             <CodeHighlight code={activeCode} />
         </div>
      </div>

      {/* Controls */}
      <div className="bg-zinc-50 dark:bg-zinc-900/30 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800">
          <div className="space-y-4">
               <h3 className="font-semibold text-zinc-500 uppercase tracking-wider text-sm flex items-center gap-2"><Waypoints className="w-4 h-4" /> Cycle Operations</h3>
               <div className="flex flex-wrap gap-4 items-center">
                   <div className="flex items-center gap-2">
                       <span className="text-sm text-zinc-500">Cycle Target:</span>
                       <select value={cycleTarget} onChange={e => setCycleTarget(e.target.value)} className="bg-white dark:bg-zinc-900 border border-zinc-300 rounded px-2 py-1 text-sm">
                           <option value="-1">None (Linear)</option>
                           {nodes.map((_, i) => <option key={i} value={i}>Index {i}</option>)}
                       </select>
                   </div>
                   
                   <button onClick={handleDetectCycle} className="bg-purple-100 text-purple-700 hover:bg-purple-200 px-4 py-2 rounded text-sm font-medium">Detect Cycle (Floyd)</button>
               </div>
          </div>
      </div>
    </div>
  );
}

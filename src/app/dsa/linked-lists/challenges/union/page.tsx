"use client";

import { useEffect, useState, useRef } from "react";
import BackButton from "@/components/ui/BackButton";
import LinkedListVisualizer, { LinkedListNode } from "@/components/visualizations/LinkedListVisualizer";
import { 
    LinkedListStep, 
    generateUnionSteps 
} from "@/lib/algorithms/linkedList/intersectionUnion";
import { Play, Pause, RefreshCw, Layers } from "lucide-react";
import CodeHighlight from "@/components/visualizations/CodeHighlight";

const UNION_CODE = `function getUnion(headA, headB):
  unionSet = new Set()
  result = new LinkedList()
  
  for node in [headA, headB]:
    while node:
      if !unionSet.has(node.value):
        unionSet.add(node.value)
        result.add(node.value)
      node = node.next
      
  return result.head`;

export default function UnionPage() {
  const initialNodesA: LinkedListNode[] = [
      { id: "u1", value: 10 }, 
      { id: "u2", value: 20 },
      { id: "u3", value: 30 }
  ];
  
  const initialNodesB: LinkedListNode[] = [
      { id: "v1", value: 20 },
      { id: "v2", value: 30 },
      { id: "v3", value: 40 }
  ];
  
  const [nodesA, setNodesA] = useState<LinkedListNode[]>(initialNodesA);
  const [nodesB, setNodesB] = useState<LinkedListNode[]>(initialNodesB);

  // Animation
  const [steps, setSteps] = useState<LinkedListStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(500);
  const [message, setMessage] = useState("Click 'Compute Union' to start.");
  const [activeCode, setActiveCode] = useState(UNION_CODE);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev < steps.length - 1) return prev + 1;
          setIsPlaying(false);
          return prev;
        });
      }, speed);
    } else {
        if(timerRef.current) clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current!);
  }, [isPlaying, speed, steps]);

  const handleRun = () => {
      // Generate steps
      const newSteps = Array.from(generateUnionSteps(nodesA, nodesB));
      setSteps(newSteps);
      setCurrentStep(0);
      setIsPlaying(true);
  };
  
  const handleReset = () => {
      setNodesA(initialNodesA);
      setNodesB(initialNodesB);
      setSteps([]);
      setCurrentStep(0);
      setMessage("Reset.");
      setIsPlaying(false);
  };

  const currentStepData = steps.length > 0 ? steps[currentStep] : { 
      nodes: nodesA, 
      auxiliaryNodes: nodesB,
      highlightedNodes: [], 
      pointers: {}, 
      message 
  };
  
  // During Union steps, we show A and B list being scanned.
  // At the end, we might want to show the specific Result list.
  // Our generator logic puts the result in 'nodes' property at the very last step, and clears 'auxiliaryNodes'.
  // So 'displayNodesA' will naturally become the result list at the end.
  const displayNodesA = currentStepData.nodes;
  const displayNodesB = currentStepData.auxiliaryNodes;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <BackButton />
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Union of Two Lists</h1>
            <p className="text-muted-foreground">Merge two lists into a new list containing all unique elements.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2 space-y-8">
            {/* List A (or Result) Visualization */}
            <div className="space-y-2">
                <span className="text-sm font-semibold text-zinc-500 uppercase">
                    {!displayNodesB ? "Result (Union)" : "List A"}
                </span>
                <LinkedListVisualizer 
                    nodes={displayNodesA}
                    highlightedNodes={currentStepData.highlightedNodes}
                    pointers={currentStepData.pointers}
                />
            </div>
            
            {/* List B Visualization */}
             {displayNodesB && (
                 <div className="space-y-2">
                    <span className="text-sm font-semibold text-zinc-500 uppercase">List B</span>
                    <LinkedListVisualizer 
                        nodes={displayNodesB}
                        highlightedNodes={currentStepData.highlightedNodes}
                        pointers={currentStepData.pointers}
                    />
                </div>
            )}

            <div className="bg-zinc-100 dark:bg-zinc-900/50 p-4 rounded-lg flex justify-between items-center text-sm font-mono text-zinc-600 dark:text-zinc-400">
                <span>Status: <span className="text-zinc-900 dark:text-white font-bold">{currentStepData.message || message}</span></span>
                <div className="flex items-center gap-4">
                     <button onClick={handleReset} className="p-2 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-full transition-colors" title="Reset">
                         <RefreshCw className="w-4 h-4" />
                     </button>
                     <div className="flex items-center gap-2">
                         <span className="text-xs">Speed:</span>
                        <input type="range" min="100" max="1000" step="100" value={1100-speed} onChange={e => setSpeed(1100-parseInt(e.target.value))} className="w-24" />
                     </div>
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
              <h3 className="font-semibold text-zinc-500 uppercase tracking-wider text-sm flex items-center gap-2"><Layers className="w-4 h-4" /> Operations</h3>
              <div className="flex gap-4">
                  <button onClick={handleRun} disabled={isPlaying} className="bg-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50 transition-colors flex items-center gap-2">
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      Compute Union
                  </button>
              </div>
          </div>
      </div>
    </div>
  );
}

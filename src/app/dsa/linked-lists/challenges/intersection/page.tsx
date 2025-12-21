"use client";

import { useEffect, useState, useRef } from "react";
import BackButton from "@/components/ui/BackButton";
import LinkedListVisualizer, { LinkedListNode } from "@/components/visualizations/LinkedListVisualizer";
import { 
    LinkedListStep, 
    generateIntersectionSteps 
} from "@/lib/algorithms/linkedList/intersectionUnion";
import { Play, Pause, RefreshCw, GitMerge } from "lucide-react";
import CodeHighlight from "@/components/visualizations/CodeHighlight";

const INTERSECTION_CODE = `function getIntersectionNode(headA, headB):
  if !headA or !headB: return null
  pA = headA, pB = headB
  
  while pA != pB:
    pA = !pA ? headB : pA.next
    pB = !pB ? headA : pB.next
    
  return pA // or pB`;

export default function IntersectionPage() {
  // Two lists that intersect at node with value 40 (id "c4")
  // List A: 10 -> 20 -> 40 -> 50 -> 60
  // List B: 90 -> 40 -> 50 -> 60
  // IDs need to be shared for visual intersection logic in our generator (strict equality)
  
  const commonTail = [
      { id: "c4", value: 40 },
      { id: "c5", value: 50 },
      { id: "c6", value: 60 }
  ];
  
  const initialNodesA: LinkedListNode[] = [
      { id: "a1", value: 10 }, 
      { id: "a2", value: 20 },
      ...commonTail
  ];
  
  const initialNodesB: LinkedListNode[] = [
      { id: "b1", value: 90 },
      ...commonTail
  ];
  
  const [nodesA, setNodesA] = useState<LinkedListNode[]>(initialNodesA);
  const [nodesB, setNodesB] = useState<LinkedListNode[]>(initialNodesB);

  // Animation
  const [steps, setSteps] = useState<LinkedListStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(500);
  const [message, setMessage] = useState("Click 'Find Intersection' to start.");
  const [activeCode, setActiveCode] = useState(INTERSECTION_CODE);

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
      const newSteps = Array.from(generateIntersectionSteps(nodesA, nodesB));
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
  
  const displayNodesA = currentStepData.nodes;
  const displayNodesB = currentStepData.auxiliaryNodes || nodesB; // Fallback if aux not present (e.g. initial state though our generator yields it)

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <BackButton />
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Intersection of Two Lists</h1>
            <p className="text-muted-foreground">Find the node where two Linked Lists merge using the Two-Pointer technique.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2 space-y-8">
            {/* List A Visualization */}
            <div className="space-y-2">
                <span className="text-sm font-semibold text-zinc-500 uppercase">List A (Head 1)</span>
                <LinkedListVisualizer 
                    nodes={displayNodesA}
                    highlightedNodes={currentStepData.highlightedNodes}
                    pointers={currentStepData.pointers}
                />
            </div>
            
            {/* List B Visualization */}
             <div className="space-y-2">
                <span className="text-sm font-semibold text-zinc-500 uppercase">List B (Head 2)</span>
                <LinkedListVisualizer 
                    nodes={displayNodesB}
                    highlightedNodes={currentStepData.highlightedNodes}
                    pointers={currentStepData.pointers}
                />
            </div>

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
              <h3 className="font-semibold text-zinc-500 uppercase tracking-wider text-sm flex items-center gap-2"><GitMerge className="w-4 h-4" /> Operations</h3>
              <div className="flex gap-4">
                  <button onClick={handleRun} disabled={isPlaying} className="bg-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50 transition-colors flex items-center gap-2">
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      Find Intersection
                  </button>
              </div>
          </div>
      </div>
    </div>
  );
}

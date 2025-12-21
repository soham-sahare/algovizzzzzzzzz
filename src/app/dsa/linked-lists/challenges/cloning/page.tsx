"use client";

import { useEffect, useState, useRef } from "react";
import BackButton from "@/components/ui/BackButton";
import LinkedListVisualizer, { LinkedListNode } from "@/components/visualizations/LinkedListVisualizer";
import { 
    LinkedListStep,
    generateDeepCopySteps,
    generateCloneRandomSteps,
} from "@/lib/algorithms/linkedList/challenges";
import { RefreshCw, RotateCcw } from "lucide-react";
import CodeHighlight from "@/components/visualizations/CodeHighlight";

const DEEP_COPY_CODE = `function deepCopy(head):
  if !head: return null
  
  newHead = Node(head.val)
  curr = head.next
  newCurr = newHead
  
  while curr:
    newCurr.next = Node(curr.val)
    curr = curr.next
    newCurr = newCurr.next
    
  return newHead`;

const CLONE_RANDOM_CODE = `function copyRandomList(head):
  if !head: return null
  
  // 1. Interweave
  curr = head
  while curr:
    copy = Node(curr.val)
    copy.next = curr.next
    curr.next = copy
    curr = copy.next
    
  // 2. Assign Random
  curr = head
  while curr:
    if curr.random:
        curr.next.random = curr.random.next
    curr = curr.next.next
    
  // 3. Separate
  dummy = Node(0)
  copyCurr = dummy
  curr = head
  while curr:
    copyCurr.next = curr.next
    curr.next = curr.next.next
    copyCurr = copyCurr.next
    curr = curr
    
  return dummy.next`;

export default function CloningPage() {
  const [nodes, setNodes] = useState<LinkedListNode[]>([
      { id: "c1", value: 1 }, { id: "c2", value: 2 }, 
      { id: "c3", value: 3 }
  ]);
  
  // Animation
  const [steps, setSteps] = useState<LinkedListStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(500);
  const [message, setMessage] = useState("Select a cloning strategy.");
  const [activeCode, setActiveCode] = useState("");
  
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

  const handleDeepCopy = () => {
    // Reset nodes first to clean state
    setNodes([{ id: "c1", value: 1 }, { id: "c2", value: 2 }, { id: "c3", value: 3 }]);
    runAlgo(generateDeepCopySteps(nodes), DEEP_COPY_CODE);
  };

  const handleCloneRandom = () => {
     setNodes([{ id: "c1", value: 1 }, { id: "c2", value: 2 }, { id: "c3", value: 3 }]);
     runAlgo(generateCloneRandomSteps(nodes), CLONE_RANDOM_CODE);
  };

  const currentStepData = steps.length > 0 ? steps[currentStep] : { nodes, highlightedNodes: [], pointers: {}, message };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <BackButton />
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Linked List Cloning</h1>
            <p className="text-muted-foreground">Visualize Deep Copy and Random Pointer Cloning.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2 space-y-6">
            <LinkedListVisualizer 
                nodes={currentStepData.nodes}
                highlightedNodes={currentStepData.highlightedNodes}
                pointers={currentStepData.pointers}
            />

            <div className="bg-zinc-100 dark:bg-zinc-900/50 p-4 rounded-lg flex justify-between items-center text-sm font-mono text-zinc-600 dark:text-zinc-400">
                <span>Status: <span className="text-zinc-900 dark:text-white font-bold">{currentStepData.message || message}</span></span>
                <div className="flex items-center gap-4">
                     <button onClick={() => {
                         setNodes([
                            { id: "c1", value: 1 }, { id: "c2", value: 2 }, 
                            { id: "c3", value: 3 }
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
              <h3 className="font-semibold text-zinc-500 uppercase tracking-wider text-sm flex items-center gap-2"><RotateCcw className="w-4 h-4" /> Operations</h3>
              <div className="flex flex-wrap gap-4">
                  <button onClick={handleDeepCopy} className="bg-zinc-900 text-white px-4 py-2 rounded text-sm font-medium hover:bg-zinc-800">Deep Copy</button>
                  <button onClick={handleCloneRandom} className="bg-zinc-900 text-white px-4 py-2 rounded text-sm font-medium hover:bg-zinc-800">Clone with Random Ptr</button>
              </div>
          </div>
      </div>
    </div>
  );
}

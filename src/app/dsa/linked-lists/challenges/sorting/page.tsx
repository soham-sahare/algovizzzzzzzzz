"use client";

import { useEffect, useState, useRef } from "react";
import BackButton from "@/components/ui/BackButton";
import LinkedListVisualizer, { LinkedListNode } from "@/components/visualizations/LinkedListVisualizer";
import { 
    LinkedListStep,
    generateMergeSortSteps,
    generateInsertionSortSteps,
} from "@/lib/algorithms/linkedList/challenges";
import { Play, Pause, RefreshCw, RotateCcw } from "lucide-react";
import CodeHighlight from "@/components/visualizations/CodeHighlight";

const MERGE_SORT_CODE = `function mergeSort(head):
  if !head or !head.next: return head
  
  // Find middle
  slow = head, fast = head.next
  while fast and fast.next:
    slow = slow.next
    fast = fast.next.next
  
  mid = slow.next
  slow.next = null
  
  left = mergeSort(head)
  right = mergeSort(mid)
  
  return merge(left, right)`;

const INSERTION_SORT_CODE = `function insertionSort(head):
  if !head or !head.next: return head
  
  sortedHead = null
  curr = head
  
  while curr:
    next = curr.next
    
    // Insert curr into sorted list
    if !sortedHead or sortedHead.val >= curr.val:
        curr.next = sortedHead
        sortedHead = curr
    else:
        temp = sortedHead
        while temp.next and temp.next.val < curr.val:
            temp = temp.next
        curr.next = temp.next
        temp.next = curr
        
    curr = next
    
  return sortedHead`;

export default function SortingPage() {
  const [nodes, setNodes] = useState<LinkedListNode[]>([
      { id: "s1", value: 40 }, { id: "s2", value: 10 }, 
      { id: "s3", value: 50 }, { id: "s4", value: 20 },
      { id: "s5", value: 30 }, { id: "s6", value: 60 }
  ]);
  
  // Animation
  const [steps, setSteps] = useState<LinkedListStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(500);
  const [message, setMessage] = useState("Select a sorting strategy.");
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

  const handleMergeSort = () => runAlgo(generateMergeSortSteps(nodes), MERGE_SORT_CODE);
  const handleInsertionSort = () => runAlgo(generateInsertionSortSteps(nodes), INSERTION_SORT_CODE);

  const currentStepData = steps.length > 0 ? steps[currentStep] : { nodes, highlightedNodes: [], pointers: {}, message };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <BackButton />
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Linked List Sorting</h1>
            <p className="text-muted-foreground">Visualize Sort algorithms adapted for Linked Lists: Merge Sort and Insertion Sort.</p>
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
                            { id: "s1", value: 40 }, { id: "s2", value: 10 }, 
                            { id: "s3", value: 50 }, { id: "s4", value: 20 },
                            { id: "s5", value: 30 }, { id: "s6", value: 60 }
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
                  <button onClick={handleMergeSort} className="bg-zinc-900 text-white px-4 py-2 rounded text-sm font-medium hover:bg-zinc-800">Merge Sort</button>
                  <button onClick={handleInsertionSort} className="bg-zinc-900 text-white px-4 py-2 rounded text-sm font-medium hover:bg-zinc-800">Insertion Sort</button>
              </div>
          </div>
      </div>
    </div>
  );
}

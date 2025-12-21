"use client";

import { useEffect, useState, useRef } from "react";
import BackButton from "@/components/ui/BackButton";
import LinkedListVisualizer, { LinkedListNode } from "@/components/visualizations/LinkedListVisualizer";
import { 
    LinkedListStep,
    generateRemoveNthFromEndSteps,
    generateRotateListSteps,
    generateSwapPairsSteps,
    generateOddEvenSteps
} from "@/lib/algorithms/linkedList/challenges";
import { RotateCcw, Trash2, RefreshCw, Shuffle, GitMerge } from "lucide-react";
import CodeHighlight from "@/components/visualizations/CodeHighlight";

const REMOVE_NTH_CODE = `function removeNthFromEnd(head, n):
  dummy = Node(0, head)
  fast = dummy
  slow = dummy
  
  // Move fast n+1 steps
  for i from 0 to n:
    fast = fast.next
    
  // Move both until fast hits end
  while fast:
    fast = fast.next
    slow = slow.next
    
  // Skip target
  slow.next = slow.next.next
  return dummy.next`;

const ROTATE_LIST_CODE = `function rotateRight(head, k):
  if !head: return null
  len = 1
  tail = head
  while tail.next:
    tail = tail.next, len++
    
  k = k % len
  if k == 0: return head
  
  // Find new tail
  cur = head
  for i from 0 to len - k - 1:
    cur = cur.next
    
  newHead = cur.next
  cur.next = null
  tail.next = head
  return newHead`;

const SWAP_PAIRS_CODE = `function swapPairs(head):
  if !head or !head.next: return head
  dummy = Node(0, head)
  prev = dummy
  
  while prev.next and prev.next.next:
    first = prev.next
    second = prev.next.next
    
    // Swap
    prev.next = second
    first.next = second.next
    second.next = first
    
    prev = first
  return dummy.next`;

const ODD_EVEN_CODE = `function oddEvenList(head):
  if !head: return null
  odd = head
  even = head.next
  evenHead = even
  
  while even and even.next:
    odd.next = even.next
    odd = odd.next
    even.next = odd.next
    even = even.next
    
  odd.next = evenHead
  return head`;

export default function ReorderingPage() {
  const [nodes, setNodes] = useState<LinkedListNode[]>([
      { id: "r1", value: 10 }, { id: "r2", value: 20 }, 
      { id: "r3", value: 30 }, { id: "r4", value: 40 },
      { id: "r5", value: 50 }, { id: "r6", value: 60 }
  ]);
  
  const [steps, setSteps] = useState<LinkedListStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(500);
  const [message, setMessage] = useState("Select a reordering strategy.");
  const [activeCode, setActiveCode] = useState("");
  
  // Custom Inputs
  const [removeN, setRemoveN] = useState("2");
  const [rotateK, setRotateK] = useState("1");

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev < steps.length - 1) return prev + 1;
          setIsPlaying(false);
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

  const handleRemoveNth = () => {
      const n = parseInt(removeN);
      if(!isNaN(n)) runAlgo(generateRemoveNthFromEndSteps(nodes, n), REMOVE_NTH_CODE);
  };

  const handleRotate = () => {
      const k = parseInt(rotateK);
      if(!isNaN(k)) runAlgo(generateRotateListSteps(nodes, k), ROTATE_LIST_CODE);
  };

  const handleSwapPairs = () => runAlgo(generateSwapPairsSteps(nodes), SWAP_PAIRS_CODE);
  const handleOddEven = () => runAlgo(generateOddEvenSteps(nodes), ODD_EVEN_CODE);

  const resetList = () => {
      setNodes([
          { id: "r1", value: 10 }, { id: "r2", value: 20 }, 
          { id: "r3", value: 30 }, { id: "r4", value: 40 },
          { id: "r5", value: 50 }, { id: "r6", value: 60 }
      ]);
      setSteps([]);
      setMessage("Reset.");
      setIsPlaying(false);
  };

  const currentStepData = steps.length > 0 ? steps[currentStep] : { nodes, highlightedNodes: [], pointers: {}, message };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <BackButton />
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Reordering Operations</h1>
            <p className="text-muted-foreground">Sophisticated list manipulations: Remove Nth, Rotate, Swap, Odd-Even.</p>
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
                     <button onClick={resetList} className="p-2 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-full transition-colors" title="Reset List">
                         <RotateCcw className="w-4 h-4" />
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
              <h3 className="font-semibold text-zinc-500 uppercase tracking-wider text-sm flex items-center gap-2"><Shuffle className="w-4 h-4" /> Operations</h3>
              <div className="flex flex-wrap gap-4">
                  
                  <div className="flex items-center gap-2 bg-white dark:bg-zinc-900 p-1 rounded border border-zinc-200 dark:border-zinc-700">
                      <input className="w-12 px-2 py-1 text-sm bg-transparent" placeholder="N" value={removeN} onChange={e => setRemoveN(e.target.value)} />
                      <button onClick={handleRemoveNth} className="flex items-center gap-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 px-3 py-1 rounded text-sm font-medium hover:opacity-80">
                          <Trash2 className="w-3 h-3" /> Remove Nth
                      </button>
                  </div>

                  <div className="flex items-center gap-2 bg-white dark:bg-zinc-900 p-1 rounded border border-zinc-200 dark:border-zinc-700">
                      <input className="w-12 px-2 py-1 text-sm bg-transparent" placeholder="K" value={rotateK} onChange={e => setRotateK(e.target.value)} />
                      <button onClick={handleRotate} className="flex items-center gap-2 bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-white px-3 py-1 rounded text-sm font-medium hover:bg-zinc-300">
                          <RefreshCw className="w-3 h-3" /> Rotate
                      </button>
                  </div>

                  <button onClick={handleSwapPairs} className="flex items-center gap-2 bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-white px-3 py-1 rounded text-sm font-medium hover:bg-zinc-300">
                      <Shuffle className="w-3 h-3" /> Swap Pairs
                  </button>

                  <button onClick={handleOddEven} className="flex items-center gap-2 bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-white px-3 py-1 rounded text-sm font-medium hover:bg-zinc-300">
                      <GitMerge className="w-3 h-3" /> Odd-Even
                  </button>
              </div>
          </div>
      </div>
    </div>
  );
}

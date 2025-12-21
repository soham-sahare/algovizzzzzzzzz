"use client";

import { useEffect, useState, useRef } from "react";
import BackButton from "@/components/ui/BackButton";
import LinkedListVisualizer, { LinkedListNode } from "@/components/visualizations/LinkedListVisualizer";
import { 
    LinkedListStep,
    generateReverseIterativeSteps,
    generateReverseRecursiveSteps,
    generateReverseKGroupSteps,
    generateReverseBetweenSteps,
} from "@/lib/algorithms/linkedList/challenges";
import { Play, Pause, RefreshCw, RotateCcw } from "lucide-react";
import CodeHighlight from "@/components/visualizations/CodeHighlight";

const ITERATIVE_REVERSE_CODE = `function reverseList(head):
  prev = null
  curr = head
  while curr:
    next = curr.next
    curr.next = prev
    prev = curr
    curr = next
  return prev`;

const RECURSIVE_REVERSE_CODE = `function reverse(head):
  if !head or !head.next: return head
  rest = reverse(head.next)
  head.next.next = head
  head.next = null
  return rest`;

const K_GROUP_CODE = `function reverseKGroup(head, k):
  curr = head, count = 0
  while curr and count < k:
    curr = curr.next, count++
  if count == k:
    prev = reverseKGroup(curr, k)
    while count-- > 0:
      tmp = head.next
      head.next = prev
      prev = head
      head = tmp
    head = prev
  return head`;

const REVERSE_BETWEEN_CODE = `function reverseBetween(head, left, right):
  if !head or left == right: return head
  dummy = Node(0, head)
  prev = dummy
  
  for i from 1 to left-1:
    prev = prev.next
    
  curr = prev.next
  for i from 1 to right-left:
    temp = curr.next
    curr.next = temp.next
    temp.next = prev.next
    prev.next = temp
    
  return dummy.next`;

export default function ReversalPage() {
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
  const [message, setMessage] = useState("Select a reversal strategy.");
  const [activeCode, setActiveCode] = useState("");
  
  // Custom Inputs
  const [kGroup, setKGroup] = useState("2");
  const [rangeStart, setRangeStart] = useState("1");
  const [rangeEnd, setRangeEnd] = useState("4");

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

  const handleReverseIterative = () => runAlgo(generateReverseIterativeSteps(nodes), ITERATIVE_REVERSE_CODE);
  const handleReverseRecursive = () => runAlgo(generateReverseRecursiveSteps(nodes), RECURSIVE_REVERSE_CODE);
  const handleReverseKGroup = () => {
      const k = parseInt(kGroup);
      if(!isNaN(k)) runAlgo(generateReverseKGroupSteps(nodes, k), K_GROUP_CODE);
  };
  const handleReverseBetween = () => {
      const l = parseInt(rangeStart), r = parseInt(rangeEnd);
      if(!isNaN(l) && !isNaN(r)) runAlgo(generateReverseBetweenSteps(nodes, l, r), REVERSE_BETWEEN_CODE);
  };

  const currentStepData = steps.length > 0 ? steps[currentStep] : { nodes, highlightedNodes: [], pointers: {}, message };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <BackButton />
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Linked List Reversal</h1>
            <p className="text-muted-foreground">Advanced reversal techniques: Iterative, Recursive, K-Group, and Between Range.</p>
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
              <h3 className="font-semibold text-zinc-500 uppercase tracking-wider text-sm flex items-center gap-2"><RotateCcw className="w-4 h-4" /> Operations</h3>
              <div className="flex flex-wrap gap-4">
                  <button onClick={handleReverseIterative} className="bg-zinc-900 text-white px-4 py-2 rounded text-sm font-medium hover:bg-zinc-800">Iterative Reverse</button>
                  <button onClick={handleReverseRecursive} className="bg-zinc-900 text-white px-4 py-2 rounded text-sm font-medium hover:bg-zinc-800">Recursive Reverse</button>
                  
                  <div className="flex items-center gap-2 bg-white dark:bg-zinc-900 p-1 rounded border border-zinc-200 dark:border-zinc-700">
                      <input className="w-12 px-2 py-1 text-sm bg-transparent" placeholder="K" value={kGroup} onChange={e => setKGroup(e.target.value)} />
                      <button onClick={handleReverseKGroup} className="bg-zinc-200 dark:bg-zinc-800 px-3 py-1 rounded text-sm font-medium hover:bg-zinc-300">K-Group</button>
                  </div>

                  <div className="flex items-center gap-2 bg-white dark:bg-zinc-900 p-1 rounded border border-zinc-200 dark:border-zinc-700">
                      <input className="w-10 px-2 py-1 text-sm bg-transparent" placeholder="L" value={rangeStart} onChange={e => setRangeStart(e.target.value)} />
                      <span className="text-zinc-400">-</span>
                      <input className="w-10 px-2 py-1 text-sm bg-transparent" placeholder="R" value={rangeEnd} onChange={e => setRangeEnd(e.target.value)} />
                      <button onClick={handleReverseBetween} className="bg-zinc-200 dark:bg-zinc-800 px-3 py-1 rounded text-sm font-medium hover:bg-zinc-300">Rev Between</button>
                  </div>
              </div>
          </div>
      </div>
    </div>
  );
}

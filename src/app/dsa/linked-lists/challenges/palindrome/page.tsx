"use client";

import { useEffect, useState, useRef } from "react";
import BackButton from "@/components/ui/BackButton";
import LinkedListVisualizer, { LinkedListNode } from "@/components/visualizations/LinkedListVisualizer";
import { 
    LinkedListStep,
    generateCheckPalindromeSteps,
    generateConvertToPalindromeSteps
} from "@/lib/algorithms/linkedList/challenges";
import { Play, RotateCcw, Check, ArrowRight } from "lucide-react";
import CodeHighlight from "@/components/visualizations/CodeHighlight";

const CHECK_PALINDROME_CODE = `function isPalindrome(head):
  if !head or !head.next: return true
  
  // Find Middle
  slow = head, fast = head
  while fast and fast.next:
    slow = slow.next
    fast = fast.next.next
    
  // Reverse Second Half
  prev = null, curr = slow
  while curr:
    temp = curr.next
    curr.next = prev
    prev = curr
    curr = temp
    
  // Compare Halves
  first = head, second = prev
  while second:
    if first.val != second.val: return false
    first = first.next
    second = second.next
    
  return true`;

const CONVERT_PALINDROME_CODE = `function makePalindrome(head):
  // Strategy: Mirror first half to second half
  // (Simplified for array-based visualization)
  
  len = length(head)
  left = 0, right = len - 1
  
  while left < right:
    // Copy value from left to right
    nodeAt(right).val = nodeAt(left).val
    left++
    right--
    
  return head`;

export default function PalindromePage() {
  const [nodes, setNodes] = useState<LinkedListNode[]>([
      { id: "p1", value: 1 }, { id: "p2", value: 2 }, 
      { id: "p3", value: 3 }, { id: "p4", value: 2 },
      { id: "p5", value: 1 } // Default Palindrome
  ]);
  
  const [steps, setSteps] = useState<LinkedListStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(500);
  const [message, setMessage] = useState("Select an operation.");
  const [activeCode, setActiveCode] = useState("");
  
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

  const handleCheck = () => runAlgo(generateCheckPalindromeSteps(nodes), CHECK_PALINDROME_CODE);
  const handleConvert = () => runAlgo(generateConvertToPalindromeSteps(nodes), CONVERT_PALINDROME_CODE);

  const resetList = (palindrome: boolean) => {
      if(palindrome) {
          setNodes([
             { id: "p1", value: 1 }, { id: "p2", value: 2 }, { id: "p3", value: 3 }, { id: "p4", value: 2 }, { id: "p5", value: 1 }
          ]);
      } else {
          setNodes([
             { id: "np1", value: 1 }, { id: "np2", value: 2 }, { id: "np3", value: 3 }, { id: "np4", value: 4 }, { id: "np5", value: 5 }
          ]);
      }
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
            <h1 className="text-3xl font-bold text-foreground mb-2">Palindrome Operations</h1>
            <p className="text-muted-foreground">Check if a list is a palindrome or convert it into one.</p>
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
                     <div className="flex gap-2">
                        <button onClick={() => resetList(true)} className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs rounded hover:opacity-80">Reset (True)</button>
                        <button onClick={() => resetList(false)} className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-xs rounded hover:opacity-80">Reset (False)</button>
                     </div>
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
                  <button onClick={handleCheck} className="flex items-center gap-2 bg-zinc-900 text-white px-4 py-2 rounded text-sm font-medium hover:bg-zinc-800">
                      <Check className="w-4 h-4" /> Check Palindrome
                  </button>
                  <button onClick={handleConvert} className="flex items-center gap-2 bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-white px-4 py-2 rounded text-sm font-medium hover:bg-zinc-300 dark:hover:bg-zinc-700">
                      <ArrowRight className="w-4 h-4" /> Convert to Palindrome
                  </button>
              </div>
          </div>
      </div>
    </div>
  );
}

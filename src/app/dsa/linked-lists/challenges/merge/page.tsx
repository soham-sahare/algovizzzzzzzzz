"use client";

import { useEffect, useState, useRef } from "react";
import BackButton from "@/components/ui/BackButton";
import LinkedListVisualizer, { LinkedListNode } from "@/components/visualizations/LinkedListVisualizer";
import { 
    LinkedListStep,
    generateMergeTwoListsSteps,
    generateMergeKListsSteps,
    generateMergeAlternateSteps,
} from "@/lib/algorithms/linkedList/challenges";
import { Play, Pause, RefreshCw, RotateCcw } from "lucide-react";
import CodeHighlight from "@/components/visualizations/CodeHighlight";

const MERGE_TWO_CODE = `function mergeTwoLists(l1, l2):
  dummy = Node(0)
  tail = dummy
  
  while l1 and l2:
    if l1.val < l2.val:
      tail.next = l1
      l1 = l1.next
    else:
      tail.next = l2
      l2 = l2.next
    tail = tail.next
    
  if l1: tail.next = l1
  if l2: tail.next = l2
  
  return dummy.next`;

const MERGE_K_CODE = `function mergeKLists(lists):
  if not lists: return null
  interval = 1
  while interval < len(lists):
    for i = 0 to len(lists) - interval step interval * 2:
      lists[i] = mergeTwoLists(lists[i], lists[i + interval])
    interval *= 2
  return lists[0]`;

const MERGE_ALTERNATE_CODE = `function mergeAlternate(l1, l2):
  p1 = l1, p2 = l2
  while p1 and p2:
    p1_next = p1.next
    p2_next = p2.next
    
    p1.next = p2
    if p1_next:
      p2.next = p1_next
      
    p1 = p1_next
    p2 = p2_next
  return l1`;

export default function MergePage() {
  // Initial disjoint lists state
  // List A: 1 -> 3 -> 5
  // List B: 2 -> 4 -> 6
  // To visualize disjoint lists in ONE visualizer, we just put them in the array.
  // We need to set 'next' manually to avoid auto-linking in visualizer if possible,
  // OR we rely on the visualizer connecting index i to i+1.
  // Wait, my updated LinkedListVisualizer (if it supported 'next') would be great.
  // But currently it likely still draws arrows linearly unless I modify it more.
  // Assuming standard behavior: [1,3,5, 2,4,6] looks like 1->3->5->2->4->6.
  // This is acceptable for "Input" if we treat it as "Pool of nodes".
  // Or we can use "pointers" to clearly label "Head A" and "Head B".
  
  const initialNodes: LinkedListNode[] = [
      { id: "a1", value: 1, next: "a2" }, { id: "a2", value: 3, next: "a3" }, { id: "a3", value: 5, next: "b1" }, // next="b1" strictly for array order viz
      { id: "b1", value: 2, next: "b2" }, { id: "b2", value: 4, next: "b3" }, { id: "b3", value: 6, next: null }
  ];

  const [nodes, setNodes] = useState<LinkedListNode[]>(initialNodes);
  
  // Animation
  const [steps, setSteps] = useState<LinkedListStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(500);
  const [message, setMessage] = useState("Select a merge strategy.");
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

  const handleMergeTwo = () => {
      // Pass the CURRENT nodes
      runAlgo(generateMergeTwoListsSteps(nodes, "a1", "b1"), MERGE_TWO_CODE);
  };

  const handleMergeK = () => {
      // Simulate 3 lists: [1,10], [2,11], [3,12]
      const kNodes = [
          { id: "k1_1", value: 1 }, { id: "k1_2", value: 10 },
          { id: "k2_1", value: 2 }, { id: "k2_2", value: 11 },
          { id: "k3_1", value: 3 }, { id: "k3_2", value: 12 }
      ];
      setNodes(kNodes);
      // We need to delay runAlgo until nodes are set? 
      // Actually runAlgo uses the passed nodes.
      // But we want to visualize the START state first.
      
      // Let's just run it on the new nodes immediately
      runAlgo(generateMergeKListsSteps(kNodes, ["k1_1", "k2_1", "k3_1"]), MERGE_K_CODE);
  };

  const handleMergeAlternate = () => {
      runAlgo(generateMergeAlternateSteps(nodes, "a1", "b1"), MERGE_ALTERNATE_CODE);
  };
  
  const handleReset = () => {
      setNodes(initialNodes);
      setSteps([]);
      setMessage("Reset to two lists.");
      setIsPlaying(false);
      setCurrentStep(0);
  };

  const currentStepData = steps.length > 0 ? steps[currentStep] : { nodes, highlightedNodes: [], pointers: {}, message };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <BackButton />
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Merge Operations</h1>
            <p className="text-muted-foreground">Merge Two Sorted Lists, Merge K Lists, and Alternating Merge.</p>
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
                     <button onClick={handleReset} className="p-2 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-full transition-colors" title="Reset List">
                         <RefreshCw className="w-4 h-4" />
                     </button>
                    <input type="range" min="100" max="1000" step="100" value={1100-speed} onChange={e => setSpeed(1100-parseInt(e.target.value))} className="w-24" />
                </div>
            </div>
         </div>

         <div className="lg:col-span-1">
             <CodeHighlight code={activeCode || MERGE_TWO_CODE} />
         </div>
      </div>

      {/* Controls */}
      <div className="bg-zinc-50 dark:bg-zinc-900/30 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800">
          <div className="space-y-4">
              <h3 className="font-semibold text-zinc-500 uppercase tracking-wider text-sm flex items-center gap-2"><RotateCcw className="w-4 h-4" /> Operations</h3>
              <div className="flex flex-wrap gap-4">
                  <button onClick={handleMergeTwo} className="bg-zinc-900 text-white px-4 py-2 rounded text-sm font-medium hover:bg-zinc-800">Merge Two Sorted</button>
                  <button onClick={handleMergeK} className="bg-zinc-200 dark:bg-zinc-800 px-4 py-2 rounded text-sm font-medium hover:bg-zinc-300">Merge K Lists</button>
                  <button onClick={handleMergeAlternate} className="bg-zinc-200 dark:bg-zinc-800 px-4 py-2 rounded text-sm font-medium hover:bg-zinc-300">Merge Alternately</button>
              </div>
          </div>
      </div>
    </div>
  );
}

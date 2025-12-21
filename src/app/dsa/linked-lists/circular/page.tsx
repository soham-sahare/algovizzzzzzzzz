"use client";

import { useEffect, useState, useRef } from "react";
import BackButton from "@/components/ui/BackButton";
import LinkedListVisualizer, { LinkedListNode } from "@/components/visualizations/LinkedListVisualizer";
import { LinkedListStep } from "@/lib/algorithms/linkedList/singly";
import { 
    generateCircularInsertHeadSteps, 
    generateCircularInsertTailSteps,
    generateCircularDeleteHeadSteps,
    generateCircularDeleteTailSteps,
    generateCircularInsertAtPositionSteps,
    generateCircularDeleteAtPositionSteps,
    generateCircularDeleteValueSteps,
    generateCircularSearchSteps,
    generateCircularReverseSteps,
    generateCircularCheckSteps,
    generateCircularSplitSteps,
    generateJosephusSteps
} from "@/lib/algorithms/linkedList/circular";
import { Plus, Trash2, Play, Pause, Search, Settings, ArrowRightLeft, Split, CheckCircle, Users } from "lucide-react";
import CodeHighlight from "@/components/visualizations/CodeHighlight";

const INSERT_HEAD_CODE = `function insertHead(val):
  newNode = new Node(val)
  if !head:
    newNode.next = newNode
  else:
    newNode.next = head
    tail.next = newNode
  head = newNode`;

const INSERT_TAIL_CODE = `function insertTail(val):
  if !head: return insertHead(val)
  newNode = new Node(val)
  newNode.next = head
  tail.next = newNode
  tail = newNode`;

const DELETE_HEAD_CODE = `function deleteHead():
  if head == tail: head = null
  else:
    head = head.next
    tail.next = head`;

const DELETE_TAIL_CODE = `function deleteTail():
  if head == tail: head = null
  else:
    curr = head
    while curr.next != tail:
      curr = curr.next
    curr.next = head
    tail = curr`;

const INSERT_POS_CODE = `function insert(val, idx):
  if idx==0: insertHead(val)
  curr = head
  for i from 0 to idx-1:
    curr = curr.next
  newNode = new Node(val)
  newNode.next = curr.next
  curr.next = newNode`;

const DELETE_POS_CODE = `function delete(idx):
  if idx==0: deleteHead()
  curr = head
  for i from 0 to idx-1:
    curr = curr.next
  curr.next = curr.next.next`;

const DELETE_VAL_CODE = `function delete(val):
  if head.val == val: deleteHead()
  curr = head
  while curr.next != head:
    if curr.next.val == val:
      curr.next = curr.next.next
      return
    curr = curr.next`;

const SEARCH_CODE = `function search(val):
  curr = head
  do:
    if curr.val == val: return found
    curr = curr.next
  while curr != head
  return not_found`;

const REVERSE_CODE = `function reverse():
  prev = tail
  curr = head
  do:
    next = curr.next
    curr.next = prev
    prev = curr
    curr = next
  while curr != head
  head = prev`;

const CHECK_CIRCULAR_CODE = `function isCircular():
  if !head: return true
  curr = head.next
  while curr and curr != head:
    curr = curr.next
  return curr == head`;

const SPLIT_CODE = `function split():
  slow = head, fast = head
  while fast.next != head and fast.next.next != head:
    fast = fast.next.next
    slow = slow.next
  head1 = head
  head2 = slow.next
  slow.next = head1
  curr = head2
  while curr.next != head: curr = curr.next
  curr.next = head2`;

const JOSEPHUS_CODE = `function josephus(k):
  curr = head
  while curr.next != curr:
    for i=1 to k-1: curr = curr.next
    curr.next = curr.next.next // Eliminate
  return curr.val`;

const TRAVERSE_CODE = `function traverse():
  curr = head
  if !head: return
  do:
    print(curr.val)
    curr = curr.next
  while curr != head`;

export default function CircularLinkedListPage() {
  const [nodes, setNodes] = useState<LinkedListNode[]>([
      { id: "c1", value: 10 }, 
      { id: "c2", value: 20 }, 
      { id: "c3", value: 30 },
      { id: "c4", value: 40 },
      { id: "c5", value: 50 },
  ]);
  
  const [steps, setSteps] = useState<LinkedListStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(500);
  const [message, setMessage] = useState("Ready for Circular operations.");
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [activeCode, setActiveCode] = useState(INSERT_HEAD_CODE);

  // Inputs
  const [inputValue, setInputValue] = useState("50");
  const [inputIndex, setInputIndex] = useState("0");
  const [deleteValue, setDeleteValue] = useState("20");
  const [deleteIndex, setDeleteIndex] = useState("0");
  const [searchValue, setSearchValue] = useState("20");
  const [josephusK, setJosephusK] = useState("2");

  const timerRef = useRef<NodeJS.Timeout | null>(null);

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

  const handleInsertHead = () => {
      const val = parseInt(inputValue);
      if (isNaN(val)) return;
      setActiveCode(INSERT_HEAD_CODE);
      executeOperation(generateCircularInsertHeadSteps(nodes, val));
  };

  const handleInsertTail = () => {
      const val = parseInt(inputValue);
      if (isNaN(val)) return;
      setActiveCode(INSERT_TAIL_CODE);
      executeOperation(generateCircularInsertTailSteps(nodes, val));
  };
   const handleInsertAtPosition = () => {
      const val = parseInt(inputValue);
      const idx = parseInt(inputIndex);
      if (isNaN(val) || isNaN(idx)) return;
      setActiveCode(INSERT_POS_CODE);
      executeOperation(generateCircularInsertAtPositionSteps(nodes, val, idx));
  };

  const handleDeleteHead = () => {
      setActiveCode(DELETE_HEAD_CODE);
      executeOperation(generateCircularDeleteHeadSteps(nodes));
  };
  
  const handleDeleteTail = () => {
      setActiveCode(DELETE_TAIL_CODE);
      executeOperation(generateCircularDeleteTailSteps(nodes));
  };
  const handleDeleteAtPosition = () => {
      const idx = parseInt(deleteIndex);
      if (isNaN(idx)) return;
      setActiveCode(DELETE_POS_CODE);
      executeOperation(generateCircularDeleteAtPositionSteps(nodes, idx));
  };
   const handleDeleteValue = () => {
      const val = parseInt(deleteValue);
      if (isNaN(val)) return;
      setActiveCode(DELETE_VAL_CODE);
      executeOperation(generateCircularDeleteValueSteps(nodes, val));
  };
   const handleSearch = () => {
      const val = parseInt(searchValue);
      if (isNaN(val)) return;
      setActiveCode(SEARCH_CODE);
      executeOperation(generateCircularSearchSteps(nodes, val));
  };
   const handleReverse = () => {
      setActiveCode(REVERSE_CODE);
      executeOperation(generateCircularReverseSteps(nodes));
  };
  
  const handleCheckCircular = () => {
      setActiveCode(CHECK_CIRCULAR_CODE);
      executeOperation(generateCircularCheckSteps(nodes));
  };

  const handleSplit = () => {
      setActiveCode(SPLIT_CODE);
      executeOperation(generateCircularSplitSteps(nodes));
  };
  
  const handleJosephus = () => {
      const k = parseInt(josephusK);
      if(isNaN(k)) return;
      setActiveCode(JOSEPHUS_CODE);
      executeOperation(generateJosephusSteps(nodes, k));
  };
   const handleTraverse = () => {
      setActiveCode(TRAVERSE_CODE);
      // Re-use traverse forward as they are visually defined in search mostly or create specific traverse
      // Actually let's just use Search logic but without looking for target, just to walk.
      // Or simplest is reused Check steps which traverse fully.
      executeOperation(generateCircularCheckSteps(nodes)); // reusing visual run
  };

  const currentStepData = steps.length > 0 && currentStep < steps.length 
      ? steps[currentStep] 
      : { nodes: nodes, highlightedNodes: [], pointers: {}, message: message };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <BackButton />
      
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Circular Linked List</h1>
        <p className="text-muted-foreground">The last node points back to the first node, forming a circle.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
            {/* Visualizer */}
            <LinkedListVisualizer 
                nodes={currentStepData.nodes}
                highlightedNodes={currentStepData.highlightedNodes}
                pointers={currentStepData.pointers}
                mode="circular"
            />
            
            {/* Status Bar */}
             <div className="bg-zinc-100 dark:bg-zinc-900/50 p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 flex justify-between items-center text-sm font-mono text-zinc-600 dark:text-zinc-400">
                <span>Length: <span className="text-zinc-900 dark:text-white">{currentStepData.nodes.length}</span></span>
                <span>Status: <span className="text-yellow-600 dark:text-yellow-500 font-bold">{currentStepData.message || message}</span></span>
            </div>

            {/* Playback Controls */}
            <div className="p-6 bg-white dark:bg-zinc-900/50 rounded-xl border border-zinc-200 dark:border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm dark:shadow-none">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="p-3 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-100 dark:hover:bg-white text-black rounded-full shadow-lg shadow-black/5 dark:shadow-white/10 transition-all active:scale-95"
                    >
                        {isPlaying ? <Pause className="fill-current w-5 h-5" /> : <Play className="fill-current ml-1 w-5 h-5" />}
                    </button>
                    <div className="text-zinc-600 dark:text-zinc-400 font-mono text-sm">
                        Step: {currentStep} / {Math.max(0, steps.length - 1)}
                    </div>
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto">
                    <span className="text-zinc-500 text-sm font-medium">Speed</span>
                    <input 
                        type="range" 
                        min="100" 
                        max="1000" 
                        step="100"
                        value={1100 - speed} 
                        onChange={(e) => setSpeed(1100 - parseInt(e.target.value))}
                        className="w-24 md:w-32 accent-zinc-900 dark:accent-white h-1.5 bg-zinc-200 dark:bg-zinc-700 rounded-full appearance-none cursor-pointer"
                    />
                </div>
            </div>
        </div>

        <div className="lg:col-span-1">
             <div className="sticky top-6">
                <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-3">Algorithm Logic</h3>
                <CodeHighlight code={activeCode} activeLine={currentStepData.lineNumber} />
            </div>
        </div>
      </div>

       {/* Controls */}
       <div className="grid md:grid-cols-3 gap-6">
            {/* Insert Controls */}
            <div className="bg-zinc-50 dark:bg-zinc-900/30 p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-3">
                <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider flex items-center gap-2">
                    <Plus className="w-4 h-4" /> Insert
                </h3>
                <div className="grid grid-cols-2 gap-2">
                    <input 
                        type="number" 
                        value={inputValue} 
                        onChange={(e) => setInputValue(e.target.value)} 
                        className="bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded px-3 py-2 text-sm"
                        placeholder="Val"
                    />
                    <input 
                        type="number" 
                        value={inputIndex} 
                        onChange={(e) => setInputIndex(e.target.value)} 
                        className="bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded px-3 py-2 text-sm"
                        placeholder="Idx"
                    />
                </div>
                <div className="grid grid-cols-3 gap-2">
                    <button onClick={handleInsertHead} disabled={isProcessing} className="bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:text-black py-2 rounded text-sm font-medium transition disabled:opacity-50">Head</button>
                    <button onClick={handleInsertTail} disabled={isProcessing} className="bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-800 dark:text-white py-2 rounded text-sm font-medium transition disabled:opacity-50">Tail</button>
                    <button onClick={handleInsertAtPosition} disabled={isProcessing} className="bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-800 dark:text-white py-2 rounded text-sm font-medium transition disabled:opacity-50">Pos</button>
                </div>
            </div>

             {/* Delete Controls */}
            <div className="bg-zinc-50 dark:bg-zinc-900/30 p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-3">
                <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider flex items-center gap-2">
                    <Trash2 className="w-4 h-4" /> Delete
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  <input 
                    type="number" 
                    value={deleteValue} 
                    onChange={(e) => setDeleteValue(e.target.value)} 
                    className="w-full bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded px-3 py-2 text-sm"
                    placeholder="Val"
                  />
                  <input 
                    type="number" 
                    value={deleteIndex} 
                    onChange={(e) => setDeleteIndex(e.target.value)} 
                    className="w-full bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded px-3 py-2 text-sm"
                    placeholder="Idx"
                  />
                </div>
                 <div className="grid grid-cols-2 gap-2">
                    <button onClick={handleDeleteValue} disabled={isProcessing} className="bg-red-100 hover:bg-red-200 text-red-700 dark:bg-red-900/30 dark:text-red-200 py-2 rounded text-sm font-medium transition disabled:opacity-50">Del Val</button>
                    <button onClick={handleDeleteAtPosition} disabled={isProcessing} className="bg-red-100 hover:bg-red-200 text-red-700 dark:bg-red-900/30 dark:text-red-200 py-2 rounded text-sm font-medium transition disabled:opacity-50">Del Pos</button>
                 </div>
            </div>

            {/* Operations Controls */}
             <div className="bg-zinc-50 dark:bg-zinc-900/30 p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-3">
                <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider flex items-center gap-2">
                    <Settings className="w-4 h-4" /> Operations
                </h3>
                <div className="flex gap-2">
                  <input 
                    type="number" 
                    value={searchValue} 
                    onChange={(e) => setSearchValue(e.target.value)} 
                    className="w-full bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded px-3 py-2 text-sm"
                    placeholder="Val"
                   />
                   <button onClick={handleSearch} disabled={isProcessing} className="whitespace-nowrap px-3 bg-blue-100 hover:bg-blue-200 text-blue-700 dark:bg-blue-900/30 dark:text-blue-200 py-2 rounded text-sm font-medium transition disabled:opacity-50">Search</button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                     <button onClick={handleCheckCircular} disabled={isProcessing} className="flex items-center justify-center gap-2 bg-green-100 hover:bg-green-200 text-green-700 dark:bg-green-900/30 dark:text-green-200 py-2 rounded text-sm font-medium transition disabled:opacity-50">
                        <CheckCircle className="w-4 h-4" /> Check
                     </button>
                     <button onClick={handleSplit} disabled={isProcessing} className="flex items-center justify-center gap-2 bg-purple-100 hover:bg-purple-200 text-purple-700 dark:bg-purple-900/30 dark:text-purple-200 py-2 rounded text-sm font-medium transition disabled:opacity-50">
                        <Split className="w-4 h-4" /> Split
                     </button>
                </div>
                
                 <div className="flex gap-2 border-t border-zinc-200 dark:border-zinc-700 pt-3 mt-1">
                    <input 
                        type="number" 
                        value={josephusK} 
                        onChange={(e) => setJosephusK(e.target.value)} 
                        className="w-16 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded px-3 py-2 text-sm"
                        placeholder="K"
                    />
                    <button onClick={handleJosephus} disabled={isProcessing} className="flex-1 flex items-center justify-center gap-2 bg-amber-100 hover:bg-amber-200 text-amber-700 dark:bg-amber-900/30 dark:text-amber-200 py-2 rounded text-sm font-medium transition disabled:opacity-50">
                         <Users className="w-4 h-4" /> Josephus
                    </button>
                </div>

                 <button onClick={handleReverse} disabled={isProcessing} className="w-full bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-800 dark:text-white py-2 rounded text-sm font-medium transition flex items-center justify-center gap-2 disabled:opacity-50">
                    <ArrowRightLeft className="w-4 h-4" /> Reverse List
                 </button>
            </div>
      </div>
    </div>
  );
}

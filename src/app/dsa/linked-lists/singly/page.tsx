"use client";

import { useEffect, useState, useRef } from "react";
import BackButton from "@/components/ui/BackButton";
import LinkedListVisualizer, { LinkedListNode } from "@/components/visualizations/LinkedListVisualizer";
import { 
    LinkedListStep, 
    generateInsertHeadSteps, 
    generateInsertTailSteps, 
    generateSearchSteps, 
    generateDeleteValueSteps,
    generateInsertAtPositionSteps,
    generateDeleteAtPositionSteps,
    generateReverseSteps
} from "@/lib/algorithms/linkedList/singly";
import { Plus, Trash2, Search, Play, Pause, RotateCcw, ArrowRightLeft, Settings, FastForward } from "lucide-react";
import CodeHighlight from "@/components/visualizations/CodeHighlight";

const INSERT_HEAD_CODE = `function insertHead(val):
  newNode = new Node(val)
  newNode.next = head
  head = newNode`;

const INSERT_TAIL_CODE = `function insertTail(val):
  if head is null: return insertHead(val)
  curr = head
  while curr.next: 
    curr = curr.next
  curr.next = new Node(val)`;

const SEARCH_CODE = `function search(val):
  curr = head
  while curr:
    if curr.val == val: return found
    curr = curr.next
  return not_found`;

const DELETE_VAL_CODE = `function delete(val):
  if head.val == val: head = head.next
  curr = head
  while curr.next:
    if curr.next.val == val:
      curr.next = curr.next.next
      return
    curr = curr.next`;

const INSERT_POS_CODE = `function insert(val, index):
  if index == 0: return insertHead(val)
  curr = head
  for i from 0 to index-1:
    curr = curr.next
  newNode = new Node(val)
  newNode.next = curr.next
  curr.next = newNode`;

const DELETE_POS_CODE = `function delete(index):
  if index == 0: head = head.next
  curr = head
  for i from 0 to index-1:
    curr = curr.next
  curr.next = curr.next.next`;

const REVERSE_CODE = `function reverse():
  prev = null
  curr = head
  while curr:
    next = curr.next
    curr.next = prev
    prev = curr
    curr = next
  head = prev`;

export default function SinglyLinkedListPage() {
  const [nodes, setNodes] = useState<LinkedListNode[]>([
      { id: "init1", value: 10 }, 
      { id: "init2", value: 20 }, 
      { id: "init3", value: 30 }
  ]);
  
  // Animation State
  const [steps, setSteps] = useState<LinkedListStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(500);
  const [message, setMessage] = useState("Ready to perform operations.");
  const [isProcessing, setIsProcessing] = useState(false);

  // Pseudocode State
  const [activeCode, setActiveCode] = useState(INSERT_HEAD_CODE); // Locks controls during animation

  // Inputs
  const [inputValue, setInputValue] = useState("40");
  const [inputIndex, setInputIndex] = useState("0");
  const [deleteValue, setDeleteValue] = useState("20");
  const [deleteIndex, setDeleteIndex] = useState("0");
  const [searchValue, setSearchValue] = useState("20");

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Playback Loop
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev < steps.length - 1) {
            return prev + 1;
          } else {
            setIsPlaying(false);
            setIsProcessing(false);
            // Apply final state to actual list
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

  // Execute Operation Wrapper
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
      executeOperation(generateInsertHeadSteps(nodes, val));
  };

  const handleInsertTail = () => {
      const val = parseInt(inputValue);
      if (isNaN(val)) return;
      setActiveCode(INSERT_TAIL_CODE);
      executeOperation(generateInsertTailSteps(nodes, val));
  };

  const handleSearch = () => {
      const val = parseInt(searchValue);
      if (isNaN(val)) return;
      setActiveCode(SEARCH_CODE);
      executeOperation(generateSearchSteps(nodes, val));
  };

  const handleInsertAtPosition = () => {
      const val = parseInt(inputValue);
      const idx = parseInt(inputIndex);
      if (isNaN(val) || isNaN(idx)) return;
      setActiveCode(INSERT_POS_CODE);
      executeOperation(generateInsertAtPositionSteps(nodes, val, idx));
  };

  const handleDeleteAtPosition = () => {
      const idx = parseInt(deleteIndex);
      if (isNaN(idx)) return;
      setActiveCode(DELETE_POS_CODE);
      executeOperation(generateDeleteAtPositionSteps(nodes, idx));
  };

  const handleDeleteValue = () => {
      const val = parseInt(deleteValue);
      if (isNaN(val)) return;
      setActiveCode(DELETE_VAL_CODE);
      executeOperation(generateDeleteValueSteps(nodes, val));
  };

  const handleReverse = () => {
      setActiveCode(REVERSE_CODE);
      executeOperation(generateReverseSteps(nodes));
  };

  const currentStepData = steps.length > 0 && currentStep < steps.length 
      ? steps[currentStep] 
      : { nodes: nodes, highlightedNodes: [], pointers: {}, message: message };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <BackButton />
      
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Singly Linked List</h1>
        <p className="text-muted-foreground">Detailed visualization of pointer manipulations for standard operations.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
            {/* Visualizer */}
            <LinkedListVisualizer 
                nodes={currentStepData.nodes}
                highlightedNodes={currentStepData.highlightedNodes}
                pointers={currentStepData.pointers}
            />
            
            {/* Status Bar */}
             <div className="bg-zinc-100 dark:bg-zinc-900/50 p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 flex justify-between items-center text-sm font-mono text-zinc-600 dark:text-zinc-400">
                <span>Length: <span className="text-zinc-900 dark:text-white">{currentStepData.nodes.length}</span></span>
                <span>Status: <span className="text-yellow-600 dark:text-yellow-500 font-bold">{currentStepData.message || message}</span></span>
                 {/* Speed Control */}
                 <div className="flex items-center gap-2">
                        <span className="text-xs">Speed</span>
                        <input 
                            type="range" 
                            min="100" 
                            max="1000" 
                            step="100"
                            value={1100 - speed} 
                            onChange={(e) => setSpeed(1100 - parseInt(e.target.value))}
                            className="w-20 h-1 bg-zinc-300 rounded-full appearance-none cursor-pointer"
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
                 <button onClick={handleReverse} disabled={isProcessing} className="w-full bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-800 dark:text-white py-2 rounded text-sm font-medium transition flex items-center justify-center gap-2 disabled:opacity-50">
                    <ArrowRightLeft className="w-4 h-4" /> Reverse List
                 </button>
            </div>
      </div>
    </div>
  );
}

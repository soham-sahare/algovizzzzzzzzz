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
    generateReverseSteps,
    generateInsertSortedSteps,
    generateDeleteAllOccurrencesSteps,
    generateTraverseSteps,
    generateFindNthSteps,
    generateFindMiddleSteps,
    generateGetLengthSteps,
    generateUpdateValueSteps,
    generateCheckSortedSteps
} from "@/lib/algorithms/linkedList/singly";
import { Plus, Trash2, Search, Play, Pause, RotateCcw, ArrowRightLeft, Settings, FastForward, Save, Eye, RefreshCcw, CheckSquare } from "lucide-react";
import CodeHighlight from "@/components/visualizations/CodeHighlight";

const INSERT_HEAD_CODE = `function insertHead(val):
  node = new Node(val)
  node.next = head
  head = node`;

const INSERT_TAIL_CODE = `function insertTail(val):
  node = new Node(val)
  if !head: head = node; return
  curr = head
  while curr.next: curr = curr.next
  curr.next = node`;

const INSERT_POS_CODE = `function insert(val, idx):
  if idx==0: insertHead(val)
  curr = head
  for i=0 to idx-1: curr = curr.next
  node = new Node(val)
  node.next = curr.next
  curr.next = node`;

const INSERT_SORTED_CODE = `function insertSorted(val):
  if !head or head.val >= val: insertHead(val)
  curr = head
  while curr.next and curr.next.val < val:
    curr = curr.next
  node = new Node(val)
  node.next = curr.next
  curr.next = node`;

const DELETE_HEAD_CODE = `function deleteHead():
  if head: head = head.next`;

// Re-using common deletes
const DELETE_POS_CODE = `function delete(idx):
  if idx==0: deleteHead()
  curr = head
  for i=0 to idx-1: curr = curr.next
  curr.next = curr.next.next`;

const DELETE_VAL_CODE = `function delete(val):
  if head.val == val: head = head.next; return
  curr = head
  while curr.next:
    if curr.next.val == val:
      curr.next = curr.next.next
      return
    curr = curr.next`;

const DELETE_ALL_CODE = `function deleteAll(val):
  while head and head.val == val: head = head.next
  curr = head
  while curr and curr.next:
    if curr.next.val == val:
      curr.next = curr.next.next
    else:
      curr = curr.next`;

const FIND_NTH_CODE = `function findNth(n):
  curr = head, count = 0
  while curr:
    if count == n: return curr
    curr = curr.next
    count++`;

const FIND_MIDDLE_CODE = `function findMiddle():
  slow = head, fast = head
  while fast and fast.next:
    slow = slow.next
    fast = fast.next.next
  return slow`;

const UPDATE_CODE = `function update(idx, val):
  curr = head
  for i=0 to idx-1: curr = curr.next
  curr.val = val`;

const CHECK_SORTED_CODE = `function isSorted():
  curr = head
  while curr and curr.next:
    if curr.val > curr.next.val: return false
    curr = curr.next
  return true`;

const REVERSE_CODE = `function reverse():
  prev = null, curr = head
  while curr:
    next = curr.next
    curr.next = prev
    prev = curr
    curr = next
  head = prev`;

const TRAVERSE_CODE = `function traverse():
  curr = head
  while curr:
    print(curr.val)
    curr = curr.next`;

const SEARCH_CODE = `function search(val):
  curr = head
  while curr:
    if curr.val == val: return true
    curr = curr.next
  return false`;

const GET_LENGTH_CODE = `function getLength():
  count = 0, curr = head
  while curr:
    count++
    curr = curr.next
  return count`;


export default function SinglyLinkedListPage() {
  const [nodes, setNodes] = useState<LinkedListNode[]>([
      { id: "s1", value: 10 }, 
      { id: "s2", value: 20 }, 
      { id: "s3", value: 30 },
      { id: "s4", value: 40 }
  ]);
  
  const [steps, setSteps] = useState<LinkedListStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(500);
  const [message, setMessage] = useState("Ready for operations.");
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeCode, setActiveCode] = useState(INSERT_HEAD_CODE);

  // Inputs
  const [inputValue, setInputValue] = useState("50");
  const [inputIndex, setInputIndex] = useState("0");
  const [deleteValue, setDeleteValue] = useState("20");
  const [deleteIndex, setDeleteIndex] = useState("0");
  const [arrayInput, setArrayInput] = useState("10, 20, 30, 40, 50");
  const [nthIndex, setNthIndex] = useState("2");
  const [updateVal, setUpdateVal] = useState("99");
  const [updateIdx, setUpdateIdx] = useState("1");

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

  const handleCreateFromArray = () => {
    const arr = arrayInput.split(",").map(val => parseInt(val.trim())).filter(val => !isNaN(val));
    if (arr.length > 0) {
        const newNodes = arr.map((val, i) => ({ id: `n${i}`, value: val }));
        setNodes(newNodes);
        setSteps([]);
        setCurrentStep(0);
        setMessage("Created from array.");
    }
  };
  
  const handleInsertSorted = () => {
      const val = parseInt(inputValue);
      if(isNaN(val)) return;
      setActiveCode(INSERT_SORTED_CODE);
      executeOperation(generateInsertSortedSteps(nodes, val));
  };
  
  const handleDeleteAll = () => {
      const val = parseInt(deleteValue);
      if(isNaN(val)) return;
      setActiveCode(DELETE_ALL_CODE);
      executeOperation(generateDeleteAllOccurrencesSteps(nodes, val));
  };

  const handleTraverse = () => {
      setActiveCode(TRAVERSE_CODE);
      executeOperation(generateTraverseSteps(nodes));
  };

  const handleFindNth = () => {
      const n = parseInt(nthIndex);
      if(isNaN(n)) return;
      setActiveCode(FIND_NTH_CODE);
      executeOperation(generateFindNthSteps(nodes, n));
  };

  const handleFindMiddle = () => {
      setActiveCode(FIND_MIDDLE_CODE);
      executeOperation(generateFindMiddleSteps(nodes));
  };

  const handleGetLength = () => {
       setActiveCode(GET_LENGTH_CODE);
       executeOperation(generateGetLengthSteps(nodes));
  };

  const handleUpdateValue = () => {
      const idx = parseInt(updateIdx);
      const val = parseInt(updateVal);
      if(isNaN(idx) || isNaN(val)) return;
      setActiveCode(UPDATE_CODE);
      executeOperation(generateUpdateValueSteps(nodes, idx, val));
  };

  const handleCheckSorted = () => {
      setActiveCode(CHECK_SORTED_CODE);
      executeOperation(generateCheckSortedSteps(nodes));
  };
  
  const handleReverse = () => {
      setActiveCode(REVERSE_CODE);
      executeOperation(generateReverseSteps(nodes));
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
  
  const handleInsertAtPosition = () => {
      const idx = parseInt(inputIndex);
      const val = parseInt(inputValue);
      if (isNaN(val) || isNaN(idx)) return;
      setActiveCode(INSERT_POS_CODE);
      executeOperation(generateInsertAtPositionSteps(nodes, val, idx));
  };

  const handleDeleteAtPosition = () => {
     const idx = parseInt(deleteIndex);
     if(isNaN(idx)) return;
     setActiveCode(DELETE_POS_CODE);
     executeOperation(generateDeleteAtPositionSteps(nodes, idx));
  };

  const handleDeleteValue = () => {
     const val = parseInt(deleteValue);
     if(isNaN(val)) return;
     setActiveCode(DELETE_VAL_CODE);
     executeOperation(generateDeleteValueSteps(nodes, val));
  };

  const handleSearch = () => {
     const val = parseInt(inputValue); // Using insert val for search to reduce inputs
     if(isNaN(val)) return;
     setActiveCode(SEARCH_CODE);
     executeOperation(generateSearchSteps(nodes, val));
  };

  const currentStepData = steps.length > 0 && currentStep < steps.length 
      ? steps[currentStep] 
      : { nodes: nodes, highlightedNodes: [], pointers: {}, message: message };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <BackButton />
      
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Singly Linked List</h1>
        <p className="text-muted-foreground">Comprehensive visualization of 15+ Singly Linked List operations.</p>
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
       <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Create / Init */}
             <div className="bg-zinc-50 dark:bg-zinc-900/30 p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-3">
                <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider flex items-center gap-2">
                    <Save className="w-4 h-4" /> Create
                </h3>
                 <div className="flex gap-2">
                     <input 
                        type="text" 
                        value={arrayInput} 
                        onChange={(e) => setArrayInput(e.target.value)} 
                        className="w-full bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded px-3 py-2 text-sm"
                        placeholder="10, 20..."
                    />
                    <button onClick={handleCreateFromArray} className="whitespace-nowrap px-3 bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-800 dark:text-white py-2 rounded text-sm font-medium transition">Set</button>
                 </div>
                 <button onClick={() => { setNodes([]); setMessage("List cleared."); }} className="w-full bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-900/10 dark:text-red-400 py-2 rounded text-sm font-medium transition">Empty List</button>
            </div>

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
                <div className="grid grid-cols-2 gap-2">
                    <button onClick={handleInsertHead} disabled={isProcessing} className="bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:text-black py-2 rounded text-sm font-medium transition disabled:opacity-50">Head</button>
                    <button onClick={handleInsertTail} disabled={isProcessing} className="bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-800 dark:text-white py-2 rounded text-sm font-medium transition disabled:opacity-50">Tail</button>
                    <button onClick={handleInsertAtPosition} disabled={isProcessing} className="bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-800 dark:text-white py-2 rounded text-sm font-medium transition disabled:opacity-50">Pos</button>
                    <button onClick={handleInsertSorted} disabled={isProcessing} className="bg-emerald-100 hover:bg-emerald-200 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-200 py-2 rounded text-sm font-medium transition disabled:opacity-50">Sorted</button>
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
                    <button onClick={handleDeleteValue} disabled={isProcessing} className="bg-red-100 hover:bg-red-200 text-red-700 dark:bg-red-900/30 dark:text-red-200 py-2 rounded text-sm font-medium transition disabled:opacity-50">Val</button>
                    <button onClick={handleDeleteAtPosition} disabled={isProcessing} className="bg-red-100 hover:bg-red-200 text-red-700 dark:bg-red-900/30 dark:text-red-200 py-2 rounded text-sm font-medium transition disabled:opacity-50">Pos</button>
                    <button onClick={handleDeleteAll} disabled={isProcessing} className="col-span-2 bg-red-50 hover:bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-300 py-2 rounded text-sm font-medium transition disabled:opacity-50">Delete All Occurrences</button>
                 </div>
            </div>

            {/* Read / Search */}
            <div className="bg-zinc-50 dark:bg-zinc-900/30 p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-3">
                <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider flex items-center gap-2">
                    <Eye className="w-4 h-4" /> Read / Search
                </h3>
                  <div className="grid grid-cols-2 gap-2">
                       <button onClick={handleTraverse} disabled={isProcessing} className="bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-800 dark:text-white py-2 rounded text-sm font-medium transition disabled:opacity-50">Traverse</button>
                       <button onClick={handleSearch} disabled={isProcessing} className="bg-blue-100 hover:bg-blue-200 text-blue-700 dark:bg-blue-900/30 dark:text-blue-200 py-2 rounded text-sm font-medium transition disabled:opacity-50">Search (Val)</button>
                       <button onClick={handleGetLength} disabled={isProcessing} className="bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-800 dark:text-white py-2 rounded text-sm font-medium transition disabled:opacity-50">Length</button>
                        <button onClick={handleFindMiddle} disabled={isProcessing} className="bg-purple-100 hover:bg-purple-200 text-purple-700 dark:bg-purple-900/30 dark:text-purple-200 py-2 rounded text-sm font-medium transition disabled:opacity-50">Middle</button>
                  </div>
                   <div className="flex gap-2 border-t border-zinc-200 dark:border-zinc-700 pt-3">
                     <input 
                        type="number" 
                        value={nthIndex} 
                        onChange={(e) => setNthIndex(e.target.value)} 
                        className="w-16 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded px-3 py-2 text-sm"
                        placeholder="N"
                    />
                    <button onClick={handleFindNth} disabled={isProcessing} className="flex-1 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 py-2 rounded text-sm font-medium transition disabled:opacity-50">Find Nth</button>
                   </div>
            </div>

            {/* Update */}
            <div className="bg-zinc-50 dark:bg-zinc-900/30 p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-3">
                <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider flex items-center gap-2">
                    <RefreshCcw className="w-4 h-4" /> Update
                </h3>
                <div className="flex gap-2">
                     <input 
                        type="number" 
                        value={updateIdx} 
                        onChange={(e) => setUpdateIdx(e.target.value)} 
                        className="w-14 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded px-3 py-2 text-sm"
                        placeholder="Idx"
                    />
                    <input 
                        type="number" 
                        value={updateVal} 
                        onChange={(e) => setUpdateVal(e.target.value)} 
                        className="w-16 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded px-3 py-2 text-sm"
                        placeholder="Val"
                    />
                     <button onClick={handleUpdateValue} disabled={isProcessing} className="flex-1 bg-amber-100 hover:bg-amber-200 text-amber-700 dark:bg-amber-900/30 dark:text-amber-200 py-2 rounded text-sm font-medium transition disabled:opacity-50">Update</button>
                </div>
                 <button onClick={handleReverse} disabled={isProcessing} className="w-full bg-indigo-50 hover:bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-200 py-2 rounded text-sm font-medium transition flex items-center justify-center gap-2 disabled:opacity-50">
                    Reverse List (Pointer)
                 </button>
            </div>

            {/* Check */}
            <div className="bg-zinc-50 dark:bg-zinc-900/30 p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-3">
                <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider flex items-center gap-2">
                    <CheckSquare className="w-4 h-4" /> Check
                </h3>
                  <div className="grid grid-cols-2 gap-2">
                       <button onClick={handleCheckSorted} disabled={isProcessing} className="bg-green-100 hover:bg-green-200 text-green-700 dark:bg-green-900/30 dark:text-green-200 py-2 rounded text-sm font-medium transition disabled:opacity-50">Is Sorted?</button>
                       <div className="flex items-center justify-center text-sm font-medium text-zinc-500 bg-zinc-100 dark:bg-zinc-800 rounded">
                           Empty: {nodes.length === 0 ? "Yes" : "No"}
                       </div>
                  </div>
            </div>

      </div>
    </div>
  );
}

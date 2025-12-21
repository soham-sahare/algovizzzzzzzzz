"use client";

import { useState } from "react";
import BackButton from "@/components/ui/BackButton";
import ArrayOperationsVisualizer from "@/components/visualizations/ArrayOperationsVisualizer";
import CodeHighlight from "@/components/visualizations/CodeHighlight"; // Import CodeHighlight
import { Plus, Trash2, Search, Pencil, RotateCcw } from "lucide-react";
import { delay } from "framer-motion";

// Pseudocode Constants
const INSERT_CODE = `function insert(arr, index, value):
  if arr is full: resize()
  for i from size down to index:
    arr[i] = arr[i-1] // Shift right
  arr[index] = value
  size++`;

const DELETE_CODE = `function delete(arr, index):
  if index invalid: return
  for i from index to size-2:
    arr[i] = arr[i+1] // Shift left
  arr[size-1] = null
  size--`;

const UPDATE_CODE = `function update(arr, index, value):
  if index invalid: return
  arr[index] = value`;

const SEARCH_CODE = `function search(arr, value):
  for i from 0 to size-1:
    if arr[i] == value:
      return i
  return -1`;

const DEFAULT_CODE = `// Select an operation below
// to see its algorithm
// and visualization`;

export default function ArrayBasicsPage() {
  const [array, setArray] = useState<(number | null)[]>([10, 20, 30, 40]);
  const [capacity, setCapacity] = useState(8);
  const [highlightIndex, setHighlightIndex] = useState<number | undefined>(undefined);
  const [highlightType, setHighlightType] = useState<"access" | "insert" | "delete" | "search" | undefined>(undefined);
  
  // Highlighting State
  const [activeCode, setActiveCode] = useState(DEFAULT_CODE);
  const [activeLine, setActiveLine] = useState<number | undefined>(undefined);

  // Inputs
  const [insertIndex, setInsertIndex] = useState("0");
  const [insertValue, setInsertValue] = useState("50");
  const [deleteIndex, setDeleteIndex] = useState("0");
  const [accessIndex, setAccessIndex] = useState("0");
  const [updateValue, setUpdateValue] = useState("99");
  const [searchValue, setSearchValue] = useState("30");

  const [message, setMessage] = useState("Ready to perform operations.");

  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  const handleInsert = async () => {
    setActiveCode(INSERT_CODE);
    setActiveLine(1); // function definition
    const idx = parseInt(insertIndex);
    const val = parseInt(insertValue);

    if (isNaN(idx) || isNaN(val)) {
        setMessage("Invalid input.");
        return;
    }
    if (idx < 0 || idx > array.length) {
        setMessage(`Index ${idx} out of bounds (0-${array.length}).`);
        return;
    }
    
    // Check Full
    setActiveLine(2); 
    if (array.length >= capacity) {
        setMessage("Array full! Doubling capacity...");
        setCapacity((c) => c * 2);
        await sleep(800);
    }
    
    setHighlightIndex(idx);
    setHighlightType("insert");
    setMessage(`Inserting ${val} at index ${idx}...`);
    
    // Loop shift
    setActiveLine(3);
    await sleep(600);
    
    setActiveLine(4); // Shift action (conceptual, we do it in one go for simple visual)
    const newArray = [...array];
    newArray.splice(idx, 0, val);
    setArray(newArray);
    
    setActiveLine(5); // Assign value
    setMessage(`Inserted ${val} at index ${idx}.`);
    
    setActiveLine(6); // size++
    await sleep(500);
    
    setHighlightIndex(undefined);
    setHighlightType(undefined);
    setActiveLine(undefined);
  };

  const handleDelete = async () => {
    setActiveCode(DELETE_CODE);
    setActiveLine(1);
    const idx = parseInt(deleteIndex);
    
    setActiveLine(2); // Check invalid
    if (isNaN(idx)) {
        setMessage("Invalid input.");
        return;
    }
    if (idx < 0 || idx >= array.length) {
        setMessage(`Index ${idx} out of bounds (0-${array.length - 1}).`);
        return;
    }

    setHighlightIndex(idx);
    setHighlightType("delete");
    setMessage(`Deleting element at index ${idx}...`);
    
    setActiveLine(3); // Loop start
    await sleep(600);
    
    setActiveLine(4); // Shift logic visualization
    const newArray = [...array];
    newArray.splice(idx, 1);
    setArray(newArray);

    setActiveLine(5); // nullify last (implicit in splice but meaningful for static array mental model)
    setMessage(`Deleted element at index ${idx}.`);
    
    setActiveLine(6); // size--
    await sleep(500);
    
    setHighlightIndex(undefined);
    setHighlightType(undefined);
    setActiveLine(undefined);
  };

  const handleUpdate = async () => {
    setActiveCode(UPDATE_CODE);
    setActiveLine(1);
    const idx = parseInt(accessIndex);
    const val = parseInt(updateValue);

    setActiveLine(2);
    if (isNaN(idx) || isNaN(val)) return;
    if (idx < 0 || idx >= array.length) {
        setMessage(`Index ${idx} out of bounds.`);
        return;
    }

    setHighlightIndex(idx);
    setHighlightType("access");
    setMessage(`Updating index ${idx} to ${val}...`);
    
    setActiveLine(3); // Assignment
    await sleep(600);

    const newArray = [...array];
    newArray[idx] = val;
    setArray(newArray);
    
    setMessage(`Updated index ${idx} to ${val}.`);
    await sleep(500);
    setHighlightIndex(undefined);
    setHighlightType(undefined);
    setActiveLine(undefined);
  };

  const handleSearch = async () => {
    setActiveCode(SEARCH_CODE);
    setActiveLine(1);
    const val = parseInt(searchValue);
    if (isNaN(val)) return;

    setMessage(`Searching for ${val}...`);
    setHighlightType("search");

    let found = false;
    setActiveLine(2); // Loop
    for (let i = 0; i < array.length; i++) {
        setHighlightIndex(i);
        setActiveLine(3); // Check match
        await sleep(400);

        if (array[i] === val) {
            setMessage(`Found ${val} at index ${i}!`);
            found = true;
            setActiveLine(4); // Return i
            await sleep(1000);
            break;
        }
    }

    if (!found) {
        setMessage(`${val} not found in array.`);
        setActiveLine(5); // Return -1
        await sleep(1000);
    }
    
    setHighlightIndex(undefined);
    setHighlightType(undefined);
    setActiveLine(undefined);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <BackButton />
      
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Static & Dynamic Arrays</h1>
        <p className="text-muted-foreground">Visualize how arrays manage memory, resize, and handle basic CRUD operations.</p>
      </div>

      {/* Top Section: Visualizer & Pseudocode */}
      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Left Column: Visualizer */}
        <div className="lg:col-span-2 space-y-6">
            <ArrayOperationsVisualizer 
                array={array}
                capacity={capacity}
                highlightIndex={highlightIndex}
                highlightType={highlightType}
            />
            
            <div className="bg-zinc-100 dark:bg-zinc-900/50 p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 flex justify-between items-center text-sm font-mono text-zinc-600 dark:text-zinc-400">
                <span>Size: <span className="text-zinc-900 dark:text-white">{array.length}</span></span>
                <span>Capacity: <span className="text-zinc-900 dark:text-white">{capacity}</span></span>
                <span>Status: <span className="text-yellow-600 dark:text-yellow-500 font-bold">{message}</span></span>
            </div>
        </div>

        {/* Right Column: Pseudocode */}
        <div className="lg:col-span-1">
             <div className="sticky top-6">
                <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-3">Algorithm Logic</h3>
                <CodeHighlight code={activeCode} activeLine={activeLine} />
            </div>
        </div>
      </div>

        {/* Bottom Section: Controls Grid */}
        <div className="mt-8">
            <h3 className="text-lg font-semibold text-foreground mb-6 pb-2 border-b border-zinc-200 dark:border-zinc-800">Operations</h3>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                
                {/* Insert */}
                <div className="bg-zinc-50 dark:bg-zinc-900/30 p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-3 shadow-sm dark:shadow-none">
                    <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider flex items-center gap-2">
                        <Plus className="w-4 h-4" /> Insert
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                        <input type="number" value={insertIndex} onChange={(e) => setInsertIndex(e.target.value)} placeholder="Index" className="bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded px-3 py-2 text-sm text-foreground focus:outline-none focus:border-zinc-500" />
                        <input type="number" value={insertValue} onChange={(e) => setInsertValue(e.target.value)} placeholder="Value" className="bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded px-3 py-2 text-sm text-foreground focus:outline-none focus:border-zinc-500" />
                    </div>
                    <button onClick={handleInsert} className="w-full bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 text-sm font-medium py-2 rounded transition-colors flex items-center justify-center gap-2">
                        Insert
                    </button>
                </div>

                {/* Delete */}
                <div className="bg-zinc-50 dark:bg-zinc-900/30 p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-3 shadow-sm dark:shadow-none">
                    <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider flex items-center gap-2">
                        <Trash2 className="w-4 h-4" /> Delete
                    </h3>
                    <input type="number" value={deleteIndex} onChange={(e) => setDeleteIndex(e.target.value)} placeholder="Index" className="w-full bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded px-3 py-2 text-sm text-foreground focus:outline-none focus:border-zinc-500" />
                    <button onClick={handleDelete} className="w-full bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-200 text-sm font-medium py-2 rounded transition-colors flex items-center justify-center gap-2">
                        Delete
                    </button>
                </div>

                {/* Update */}
                <div className="bg-zinc-50 dark:bg-zinc-900/30 p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-3 shadow-sm dark:shadow-none">
                    <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider flex items-center gap-2">
                        <Pencil className="w-4 h-4" /> Update
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                        <input type="number" value={accessIndex} onChange={(e) => setAccessIndex(e.target.value)} placeholder="Idx" className="bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded px-3 py-2 text-sm text-foreground focus:outline-none focus:border-zinc-500" />
                        <input type="number" value={updateValue} onChange={(e) => setUpdateValue(e.target.value)} placeholder="Val" className="bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded px-3 py-2 text-sm text-foreground focus:outline-none focus:border-zinc-500" />
                    </div>
                    <button onClick={handleUpdate} className="w-full bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-foreground text-sm font-medium py-2 rounded transition-colors flex items-center justify-center gap-2">
                        Update
                    </button>
                </div>

                {/* Search */}
                <div className="bg-zinc-50 dark:bg-zinc-900/30 p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-3 shadow-sm dark:shadow-none">
                    <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider flex items-center gap-2">
                        <Search className="w-4 h-4" /> Search
                    </h3>
                    <input type="number" value={searchValue} onChange={(e) => setSearchValue(e.target.value)} placeholder="Value to search" className="w-full bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded px-3 py-2 text-sm text-foreground focus:outline-none focus:border-zinc-500" />
                    <button onClick={handleSearch} className="w-full bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-foreground text-sm font-medium py-2 rounded transition-colors flex items-center justify-center gap-2">
                        Search
                    </button>
                </div>
            </div>
      </div>
    </div>
  );
}

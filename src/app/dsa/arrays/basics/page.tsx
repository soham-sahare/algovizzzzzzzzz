"use client";

import { useState } from "react";
import BackButton from "@/components/ui/BackButton";
import ArrayOperationsVisualizer from "@/components/visualizations/ArrayOperationsVisualizer";
import { Plus, Trash2, Search, Pencil, RotateCcw } from "lucide-react";
import { delay } from "framer-motion";

export default function ArrayBasicsPage() {
  const [array, setArray] = useState<(number | null)[]>([10, 20, 30, 40]);
  const [capacity, setCapacity] = useState(8);
  const [highlightIndex, setHighlightIndex] = useState<number | undefined>(undefined);
  const [highlightType, setHighlightType] = useState<"access" | "insert" | "delete" | "search" | undefined>(undefined);
  
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
    if (array.length >= capacity) {
        setMessage("Array full! Doubling capacity...");
        setCapacity((c) => c * 2);
        await sleep(800);
    }

    setHighlightIndex(idx);
    setHighlightType("insert");
    setMessage(`Inserting ${val} at index ${idx}...`);
    await sleep(600);

    const newArray = [...array];
    newArray.splice(idx, 0, val);
    setArray(newArray);
    
    setMessage(`Inserted ${val} at index ${idx}.`);
    await sleep(500);
    setHighlightIndex(undefined);
    setHighlightType(undefined);
  };

  const handleDelete = async () => {
    const idx = parseInt(deleteIndex);
    
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
    await sleep(600);

    const newArray = [...array];
    newArray.splice(idx, 1);
    setArray(newArray);

    setMessage(`Deleted element at index ${idx}.`);
    await sleep(500);
    setHighlightIndex(undefined);
    setHighlightType(undefined);
  };

  const handleUpdate = async () => {
    const idx = parseInt(accessIndex);
    const val = parseInt(updateValue);

    if (isNaN(idx) || isNaN(val)) return;
    if (idx < 0 || idx >= array.length) {
        setMessage(`Index ${idx} out of bounds.`);
        return;
    }

    setHighlightIndex(idx);
    setHighlightType("access");
    setMessage(`Updating index ${idx} to ${val}...`);
    await sleep(600);

    const newArray = [...array];
    newArray[idx] = val;
    setArray(newArray);
    
    setMessage(`Updated index ${idx} to ${val}.`);
    await sleep(500);
    setHighlightIndex(undefined);
    setHighlightType(undefined);
  };

  const handleSearch = async () => {
    const val = parseInt(searchValue);
    if (isNaN(val)) return;

    setMessage(`Searching for ${val}...`);
    setHighlightType("search");

    let found = false;
    for (let i = 0; i < array.length; i++) {
        setHighlightIndex(i);
        await sleep(400);

        if (array[i] === val) {
            setMessage(`Found ${val} at index ${i}!`);
            found = true;
            await sleep(1000);
            break;
        }
    }

    if (!found) {
        setMessage(`${val} not found in array.`);
         await sleep(1000);
    }
    
    setHighlightIndex(undefined);
    setHighlightType(undefined);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <BackButton />
      
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Static & Dynamic Arrays</h1>
        <p className="text-muted-foreground">Visualize how arrays manage memory, resize, and handle basic CRUD operations.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Visualizer Section */}
        <div className="lg:col-span-2 space-y-6">
            <ArrayOperationsVisualizer 
                array={array}
                capacity={capacity}
                highlightIndex={highlightIndex}
                highlightType={highlightType}
            />
            
            <div className="bg-zinc-900/50 p-4 rounded-lg border border-zinc-800 flex justify-between items-center text-sm font-mono text-zinc-400">
                <span>Size: <span className="text-white">{array.length}</span></span>
                <span>Capacity: <span className="text-white">{capacity}</span></span>
                <span>Status: <span className="text-yellow-500">{message}</span></span>
            </div>
        </div>

        {/* Controls Section */}
        <div className="lg:col-span-1 space-y-6">
            {/* Insert */}
            <div className="bg-zinc-900/30 p-5 rounded-xl border border-zinc-800 space-y-3">
                <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                    <Plus className="w-4 h-4" /> Insert
                </h3>
                <div className="grid grid-cols-2 gap-2">
                    <input type="number" value={insertIndex} onChange={(e) => setInsertIndex(e.target.value)} placeholder="Index" className="bg-zinc-900 border border-zinc-700 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-zinc-500" />
                    <input type="number" value={insertValue} onChange={(e) => setInsertValue(e.target.value)} placeholder="Value" className="bg-zinc-900 border border-zinc-700 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-zinc-500" />
                </div>
                <button onClick={handleInsert} className="w-full bg-zinc-800 hover:bg-zinc-700 text-white text-sm font-medium py-2 rounded transition-colors flex items-center justify-center gap-2">
                    Insert Element
                </button>
            </div>

            {/* Delete */}
            <div className="bg-zinc-900/30 p-5 rounded-xl border border-zinc-800 space-y-3">
                <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                    <Trash2 className="w-4 h-4" /> Delete
                </h3>
                <input type="number" value={deleteIndex} onChange={(e) => setDeleteIndex(e.target.value)} placeholder="Index" className="w-full bg-zinc-900 border border-zinc-700 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-zinc-500" />
                <button onClick={handleDelete} className="w-full bg-red-900/30 hover:bg-red-900/50 border border-red-900/50 text-red-200 text-sm font-medium py-2 rounded transition-colors flex items-center justify-center gap-2">
                    Delete at Index
                </button>
            </div>

            {/* Update */}
            <div className="bg-zinc-900/30 p-5 rounded-xl border border-zinc-800 space-y-3">
                <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                    <Pencil className="w-4 h-4" /> Access / Update
                </h3>
                <div className="grid grid-cols-2 gap-2">
                     <input type="number" value={accessIndex} onChange={(e) => setAccessIndex(e.target.value)} placeholder="Index" className="bg-zinc-900 border border-zinc-700 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-zinc-500" />
                     <input type="number" value={updateValue} onChange={(e) => setUpdateValue(e.target.value)} placeholder="New Value" className="bg-zinc-900 border border-zinc-700 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-zinc-500" />
                </div>
                <button onClick={handleUpdate} className="w-full bg-zinc-800 hover:bg-zinc-700 text-white text-sm font-medium py-2 rounded transition-colors flex items-center justify-center gap-2">
                    Update Value
                </button>
            </div>

             {/* Search */}
             <div className="bg-zinc-900/30 p-5 rounded-xl border border-zinc-800 space-y-3">
                <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                    <Search className="w-4 h-4" /> Search
                </h3>
                <input type="number" value={searchValue} onChange={(e) => setSearchValue(e.target.value)} placeholder="Value to search" className="w-full bg-zinc-900 border border-zinc-700 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-zinc-500" />
                <button onClick={handleSearch} className="w-full bg-zinc-800 hover:bg-zinc-700 text-white text-sm font-medium py-2 rounded transition-colors flex items-center justify-center gap-2">
                    Find Element
                </button>
            </div>
        </div>
      </div>
    </div>
  );
}

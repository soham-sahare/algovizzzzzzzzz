"use client";

import { useState } from "react";
import BackButton from "@/components/ui/BackButton";
import { motion, AnimatePresence } from "framer-motion";
import { Database, Plus, Trash, Search, Eye } from "lucide-react";

export default function StackPlayground() {
    const [stack, setStack] = useState<number[]>([10, 20, 30]);
    const [inputVal, setInputVal] = useState(42);
    const [message, setMessage] = useState("Ready");
    const [highlightIndex, setHighlightIndex] = useState<number | null>(null);

    const push = () => {
        if (stack.length >= 8) {
             setMessage("Stack Overflow! (Visual limit reached)");
             return;
        }
        setStack([...stack, inputVal]);
        setMessage(`Pushed ${inputVal}`);
        setHighlightIndex(stack.length);
        setTimeout(() => setHighlightIndex(null), 1000);
    };

    const pop = () => {
        if (stack.length === 0) {
            setMessage("Stack Underflow!");
            return;
        }
        const val = stack[stack.length - 1];
        setStack(stack.slice(0, -1));
        setMessage(`Popped ${val}`);
        setHighlightIndex(stack.length - 1); // Highlight where it was? No, it's gone.
    };

    const peek = () => {
        if (stack.length === 0) {
             setMessage("Stack Empty");
             return;
        }
        setMessage(`Top element is ${stack[stack.length - 1]}`);
        setHighlightIndex(stack.length - 1);
        setTimeout(() => setHighlightIndex(null), 1500);
    };

    const search = () => {
        const idx = stack.lastIndexOf(inputVal); // Search from top
        if (idx === -1) {
            setMessage(`Value ${inputVal} not found`);
        } else {
            // Distance from top
            const dist = stack.length - 1 - idx;
            setMessage(`Found ${inputVal} at index ${idx} (Depth: ${dist})`);
            setHighlightIndex(idx);
            setTimeout(() => setHighlightIndex(null), 2000);
        }
    };

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            <BackButton href="/dsa/stacks" />
            
             <div className="flex bg-zinc-100 dark:bg-zinc-900/50 p-6 rounded-xl items-center justify-between">
                <div>
                   <h1 className="text-3xl font-bold text-foreground">Stack Playground</h1>
                   <p className="text-muted-foreground">Interactive LIFO (Last-In First-Out) visualization.</p>
                </div>
                <div className="text-right">
                    <span className="text-2xl font-mono font-bold text-indigo-600 block">{stack.length}</span>
                    <span className="text-xs uppercase text-zinc-500">Size</span>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Visualization */}
                <div className="lg:col-span-2 border rounded-xl bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 p-12 flex flex-col items-center justify-end min-h-[500px] relative">
                    
                    <div className="w-48 bg-zinc-200 dark:bg-zinc-800/50 border-l-4 border-r-4 border-b-4 border-zinc-300 dark:border-zinc-700 rounded-b-xl flex flex-col-reverse p-4 gap-2 relative min-h-[100px]">
                        <AnimatePresence mode="popLayout">
                            {stack.map((val, idx) => (
                                <motion.div
                                    key={`${idx}-${val}`}
                                    initial={{ y: -50, opacity: 0 }}
                                    animate={{ 
                                        y: 0, 
                                        opacity: 1, 
                                        backgroundColor: highlightIndex === idx ? "#fef08a" : "#fff",
                                        borderColor: highlightIndex === idx ? "#eab308" : ""
                                    }}
                                    exit={{ y: -50, opacity: 0, scale: 0.8 }}
                                    className={`
                                        w-full h-12 rounded border-2 shadow-sm flex items-center justify-center font-bold text-lg
                                        ${highlightIndex === idx ? 'text-yellow-700 border-yellow-500' : 'bg-white dark:bg-zinc-800 dark:text-zinc-200 border-zinc-300 dark:border-zinc-700'}
                                    `}
                                >
                                    {val}
                                </motion.div>
                            ))}
                        </AnimatePresence>
                        
                        {stack.length === 0 && (
                            <div className="absolute inset-0 flex items-center justify-center text-zinc-400 text-sm font-italic">Empty</div>
                        )}
                    </div>
                     <span className="mt-4 text-xs font-mono text-zinc-400 uppercase tracking-widest">Stack Bottom</span>

                    {/* Status Toast */}
                    <div className="absolute top-4 right-4 bg-zinc-900 text-white px-4 py-2 rounded text-sm font-mono shadow-lg">
                        {message}
                    </div>
                </div>

                {/* Controls */}
                <div className="space-y-6">
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-xl shadow-sm space-y-4">
                        <div>
                            <label className="text-xs uppercase text-zinc-500 font-bold mb-2 block">Value</label>
                             <input 
                                type="number" 
                                value={inputVal}
                                onChange={(e) => setInputVal(parseInt(e.target.value))}
                                className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded text-sm mb-4"
                            />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3">
                             <button onClick={push} className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-bold transition">
                                <Plus className="w-4 h-4" /> Push
                            </button>
                             <button onClick={pop} className="flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg font-bold transition">
                                <Trash className="w-4 h-4" /> Pop
                            </button>
                        </div>
                        
                         <button onClick={peek} className="w-full flex items-center justify-center gap-2 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 text-foreground py-3 rounded-lg font-medium transition">
                            <Eye className="w-4 h-4" /> Peek Top
                        </button>
                         <button onClick={search} className="w-full flex items-center justify-center gap-2 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 text-foreground py-3 rounded-lg font-medium transition">
                            <Search className="w-4 h-4" /> Search Value
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

"use client";

import { useState } from "react";
import BackButton from "@/components/ui/BackButton";
import { motion, AnimatePresence } from "framer-motion";
import { Server, Plus, Trash, Search, Eye, ArrowRight } from "lucide-react";

export default function QueuePlayground() {
    const [queue, setQueue] = useState<number[]>([10, 20, 30]);
    const [inputVal, setInputVal] = useState(42);
    const [message, setMessage] = useState("Ready");
    const [highlightIndex, setHighlightIndex] = useState<number | null>(null);

    const enqueue = () => {
        if (queue.length >= 8) {
             setMessage("Queue Full! (Visual limit)");
             return;
        }
        setQueue([...queue, inputVal]);
        setMessage(`Enqueued ${inputVal}`);
        setHighlightIndex(queue.length);
        setTimeout(() => setHighlightIndex(null), 1000);
    };

    const dequeue = () => {
        if (queue.length === 0) {
            setMessage("Queue Empty!");
            return;
        }
        const val = queue[0];
        setQueue(queue.slice(1));
        setMessage(`Dequeued ${val}`);
    };

    const peek = () => {
        if (queue.length === 0) {
             setMessage("Queue Empty");
             return;
        }
        setMessage(`Front element is ${queue[0]}`);
        setHighlightIndex(0);
        setTimeout(() => setHighlightIndex(null), 1500);
    };

    const search = () => {
        const idx = queue.indexOf(inputVal);
        if (idx === -1) {
            setMessage(`Value ${inputVal} not found`);
        } else {
            setMessage(`Found ${inputVal} at index ${idx}`);
            setHighlightIndex(idx);
            setTimeout(() => setHighlightIndex(null), 2000);
        }
    };

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            <BackButton href="/dsa/queues" />
            
             <div className="flex bg-zinc-100 dark:bg-zinc-900/50 p-6 rounded-xl items-center justify-between">
                <div>
                   <h1 className="text-3xl font-bold text-foreground">Queue Playground</h1>
                   <p className="text-muted-foreground">Interactive FIFO (First-In First-Out) visualization.</p>
                </div>
                <div className="text-right">
                    <span className="text-2xl font-mono font-bold text-teal-600 block">{queue.length}</span>
                    <span className="text-xs uppercase text-zinc-500">Size</span>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Visualization */}
                <div className="lg:col-span-2 border rounded-xl bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 p-12 flex flex-col items-center justify-center min-h-[400px] relative">
                    
                    {/* Queue Tube */}
                    <div className="flex items-center gap-2 p-4 bg-zinc-200 dark:bg-zinc-800/50 rounded-full border border-zinc-300 dark:border-zinc-700 overflow-hidden min-w-[300px] min-h-[80px] relative justify-start px-8">
                        
                         <span className="absolute left-2 text-[10px] font-bold text-zinc-400 uppercase -rotate-90">Front</span>
                         <span className="absolute right-2 text-[10px] font-bold text-zinc-400 uppercase -rotate-90">Rear</span>

                        <AnimatePresence mode="popLayout">
                            {queue.map((val, idx) => (
                                <motion.div
                                    key={`${idx}-${val}`} // Unique key needs better tracking ideally, but works for simple appends
                                    layout
                                    initial={{ x: 50, opacity: 0, scale: 0.5 }}
                                    animate={{ 
                                        x: 0, 
                                        opacity: 1, 
                                        scale: 1,
                                        backgroundColor: highlightIndex === idx ? "#fef08a" : "#fff",
                                        borderColor: highlightIndex === idx ? "#eab308" : ""
                                    }}
                                    exit={{ x: -50, opacity: 0, scale: 0.5 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                    className={`
                                        w-12 h-12 rounded-full border-2 shadow-sm flex-shrink-0 flex items-center justify-center font-bold text-lg
                                        ${highlightIndex === idx ? 'text-yellow-700 border-yellow-500' : 'bg-white dark:bg-zinc-800 dark:text-zinc-200 border-zinc-300 dark:border-zinc-700'}
                                    `}
                                >
                                    {val}
                                </motion.div>
                            ))}
                        </AnimatePresence>
                        
                         {queue.length === 0 && (
                            <div className="w-full text-center text-zinc-400 text-sm font-italic">Empty</div>
                        )}
                    </div>
                    
                    <div className="flex gap-20 mt-4 text-xs font-mono text-zinc-400">
                        <div className="flex items-center gap-1"><ArrowRight className="w-3 h-3"/> Dequeue Side</div>
                        <div className="flex items-center gap-1">Enqueue Side <ArrowRight className="w-3 h-3"/></div>
                    </div>

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
                             <button onClick={enqueue} className="flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-lg font-bold transition">
                                <Plus className="w-4 h-4" /> Enqueue
                            </button>
                             <button onClick={dequeue} className="flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg font-bold transition">
                                <Trash className="w-4 h-4" /> Dequeue
                            </button>
                        </div>
                        
                         <button onClick={peek} className="w-full flex items-center justify-center gap-2 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 text-foreground py-3 rounded-lg font-medium transition">
                            <Eye className="w-4 h-4" /> Peek Front
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

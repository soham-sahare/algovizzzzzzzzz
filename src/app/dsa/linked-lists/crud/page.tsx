"use client";

import { useEffect, useState } from "react";
import BackButton from "@/components/ui/BackButton";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, RotateCcw, Plus, Trash, Edit, Search, ArrowRight, ArrowLeft } from "lucide-react";
import { generateListCRUDSteps, ListCRUDStep } from "@/lib/algorithms/linkedList/crud";

export default function LinkedListCRUDPage() {
    // State
    const [listType, setListType] = useState<'SINGLY' | 'DOUBLY' | 'CIRCULAR'>('SINGLY');
    const [values, setValues] = useState<number[]>([10, 20, 30, 40]);
    
    // Inputs
    const [inputVal, setInputVal] = useState(99);
    const [inputIdx, setInputIdx] = useState(1);
    
    // Playback
    const [steps, setSteps] = useState<ListCRUDStep[]>([]);
    const [currentStep, setCurrentStep] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [speed, setSpeed] = useState(600);
    const [message, setMessage] = useState("Ready");
    const [isProcessing, setIsProcessing] = useState(false);

    // Auto-Play
    useEffect(() => {
        if (isPlaying) {
            const timer = setInterval(() => {
                setCurrentStep((prev) => {
                    if (prev < steps.length - 1) {
                        return prev + 1;
                    } else {
                        setIsPlaying(false);
                        setIsProcessing(false);
                        setMessage("Complete");
                        // Update Source of Truth based on final state
                        // The visualizer is just a simulation, we need to apply the op to `values` to keep sync
                        // OR we trust the final node list from the generator. 
                        // The generator returns nodes with IDs. We just want values.
                        const finalNodes = steps[steps.length - 1].nodes;
                        setValues(finalNodes.map(n => n.value));
                        return prev;
                    }
                });
            }, speed);
            return () => clearInterval(timer);
        }
    }, [isPlaying, speed, steps]);

    const handleRun = (op: 'INSERT' | 'DELETE' | 'UPDATE' | 'GET', subType?: 'VALUE') => {
        if (isProcessing) return;
        setIsProcessing(true);
        
        const deleteByVal = op === 'DELETE' && subType === 'VALUE';
        const params = deleteByVal ? inputVal : inputIdx;
        
        const gen = generateListCRUDSteps(values, listType, op, params, inputVal, deleteByVal);
        const newSteps = Array.from(gen);
        
        if (newSteps.length === 0) {
            setIsProcessing(false);
            return;
        }

        setSteps(newSteps);
        setCurrentStep(0);
        setIsPlaying(true);
    };

    const handleReset = () => {
        setValues([10, 20, 30, 40]);
        setSteps([]);
        setCurrentStep(0);
        setIsPlaying(false);
        setIsProcessing(false);
        setMessage("Reset List");
    };

    const stepData = steps.length > 0 ? steps[currentStep] : {
        nodes: values.map((v, i) => ({ id: `init-${i}`, value: v, nextId: null })), // simplified init
        pointers: [],
        message: "Select an operation"
    };
    
    // Visualizer Render Logic
    // We render nodes horizontally. Arrows depend on type.
    
    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            <BackButton href="/dsa/linked-lists" />
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-foreground mb-2">Linked List Operations</h1>
                    <p className="text-muted-foreground">Comprehensive CRUD for Singly, Doubly, and Circular Linked Lists.</p>
                </div>
                
                <div className="flex bg-zinc-100 dark:bg-zinc-900 p-1 rounded-lg">
                    {(['SINGLY', 'DOUBLY', 'CIRCULAR'] as const).map(t => (
                        <button
                            key={t}
                            onClick={() => { setListType(t); handleReset(); }}
                            disabled={isProcessing}
                            className={`px-4 py-2 text-sm font-medium rounded-md transition ${listType === t ? 'bg-white dark:bg-zinc-800 shadow text-indigo-600' : 'text-zinc-500 hover:text-zinc-700'}`}
                        >
                            {t}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Visualizer Area */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="border rounded-lg bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 p-8 min-h-[400px] flex items-center justify-center overflow-x-auto relative">
                        <div className="flex items-center gap-4 min-w-max">
                            <AnimatePresence>
                                {stepData.nodes.map((node, i) => {
                                    const ptr = stepData.pointers.find(p => p.nodeId === node.id);
                                    return (
                                        <motion.div
                                            key={node.id}
                                            layout
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ 
                                                opacity: 1, 
                                                scale: node.highlight ? 1.1 : 1,
                                                borderColor: node.highlight ? "#ef4444" : "" 
                                            }}
                                            exit={{ opacity: 0, scale: 0, y: 20 }}
                                            className="relative flex items-center"
                                        >
                                            {/* Node Body */}
                                            <div className={`
                                                w-16 h-16 rounded-full border-2 flex items-center justify-center text-lg font-bold bg-white dark:bg-zinc-800 shadow-sm relative z-10
                                                ${node.color || (node.highlight ? "border-red-500 bg-red-50" : "border-zinc-300 dark:border-zinc-700")}
                                            `}>
                                                {node.value}
                                                <span className="absolute -bottom-6 text-xs text-zinc-400 font-mono font-normal">#{i}</span>
                                            </div>

                                            {/* Pointers (Arrows) */}
                                            {i < stepData.nodes.length - 1 && (
                                                <div className="w-12 h-0.5 bg-zinc-300 dark:bg-zinc-700 mx-2 relative">
                                                    <ArrowRight className="absolute -right-2 -top-2 w-4 h-4 text-zinc-300 dark:text-zinc-700" />
                                                    {listType === 'DOUBLY' && (
                                                        <ArrowLeft className="absolute -left-2 -top-2 w-4 h-4 text-zinc-300 dark:text-zinc-700" />
                                                    )}
                                                </div>
                                            )}
                                            
                                            {/* Circular Link (Visualized as a looping dashed line for last node) */}
                                            {listType === 'CIRCULAR' && i === stepData.nodes.length - 1 && (
                                                <div className="absolute top-1/2 left-1/2 w-full h-24 border-b-2 border-r-2 border-zinc-300 dark:border-zinc-700 border-dashed rounded-br-3xl pointer-events-none transform translate-y-8" style={{ width: `calc(100% * ${stepData.nodes.length} + ${(stepData.nodes.length-1)*16}px)` , left: `calc(-100% * ${stepData.nodes.length - 1} - ${(stepData.nodes.length-1)*64}px)` }}>
                                                     {/* This is a hacky CSS curve back to start */}
                                                </div>
                                            )}

                                            {/* Aux Pointer Label */}
                                            {ptr && (
                                                <motion.div 
                                                    initial={{ y: -10, opacity: 0 }}
                                                    animate={{ y: 0, opacity: 1 }}
                                                    className={`absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 rounded text-xs font-bold text-white shadow-md ${ptr.color}`}
                                                >
                                                    {ptr.label}
                                                    <div className={`absolute bottom-[-4px] left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 ${ptr.color}`}></div>
                                                </motion.div>
                                            )}
                                        </motion.div>
                                    );
                                })}
                            </AnimatePresence>
                            {stepData.nodes.length === 0 && (
                                <div className="text-zinc-400 italic">List is Empty</div>
                            )}
                        </div>
                    </div>

                     {/* Status Bar */}
                     <div className="bg-zinc-100 dark:bg-zinc-900/50 p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 flex justify-between items-center text-sm font-mono text-zinc-600 dark:text-zinc-400">
                        <span>Status: <span className="text-indigo-600 dark:text-indigo-400 font-bold">{stepData.message || message}</span></span>
                         <div className="flex items-center gap-4">
                            <button 
                                onClick={() => setIsPlaying(!isPlaying)}
                                disabled={!isProcessing} 
                                className="p-2 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-full disabled:opacity-50"
                            >
                                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                            </button>
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
                </div>

                {/* Controls */}
                <div className="lg:col-span-1 space-y-6">
                     <div className="sticky top-6">
                        <div className="bg-zinc-50 dark:bg-zinc-900/30 p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-4">
                            
                            {/* Inputs */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs uppercase text-zinc-500 font-bold mb-1 block">Value</label>
                                    <input 
                                        type="number" 
                                        value={inputVal}
                                        onChange={(e) => setInputVal(parseInt(e.target.value))}
                                        className="w-full px-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded text-sm disabled:opacity-50"
                                        disabled={isProcessing}
                                    />
                                </div>
                                <div>
                                    <label className="text-xs uppercase text-zinc-500 font-bold mb-1 block">Index</label>
                                    <input 
                                        type="number" 
                                        value={inputIdx}
                                        onChange={(e) => setInputIdx(parseInt(e.target.value))}
                                        className="w-full px-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded text-sm disabled:opacity-50"
                                        disabled={isProcessing}
                                    />
                                </div>
                            </div>

                            <hr className="border-zinc-200 dark:border-zinc-700" />

                            {/* Actions */}
                            <div className="space-y-2">
                                <p className="text-xs font-bold text-zinc-500 uppercase">Operations</p>
                                <button onClick={() => handleRun('INSERT')} disabled={isProcessing} className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded text-sm font-medium transition disabled:opacity-50">
                                    <Plus className="w-4 h-4" /> Insert (Idx)
                                </button>
                                <button onClick={() => handleRun('GET')} disabled={isProcessing} className="w-full flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white py-2 rounded text-sm font-medium transition disabled:opacity-50">
                                    <Search className="w-4 h-4" /> Get (Idx)
                                </button>
                                <button onClick={() => handleRun('UPDATE')} disabled={isProcessing} className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded text-sm font-medium transition disabled:opacity-50">
                                    <Edit className="w-4 h-4" /> Update (Idx)
                                </button>
                                <div className="grid grid-cols-2 gap-2">
                                    <button onClick={() => handleRun('DELETE', 'VALUE')} disabled={isProcessing} className="flex items-center justify-center gap-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded text-xs font-medium transition disabled:opacity-50">
                                        <Trash className="w-3 h-3" /> Del Value
                                    </button>
                                    <button onClick={() => handleRun('DELETE')} disabled={isProcessing} className="flex items-center justify-center gap-1 bg-orange-600 hover:bg-orange-700 text-white py-2 rounded text-xs font-medium transition disabled:opacity-50">
                                        <Trash className="w-3 h-3" /> Del Index
                                    </button>
                                </div>
                            </div>
                            
                            <hr className="border-zinc-200 dark:border-zinc-700" />
                            
                             <button onClick={handleReset} disabled={isProcessing} className="w-full flex items-center justify-center gap-2 bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-800 text-foreground py-2 rounded text-sm font-medium transition disabled:opacity-50">
                                <RotateCcw className="w-4 h-4" /> Reset List
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

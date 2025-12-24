"use client";

import { useEffect, useState } from "react";
import BackButton from "@/components/ui/BackButton";
import CodeHighlight from "@/components/visualizations/CodeHighlight";
import IntervalVisualizer from "@/components/visualizations/IntervalVisualizer";
import { generateActivitySelectionSteps, ActivityStep } from "@/lib/algorithms/greedy/activitySelection";
import { Play, Pause, RotateCcw } from "lucide-react";

const GREEDY_CODE = `function activitySelection(activities):
  // 1. Sort by finish time
  activities.sort((a,b) => a.end - b.end)
  
  last_end = activities[0].end
  selected = [activities[0]]
  
  for i from 1 to n:
    if activities[i].start >= last_end:
      selected.push(activities[i])
      last_end = activities[i].end
      
  return selected`;

const INITIAL_ACTIVITIES = [
    { start: 1, end: 4 },
    { start: 3, end: 5 },
    { start: 0, end: 6 },
    { start: 5, end: 7 },
    { start: 3, end: 9 },
    { start: 5, end: 9 },
    { start: 6, end: 10 },
    { start: 8, end: 11 },
    { start: 8, end: 12 },
    { start: 2, end: 14 },
    { start: 12, end: 16 }
];

export default function ActivitySelectionPage() {
    const [startTimes, setStartTimes] = useState(INITIAL_ACTIVITIES.map(a => a.start));
    const [endTimes, setEndTimes] = useState(INITIAL_ACTIVITIES.map(a => a.end));
    
    const [steps, setSteps] = useState<ActivityStep[]>([]);
    const [currentStep, setCurrentStep] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [speed, setSpeed] = useState(800);
    const [message, setMessage] = useState("Ready to run");
    const [isProcessing, setIsProcessing] = useState(false);
    
    // Playback
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
                        return prev;
                    }
                });
            }, speed);
            return () => clearInterval(timer);
        }
    }, [isPlaying, speed, steps]);

    const stepData = steps.length > 0 ? steps[currentStep] : { 
        activities: startTimes.map((s, i) => ({ id: i, start: s, end: endTimes[i], originalIndex: i })),
        selectedIds: [],
        rejectedIds: [],
        message: "Ready",
        lineNumber: undefined
    };

    const handleRun = () => {
        if (isProcessing) return;
        setIsProcessing(true);
        const gen = generateActivitySelectionSteps(startTimes, endTimes);
        const newSteps = Array.from(gen);
        setSteps(newSteps);
        setCurrentStep(0);
        setIsPlaying(true);
    };

    const handleReset = () => {
        setSteps([]);
        setCurrentStep(0);
        setIsPlaying(false);
        setIsProcessing(false);
        setMessage("Reset");
    };

    // Calculate max time for visualization scale
    const maxTime = Math.max(...endTimes, 16);

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            <BackButton href="/dsa/greedy" />
            <div>
                 <h1 className="text-3xl font-bold text-foreground mb-2">Activity Selection Problem</h1>
                 <p className="text-muted-foreground">Greedy strategy: Always select the next activity that finishes earliest.</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    {/* Visualizer */}
                     <div className="border rounded-lg bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 p-8 min-h-[500px]">
                        <IntervalVisualizer 
                            activities={stepData.activities}
                            currentActivityId={stepData.currentActivityId}
                            selectedIds={stepData.selectedIds}
                            rejectedIds={stepData.rejectedIds}
                            maxTime={maxTime}
                        />
                     </div>

                    {/* Status */}
                     <div className="bg-zinc-100 dark:bg-zinc-900/50 p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 flex justify-between items-center text-sm font-mono text-zinc-600 dark:text-zinc-400">
                        <span>Status: <span className="text-yellow-600 dark:text-yellow-500 font-bold">{stepData.message || message}</span></span>
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

                <div className="lg:col-span-1 space-y-6">
                     <div className="sticky top-6">
                        <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-3">Algorithm Logic</h3>
                        <CodeHighlight code={GREEDY_CODE} activeLine={stepData.lineNumber} />

                        {/* Controls */}
                        <div className="grid grid-cols-1 gap-4 mt-6">
                            <div className="bg-zinc-50 dark:bg-zinc-900/30 p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-4">
                                <p className="text-xs text-zinc-500">
                                    Visualizing the selection process. 
                                    Notice how activities are first sorted by their end times.
                                </p>
                                <button onClick={handleRun} disabled={isProcessing} className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded text-sm font-medium transition disabled:opacity-50">
                                    <Play className="w-4 h-4" /> Run Algorithm
                                </button>
                                <button onClick={handleReset} disabled={isProcessing} className="w-full flex items-center justify-center gap-2 bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-800 text-foreground py-2 rounded text-sm font-medium transition disabled:opacity-50">
                                    <RotateCcw className="w-4 h-4" /> Reset
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

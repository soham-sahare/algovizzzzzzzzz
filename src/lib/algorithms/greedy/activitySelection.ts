
export type Activity = {
    id: number;
    start: number;
    end: number;
    originalIndex: number;
}

export type ActivityStep = {
    activities: Activity[]; // Might change order if sorted
    currentActivityId?: number; // The one we are considering
    lastSelectedId?: number; // The last one added to our set
    selectedIds: number[];
    rejectedIds: number[];
    message: string;
    lineNumber?: number;
}

export function* generateActivitySelectionSteps(
    startTimes: number[], 
    endTimes: number[]
): Generator<ActivityStep> {
    // 1. Combine into objects
    let activities: Activity[] = startTimes.map((start, i) => ({
        id: i,
        start,
        end: endTimes[i],
        originalIndex: i
    }));

    yield { 
        activities: [...activities], 
        selectedIds: [],
        rejectedIds: [],
        message: "Initial activities. Not yet sorted.", 
        lineNumber: 1 
    };

    // 2. Sort by End Time
    activities.sort((a, b) => a.end - b.end);

    yield { 
        activities: [...activities], 
        selectedIds: [],
        rejectedIds: [],
        message: "Sorted activities by Finish Time (Ascending).", 
        lineNumber: 2 
    };

    // 3. Select first activity
    const selectedIds: number[] = [activities[0].id];
    let lastFinishTime = activities[0].end;

    yield { 
        activities: [...activities], 
        currentActivityId: activities[0].id,
        lastSelectedId: activities[0].id,
        selectedIds: [...selectedIds],
        rejectedIds: [],
        message: `Select Activity ${activities[0].id} (Finishes earliest at ${activities[0].end}).`, 
        lineNumber: 3 
    };

    // 4. Iterate others
    const rejectedIds: number[] = [];

    for (let i = 1; i < activities.length; i++) {
        const curr = activities[i];

        yield { 
            activities: [...activities], 
            currentActivityId: curr.id,
            lastSelectedId: activities.find(a => a.id === selectedIds[selectedIds.length-1])?.id,
            selectedIds: [...selectedIds],
            rejectedIds: [...rejectedIds],
            message: `Considering Activity ${curr.id} (${curr.start} - ${curr.end}).`, 
            lineNumber: 4 
        };

        if (curr.start >= lastFinishTime) {
            selectedIds.push(curr.id);
            lastFinishTime = curr.end;
             yield { 
                activities: [...activities], 
                currentActivityId: curr.id,
                selectedIds: [...selectedIds],
                rejectedIds: [...rejectedIds],
                message: `Valid! Starts at ${curr.start} >= Last Finish ${lastFinishTime}. Select.`, 
                lineNumber: 5 
            };
        } else {
            rejectedIds.push(curr.id);
             yield { 
                activities: [...activities], 
                currentActivityId: curr.id,
                selectedIds: [...selectedIds],
                rejectedIds: [...rejectedIds],
                message: `Conflict! Starts at ${curr.start} < Last Finish ${lastFinishTime}. Reject.`, 
                lineNumber: 6 
            };
        }
    }

    yield { 
        activities: [...activities], 
        selectedIds: [...selectedIds],
        rejectedIds: [...rejectedIds],
        message: `Finished. Selected ${selectedIds.length} activities.`, 
        lineNumber: 7 
    };
}

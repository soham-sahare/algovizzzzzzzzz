
import { SortingStep } from "./selectionSort";

export function* generateCountingSortSteps(array: number[]): Generator<SortingStep> {
  const n = array.length;
  if (n === 0) return;
  
  // Find max
  let max = array[0];
  for (let i = 1; i < n; i++) {
    if (array[i] > max) max = array[i];
  }

  yield {
    array: [...array],
    sorted: [],
    comparing: [],
    swapping: [],
    message: `Found Max Value: ${max}. Creating count array of size ${max + 1}.`,
    lineNumber: 1
  };

  const count = new Array(max + 1).fill(0);
  
  // Count frequencies
  for (let i = 0; i < n; i++) {
    count[array[i]]++;
    yield {
      array: [...array],
      sorted: [],
      comparing: [i], // Highlight current element being counted
      swapping: [],
      message: `Count frequency of ${array[i]}: ${count[array[i]]}`,
      lineNumber: 2
    };
  }

  // Accumulate
  for (let i = 1; i <= max; i++) {
    count[i] += count[i - 1];
  }
  
  yield {
     array: [...array],
     sorted: [],
     comparing: [],
     swapping: [],
     message: `Calculated cumulative counts.`,
     lineNumber: 3
  };

  const output = new Array(n).fill(0);
  
  // Build output array
  // Iterate backwards for stability
  for (let i = n - 1; i >= 0; i--) {
     const val = array[i];
     const pos = count[val] - 1;
     output[pos] = val;
     count[val]--;
     
     // Visualize placement (we can't easily show separate output array in this generic visualizer structure, so we might need to overwrite input array progressively or just show final result at end. 
     // Standard array visualizer expects 'array' prop. 
     // We can simulate the output array building by modifying a copy of 'array' but that's misleading if In-Place isn't true.
     // Getting creative: We'll just show the final array placement one by one in the main array view, effectively mimicking the overwrite.)
     
     const currentView = [...array]; 
     // To visualize properly, we might need a custom visualizer that shows Input vs Output array. 
     // For now, adhering to the SortingStep interface which implies single array transformation. 
     // We will update the 'array' state to reflect the output array progressively if possible, or just copy 'output' to 'array' at the end.
     
     yield {
        array: [...array],
        sorted: [],
        comparing: [i],
        swapping: [],
        message: `Placing ${val} at index ${pos} in output...`,
        lineNumber: 4
     };
  }
  
  // Copy output to array
  for(let i=0; i<n; i++) {
      array[i] = output[i];
      yield {
        array: [...array],
        sorted: Array.from({length: i+1}, (_, k)=>k),
        comparing: [i],
        swapping: [],
        message: `Copied ${output[i]} to original array index ${i}`,
        lineNumber: 5
      };
  }

  yield {
    array: [...array],
    sorted: Array.from({ length: n }, (_, i) => i),
    comparing: [],
    swapping: [],
    message: "Counting Sort Complete!",
    lineNumber: 6
  };
}

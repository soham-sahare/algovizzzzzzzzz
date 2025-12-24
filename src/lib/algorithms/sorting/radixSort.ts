
import { SortingStep } from "./selectionSort";

export function* generateRadixSortSteps(array: number[]): Generator<SortingStep> {
  const n = array.length;
  if (n === 0) return;

  // Find max to know number of digits
  let max = array[0];
  for(let x of array) if (x > max) max = x;
  
  yield {
      array: [...array],
      sorted: [],
      comparing: [],
      swapping: [],
      message: `Found Max: ${max}. Starting LSD Radix Sort.`,
      lineNumber: 1
  };

  // Do counting sort for every digit. exp is 1, 10, 100...
  for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
      
      yield {
          array: [...array],
          sorted: [],
          comparing: [],
          swapping: [],
          message: `Sorting by digit place: ${exp}s`,
          lineNumber: 2
      };

      const output = new Array(n).fill(0);
      const count = new Array(10).fill(0);

      // Count occurrences
      for (let i = 0; i < n; i++) {
          const digit = Math.floor(array[i] / exp) % 10;
          count[digit]++;
          yield {
              array: [...array],
              sorted: [],
              comparing: [i],
              swapping: [],
              message: `Scanning ${array[i]}: Digit ${digit}`,
              lineNumber: 3
          };
      }

      // Cumulative count
      for (let i = 1; i < 10; i++) {
          count[i] += count[i - 1];
      }

      // Build output
      for (let i = n - 1; i >= 0; i--) {
          const digit = Math.floor(array[i] / exp) % 10;
          const pos = count[digit] - 1;
          output[pos] = array[i];
          count[digit]--;
          
          // Visualization hack: show movement to output pos implies we update a copy for display
          // We can't easily visualize "moving to another array" in-place without a complex visualizer.
          // We will just highlight.
      }
      
      // Update main array
      for (let i = 0; i < n; i++) {
          array[i] = output[i];
           yield {
              array: [...array],
              sorted: [], // Not sorted fully yet
              comparing: [i],
              swapping: [],
              message: `Updated index ${i} with ${output[i]} (sorted by current digit)`,
              lineNumber: 4
          };
      }
  }

  yield {
    array: [...array],
    sorted: Array.from({ length: n }, (_, i) => i),
    comparing: [],
    swapping: [],
    message: "Radix Sort Complete!",
    lineNumber: 5
  };
}

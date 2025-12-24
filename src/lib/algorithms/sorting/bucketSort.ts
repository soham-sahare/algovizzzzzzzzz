
import { SortingStep } from "./selectionSort";

export function* generateBucketSortSteps(array: number[]): Generator<SortingStep> {
  // Use normalized float logic for bucket sort, but map back to our integers
  // Assume generic bucket sort logic:
  // 1. Create N buckets
  // 2. Distribute elements
  // 3. Sort buckets
  // 4. Concatenate
  
  const n = array.length;
  if (n === 0) return;
  
  const max = Math.max(...array);
  const min = Math.min(...array);
  const range = max - min + 1;
  const bucketCount = Math.floor(Math.sqrt(n)); 
  const buckets: number[][] = Array.from({ length: bucketCount }, () => []);

  yield {
     array: [...array],
     sorted: [],
     comparing: [],
     swapping: [],
     message: `Initializing ${bucketCount} buckets...`,
     lineNumber: 1
  };
  
  // Distribute
  for(let i=0; i<n; i++) {
      const idx = Math.floor(((array[i] - min) / range) * bucketCount);
      buckets[idx].push(array[i]);
      
      yield {
          array: [...array],
          sorted: [],
          comparing: [i],
          swapping: [],
          message: `Move ${array[i]} to Bucket ${idx}`,
          lineNumber: 2
      };
  }

  // Sort and Concatenate Visualization
  // We will build the new array progressively
  let currentIndex = 0;
  const newArray = new Array(n).fill(0); // Only for final display logic mimicry

  for(let i=0; i<bucketCount; i++) {
      yield {
          array: [...array],
          sorted: [],
          comparing: [],
          swapping: [],
          message: `Sorting Bucket ${i}...`,
          lineNumber: 3
      };
      
      buckets[i].sort((a,b) => a - b);
      
      for(const val of buckets[i]) {
          array[currentIndex] = val; // Overwrite in place for visualization
          
           yield {
              array: [...array],
              sorted: Array.from({length: currentIndex+1}, (_,k)=>k),
              comparing: [currentIndex],
              swapping: [],
              message: `Placed sorted value ${val} back into array`,
              lineNumber: 4
          };
          currentIndex++;
      }
  }

  yield {
    array: [...array],
    sorted: Array.from({ length: n }, (_, i) => i),
    comparing: [],
    swapping: [],
    message: "Bucket Sort Complete!",
    lineNumber: 5
  };
}

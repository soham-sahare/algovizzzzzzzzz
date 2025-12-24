
import { SortingStep } from "./selectionSort";

export function* generateShellSortSteps(array: number[]): Generator<SortingStep> {
  const n = array.length;
  // Start with a big gap, then reduce the gap
  for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
      
      yield {
          array: [...array],
          sorted: [],
          comparing: [],
          swapping: [],
          message: `Gap Size: ${gap}`,
          lineNumber: 1
      };

      // Do a gapped insertion sort for this gap size.
      // The first gap elements a[0..gap-1] are already in gapped order
      // keep adding one more element until the entire array is gap sorted
      for (let i = gap; i < n; i++) {
          const temp = array[i];
          let j = i;
          
          yield {
              array: [...array],
              sorted: [],
              comparing: [i, j - gap],
              swapping: [],
              message: `Comparing ${temp} with ${array[j-gap]} (gap ${gap})`,
              lineNumber: 2
          };

          while (j >= gap && array[j - gap] > temp) {
               array[j] = array[j - gap];
               
               yield {
                  array: [...array],
                  sorted: [],
                  comparing: [],
                  swapping: [j, j-gap], // Visualizing the shift as a 'copy over' but swap highlights work well
                  message: `Shift ${array[j]} to index ${j}`,
                  lineNumber: 3
              };
               
              j -= gap;
          }
          
          array[j] = temp;
          
          yield {
              array: [...array],
              sorted: [],
              comparing: [],
              swapping: [j], // Highlight placement
              message: `Placed ${temp} at index ${j}`,
              lineNumber: 4
          };
      }
  }

  yield {
    array: [...array],
    sorted: Array.from({ length: n }, (_, i) => i),
    comparing: [],
    swapping: [],
    message: "Shell Sort Complete!",
    lineNumber: 5
  };
}

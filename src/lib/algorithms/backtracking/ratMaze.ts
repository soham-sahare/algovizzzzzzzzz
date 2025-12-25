
export type RatMazeStep = {
    grid: number[][]; // 0=open, 1=wall, 2=path, 3=visited/backtracked
    currentCell: [number, number];
    message: string;
    description: string;
    lineNumber?: number;
};

// Simple solver to find ONE path
export function* generateRatMazeSteps(gridInput: number[][]): Generator<RatMazeStep> {
    const N = gridInput.length;
    const grid = gridInput.map(row => [...row]); // copy

    const start: [number, number] = [0, 0];
    const end: [number, number] = [N - 1, N - 1];

    if (grid[0][0] === 1 || grid[N-1][N-1] === 1) {
        yield {
             grid: grid.map(r => [...r]),
             currentCell: start,
             message: "Blocked",
             description: "Start or End is blocked by a wall.",
        };
        return;
    }

    yield {
        grid: grid.map(r => [...r]),
        currentCell: start,
        message: "Start",
        description: "Starting at (0, 0). Goal is (N-1, N-1).",
    };

    function* solve(r: number, c: number): Generator<RatMazeStep, boolean, void> {
        // Check bounds and wall
        if (r < 0 || c < 0 || r >= N || c >= N || grid[r][c] === 1 || grid[r][c] === 2) {
            return false;
        }

        // Visualize verification
        yield {
            grid: grid.map(r => [...r]),
            currentCell: [r, c],
            message: `Visiting (${r}, ${c})`,
            description: "Checking cell validity...",
        };

        // Mark as part of path tentatively
        grid[r][c] = 2; // Path color
        
        yield {
            grid: grid.map(r => [...r]),
            currentCell: [r, c],
            message: `Marking (${r}, ${c})`,
            description: "Tentatively adding to path.",
        };

        // Check destination
        if (r === end[0] && c === end[1]) {
             yield {
                grid: grid.map(r => [...r]),
                currentCell: [r, c],
                message: "Goal Reached!",
                description: "Found the exit.",
            };
            return true;
        }

        // Explore neighbors: Down, Right, Up, Left
        const directions = [[1, 0], [0, 1], [-1, 0], [0, -1]];
        
        for (let [dr, dc] of directions) {
            const nextR = r + dr;
            const nextC = c + dc;
            
            if (yield* solve(nextR, nextC)) {
                return true;
            }
        }

        // Backtrack
        grid[r][c] = 3; // Visited but failed (backtracked)
        
        yield {
            grid: grid.map(r => [...r]),
            currentCell: [r, c],
            message: `Backtracking from (${r}, ${c})`,
            description: "Dead end. Unmarking cell.",
        };

        return false;
    }

    const success = yield* solve(0, 0);

    if (!success) {
        yield {
            grid: grid.map(r => [...r]),
            currentCell: start,
            message: "No Path Found",
            description: "Explored reachable areas but couldn't reach goal.",
        };
    }
}

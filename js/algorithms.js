/**
 * Graph Algorithms for Pathfinding
 * Implements: Dijkstra's Algorithm, A* Search, BFS, DFS
 */

// ============================================================================
// Dijkstra's Algorithm
// Time Complexity: O((V + E) log V) with priority queue
// Space Complexity: O(V)
// ============================================================================
class DijkstraAlgorithm {
    constructor(graph) {
        this.graph = graph;
        this.visitedNodes = [];
    }

    /**
     * Find shortest path from source to destination
     */
    findPath(sourceId, destId) {
        const startTime = performance.now();
        this.visitedNodes = [];

        // Initialize distances and previous nodes
        const distances = new Map();
        const previous = new Map();
        const pq = new PriorityQueue();

        // Set all distances to infinity except source
        this.graph.nodes.forEach((node, id) => {
            distances.set(id, id === sourceId ? 0 : Infinity);
            previous.set(id, null);
        });

        // Add source to priority queue
        pq.enqueue(sourceId, 0);

        while (!pq.isEmpty()) {
            const currentId = pq.dequeue();
            this.visitedNodes.push(currentId);

            // Found destination
            if (currentId === destId) {
                break;
            }

            const currentDistance = distances.get(currentId);

            // Check all neighbors
            const neighbors = this.graph.getNeighbors(currentId);
            for (const edge of neighbors) {
                const neighborId = edge.to;
                const weight = edge.getEffectiveWeight();

                // Skip blocked edges
                if (weight === Infinity) continue;

                const newDistance = currentDistance + weight;

                // Found shorter path
                if (newDistance < distances.get(neighborId)) {
                    distances.set(neighborId, newDistance);
                    previous.set(neighborId, currentId);
                    pq.enqueue(neighborId, newDistance);
                }
            }
        }

        // Reconstruct path
        const path = this.reconstructPath(previous, sourceId, destId);
        const distance = distances.get(destId);
        const executionTime = performance.now() - startTime;

        return new PathResult(
            path,
            distance === Infinity ? -1 : distance,
            this.visitedNodes.length,
            executionTime,
            'Dijkstra'
        );
    }

    /**
     * Reconstruct path from previous nodes map
     */
    reconstructPath(previous, sourceId, destId) {
        const path = [];
        let current = destId;

        while (current !== null) {
            path.unshift(current);
            current = previous.get(current);
        }

        return path[0] === sourceId ? path : [];
    }

    getVisitedNodes() {
        return this.visitedNodes;
    }
}

// ============================================================================
// A* Search Algorithm
// Time Complexity: O((V + E) log V) with priority queue
// Space Complexity: O(V)
// Uses heuristic function for better performance
// ============================================================================
class AStarAlgorithm {
    constructor(graph, heuristicType = 'euclidean') {
        this.graph = graph;
        this.heuristicType = heuristicType;
        this.visitedNodes = [];
    }

    /**
     * Calculate heuristic (estimated distance to goal)
     */
    heuristic(nodeId, goalId) {
        const node = this.graph.getNode(nodeId);
        const goal = this.graph.getNode(goalId);

        switch (this.heuristicType) {
            case 'manhattan':
                return node.manhattanDistance(goal);
            case 'chebyshev':
                return node.chebyshevDistance(goal);
            case 'euclidean':
            default:
                return node.euclideanDistance(goal);
        }
    }

    /**
     * Find shortest path using A* algorithm
     */
    findPath(sourceId, destId) {
        const startTime = performance.now();
        this.visitedNodes = [];

        // g(n): actual cost from start to n
        const gScore = new Map();
        // f(n): g(n) + h(n) (estimated total cost)
        const fScore = new Map();
        const previous = new Map();
        const openSet = new PriorityQueue();
        const closedSet = new Set();

        // Initialize scores
        this.graph.nodes.forEach((node, id) => {
            gScore.set(id, id === sourceId ? 0 : Infinity);
            fScore.set(id, id === sourceId ? this.heuristic(sourceId, destId) : Infinity);
            previous.set(id, null);
        });

        openSet.enqueue(sourceId, fScore.get(sourceId));

        while (!openSet.isEmpty()) {
            const currentId = openSet.dequeue();

            // Skip if already processed
            if (closedSet.has(currentId)) continue;

            closedSet.add(currentId);
            this.visitedNodes.push(currentId);

            // Found destination
            if (currentId === destId) {
                break;
            }

            const currentGScore = gScore.get(currentId);

            // Check all neighbors
            const neighbors = this.graph.getNeighbors(currentId);
            for (const edge of neighbors) {
                const neighborId = edge.to;
                const weight = edge.getEffectiveWeight();

                // Skip blocked edges or already processed nodes
                if (weight === Infinity || closedSet.has(neighborId)) continue;

                const tentativeGScore = currentGScore + weight;

                // Found better path
                if (tentativeGScore < gScore.get(neighborId)) {
                    previous.set(neighborId, currentId);
                    gScore.set(neighborId, tentativeGScore);

                    const h = this.heuristic(neighborId, destId);
                    const f = tentativeGScore + h;
                    fScore.set(neighborId, f);

                    openSet.enqueue(neighborId, f);
                }
            }
        }

        // Reconstruct path
        const path = this.reconstructPath(previous, sourceId, destId);
        const distance = gScore.get(destId);
        const executionTime = performance.now() - startTime;

        return new PathResult(
            path,
            distance === Infinity ? -1 : distance,
            this.visitedNodes.length,
            executionTime,
            `A* (${this.heuristicType})`
        );
    }

    reconstructPath(previous, sourceId, destId) {
        const path = [];
        let current = destId;

        while (current !== null) {
            path.unshift(current);
            current = previous.get(current);
        }

        return path[0] === sourceId ? path : [];
    }

    getVisitedNodes() {
        return this.visitedNodes;
    }
}

// ============================================================================
// Breadth-First Search (BFS)
// Time Complexity: O(V + E)
// Space Complexity: O(V)
// Finds shortest path in unweighted graphs
// ============================================================================
class BFSAlgorithm {
    constructor(graph) {
        this.graph = graph;
        this.visitedNodes = [];
    }

    /**
     * Find path using BFS
     */
    findPath(sourceId, destId) {
        const startTime = performance.now();
        this.visitedNodes = [];

        const queue = [sourceId];
        const visited = new Set([sourceId]);
        const previous = new Map();
        const distances = new Map();

        previous.set(sourceId, null);
        distances.set(sourceId, 0);

        while (queue.length > 0) {
            const currentId = queue.shift();
            this.visitedNodes.push(currentId);

            // Found destination
            if (currentId === destId) {
                break;
            }

            // Explore neighbors
            const neighbors = this.graph.getNeighbors(currentId);
            for (const edge of neighbors) {
                const neighborId = edge.to;

                // Skip visited nodes and blocked edges
                if (visited.has(neighborId) || edge.blocked) continue;

                visited.add(neighborId);
                previous.set(neighborId, currentId);

                const currentDistance = distances.get(currentId);
                distances.set(neighborId, currentDistance + edge.weight);

                queue.push(neighborId);
            }
        }

        // Reconstruct path
        const path = this.reconstructPath(previous, sourceId, destId);
        const distance = distances.get(destId) || -1;
        const executionTime = performance.now() - startTime;

        return new PathResult(
            path,
            distance,
            this.visitedNodes.length,
            executionTime,
            'BFS'
        );
    }

    reconstructPath(previous, sourceId, destId) {
        const path = [];
        let current = destId;

        while (current !== null && current !== undefined) {
            path.unshift(current);
            current = previous.get(current);
        }

        return path.length > 0 && path[0] === sourceId ? path : [];
    }

    getVisitedNodes() {
        return this.visitedNodes;
    }
}

// ============================================================================
// Depth-First Search (DFS)
// Time Complexity: O(V + E)
// Space Complexity: O(V)
// Does not guarantee shortest path
// ============================================================================
class DFSAlgorithm {
    constructor(graph) {
        this.graph = graph;
        this.visitedNodes = [];
    }

    /**
     * Find path using DFS
     */
    findPath(sourceId, destId) {
        const startTime = performance.now();
        this.visitedNodes = [];

        const visited = new Set();
        const previous = new Map();
        const distances = new Map();

        previous.set(sourceId, null);
        distances.set(sourceId, 0);

        // DFS recursive helper
        const dfs = (currentId, currentDistance) => {
            visited.add(currentId);
            this.visitedNodes.push(currentId);

            // Found destination
            if (currentId === destId) {
                return true;
            }

            // Explore neighbors
            const neighbors = this.graph.getNeighbors(currentId);
            for (const edge of neighbors) {
                const neighborId = edge.to;

                // Skip visited nodes and blocked edges
                if (visited.has(neighborId) || edge.blocked) continue;

                previous.set(neighborId, currentId);
                distances.set(neighborId, currentDistance + edge.weight);

                if (dfs(neighborId, currentDistance + edge.weight)) {
                    return true;
                }
            }

            return false;
        };

        const found = dfs(sourceId, 0);

        // Reconstruct path
        const path = found ? this.reconstructPath(previous, sourceId, destId) : [];
        const distance = found ? distances.get(destId) : -1;
        const executionTime = performance.now() - startTime;

        return new PathResult(
            path,
            distance,
            this.visitedNodes.length,
            executionTime,
            'DFS'
        );
    }

    reconstructPath(previous, sourceId, destId) {
        const path = [];
        let current = destId;

        while (current !== null && current !== undefined) {
            path.unshift(current);
            current = previous.get(current);
        }

        return path.length > 0 && path[0] === sourceId ? path : [];
    }

    getVisitedNodes() {
        return this.visitedNodes;
    }
}

// ============================================================================
// Algorithm Factory
// ============================================================================
class AlgorithmFactory {
    static createAlgorithm(type, graph, options = {}) {
        switch (type) {
            case 'dijkstra':
                return new DijkstraAlgorithm(graph);
            case 'astar':
                return new AStarAlgorithm(graph, options.heuristic || 'euclidean');
            case 'bfs':
                return new BFSAlgorithm(graph);
            case 'dfs':
                return new DFSAlgorithm(graph);
            default:
                throw new Error(`Unknown algorithm type: ${type}`);
        }
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        DijkstraAlgorithm,
        AStarAlgorithm,
        BFSAlgorithm,
        DFSAlgorithm,
        AlgorithmFactory
    };
}

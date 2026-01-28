/**
 * Data Structures for Graph-Based Navigation System
 * Implements: Priority Queue (Min-Heap), Graph, Hash Maps
 */

// ============================================================================
// Priority Queue (Min-Heap) Implementation
// Used for Dijkstra's and A* algorithms
// ============================================================================
class PriorityQueue {
    constructor() {
        this.heap = [];
        this.size = 0;
    }

    /**
     * Insert element with priority
     * Time Complexity: O(log n)
     */
    enqueue(element, priority) {
        const node = { element, priority };
        this.heap.push(node);
        this.size++;
        this.bubbleUp(this.size - 1);
    }

    /**
     * Remove and return element with minimum priority
     * Time Complexity: O(log n)
     */
    dequeue() {
        if (this.size === 0) return null;
        
        const min = this.heap[0];
        const end = this.heap.pop();
        this.size--;
        
        if (this.size > 0) {
            this.heap[0] = end;
            this.bubbleDown(0);
        }
        
        return min.element;
    }

    /**
     * Bubble up element to maintain heap property
     */
    bubbleUp(index) {
        while (index > 0) {
            const parentIndex = Math.floor((index - 1) / 2);
            
            if (this.heap[index].priority >= this.heap[parentIndex].priority) {
                break;
            }
            
            [this.heap[index], this.heap[parentIndex]] = 
                [this.heap[parentIndex], this.heap[index]];
            
            index = parentIndex;
        }
    }

    /**
     * Bubble down element to maintain heap property
     */
    bubbleDown(index) {
        while (true) {
            let minIndex = index;
            const leftChild = 2 * index + 1;
            const rightChild = 2 * index + 2;
            
            if (leftChild < this.size && 
                this.heap[leftChild].priority < this.heap[minIndex].priority) {
                minIndex = leftChild;
            }
            
            if (rightChild < this.size && 
                this.heap[rightChild].priority < this.heap[minIndex].priority) {
                minIndex = rightChild;
            }
            
            if (minIndex === index) break;
            
            [this.heap[index], this.heap[minIndex]] = 
                [this.heap[minIndex], this.heap[index]];
            
            index = minIndex;
        }
    }

    isEmpty() {
        return this.size === 0;
    }

    clear() {
        this.heap = [];
        this.size = 0;
    }
}

// ============================================================================
// Graph Node Class
// ============================================================================
class GraphNode {
    constructor(id, name, x, y, metadata = {}) {
        this.id = id;
        this.name = name;
        this.x = x; // X coordinate for visualization
        this.y = y; // Y coordinate for visualization
        this.metadata = metadata; // Additional data (population, type, etc.)
    }

    /**
     * Calculate Euclidean distance to another node
     */
    euclideanDistance(other) {
        const dx = this.x - other.x;
        const dy = this.y - other.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    /**
     * Calculate Manhattan distance to another node
     */
    manhattanDistance(other) {
        return Math.abs(this.x - other.x) + Math.abs(this.y - other.y);
    }

    /**
     * Calculate Chebyshev distance to another node
     */
    chebyshevDistance(other) {
        return Math.max(Math.abs(this.x - other.x), Math.abs(this.y - other.y));
    }
}

// ============================================================================
// Graph Edge Class
// ============================================================================
class GraphEdge {
    constructor(from, to, weight, metadata = {}) {
        this.from = from;
        this.to = to;
        this.weight = weight; // Base weight (distance)
        this.metadata = metadata; // Road type, speed limit, etc.
        this.trafficMultiplier = 1.0; // Traffic factor (1.0 = no traffic)
        this.blocked = false; // Roadblock status
    }

    /**
     * Get effective weight considering traffic and blocks
     */
    getEffectiveWeight() {
        if (this.blocked) return Infinity;
        return this.weight * this.trafficMultiplier;
    }

    /**
     * Set traffic level (0 = no traffic, 1 = heavy traffic)
     */
    setTraffic(level) {
        this.trafficMultiplier = 1.0 + (level * 2.0); // Up to 3x slower
    }
}

// ============================================================================
// Graph Class (Adjacency List Implementation)
// ============================================================================
class Graph {
    constructor() {
        this.nodes = new Map(); // nodeId -> GraphNode
        this.adjacencyList = new Map(); // nodeId -> [GraphEdge]
        this.edges = []; // All edges for visualization
    }

    /**
     * Add a node to the graph
     * Time Complexity: O(1)
     */
    addNode(id, name, x, y, metadata = {}) {
        if (!this.nodes.has(id)) {
            const node = new GraphNode(id, name, x, y, metadata);
            this.nodes.set(id, node);
            this.adjacencyList.set(id, []);
            return node;
        }
        return this.nodes.get(id);
    }

    /**
     * Add an edge to the graph
     * Time Complexity: O(1)
     */
    addEdge(fromId, toId, weight, bidirectional = true, metadata = {}) {
        if (!this.nodes.has(fromId) || !this.nodes.has(toId)) {
            console.error('Cannot add edge: node does not exist');
            return null;
        }

        const edge = new GraphEdge(fromId, toId, weight, metadata);
        this.adjacencyList.get(fromId).push(edge);
        this.edges.push(edge);

        // Add reverse edge for bidirectional graphs
        if (bidirectional) {
            const reverseEdge = new GraphEdge(toId, fromId, weight, metadata);
            this.adjacencyList.get(toId).push(reverseEdge);
            this.edges.push(reverseEdge);
        }

        return edge;
    }

    /**
     * Get all neighbors of a node
     * Time Complexity: O(1)
     */
    getNeighbors(nodeId) {
        return this.adjacencyList.get(nodeId) || [];
    }

    /**
     * Get node by ID
     * Time Complexity: O(1)
     */
    getNode(nodeId) {
        return this.nodes.get(nodeId);
    }

    /**
     * Get all nodes
     */
    getAllNodes() {
        return Array.from(this.nodes.values());
    }

    /**
     * Get all edges
     */
    getAllEdges() {
        return this.edges;
    }

    /**
     * Clear the graph
     */
    clear() {
        this.nodes.clear();
        this.adjacencyList.clear();
        this.edges = [];
    }

    /**
     * Get graph statistics
     */
    getStats() {
        return {
            nodeCount: this.nodes.size,
            edgeCount: this.edges.length / 2, // Divide by 2 for bidirectional
            avgDegree: this.edges.length / this.nodes.size
        };
    }

    /**
     * Apply traffic to random edges
     */
    simulateTraffic(intensity = 0.3) {
        this.edges.forEach(edge => {
            if (Math.random() < intensity) {
                edge.setTraffic(Math.random());
            } else {
                edge.setTraffic(0);
            }
        });
    }

    /**
     * Add random roadblocks
     */
    simulateRoadblocks(count = 3) {
        const availableEdges = this.edges.filter(e => !e.blocked);
        const blockedCount = Math.min(count, availableEdges.length);
        
        for (let i = 0; i < blockedCount; i++) {
            const randomIndex = Math.floor(Math.random() * availableEdges.length);
            availableEdges[randomIndex].blocked = true;
            availableEdges.splice(randomIndex, 1);
        }
    }

    /**
     * Clear all traffic and roadblocks
     */
    clearDynamicConditions() {
        this.edges.forEach(edge => {
            edge.trafficMultiplier = 1.0;
            edge.blocked = false;
        });
    }
}

// ============================================================================
// Path Result Class
// ============================================================================
class PathResult {
    constructor(path, distance, nodesVisited, executionTime, algorithm) {
        this.path = path; // Array of node IDs
        this.distance = distance; // Total distance
        this.nodesVisited = nodesVisited; // Number of nodes explored
        this.executionTime = executionTime; // Time in milliseconds
        this.algorithm = algorithm; // Algorithm used
    }

    /**
     * Get path as array of node objects
     */
    getPathNodes(graph) {
        return this.path.map(nodeId => graph.getNode(nodeId));
    }

    /**
     * Get detailed path steps with distances
     */
    getPathSteps(graph) {
        const steps = [];
        
        for (let i = 0; i < this.path.length; i++) {
            const currentNode = graph.getNode(this.path[i]);
            let stepDistance = 0;
            
            if (i < this.path.length - 1) {
                const nextNodeId = this.path[i + 1];
                const edges = graph.getNeighbors(this.path[i]);
                const edge = edges.find(e => e.to === nextNodeId);
                stepDistance = edge ? edge.weight : 0;
            }
            
            steps.push({
                node: currentNode,
                distance: stepDistance,
                cumulativeDistance: this.getCumulativeDistance(graph, i)
            });
        }
        
        return steps;
    }

    /**
     * Get cumulative distance up to a specific step
     */
    getCumulativeDistance(graph, stepIndex) {
        let total = 0;
        
        for (let i = 0; i < stepIndex; i++) {
            const currentId = this.path[i];
            const nextId = this.path[i + 1];
            const edges = graph.getNeighbors(currentId);
            const edge = edges.find(e => e.to === nextId);
            if (edge) total += edge.weight;
        }
        
        return total;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        PriorityQueue,
        GraphNode,
        GraphEdge,
        Graph,
        PathResult
    };
}

/**
 * Main Application Controller
 * Integrates all components and handles user interactions
 */

class PathFinderApp {
    constructor() {
        // Initialize core components
        this.graph = new Graph();
        this.mapDataManager = new MapDataManager();
        this.visualization = new VisualizationEngine('mapCanvas');

        // Current state
        this.currentDataset = 'usa_cities';
        this.currentAlgorithm = 'dijkstra';
        this.currentHeuristic = 'euclidean';
        this.currentRoutingMode = 'shortest';
        this.lastPathResult = null;

        // Initialize UI
        this.initializeUI();
        this.setupEventListeners();

        // Load default map
        this.loadMap('usa_cities');
    }

    initializeUI() {
        // Populate node selects will happen after map load
        this.updateStats();
    }

    setupEventListeners() {
        // Algorithm selection
        document.getElementById('algorithm').addEventListener('change', (e) => {
            this.currentAlgorithm = e.target.value;
            document.getElementById('currentAlgo').textContent = this.getAlgorithmDisplayName(e.target.value);

            // Show/hide heuristic option for A*
            const heuristicGroup = document.getElementById('heuristic').parentElement;
            heuristicGroup.style.display = e.target.value === 'astar' ? 'block' : 'none';
        });

        // Heuristic selection
        document.getElementById('heuristic').addEventListener('change', (e) => {
            this.currentHeuristic = e.target.value;
        });

        // Routing mode selection
        document.getElementById('routingMode').addEventListener('change', (e) => {
            this.currentRoutingMode = e.target.value;
        });

        // Find path button
        document.getElementById('findPathBtn').addEventListener('click', () => {
            this.findPath();
        });

        // Clear path button
        document.getElementById('clearPathBtn').addEventListener('click', () => {
            this.clearPath();
        });

        // Load map button
        document.getElementById('loadMapBtn').addEventListener('click', () => {
            const mapData = document.getElementById('mapData').value;
            this.loadMap(mapData);
        });

        // Traffic simulation
        document.getElementById('trafficEnabled').addEventListener('change', (e) => {
            if (e.target.checked) {
                this.graph.simulateTraffic(0.3);
            } else {
                this.graph.clearDynamicConditions();
            }
            this.visualization.render();
        });

        // Roadblocks simulation
        document.getElementById('roadblocksEnabled').addEventListener('change', (e) => {
            if (e.target.checked) {
                this.graph.simulateRoadblocks(3);
            } else {
                this.graph.clearDynamicConditions();
            }
            this.visualization.render();
        });

        // Zoom controls
        document.getElementById('zoomIn').addEventListener('click', () => {
            this.visualization.zoomIn();
        });

        document.getElementById('zoomOut').addEventListener('click', () => {
            this.visualization.zoomOut();
        });

        document.getElementById('resetView').addEventListener('click', () => {
            this.visualization.resetView();
        });

        // Close path details
        document.getElementById('closeDetails').addEventListener('click', () => {
            document.getElementById('pathDetails').style.display = 'none';
        });
    }

    loadMap(datasetName) {
        // Handle custom map generation
        if (datasetName === 'custom') {
            this.generateCustomMap();
            return;
        }

        // Load dataset into graph
        const success = this.mapDataManager.loadDataset(datasetName, this.graph);

        if (!success) {
            this.showNotification('Failed to load map dataset', 'error');
            return;
        }

        this.currentDataset = datasetName;

        // Apply routing mode
        this.mapDataManager.applyRoutingMode(this.graph, this.currentRoutingMode);

        // Update visualization
        this.visualization.setGraph(this.graph);

        // Update UI
        this.populateNodeSelects();
        this.updateStats();

        this.showNotification(`Loaded ${this.getDatasetDisplayName(datasetName)}`, 'success');
    }

    generateCustomMap() {
        // Prompt user for parameters
        const nodeCount = prompt('Enter number of nodes (cities):', '20');
        if (!nodeCount || nodeCount === null) {
            this.showNotification('Custom map generation cancelled', 'info');
            return;
        }

        const edgeCount = prompt('Enter number of edges (connections):', '40');
        if (!edgeCount || edgeCount === null) {
            this.showNotification('Custom map generation cancelled', 'info');
            return;
        }

        const nodes = parseInt(nodeCount);
        const edges = parseInt(edgeCount);

        // Validate input
        if (isNaN(nodes) || isNaN(edges) || nodes < 2 || edges < 1) {
            this.showNotification('Invalid input. Please enter valid numbers.', 'error');
            return;
        }

        if (edges < nodes - 1) {
            this.showNotification('Not enough edges to connect all nodes. Minimum: ' + (nodes - 1), 'error');
            return;
        }

        if (edges > nodes * (nodes - 1) / 2) {
            this.showNotification('Too many edges. Maximum: ' + (nodes * (nodes - 1) / 2), 'error');
            return;
        }

        try {
            // Generate custom map data
            const customData = this.mapDataManager.generateCustomMap(nodes, edges);

            // Clear graph and load custom data
            this.graph.clear();

            // Add nodes
            customData.nodes.forEach(node => {
                this.graph.addNode(
                    node.id,
                    node.name,
                    node.x,
                    node.y,
                    { population: node.population }
                );
            });

            // Add edges
            customData.edges.forEach(edge => {
                this.graph.addEdge(
                    edge.from,
                    edge.to,
                    edge.distance,
                    true
                );
            });

            this.currentDataset = 'custom';

            // Update visualization
            this.visualization.setGraph(this.graph);

            // Update UI
            this.populateNodeSelects();
            this.updateStats();

            this.showNotification(`Generated custom map with ${nodes} nodes and ${edges} edges`, 'success');
        } catch (error) {
            console.error('Error generating custom map:', error);
            this.showNotification('Error generating custom map: ' + error.message, 'error');
        }
    }

    populateNodeSelects() {
        const nodes = this.graph.getAllNodes();
        const sourceSelect = document.getElementById('sourceNode');
        const destSelect = document.getElementById('destNode');

        // Clear existing options
        sourceSelect.innerHTML = '<option value="">Select source...</option>';
        destSelect.innerHTML = '<option value="">Select destination...</option>';

        // Add node options
        nodes.forEach(node => {
            const sourceOption = document.createElement('option');
            sourceOption.value = node.id;
            sourceOption.textContent = node.name;
            sourceSelect.appendChild(sourceOption);

            const destOption = document.createElement('option');
            destOption.value = node.id;
            destOption.textContent = node.name;
            destSelect.appendChild(destOption);
        });
    }

    findPath() {
        const sourceId = document.getElementById('sourceNode').value;
        const destId = document.getElementById('destNode').value;

        // Validation
        if (!sourceId || !destId) {
            this.showNotification('Please select both source and destination', 'error');
            return;
        }

        if (sourceId === destId) {
            this.showNotification('Source and destination cannot be the same', 'error');
            return;
        }

        // Create algorithm instance
        const options = {
            heuristic: this.currentHeuristic
        };

        const algorithm = AlgorithmFactory.createAlgorithm(
            this.currentAlgorithm,
            this.graph,
            options
        );

        // Find path
        try {
            const pathResult = algorithm.findPath(sourceId, destId);

            if (!pathResult.path || pathResult.path.length === 0) {
                this.showNotification('No path found between selected nodes', 'error');
                return;
            }

            this.lastPathResult = pathResult;

            // Update metrics
            this.updateMetrics(pathResult);

            // Visualize path
            this.visualization.animatePath(pathResult);

            // Show path details
            this.displayPathDetails(pathResult);

            this.showNotification(
                `Path found! Distance: ${pathResult.distance.toFixed(2)} km`,
                'success'
            );
        } catch (error) {
            console.error('Error finding path:', error);
            this.showNotification('Error finding path: ' + error.message, 'error');
        }
    }

    clearPath() {
        this.lastPathResult = null;
        this.visualization.clearPath();
        document.getElementById('pathDetails').style.display = 'none';

        // Reset metrics
        document.getElementById('nodesVisited').textContent = '0';
        document.getElementById('execTime').textContent = '0ms';
        document.getElementById('pathLength').textContent = '0';
        document.getElementById('totalDistance').textContent = '0 km';
    }

    updateMetrics(pathResult) {
        document.getElementById('nodesVisited').textContent = pathResult.nodesVisited;
        document.getElementById('execTime').textContent = `${pathResult.executionTime.toFixed(2)}ms`;
        document.getElementById('pathLength').textContent = pathResult.path.length;
        document.getElementById('totalDistance').textContent = `${pathResult.distance.toFixed(2)} km`;
    }

    displayPathDetails(pathResult) {
        const pathSteps = pathResult.getPathSteps(this.graph);
        const pathStepsContainer = document.getElementById('pathSteps');

        pathStepsContainer.innerHTML = '';

        pathSteps.forEach((step, index) => {
            const stepElement = document.createElement('div');
            stepElement.className = 'path-step';

            const stepNumber = document.createElement('div');
            stepNumber.className = 'step-number';
            stepNumber.textContent = index + 1;

            const stepInfo = document.createElement('div');
            stepInfo.className = 'step-info';

            const stepLocation = document.createElement('div');
            stepLocation.className = 'step-location';
            stepLocation.textContent = step.node.name;

            const stepDistance = document.createElement('div');
            stepDistance.className = 'step-distance';

            if (index < pathSteps.length - 1) {
                stepDistance.textContent = `→ ${step.distance.toFixed(2)} km to next (Total: ${step.cumulativeDistance.toFixed(2)} km)`;
            } else {
                stepDistance.textContent = `✓ Destination reached (Total: ${step.cumulativeDistance.toFixed(2)} km)`;
            }

            stepInfo.appendChild(stepLocation);
            stepInfo.appendChild(stepDistance);

            stepElement.appendChild(stepNumber);
            stepElement.appendChild(stepInfo);

            pathStepsContainer.appendChild(stepElement);
        });

        document.getElementById('pathDetails').style.display = 'block';
    }

    updateStats() {
        const stats = this.graph.getStats();
        document.getElementById('nodeCount').textContent = stats.nodeCount;
        document.getElementById('edgeCount').textContent = stats.edgeCount;
    }

    getAlgorithmDisplayName(algorithm) {
        const names = {
            'dijkstra': 'Dijkstra',
            'astar': 'A*',
            'bfs': 'BFS',
            'dfs': 'DFS'
        };
        return names[algorithm] || algorithm;
    }

    getDatasetDisplayName(dataset) {
        const names = {
            'usa_cities': 'USA Major Cities',
            'europe_cities': 'European Cities',
            'india_cities': 'Indian Cities',
            'custom': 'Custom Map'
        };
        return names[dataset] || dataset;
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${type === 'error' ? '#ef4444' : type === 'success' ? '#10b981' : '#6366f1'};
            color: white;
            padding: 16px 24px;
            border-radius: 12px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
            z-index: 1000;
            animation: slideIn 0.3s ease-out;
            font-weight: 600;
            max-width: 400px;
        `;
        notification.textContent = message;

        document.body.appendChild(notification);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
}

// Add notification animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Initialize app when DOM is ready
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new PathFinderApp();
    console.log('PathFinder Pro initialized successfully!');
    console.log('Graph-based navigation system ready.');
    console.log('Available algorithms: Dijkstra, A*, BFS, DFS');
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { PathFinderApp };
}

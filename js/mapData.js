/**
 * Map Data for Navigation System
 * Contains real city data with coordinates and distances
 */

// ============================================================================
// USA Major Cities Dataset
// ============================================================================
const USA_CITIES_DATA = {
    nodes: [
        { id: 'nyc', name: 'New York', x: 850, y: 300, population: 8336817 },
        { id: 'la', name: 'Los Angeles', x: 150, y: 450, population: 3979576 },
        { id: 'chicago', name: 'Chicago', x: 650, y: 280, population: 2693976 },
        { id: 'houston', name: 'Houston', x: 450, y: 550, population: 2320268 },
        { id: 'phoenix', name: 'Phoenix', x: 250, y: 500, population: 1680992 },
        { id: 'philadelphia', name: 'Philadelphia', x: 820, y: 320, population: 1584064 },
        { id: 'san_antonio', name: 'San Antonio', x: 400, y: 600, population: 1547253 },
        { id: 'san_diego', name: 'San Diego', x: 120, y: 520, population: 1423851 },
        { id: 'dallas', name: 'Dallas', x: 450, y: 520, population: 1343573 },
        { id: 'san_jose', name: 'San Jose', x: 100, y: 380, population: 1021795 },
        { id: 'austin', name: 'Austin', x: 420, y: 580, population: 978908 },
        { id: 'jacksonville', name: 'Jacksonville', x: 750, y: 580, population: 911507 },
        { id: 'fort_worth', name: 'Fort Worth', x: 440, y: 510, population: 909585 },
        { id: 'columbus', name: 'Columbus', x: 720, y: 320, population: 898553 },
        { id: 'charlotte', name: 'Charlotte', x: 760, y: 430, population: 885708 },
        { id: 'san_francisco', name: 'San Francisco', x: 90, y: 360, population: 881549 },
        { id: 'indianapolis', name: 'Indianapolis', x: 680, y: 340, population: 876384 },
        { id: 'seattle', name: 'Seattle', x: 110, y: 150, population: 753675 },
        { id: 'denver', name: 'Denver', x: 350, y: 340, population: 727211 },
        { id: 'boston', name: 'Boston', x: 880, y: 260, population: 692600 },
        { id: 'nashville', name: 'Nashville', x: 680, y: 430, population: 689447 },
        { id: 'detroit', name: 'Detroit', x: 720, y: 260, population: 672662 },
        { id: 'portland', name: 'Portland', x: 100, y: 200, population: 654741 },
        { id: 'las_vegas', name: 'Las Vegas', x: 200, y: 420, population: 641676 },
        { id: 'miami', name: 'Miami', x: 780, y: 680, population: 467963 }
    ],
    edges: [
        // East Coast connections
        { from: 'nyc', to: 'philadelphia', distance: 95 },
        { from: 'nyc', to: 'boston', distance: 215 },
        { from: 'philadelphia', to: 'boston', distance: 310 },
        { from: 'nyc', to: 'columbus', distance: 535 },
        { from: 'philadelphia', to: 'columbus', distance: 450 },

        // Midwest connections
        { from: 'chicago', to: 'detroit', distance: 280 },
        { from: 'chicago', to: 'indianapolis', distance: 185 },
        { from: 'chicago', to: 'columbus', distance: 355 },
        { from: 'indianapolis', to: 'columbus', distance: 175 },
        { from: 'detroit', to: 'columbus', distance: 205 },

        // South connections
        { from: 'houston', to: 'dallas', distance: 240 },
        { from: 'houston', to: 'san_antonio', distance: 195 },
        { from: 'dallas', to: 'fort_worth', distance: 35 },
        { from: 'dallas', to: 'austin', distance: 195 },
        { from: 'austin', to: 'san_antonio', distance: 80 },
        { from: 'charlotte', to: 'nashville', distance: 410 },
        { from: 'jacksonville', to: 'miami', distance: 345 },
        { from: 'charlotte', to: 'jacksonville', distance: 380 },

        // West Coast connections
        { from: 'la', to: 'san_diego', distance: 120 },
        { from: 'la', to: 'phoenix', distance: 370 },
        { from: 'san_diego', to: 'phoenix', distance: 355 },
        { from: 'san_francisco', to: 'san_jose', distance: 50 },
        { from: 'san_francisco', to: 'la', distance: 380 },
        { from: 'seattle', to: 'portland', distance: 175 },
        { from: 'portland', to: 'san_francisco', distance: 635 },

        // Cross-country connections
        { from: 'chicago', to: 'denver', distance: 920 },
        { from: 'denver', to: 'las_vegas', distance: 750 },
        { from: 'denver', to: 'phoenix', distance: 600 },
        { from: 'las_vegas', to: 'la', distance: 270 },
        { from: 'nashville', to: 'indianapolis', distance: 290 },
        { from: 'columbus', to: 'charlotte', distance: 425 },
        { from: 'houston', to: 'phoenix', distance: 1180 },
        { from: 'dallas', to: 'denver', distance: 780 }
    ]
};

// ============================================================================
// European Cities Dataset
// ============================================================================
const EUROPE_CITIES_DATA = {
    nodes: [
        { id: 'london', name: 'London', x: 400, y: 250, population: 9002488 },
        { id: 'paris', name: 'Paris', x: 420, y: 300, population: 2165423 },
        { id: 'berlin', name: 'Berlin', x: 550, y: 220, population: 3769495 },
        { id: 'madrid', name: 'Madrid', x: 320, y: 400, population: 3223334 },
        { id: 'rome', name: 'Rome', x: 550, y: 420, population: 2872800 },
        { id: 'barcelona', name: 'Barcelona', x: 380, y: 420, population: 1620343 },
        { id: 'amsterdam', name: 'Amsterdam', x: 450, y: 220, population: 821752 },
        { id: 'vienna', name: 'Vienna', x: 600, y: 300, population: 1911191 },
        { id: 'prague', name: 'Prague', x: 570, y: 260, population: 1309000 },
        { id: 'budapest', name: 'Budapest', x: 620, y: 320, population: 1752286 },
        { id: 'warsaw', name: 'Warsaw', x: 650, y: 220, population: 1790658 },
        { id: 'brussels', name: 'Brussels', x: 440, y: 260, population: 1208542 },
        { id: 'munich', name: 'Munich', x: 530, y: 300, population: 1471508 },
        { id: 'milan', name: 'Milan', x: 500, y: 360, population: 1396059 },
        { id: 'zurich', name: 'Zurich', x: 490, y: 320, population: 415367 }
    ],
    edges: [
        { from: 'london', to: 'paris', distance: 340 },
        { from: 'london', to: 'amsterdam', distance: 360 },
        { from: 'london', to: 'brussels', distance: 320 },
        { from: 'paris', to: 'brussels', distance: 265 },
        { from: 'paris', to: 'barcelona', distance: 830 },
        { from: 'paris', to: 'zurich', distance: 490 },
        { from: 'barcelona', to: 'madrid', distance: 505 },
        { from: 'madrid', to: 'paris', distance: 1050 },
        { from: 'rome', to: 'milan', distance: 480 },
        { from: 'rome', to: 'vienna', distance: 765 },
        { from: 'milan', to: 'zurich', distance: 220 },
        { from: 'milan', to: 'munich', distance: 410 },
        { from: 'berlin', to: 'amsterdam', distance: 580 },
        { from: 'berlin', to: 'prague', distance: 280 },
        { from: 'berlin', to: 'warsaw', distance: 520 },
        { from: 'berlin', to: 'munich', distance: 505 },
        { from: 'prague', to: 'vienna', distance: 250 },
        { from: 'prague', to: 'munich', distance: 305 },
        { from: 'vienna', to: 'budapest', distance: 215 },
        { from: 'vienna', to: 'munich', distance: 355 },
        { from: 'budapest', to: 'warsaw', distance: 545 },
        { from: 'amsterdam', to: 'brussels', distance: 175 },
        { from: 'brussels', to: 'zurich', distance: 520 }
    ]
};

// ============================================================================
// Indian Cities Dataset
// ============================================================================
const INDIA_CITIES_DATA = {
    nodes: [
        { id: 'delhi', name: 'New Delhi', x: 500, y: 200, population: 32941000 },
        { id: 'mumbai', name: 'Mumbai', x: 400, y: 350, population: 24973000 },
        { id: 'bangalore', name: 'Bangalore', x: 450, y: 500, population: 13707000 },
        { id: 'hyderabad', name: 'Hyderabad', x: 500, y: 450, population: 10494000 },
        { id: 'chennai', name: 'Chennai', x: 520, y: 550, population: 11324000 },
        { id: 'kolkata', name: 'Kolkata', x: 650, y: 300, population: 15134000 },
        { id: 'pune', name: 'Pune', x: 420, y: 380, population: 7764000 },
        { id: 'ahmedabad', name: 'Ahmedabad', x: 380, y: 280, population: 8450000 },
        { id: 'jaipur', name: 'Jaipur', x: 450, y: 230, population: 3073350 },
        { id: 'lucknow', name: 'Lucknow', x: 550, y: 240, population: 3382000 },
        { id: 'chandigarh', name: 'Chandigarh', x: 480, y: 180, population: 1055450 },
        { id: 'kochi', name: 'Kochi', x: 420, y: 600, population: 2117990 },
        { id: 'indore', name: 'Indore', x: 450, y: 300, population: 3276697 },
        { id: 'bhopal', name: 'Bhopal', x: 480, y: 290, population: 2368145 },
        { id: 'nagpur', name: 'Nagpur', x: 520, y: 370, population: 2497777 }
    ],
    edges: [
        { from: 'delhi', to: 'jaipur', distance: 280 },
        { from: 'delhi', to: 'chandigarh', distance: 245 },
        { from: 'delhi', to: 'lucknow', distance: 555 },
        { from: 'delhi', to: 'ahmedabad', distance: 935 },
        { from: 'jaipur', to: 'ahmedabad', distance: 680 },
        { from: 'ahmedabad', to: 'mumbai', distance: 525 },
        { from: 'ahmedabad', to: 'indore', distance: 390 },
        { from: 'mumbai', to: 'pune', distance: 150 },
        { from: 'mumbai', to: 'bangalore', distance: 985 },
        { from: 'pune', to: 'bangalore', distance: 840 },
        { from: 'pune', to: 'hyderabad', distance: 560 },
        { from: 'bangalore', to: 'hyderabad', distance: 575 },
        { from: 'bangalore', to: 'chennai', distance: 350 },
        { from: 'bangalore', to: 'kochi', distance: 560 },
        { from: 'chennai', to: 'hyderabad', distance: 625 },
        { from: 'chennai', to: 'kochi', distance: 695 },
        { from: 'hyderabad', to: 'nagpur', distance: 500 },
        { from: 'nagpur', to: 'mumbai', distance: 800 },
        { from: 'nagpur', to: 'bhopal', distance: 350 },
        { from: 'indore', to: 'bhopal', distance: 195 },
        { from: 'bhopal', to: 'delhi', distance: 740 },
        { from: 'lucknow', to: 'kolkata', distance: 985 },
        { from: 'kolkata', to: 'delhi', distance: 1450 }
    ]
};

// ============================================================================
// Map Data Manager
// ============================================================================
class MapDataManager {
    constructor() {
        this.datasets = {
            'usa_cities': USA_CITIES_DATA,
            'europe_cities': EUROPE_CITIES_DATA,
            'india_cities': INDIA_CITIES_DATA
        };
    }

    /**
     * Load dataset into graph
     */
    loadDataset(datasetName, graph) {
        const dataset = this.datasets[datasetName];
        if (!dataset) {
            console.error(`Dataset ${datasetName} not found`);
            return false;
        }

        // Clear existing graph
        graph.clear();

        // Add nodes
        dataset.nodes.forEach(node => {
            graph.addNode(
                node.id,
                node.name,
                node.x,
                node.y,
                { population: node.population }
            );
        });

        // Add edges
        dataset.edges.forEach(edge => {
            graph.addEdge(
                edge.from,
                edge.to,
                edge.distance,
                true, // bidirectional
                { type: 'highway' }
            );
        });

        return true;
    }

    /**
     * Get dataset info
     */
    getDatasetInfo(datasetName) {
        const dataset = this.datasets[datasetName];
        if (!dataset) return null;

        return {
            name: datasetName,
            nodeCount: dataset.nodes.length,
            edgeCount: dataset.edges.length,
            nodes: dataset.nodes.map(n => ({ id: n.id, name: n.name }))
        };
    }

    /**
     * Get all available datasets
     */
    getAvailableDatasets() {
        return Object.keys(this.datasets).map(name => ({
            id: name,
            info: this.getDatasetInfo(name)
        }));
    }

    /**
     * Apply routing mode weights
     */
    applyRoutingMode(graph, mode) {
        const edges = graph.getAllEdges();

        switch (mode) {
            case 'fastest':
                // Highways get lower weights (faster)
                edges.forEach(edge => {
                    if (edge.metadata.type === 'highway') {
                        edge.weight *= 0.7;
                    }
                });
                break;

            case 'scenic':
                // Prefer routes through certain cities
                edges.forEach(edge => {
                    const fromNode = graph.getNode(edge.from);
                    const toNode = graph.getNode(edge.to);

                    // Smaller cities are more scenic
                    const avgPopulation = (fromNode.metadata.population + toNode.metadata.population) / 2;
                    if (avgPopulation < 1000000) {
                        edge.weight *= 0.8; // Prefer smaller cities
                    }
                });
                break;

            case 'shortest':
            default:
                // Use default weights (distance)
                break;
        }
    }

    /**
     * Generate random custom map
     */
    generateCustomMap(nodeCount = 20, edgeCount = 40) {
        const nodes = [];
        const edges = [];

        // Generate random nodes
        for (let i = 0; i < nodeCount; i++) {
            nodes.push({
                id: `node_${i}`,
                name: `City ${i + 1}`,
                x: Math.random() * 900 + 50,
                y: Math.random() * 600 + 50,
                population: Math.floor(Math.random() * 5000000) + 100000
            });
        }

        // First, ensure graph is connected using minimum spanning tree approach
        const connected = new Set([0]); // Start with first node
        const unconnected = new Set(Array.from({ length: nodeCount }, (_, i) => i).slice(1));

        // Connect all nodes (minimum spanning tree)
        while (unconnected.size > 0 && edges.length < edgeCount) {
            let minDist = Infinity;
            let bestPair = null;

            // Find closest unconnected node to any connected node
            for (const connectedIdx of connected) {
                for (const unconnectedIdx of unconnected) {
                    const dist = Math.sqrt(
                        Math.pow(nodes[connectedIdx].x - nodes[unconnectedIdx].x, 2) +
                        Math.pow(nodes[connectedIdx].y - nodes[unconnectedIdx].y, 2)
                    );
                    if (dist < minDist) {
                        minDist = dist;
                        bestPair = [connectedIdx, unconnectedIdx];
                    }
                }
            }

            if (bestPair) {
                const [from, to] = bestPair;
                edges.push({
                    from: nodes[from].id,
                    to: nodes[to].id,
                    distance: Math.round(minDist * 2)
                });
                connected.add(to);
                unconnected.delete(to);
            }
        }

        // Add remaining edges randomly
        const maxAttempts = edgeCount * 10; // Prevent infinite loop
        let attempts = 0;

        while (edges.length < edgeCount && attempts < maxAttempts) {
            attempts++;

            // Pick two random different nodes
            const fromIdx = Math.floor(Math.random() * nodeCount);
            let toIdx = Math.floor(Math.random() * nodeCount);

            while (toIdx === fromIdx) {
                toIdx = Math.floor(Math.random() * nodeCount);
            }

            // Check if edge already exists
            const edgeExists = edges.some(e =>
                (e.from === nodes[fromIdx].id && e.to === nodes[toIdx].id) ||
                (e.to === nodes[fromIdx].id && e.from === nodes[toIdx].id)
            );

            if (!edgeExists) {
                const distance = Math.sqrt(
                    Math.pow(nodes[fromIdx].x - nodes[toIdx].x, 2) +
                    Math.pow(nodes[fromIdx].y - nodes[toIdx].y, 2)
                );

                edges.push({
                    from: nodes[fromIdx].id,
                    to: nodes[toIdx].id,
                    distance: Math.round(distance * 2)
                });
            }
        }

        return { nodes, edges };
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        MapDataManager,
        USA_CITIES_DATA,
        EUROPE_CITIES_DATA,
        INDIA_CITIES_DATA
    };
}

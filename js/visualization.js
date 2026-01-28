/**
 * Visualization Engine for Graph Navigation
 * Handles canvas rendering, animations, and user interactions
 */

class VisualizationEngine {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');

        // Set canvas size
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());

        // Visualization state
        this.graph = null;
        this.currentPath = null;
        this.visitedNodes = [];
        this.animationFrame = null;

        // Camera/viewport
        this.camera = {
            x: 0,
            y: 0,
            zoom: 1.0,
            minZoom: 0.5,
            maxZoom: 3.0
        };

        // Mouse interaction
        this.mouse = {
            x: 0,
            y: 0,
            isDragging: false,
            dragStartX: 0,
            dragStartY: 0
        };

        // Animation
        this.animationProgress = 0;
        this.isAnimating = false;

        // Colors
        this.colors = {
            node: '#3b82f6',
            visited: '#8b5cf6',
            path: '#10b981',
            source: '#f59e0b',
            destination: '#ef4444',
            edge: '#4b5563',
            edgeActive: '#6366f1',
            edgeTraffic: '#f59e0b',
            edgeBlocked: '#ef4444',
            text: '#f9fafb',
            textSecondary: '#9ca3af'
        };

        this.setupEventListeners();
    }

    resizeCanvas() {
        const container = this.canvas.parentElement;
        this.canvas.width = container.clientWidth;
        this.canvas.height = container.clientHeight;
        this.render();
    }

    setupEventListeners() {
        // Mouse events for panning
        this.canvas.addEventListener('mousedown', (e) => {
            this.mouse.isDragging = true;
            this.mouse.dragStartX = e.clientX - this.camera.x;
            this.mouse.dragStartY = e.clientY - this.camera.y;
        });

        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouse.x = e.clientX - rect.left;
            this.mouse.y = e.clientY - rect.top;

            if (this.mouse.isDragging) {
                this.camera.x = e.clientX - this.mouse.dragStartX;
                this.camera.y = e.clientY - this.mouse.dragStartY;
                this.render();
            }
        });

        this.canvas.addEventListener('mouseup', () => {
            this.mouse.isDragging = false;
        });

        this.canvas.addEventListener('mouseleave', () => {
            this.mouse.isDragging = false;
        });

        // Mouse wheel for zooming
        this.canvas.addEventListener('wheel', (e) => {
            e.preventDefault();

            const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
            const newZoom = this.camera.zoom * zoomFactor;

            if (newZoom >= this.camera.minZoom && newZoom <= this.camera.maxZoom) {
                this.camera.zoom = newZoom;
                this.render();
            }
        });
    }

    setGraph(graph) {
        this.graph = graph;
        this.centerView();
        this.render();
    }

    centerView() {
        if (!this.graph || this.graph.nodes.size === 0) return;

        const nodes = this.graph.getAllNodes();
        let minX = Infinity, maxX = -Infinity;
        let minY = Infinity, maxY = -Infinity;

        nodes.forEach(node => {
            minX = Math.min(minX, node.x);
            maxX = Math.max(maxX, node.x);
            minY = Math.min(minY, node.y);
            maxY = Math.max(maxY, node.y);
        });

        const graphWidth = maxX - minX;
        const graphHeight = maxY - minY;
        const padding = 100;

        const scaleX = (this.canvas.width - padding * 2) / graphWidth;
        const scaleY = (this.canvas.height - padding * 2) / graphHeight;
        this.camera.zoom = Math.min(scaleX, scaleY, 1.5);

        const centerX = (minX + maxX) / 2;
        const centerY = (minY + maxY) / 2;

        this.camera.x = this.canvas.width / 2 - centerX * this.camera.zoom;
        this.camera.y = this.canvas.height / 2 - centerY * this.camera.zoom;
    }

    worldToScreen(x, y) {
        return {
            x: x * this.camera.zoom + this.camera.x,
            y: y * this.camera.zoom + this.camera.y
        };
    }

    render() {
        if (!this.graph) return;

        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw edges first (background layer)
        this.drawEdges();

        // Draw nodes (foreground layer)
        this.drawNodes();

        // Draw labels
        this.drawLabels();
    }

    drawEdges() {
        const edges = this.graph.getAllEdges();
        const drawnEdges = new Set();

        edges.forEach(edge => {
            // Avoid drawing duplicate bidirectional edges
            const edgeKey = [edge.from, edge.to].sort().join('-');
            if (drawnEdges.has(edgeKey)) return;
            drawnEdges.add(edgeKey);

            const fromNode = this.graph.getNode(edge.from);
            const toNode = this.graph.getNode(edge.to);

            if (!fromNode || !toNode) return;

            const from = this.worldToScreen(fromNode.x, fromNode.y);
            const to = this.worldToScreen(toNode.x, toNode.y);

            // Determine edge color
            let color = this.colors.edge;
            let lineWidth = 2;

            if (edge.blocked) {
                color = this.colors.edgeBlocked;
                lineWidth = 3;
            } else if (edge.trafficMultiplier > 1.5) {
                color = this.colors.edgeTraffic;
                lineWidth = 2.5;
            }

            // Check if edge is in current path
            if (this.currentPath && this.currentPath.length > 1) {
                for (let i = 0; i < this.currentPath.length - 1; i++) {
                    if ((this.currentPath[i] === edge.from && this.currentPath[i + 1] === edge.to) ||
                        (this.currentPath[i] === edge.to && this.currentPath[i + 1] === edge.from)) {
                        color = this.colors.path;
                        lineWidth = 4;
                        break;
                    }
                }
            }

            // Draw edge
            this.ctx.beginPath();
            this.ctx.moveTo(from.x, from.y);
            this.ctx.lineTo(to.x, to.y);
            this.ctx.strokeStyle = color;
            this.ctx.lineWidth = lineWidth * this.camera.zoom;
            this.ctx.stroke();

            // Draw weight label for path edges
            if (lineWidth > 3) {
                const midX = (from.x + to.x) / 2;
                const midY = (from.y + to.y) / 2;

                this.ctx.fillStyle = 'rgba(17, 24, 39, 0.8)';
                this.ctx.fillRect(midX - 25, midY - 12, 50, 24);

                this.ctx.fillStyle = this.colors.text;
                this.ctx.font = `${12 * this.camera.zoom}px 'JetBrains Mono', monospace`;
                this.ctx.textAlign = 'center';
                this.ctx.textBaseline = 'middle';
                this.ctx.fillText(`${Math.round(edge.weight)} km`, midX, midY);
            }
        });
    }

    drawNodes() {
        if (!this.graph) return;

        const nodes = this.graph.getAllNodes();
        const sourceId = this.currentPath && this.currentPath.length > 0 ? this.currentPath[0] : null;
        const destId = this.currentPath && this.currentPath.length > 0 ? this.currentPath[this.currentPath.length - 1] : null;

        nodes.forEach(node => {
            const pos = this.worldToScreen(node.x, node.y);
            const radius = 8 * this.camera.zoom;

            // Determine node color
            let color = this.colors.node;
            let glowIntensity = 0;

            if (node.id === sourceId) {
                color = this.colors.source;
                glowIntensity = 20;
            } else if (node.id === destId) {
                color = this.colors.destination;
                glowIntensity = 20;
            } else if (this.currentPath && this.currentPath.includes(node.id)) {
                color = this.colors.path;
                glowIntensity = 10;
            } else if (this.visitedNodes.includes(node.id)) {
                color = this.colors.visited;
            }

            // Draw glow effect
            if (glowIntensity > 0) {
                const gradient = this.ctx.createRadialGradient(pos.x, pos.y, radius, pos.x, pos.y, radius + glowIntensity);
                gradient.addColorStop(0, color);
                gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
                this.ctx.fillStyle = gradient;
                this.ctx.fillRect(pos.x - radius - glowIntensity, pos.y - radius - glowIntensity,
                    (radius + glowIntensity) * 2, (radius + glowIntensity) * 2);
            }

            // Draw node
            this.ctx.beginPath();
            this.ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2);
            this.ctx.fillStyle = color;
            this.ctx.fill();

            // Draw border
            this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
            this.ctx.lineWidth = 2;
            this.ctx.stroke();
        });
    }

    drawLabels() {
        if (!this.graph || this.camera.zoom < 0.7) return;

        const nodes = this.graph.getAllNodes();

        nodes.forEach(node => {
            const pos = this.worldToScreen(node.x, node.y);
            const fontSize = Math.max(10, 12 * this.camera.zoom);

            // Draw background for label
            this.ctx.font = `600 ${fontSize}px 'Inter', sans-serif`;
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'top';

            const metrics = this.ctx.measureText(node.name);
            const padding = 4;
            const bgX = pos.x - metrics.width / 2 - padding;
            const bgY = pos.y + 12 * this.camera.zoom;
            const bgWidth = metrics.width + padding * 2;
            const bgHeight = fontSize + padding * 2;

            this.ctx.fillStyle = 'rgba(17, 24, 39, 0.9)';
            this.ctx.fillRect(bgX, bgY, bgWidth, bgHeight);

            // Draw label text
            this.ctx.fillStyle = this.colors.text;
            this.ctx.fillText(node.name, pos.x, bgY + padding);
        });
    }

    animatePath(pathResult) {
        this.currentPath = pathResult.path;
        this.visitedNodes = [];
        this.animationProgress = 0;
        this.isAnimating = true;

        const algorithm = this.graph ? AlgorithmFactory.createAlgorithm(
            pathResult.algorithm.toLowerCase().includes('dijkstra') ? 'dijkstra' :
                pathResult.algorithm.toLowerCase().includes('a*') ? 'astar' :
                    pathResult.algorithm.toLowerCase().includes('bfs') ? 'bfs' : 'dfs',
            this.graph
        ) : null;

        if (algorithm && algorithm.getVisitedNodes) {
            const allVisited = algorithm.getVisitedNodes();
            this.animateVisitedNodes(allVisited, 0);
        } else {
            this.render();
        }
    }

    animateVisitedNodes(visitedNodes, index) {
        if (index >= visitedNodes.length) {
            this.isAnimating = false;
            this.render();
            return;
        }

        this.visitedNodes = visitedNodes.slice(0, index + 1);
        this.render();

        setTimeout(() => {
            this.animateVisitedNodes(visitedNodes, index + 1);
        }, 50);
    }

    clearPath() {
        this.currentPath = null;
        this.visitedNodes = [];
        this.animationProgress = 0;
        this.isAnimating = false;
        this.render();
    }

    zoomIn() {
        const newZoom = this.camera.zoom * 1.2;
        if (newZoom <= this.camera.maxZoom) {
            this.camera.zoom = newZoom;
            this.render();
        }
    }

    zoomOut() {
        const newZoom = this.camera.zoom * 0.8;
        if (newZoom >= this.camera.minZoom) {
            this.camera.zoom = newZoom;
            this.render();
        }
    }

    resetView() {
        this.centerView();
        this.render();
    }

    // Export visualization as image
    exportAsImage() {
        const link = document.createElement('a');
        link.download = 'pathfinder-map.png';
        link.href = this.canvas.toDataURL();
        link.click();
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { VisualizationEngine };
}

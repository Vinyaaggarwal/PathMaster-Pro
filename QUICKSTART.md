# Quick Start Guide - PathFinder Pro

## 🚀 How to Run

### Method 1: Double-click (Easiest)
1. Navigate to the `RoutingEngine` folder
2. Double-click `launch.bat`
3. The application will open in your default browser

### Method 2: Manual Browser Open
1. Navigate to the `RoutingEngine` folder
2. Right-click on `index.html`
3. Select "Open with" → Choose your browser (Chrome, Firefox, Edge, etc.)

### Method 3: Direct Browser Navigation
1. Open your web browser
2. Press `Ctrl + O` (or `Cmd + O` on Mac)
3. Navigate to: `C:\Users\vinya\Downloads\RoutingEngine\index.html`
4. Click "Open"

## 📖 Quick Tutorial

### Step 1: Load a Map
1. In the "Map Controls" section, select a dataset:
   - **USA Major Cities** (default)
   - **European Cities**
   - **Indian Cities**
2. Click "Load Map" button

### Step 2: Select Route
1. **Source Location**: Choose starting city (e.g., "New York")
2. **Destination Location**: Choose ending city (e.g., "Los Angeles")

### Step 3: Choose Algorithm
1. **Routing Algorithm**: Select from:
   - **Dijkstra's Algorithm** - Guaranteed shortest path
   - **A* Search** - Faster with heuristics
   - **BFS** - Simple breadth-first
   - **DFS** - Depth-first exploration

2. **For A* only**: Choose heuristic:
   - **Euclidean** - Straight-line distance (best for maps)
   - **Manhattan** - Grid-based distance
   - **Chebyshev** - Diagonal distance

### Step 4: Find Path
1. Click "Find Optimal Path" button
2. Watch the algorithm visualization
3. See the results:
   - **Green path** = Optimal route
   - **Purple nodes** = Visited during search
   - **Orange node** = Source
   - **Red node** = Destination

### Step 5: View Details
- Check **Performance Metrics** panel for:
  - Nodes visited
  - Execution time
  - Path length
  - Total distance
- View **Route Details** panel for step-by-step directions

## 🎮 Interactive Controls

### Map Navigation
- **Pan**: Click and drag the map
- **Zoom In**: Click `+` button or scroll up
- **Zoom Out**: Click `-` button or scroll down
- **Reset View**: Click reset button

### Advanced Features
- **Enable Traffic Simulation**: Adds random traffic to roads
- **Show Roadblocks**: Simulates blocked roads
- **Routing Mode**:
  - **Shortest Path** - Minimum distance
  - **Fastest Route** - Considers road types
  - **Scenic Route** - Prefers smaller cities

## 🎯 Example Routes to Try

### USA Map
1. **Cross-Country**: New York → Los Angeles
2. **West Coast**: Seattle → San Diego
3. **East Coast**: Boston → Miami
4. **Central**: Chicago → Houston

### Europe Map
1. **Western Europe**: London → Paris
2. **Central Europe**: Berlin → Vienna
3. **North-South**: Amsterdam → Rome
4. **Eastern**: Warsaw → Budapest

### India Map
1. **North-South**: Delhi → Bangalore
2. **East-West**: Kolkata → Mumbai
3. **Golden Triangle**: Delhi → Jaipur → Ahmedabad
4. **South India**: Chennai → Kochi

## 🔍 Algorithm Comparison

Try the same route with different algorithms:

**Example: New York → Los Angeles**
1. Run with **Dijkstra** - Note execution time and nodes visited
2. Run with **A* (Euclidean)** - Compare performance
3. Run with **BFS** - See the difference
4. Run with **DFS** - Observe non-optimal path

**Expected Results:**
- **A*** should be fastest (fewer nodes visited)
- **Dijkstra** guarantees shortest path
- **BFS** explores level by level
- **DFS** may find longer paths

## 🐛 Troubleshooting

### Map not showing?
- Refresh the page (F5)
- Check browser console for errors (F12)
- Make sure JavaScript is enabled

### Path not found?
- Ensure source and destination are different
- Check if roadblocks are blocking the path
- Try a different algorithm

### Performance issues?
- Disable traffic simulation
- Zoom out to see full map
- Use Chrome or Firefox for best performance

## 📊 Understanding the Visualization

### Node Colors
- 🔵 **Blue** - Unvisited node
- 🟣 **Purple** - Visited during search
- 🟢 **Green** - Part of optimal path
- 🟠 **Orange** - Source (start)
- 🔴 **Red** - Destination (end)

### Edge Colors
- **Gray** - Normal road
- **Green** - Part of optimal path
- **Orange** - Heavy traffic
- **Red** - Blocked road

### Metrics Explained
- **Nodes Visited**: How many cities the algorithm explored
- **Execution Time**: How fast the algorithm ran (milliseconds)
- **Path Length**: Number of cities in the route
- **Total Distance**: Sum of all road distances (kilometers)

## 🎓 Learning Objectives

This project demonstrates:
1. **Graph Data Structures** - Adjacency lists, nodes, edges
2. **Priority Queues** - Min-heap implementation
3. **Shortest Path Algorithms** - Dijkstra, A*, BFS, DFS
4. **Heuristic Functions** - Euclidean, Manhattan, Chebyshev
5. **Algorithm Analysis** - Time/space complexity
6. **Real-world Applications** - Navigation systems

## 💡 Tips

- **Compare algorithms** on the same route to see performance differences
- **Enable traffic** to see how dynamic weights affect routing
- **Try scenic mode** to see how routing preferences work
- **Use A* with Euclidean** for best performance on geographic data
- **Experiment with roadblocks** to see alternate route finding

---

**Enjoy exploring graph algorithms! 🗺️✨**

# 🗺️ PathMaster Pro: Advanced Multi-Platform Navigation System

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![C++](https://img.shields.io/badge/Language-C++17-blue.svg)](https://isocpp.org/)
[![JavaScript](https://img.shields.io/badge/Language-JavaScript-F7DF1E.svg)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Python](https://img.shields.io/badge/Language-Python-3776AB.svg)](https://www.python.org/)

**PathMaster Pro** is a comprehensive graph-based navigation ecosystem that demonstrates cutting-edge Data Structures and Algorithms across three platforms: a high-performance **C++ Routing Engine**, a beautiful **Interactive Web Visualization**, and a versatile **Python Terminal Tool**.

---

## 🚀 Key Modules

### 1. 🌐 Web Pathfinder (Interactive Visualization)
A modern, glassmorphism-inspired web application for real-time algorithm visualization using HTML5 Canvas.
- **Algorithms:** Dijkstra, A*, BFS, DFS.
- **Features:** Real-time pathfinding animation, traffic simulation, roadblocks, and pan/zoom interaction.
- **Data:** Pre-loaded datasets for USA (25 cities), Europe (15 cities), and India (15 cities).

### 2. ⚙️ C++ Routing Engine (High Performance)
A modular, high-speed engine designed for efficiency and scalability.
- **Features:** Bidirectional A* search, LRU Caching System, Reverse Adjacency lookup.
- **OSM Integration:** Includes a parser for OpenStreetMap (`.osm`) extracts.
- **Build System:** CMake-based cross-platform support.

### 3. 🐍 Python Terminal Edition (Analysis Tool)
A command-line interface for rapid algorithm comparison and statistical analysis.
- **Features:** "Compare" mode to run all algorithms simultaneously and evaluate optimality, speed, and node exploration.
- **Design:** Interactive menu-driven interface with rich terminal formatting.

---

## 🏗️ Technical Architecture

### Core Algorithms
| Algorithm | Time Complexity | Space | Optimal? | Notes |
|-----------|----------------|-------|----------|-------|
| **Dijkstra** | $O((V+E) \log V)$ | $O(V)$ | ✅ Yes | Weighted graphs (non-negative) |
| **A\*** | $O((V+E) \log V)$ | $O(V)$ | ✅ Yes* | Heuristic-guided (Euclidean/Manhattan) |
| **Bidirectional A\***| $O((V+E) \log V)$ | $O(V)$ | ✅ Yes | Faster convergence for large graphs |
| **BFS** | $O(V+E)$ | $O(V)$ | ✅ Yes** | Shortest path for unweighted only |
| **DFS** | $O(V+E)$ | $O(V)$ | ❌ No | Existence check & connectivity |

### Data Structures
- **Priority Queue:** Custom Binary Min-Heap for $O(\log n)$ extraction.
- **Graph:** Efficient Adjacency List (Hash Map based) for $O(1)$ neighbor lookup.
- **Caching:** LRU (Least Recently Used) cache for recurring route queries in the C++ engine.

---

## 📖 Quick Start

### Web Application
Simply open `index.html` in any modern browser or run:
```bash
./launch.bat
```

### C++ Engine
```bash
cd RoutingEngine
cmake -S . -B build
cmake --build build --config Release
./build/routing
```

### Python Terminal
```bash
python terminal_pathfinder.py
```

---

## 📂 Directory Structure

```text
PathMaster-Pro/
├── index.html              # Web App Entry
├── styles.css              # Glassmorphism UI
├── js/                     # JS Logic (Algorithms, DS, Visualization)
├── RoutingEngine/          # C++ Source Code
│   ├── src/                # Implementation files
│   ├── include/            # Header files
│   └── CMakeLists.txt      # Build configuration
├── terminal_pathfinder.py  # Python Implementation
└── documentation/          # ALGORITHMS.md, CUSTOM_MAP_GUIDE.md, etc.
```

---

## 🎨 UI Features
- **Dynamic Design:** Vibrant gradients and glassmorphism styling.
- **Responsive Layout:** Optimized for desktop and tablets.
- **Dark Theme:** High-contrast visuals for algorithm tracking.
- **Performance Metrics:** Real-time tracking of execution time, nodes visited, and path distance.

---

## 🤝 Contributing
Feel free to fork this project and submit PRs for:
- New algorithms (Bellman-Ford, Floyd-Warshall).
- Advanced OSM data integration.
- Mobile-responsive UI improvements.

## 📄 License
Distributed under the MIT License. See `LICENSE` for more information.

---
**Built with ❤️ for algorithm enthusiasts and developers.** 🗺️✨

# PathFinder Pro - Terminal Edition Quick Guide

## 🚀 How to Run

### Windows:
```powershell
cd C:\Users\vinya\Downloads\RoutingEngine
python terminal_pathfinder.py
```

### From any directory:
```powershell
python C:\Users\vinya\Downloads\RoutingEngine\terminal_pathfinder.py
```

---

## 🗺️ How to Change Country/Map

Once the program is running:

1. Type: **`map`** or **`0`**
2. Select from the menu:
   - **1** = USA Major Cities (15 cities)
   - **2** = European Cities (15 cities)
   - **3** = Indian Cities (15 cities)
3. The new map will load automatically!

---

## 📋 Quick Commands Reference

| Command | Number | Description |
|---------|--------|-------------|
| `map` | 0 | Switch between USA/Europe/India maps |
| `list` | 1 | Show all cities in current map |
| `dijkstra` | 2 | Find shortest path (Dijkstra's algorithm) |
| `astar` | 3 | Find path with A* search |
| `bfs` | 4 | Breadth-First Search |
| `dfs` | 5 | Depth-First Search |
| `compare` | 6 | Compare all 4 algorithms side-by-side |
| `stats` | 7 | Show graph statistics |
| `help` | 8 | Show menu |
| `exit` | 9 | Quit program |

---

## 🎯 Example Session

```
💻 Enter command: map
🗺️  Available Maps:
  1. USA Major Cities
  2. European Cities
  3. Indian Cities
Select map (1-3): 2

🔄 Loading European Cities...
✅ Loaded 15 cities with 23 connections

💻 Enter command: compare
📍 Available Cities:
  1. Amsterdam        (amsterdam)
  2. Barcelona        (barcelona)
  3. Berlin           (berlin)
  ...

Enter source city ID: london
Enter destination city ID: rome

🏁 Algorithm Comparison
======================================================================
Algorithm            Distance    Nodes  Time (ms)    Optimal
----------------------------------------------------------------------
Dijkstra             1585.00 km       12      0.45 ms    ✅ Yes
A* (Euclidean)       1585.00 km        8      0.32 ms    ✅ Yes
A* (Manhattan)       1585.00 km        9      0.35 ms    ✅ Yes
BFS                  1585.00 km       12      0.28 ms    ✅ Yes
DFS                  2345.00 km       15      0.41 ms    ❌ No
```

---

## 🌍 City IDs by Region

### USA Cities:
- `nyc`, `la`, `chicago`, `houston`, `phoenix`
- `philadelphia`, `san_diego`, `dallas`, `san_jose`
- `austin`, `seattle`, `denver`, `boston`, `miami`, `las_vegas`

### European Cities:
- `london`, `paris`, `berlin`, `madrid`, `rome`
- `barcelona`, `amsterdam`, `vienna`, `prague`
- `budapest`, `warsaw`, `brussels`, `munich`, `milan`, `zurich`

### Indian Cities:
- `delhi`, `mumbai`, `bangalore`, `hyderabad`, `chennai`
- `kolkata`, `pune`, `ahmedabad`, `jaipur`, `lucknow`
- `chandigarh`, `kochi`, `indore`, `bhopal`, `nagpur`

---

## 💡 Pro Tips

1. **Quick Compare**: Use `compare` command to see which algorithm is fastest
2. **Try Different Maps**: Each region has different connectivity patterns
3. **Heuristics**: When using A*, try both `euclidean` and `manhattan` heuristics
4. **Path Quality**: DFS finds *a* path but not necessarily the shortest one
5. **Performance**: A* is usually faster than Dijkstra for single-pair shortest path

---

## 🎓 Learning Points

- **Dijkstra**: Always finds shortest path, explores more nodes
- **A***: Uses heuristics to guide search, faster than Dijkstra
- **BFS**: Good for unweighted graphs, explores level-by-level
- **DFS**: Fast but may not find optimal path

---

## 🐛 Troubleshooting

**"No such file or directory"**
→ Make sure you're in the correct directory: `C:\Users\vinya\Downloads\RoutingEngine`

**"Invalid city ID"**
→ Use `list` command to see all available city IDs for the current map

**Program won't start**
→ Make sure Python 3 is installed: `python --version`

---

Enjoy exploring graph algorithms! 🚀

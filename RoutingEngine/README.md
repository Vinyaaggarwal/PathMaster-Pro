# RoutingEngine (All features)

This project is a modular C++ Routing Engine with Dijkstra, A*, Bidirectional A*, LRU caching, reverse adjacency, and an OSM parser for importing real map extracts.

## Build
```
cmake -S . -B build
cmake --build build --config Release
```

## Run
```
./build/routing
```

Then use commands `loadmap`, `loadosm`, `dijkstra`, `astar`, `bidir`, `update`, `cacheclear`, `summary`, `exit`.

## Notes
- OSM parser supports a small subset (nodes, ways with highway tag). For full-scale import use tools like osmconvert/osmfilter or a dedicated OSM library.
- Heuristic: Haversine distance (km) is used for A*/bidir.
- For large graphs, increase memory and consider contraction hierarchies.

#ifndef DIJKSTRA_H
#define DIJKSTRA_H

#include <vector>
#include <utility>
#include "graph.h"

std::pair<double, std::vector<int>> dijkstra(const Graph& g, int src, int dst);

#endif // DIJKSTRA_H

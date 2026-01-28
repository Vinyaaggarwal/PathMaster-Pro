#ifndef ASTAR_H
#define ASTAR_H

#include <vector>
#include <utility>
#include "graph.h"

std::pair<double, std::vector<int>> a_star(const Graph& g, int src, int dst);

#endif // ASTAR_H

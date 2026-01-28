#ifndef BIDIR_ASTAR_H
#define BIDIR_ASTAR_H

#include <vector>
#include <utility>
#include "graph.h"

std::pair<double, std::vector<int>> bidir_a_star(const Graph& g, int src, int dst);

#endif // BIDIR_ASTAR_H

#include "../include/astar.h"
#include <queue>
#include <limits>
#include <algorithm>   // <-- required for std::reverse
#include <utility>     // <-- sometimes needed for std::pair

std::pair<double, std::vector<int>> a_star(const Graph& g, int src, int dst) {
    const double INF = std::numeric_limits<double>::infinity();

    int sz = std::max((int)g.adj.size(), std::max(src, dst) + 1);
    std::vector<double> gscore(sz, INF);
    std::vector<double> fscore(sz, INF);
    std::vector<int> parent(sz, -1);

    auto heuristic = [&](int u)->double {
        return g.haversineDistance(u, dst);
    };

    using PDI = std::pair<double,int>;
    std::priority_queue<PDI, std::vector<PDI>, std::greater<PDI>> open;

    gscore[src] = 0.0;
    fscore[src] = heuristic(src);
    open.push({fscore[src], src});

    while (!open.empty()) {
        // -------- FIX 1: Don't use structured bindings --------
        // auto [f, u] = open.top();   // ❌ requires C++17 exactly
        double f = open.top().first;
        int u     = open.top().second;
        // -------------------------------------------------------
        open.pop();

        if (u == dst) break;
        if (u >= (int)g.adj.size()) continue;

        for (const auto &e : g.adj[u]) {
            int v = e.to;
            double tentative_g = gscore[u] + e.weight;

            if (tentative_g < gscore[v]) {
                parent[v] = u;
                gscore[v] = tentative_g;
                fscore[v] = tentative_g + heuristic(v);
                open.push({fscore[v], v});
            }
        }
    }

    if (gscore[dst] == INF)
        return {INF, {}};

    std::vector<int> path;

    // -------- FIX 2: std::reverse requires <algorithm> --------
    for (int cur = dst; cur != -1; cur = parent[cur])
        path.push_back(cur);

    std::reverse(path.begin(), path.end());
    // -----------------------------------------------------------

    return {gscore[dst], path};
}

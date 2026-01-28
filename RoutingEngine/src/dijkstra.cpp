#include "../include/dijkstra.h"
#include <queue>
#include <limits>

std::pair<double, std::vector<int>> dijkstra(const Graph& g, int src, int dst) {
    const double INF = std::numeric_limits<double>::infinity();
    int N = std::max((int)g.adj.size(), std::max(src, dst) + 1);
    std::vector<double> dist(N, INF);
    std::vector<int> parent(N, -1);
    using PDI = std::pair<double,int>;
    std::priority_queue<PDI, std::vector<PDI>, std::greater<PDI>> pq;
    dist[src] = 0.0;
    pq.push({0.0, src});
    while (!pq.empty()) {
        auto [d,u] = pq.top(); pq.pop();
        if (d > dist[u]) continue;
        if (u == dst) break;
        if (u >= (int)g.adj.size()) continue;
        for (const auto &e : g.adj[u]) {
            int v = e.to;
            double w = e.weight;
            if (dist[v] > dist[u] + w) {
                dist[v] = dist[u] + w;
                parent[v] = u;
                pq.push({dist[v], v});
            }
        }
    }
    if (dist[dst] == INF) return {INF, {}};
    std::vector<int> path;
    for (int cur = dst; cur != -1; cur = parent[cur]) path.push_back(cur);
    std::reverse(path.begin(), path.end());
    return {dist[dst], path};
}

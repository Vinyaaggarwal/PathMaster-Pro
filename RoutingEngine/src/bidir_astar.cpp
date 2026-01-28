#include "../include/bidir_astar.h"
#include <queue>
#include <limits>
#include <vector>

using PDI = std::pair<double,int>;

std::pair<double, std::vector<int>> bidir_a_star(const Graph& g, int src, int dst) {
    const double INF = std::numeric_limits<double>::infinity();
    if (src == dst) return {0.0, {src}};
    int N = std::max((int)g.adj.size(), std::max(src, dst)+1);
    std::vector<double> gF(N, INF), fF(N, INF), gB(N, INF), fB(N, INF);
    std::vector<int> pF(N, -1), pB(N, -1);
    std::vector<char> seenF(N, 0), seenB(N, 0);
    auto heurF = [&](int u)->double { return g.haversineDistance(u, dst); };
    auto heurB = [&](int u)->double { return g.haversineDistance(u, src); };
    std::priority_queue<PDI, std::vector<PDI>, std::greater<PDI>> openF, openB;
    gF[src] = 0.0; fF[src] = heurF(src); openF.push({fF[src], src});
    gB[dst] = 0.0; fB[dst] = heurB(dst); openB.push({fB[dst], dst});
    double best = INF; int meeting = -1;
    while (!openF.empty() && !openB.empty()) {
        // forward expand
        if (!openF.empty()) {
            auto [f,u] = openF.top(); openF.pop();
            if (f > fF[u]) continue;
            seenF[u] = 1;
            if (seenB[u]) {
                double total = gF[u] + gB[u];
                if (total < best) { best = total; meeting = u; }
            }
            if (u < (int)g.adj.size()) {
                for (const auto &e : g.adj[u]) {
                    int v = e.to; double w = e.weight;
                    if (gF[v] > gF[u] + w) {
                        gF[v] = gF[u] + w; pF[v] = u; fF[v] = gF[v] + heurF(v);
                        openF.push({fF[v], v});
                    }
                }
            }
        }
        // backward expand using reverse adjacency
        if (!openB.empty()) {
            auto [f,u] = openB.top(); openB.pop();
            if (f > fB[u]) continue;
            seenB[u] = 1;
            if (seenF[u]) {
                double total = gF[u] + gB[u];
                if (total < best) { best = total; meeting = u; }
            }
            if (u < (int)g.radj.size()) {
                for (const auto &e : g.radj[u]) {
                    int v = e.to; double w = e.weight;
                    if (gB[v] > gB[u] + w) {
                        gB[v] = gB[u] + w; pB[v] = u; fB[v] = gB[v] + heurB(v);
                        openB.push({fB[v], v});
                    }
                }
            }
        }
        double topF = openF.empty() ? INF : openF.top().first;
        double topB = openB.empty() ? INF : openB.top().first;
        if (best < std::min(topF, topB)) break;
    }
    if (meeting == -1) return {INF, {}};
    std::vector<int> pathF, pathB;
    for (int cur = meeting; cur != -1; cur = pF[cur]) pathF.push_back(cur);
    std::reverse(pathF.begin(), pathF.end());
    for (int cur = meeting; cur != -1; cur = pB[cur]) pathB.push_back(cur);
    pathF.insert(pathF.end(), pathB.begin()+1, pathB.end());
    return {best, pathF};
}

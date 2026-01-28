#include "../include/graph.h"
#include "../include/haversine.h"
#include <cmath>
#include <iostream>

Node::Node(int _id, const std::string& _name, double _lat, double _lon)
    : id(_id), name(_name), lat(_lat), lon(_lon) {}
Edge::Edge(int _to, double _w) : to(_to), weight(_w) {}

Graph::Graph() {}

void Graph::reserve(int N) {
    nodes.assign(N, Node());
    adj.assign(N, {});
    radj.assign(N, {});
}

void Graph::addNode(int id, const std::string& name, double lat, double lon) {
    if (id >= (int)nodes.size()) {
        int newSize = std::max(id + 1, (int)nodes.size() * 2);
        nodes.resize(newSize);
        adj.resize(newSize);
        radj.resize(newSize);
    }
    nodes[id] = Node(id, name, lat, lon);
}

void Graph::addEdge(int from, int to, double weight) {
    if (from >= (int)adj.size() || to >= (int)adj.size()) {
        int newSize = std::max(from, to) + 1;
        nodes.resize(newSize);
        adj.resize(newSize);
        radj.resize(newSize);
    }
    adj[from].emplace_back(to, weight);
}

bool Graph::updateEdgeWeight(int from, int to, double weight) {
    if (from >= (int)adj.size()) return false;
    for (auto &e : adj[from]) {
        if (e.to == to) {
            e.weight = weight;
            // update reverse too
            for (auto &re : radj[to]) {
                if (re.to == from) { re.weight = weight; break; }
            }
            return true;
        }
    }
    return false;
}

void Graph::buildReverseAdj() {
    radj.assign(adj.size(), {});
    for (size_t u = 0; u < adj.size(); ++u) {
        for (const auto &e : adj[u]) radj[e.to].emplace_back(u, e.weight);
    }
}

double Graph::heuristicEuclidean(int u, int v) const {
    if (u >= (int)nodes.size() || v >= (int)nodes.size()) return 0.0;
    double dx = nodes[u].lat - nodes[v].lat;
    double dy = nodes[u].lon - nodes[v].lon;
    return std::sqrt(dx*dx + dy*dy);
}

double Graph::haversineDistance(int u, int v) const {
    if (u >= (int)nodes.size() || v >= (int)nodes.size()) return 0.0;
    return haversine(nodes[u].lat, nodes[u].lon, nodes[v].lat, nodes[v].lon);
}

void Graph::summary() const {
    std::cout << "Graph: " << nodes.size() << " node slots\n";
    size_t edges = 0;
    for (const auto &vec : adj) edges += vec.size();
    std::cout << edges << " edges (directed)\n";
}

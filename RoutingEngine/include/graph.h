#ifndef GRAPH_H
#define GRAPH_H

#include <vector>
#include <string>

struct Node {
    int id;
    std::string name;
    double lat, lon;
    Node(int _id=0, const std::string& _name="", double _lat=0, double _lon=0);
};

struct Edge {
    int to;
    double weight;
    Edge(int _to=0, double _w=0);
};

class Graph {
public:
    Graph();
    void reserve(int N);
    void addNode(int id, const std::string& name, double lat, double lon);
    void addEdge(int from, int to, double weight);
    bool updateEdgeWeight(int from, int to, double weight);

    void buildReverseAdj();

    double heuristicEuclidean(int u, int v) const;
    double haversineDistance(int u, int v) const;
    void summary() const;

    std::vector<Node> nodes;
    std::vector<std::vector<Edge>> adj;
    std::vector<std::vector<Edge>> radj; // reverse adjacency for efficient backward search
};

#endif // GRAPH_H

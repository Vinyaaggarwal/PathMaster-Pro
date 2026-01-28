#include <bits/stdc++.h>
#include "../include/graph.h"
#include "../include/dijkstra.h"
#include "../include/astar.h"
#include "../include/bidir_astar.h"
#include "../include/lru_cache.h"
#include "../include/osm_parser.h"

using namespace std;

struct QueryResult { double dist; vector<int> path; QueryResult(double d=0, vector<int> p={}): dist(d), path(std::move(p)) {} };

string makeKey(const string& alg, int s, int t) { return alg + "|" + to_string(s) + "|" + to_string(t); }

bool loadMapFile(const string& filename, Graph& g) {
    ifstream fin(filename);
    if (!fin.is_open()) return false;
    string token; int nodesCount=0, edgesCount=0;
    g = Graph();
    while (fin >> token) {
        if (token == "NODES") {
            fin >> nodesCount;
            for (int i=0;i<nodesCount;++i) { int id; string name; double lat, lon; fin >> id >> name >> lat >> lon; g.addNode(id,name,lat,lon); }
        } else if (token=="EDGES") {
            fin >> edgesCount;
            for (int i=0;i<edgesCount;++i) { int u,v; double w; fin>>u>>v>>w; g.addEdge(u,v,w); }
        } else { string rest; getline(fin,rest); }
    }
    g.buildReverseAdj();
    fin.close();
    return true;
}

void printPath(const Graph& g, const vector<int>& path) {
    cout << "Path (" << path.size() << "): ";
    for (size_t i=0;i<path.size();++i) {
        int id = path[i];
        string label = (id < (int)g.nodes.size() && !g.nodes[id].name.empty()) ? g.nodes[id].name : to_string(id);
        cout << label << (i+1<path.size()?" -> " : "\n");
    }
}

int main(){
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    Graph graph;
    LRUCache<string, QueryResult> cache(200);
    cout << "RoutingEngine (All features integrated)\nType 'help'\n";
    while (true) {
        cout << "> "; string cmd; if (!(cin>>cmd)) break;
        if (cmd=="help") {
            cout << "Commands:\n  loadmap <file>       - load simple map.txt\n  loadosm <file>       - parse OSM extract (.osm)\n  summary              - graph stats\n  dijkstra s t         - run dijkstra\n  astar s t            - run A* (haversine heuristic)\n  bidir s t            - run bidirectional A*\n  update u v w         - update edge u->v weight\n  cacheclear           - clear query cache\n  exit\n";
        } else if (cmd=="exit") break;
        else if (cmd=="loadmap") { string f; cin>>f; if (loadMapFile(f, graph)) { cout<<"Loaded map."<<"\n"; graph.summary(); cache.clear(); } else cout<<"Failed to load."<<"\n"; }
        else if (cmd=="loadosm") { string f; cin>>f; if (parseOSM(f, graph)) { cout<<"Loaded OSM map."<<"\n"; graph.summary(); cache.clear(); } else cout<<"Failed to parse OSM."<<"\n"; }
        else if (cmd=="summary") graph.summary();
        else if (cmd=="dijkstra"||cmd=="astar"||cmd=="bidir") {
            int s,t; cin>>s>>t;
            if (s >= (int)graph.adj.size() || t >= (int)graph.adj.size()) { cout<<"Invalid ids\n"; continue; }
            string key = makeKey(cmd,s,t);
            QueryResult qr;
            if (cache.get(key, qr)) { cout<<"(cached) Dist="<<fixed<<setprecision(3)<<qr.dist<<"\n"; printPath(graph,qr.path); continue; }
            pair<double, vector<int>> res;
            if (cmd=="dijkstra") res = dijkstra(graph,s,t);
            else if (cmd=="astar") res = a_star(graph,s,t);
            else res = bidir_a_star(graph,s,t);
            if (res.first == numeric_limits<double>::infinity()) cout<<"No path found\n";
            else { cout<<"Dist="<<fixed<<setprecision(3)<<res.first<<"\n"; printPath(graph,res.second); cache.put(key, QueryResult(res.first,res.second)); }
        }
        else if (cmd=="update") { int u,v; double w; cin>>u>>v>>w; if (graph.updateEdgeWeight(u,v,w)) { cout<<"Updated\n"; graph.buildReverseAdj(); cache.clear(); } else cout<<"Edge not found\n"; }
        else if (cmd=="cacheclear") { cache.clear(); cout<<"Cache cleared\n"; }
        else { cout<<"Unknown cmd\n"; string rest; getline(cin,rest); }
    }
    return 0;
}

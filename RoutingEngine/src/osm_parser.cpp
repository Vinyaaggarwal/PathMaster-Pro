#include "../include/osm_parser.h"
#include <fstream>
#include <sstream>
#include <unordered_map>
#include <iostream>

// Very small OSM XML parser: reads <node id=.. lat=.. lon=..> and <way> with <nd ref=..> and <tag k="highway" v="..."> lines
// This is NOT a full OSM parser; it works for simple extracts and highways/primary/secondary/local ways.

bool parseOSM(const std::string& filename, Graph& g) {
    std::ifstream fin(filename);
    if (!fin.is_open()) return false;
    std::string line;
    std::unordered_map<long long,int> osmNodeToId;
    int nextId = 0;
    struct TempNode { long long osmId; double lat, lon; };
    std::vector<TempNode> tempNodes;
    // read file line by line, capture nodes & ways
    while (std::getline(fin, line)) {
        // trim leading spaces
        size_t pos = line.find_first_not_of(" \t");
        if (pos==std::string::npos) continue;
        std::string s = line.substr(pos);
        if (s.rfind("<node",0) == 0) {
            // parse id, lat, lon
            long long id=0; double lat=0, lon=0;
            size_t idpos = s.find("id=");
            size_t latpos = s.find("lat=");
            size_t lonpos = s.find("lon=");
            if (idpos!=std::string::npos) {
                idpos += 3; char q = s[idpos]; size_t q2 = s.find(q, idpos+1);
                std::string idstr = s.substr(idpos+1, q2-idpos-1);
                id = std::stoll(idstr);
            }
            if (latpos!=std::string::npos) {
                latpos += 4; char q = s[latpos]; size_t q2 = s.find(q, latpos+1);
                std::string latstr = s.substr(latpos+1, q2-latpos-1);
                lat = std::stod(latstr);
            }
            if (lonpos!=std::string::npos) {
                lonpos += 4; char q = s[lonpos]; size_t q2 = s.find(q, lonpos+1);
                std::string lonstr = s.substr(lonpos+1, q2-lonpos-1);
                lon = std::stod(lonstr);
            }
            osmNodeToId[id] = nextId;
            tempNodes.push_back({id, lat, lon});
            g.addNode(nextId, std::to_string(nextId), lat, lon);
            nextId++;
        }
        else if (s.rfind("<way",0) == 0) {
            // parse way block until </way>
            std::vector<long long> refs;
            bool isHighway = false;
            while (std::getline(fin, line)) {
                size_t p = line.find_first_not_of(" \t");
                if (p==std::string::npos) continue;
                std::string t = line.substr(p);
                if (t.rfind("</way",0) == 0) break;
                if (t.rfind("<nd",0) == 0) {
                    size_t refpos = t.find("ref=");
                    if (refpos!=std::string::npos) {
                        refpos += 4; char q = t[refpos]; size_t q2 = t.find(q, refpos+1);
                        std::string refstr = t.substr(refpos+1, q2-refpos-1);
                        long long ref = std::stoll(refstr);
                        refs.push_back(ref);
                    }
                }
                if (t.rfind("<tag",0) == 0) {
                    size_t kpos = t.find("k=");
                    size_t vpos = t.find("v=");
                    if (kpos!=std::string::npos && vpos!=std::string::npos) {
                        std::string kval = "", vval = "";
                        char qk = t[kpos+2]; size_t kq = t.find(qk, kpos+3);
                        kval = t.substr(kpos+3, kq-(kpos+3));
                        char qv = t[vpos+2]; size_t vq = t.find(qv, vpos+3);
                        vval = t.substr(vpos+3, vq-(vpos+3));
                        if (kval == "highway") isHighway = true;
                    }
                }
            }
            if (isHighway && refs.size() >= 2) {
                // create edges between consecutive refs (undirected converted to directed both ways)
                for (size_t i=0;i+1<refs.size();++i) {
                    long long a = refs[i], b = refs[i+1];
                    if (osmNodeToId.find(a)==osmNodeToId.end() || osmNodeToId.find(b)==osmNodeToId.end()) continue;
                    int ida = osmNodeToId[a]; int idb = osmNodeToId[b];
                    double w = g.haversineDistance(ida, idb); // weight in km
                    g.addEdge(ida, idb, w);
                    g.addEdge(idb, ida, w);
                }
            }
        }
    }
    fin.close();
    g.buildReverseAdj();
    return true;
}

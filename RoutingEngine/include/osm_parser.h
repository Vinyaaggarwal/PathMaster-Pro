#ifndef OSM_PARSER_H
#define OSM_PARSER_H

#include <string>
#include "graph.h"

// Parse a very small subset of OSM XML (nodes and ways). This is a lightweight parser
// suitable for small .osm extracts. For full OSM support use a proper library.
// The function fills graph "g" with nodes and edges. It maps OSM node ids to internal ids.

bool parseOSM(const std::string& filename, Graph& g);

#endif // OSM_PARSER_H

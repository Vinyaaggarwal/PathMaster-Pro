#!/usr/bin/env python3
"""
PathFinder Pro - Terminal Version
Graph-based navigation system with Dijkstra, A*, BFS, and DFS algorithms
"""

import heapq
import math
import time
from collections import deque
from typing import Dict, List, Tuple, Optional, Set

# ============================================================================
# Graph Data Structures
# ============================================================================

class GraphNode:
    def __init__(self, id: str, name: str, x: float, y: float):
        self.id = id
        self.name = name
        self.x = x
        self.y = y
    
    def euclidean_distance(self, other: 'GraphNode') -> float:
        """Calculate Euclidean distance to another node"""
        return math.sqrt((self.x - other.x)**2 + (self.y - other.y)**2)
    
    def manhattan_distance(self, other: 'GraphNode') -> float:
        """Calculate Manhattan distance to another node"""
        return abs(self.x - other.x) + abs(self.y - other.y)


class GraphEdge:
    def __init__(self, from_id: str, to_id: str, weight: float):
        self.from_id = from_id
        self.to_id = to_id
        self.weight = weight


class Graph:
    def __init__(self):
        self.nodes: Dict[str, GraphNode] = {}
        self.adjacency_list: Dict[str, List[GraphEdge]] = {}
    
    def add_node(self, id: str, name: str, x: float, y: float):
        """Add a node to the graph"""
        self.nodes[id] = GraphNode(id, name, x, y)
        self.adjacency_list[id] = []
    
    def add_edge(self, from_id: str, to_id: str, weight: float, bidirectional=True):
        """Add an edge to the graph"""
        edge = GraphEdge(from_id, to_id, weight)
        self.adjacency_list[from_id].append(edge)
        
        if bidirectional:
            reverse_edge = GraphEdge(to_id, from_id, weight)
            self.adjacency_list[to_id].append(reverse_edge)
    
    def get_neighbors(self, node_id: str) -> List[GraphEdge]:
        """Get all neighbors of a node"""
        return self.adjacency_list.get(node_id, [])
    
    def get_node(self, node_id: str) -> Optional[GraphNode]:
        """Get node by ID"""
        return self.nodes.get(node_id)


# ============================================================================
# Pathfinding Algorithms
# ============================================================================

class PathResult:
    def __init__(self, path: List[str], distance: float, nodes_visited: int, 
                 execution_time: float, algorithm: str):
        self.path = path
        self.distance = distance
        self.nodes_visited = nodes_visited
        self.execution_time = execution_time
        self.algorithm = algorithm


def dijkstra(graph: Graph, source_id: str, dest_id: str) -> PathResult:
    """Dijkstra's shortest path algorithm"""
    start_time = time.time()
    
    distances = {node_id: float('inf') for node_id in graph.nodes}
    distances[source_id] = 0
    previous = {node_id: None for node_id in graph.nodes}
    
    pq = [(0, source_id)]
    visited = set()
    nodes_visited = 0
    
    while pq:
        current_dist, current_id = heapq.heappop(pq)
        
        if current_id in visited:
            continue
        
        visited.add(current_id)
        nodes_visited += 1
        
        if current_id == dest_id:
            break
        
        for edge in graph.get_neighbors(current_id):
            neighbor_id = edge.to_id
            new_dist = current_dist + edge.weight
            
            if new_dist < distances[neighbor_id]:
                distances[neighbor_id] = new_dist
                previous[neighbor_id] = current_id
                heapq.heappush(pq, (new_dist, neighbor_id))
    
    # Reconstruct path
    path = []
    current = dest_id
    while current is not None:
        path.append(current)
        current = previous[current]
    path.reverse()
    
    execution_time = (time.time() - start_time) * 1000  # Convert to ms
    
    return PathResult(
        path if path[0] == source_id else [],
        distances[dest_id],
        nodes_visited,
        execution_time,
        "Dijkstra"
    )


def astar(graph: Graph, source_id: str, dest_id: str, heuristic='euclidean') -> PathResult:
    """A* search algorithm"""
    start_time = time.time()
    
    def h(node_id: str) -> float:
        """Heuristic function"""
        node = graph.get_node(node_id)
        goal = graph.get_node(dest_id)
        if heuristic == 'manhattan':
            return node.manhattan_distance(goal)
        else:  # euclidean
            return node.euclidean_distance(goal)
    
    g_score = {node_id: float('inf') for node_id in graph.nodes}
    g_score[source_id] = 0
    
    f_score = {node_id: float('inf') for node_id in graph.nodes}
    f_score[source_id] = h(source_id)
    
    previous = {node_id: None for node_id in graph.nodes}
    
    open_set = [(f_score[source_id], source_id)]
    closed_set = set()
    nodes_visited = 0
    
    while open_set:
        _, current_id = heapq.heappop(open_set)
        
        if current_id in closed_set:
            continue
        
        closed_set.add(current_id)
        nodes_visited += 1
        
        if current_id == dest_id:
            break
        
        for edge in graph.get_neighbors(current_id):
            neighbor_id = edge.to_id
            
            if neighbor_id in closed_set:
                continue
            
            tentative_g = g_score[current_id] + edge.weight
            
            if tentative_g < g_score[neighbor_id]:
                previous[neighbor_id] = current_id
                g_score[neighbor_id] = tentative_g
                f_score[neighbor_id] = tentative_g + h(neighbor_id)
                heapq.heappush(open_set, (f_score[neighbor_id], neighbor_id))
    
    # Reconstruct path
    path = []
    current = dest_id
    while current is not None:
        path.append(current)
        current = previous[current]
    path.reverse()
    
    execution_time = (time.time() - start_time) * 1000
    
    return PathResult(
        path if path and path[0] == source_id else [],
        g_score[dest_id],
        nodes_visited,
        execution_time,
        f"A* ({heuristic})"
    )


def bfs(graph: Graph, source_id: str, dest_id: str) -> PathResult:
    """Breadth-First Search"""
    start_time = time.time()
    
    queue = deque([source_id])
    visited = {source_id}
    previous = {source_id: None}
    distances = {source_id: 0}
    nodes_visited = 0
    
    while queue:
        current_id = queue.popleft()
        nodes_visited += 1
        
        if current_id == dest_id:
            break
        
        for edge in graph.get_neighbors(current_id):
            neighbor_id = edge.to_id
            
            if neighbor_id not in visited:
                visited.add(neighbor_id)
                previous[neighbor_id] = current_id
                distances[neighbor_id] = distances[current_id] + edge.weight
                queue.append(neighbor_id)
    
    # Reconstruct path
    path = []
    current = dest_id
    while current is not None:
        path.append(current)
        current = previous.get(current)
    path.reverse()
    
    execution_time = (time.time() - start_time) * 1000
    
    return PathResult(
        path if path and path[0] == source_id else [],
        distances.get(dest_id, -1),
        nodes_visited,
        execution_time,
        "BFS"
    )


def dfs(graph: Graph, source_id: str, dest_id: str) -> PathResult:
    """Depth-First Search"""
    start_time = time.time()
    
    visited = set()
    previous = {source_id: None}
    distances = {source_id: 0}
    nodes_visited = [0]  # Use list to allow modification in nested function
    
    def dfs_visit(current_id: str, current_dist: float) -> bool:
        visited.add(current_id)
        nodes_visited[0] += 1
        
        if current_id == dest_id:
            return True
        
        for edge in graph.get_neighbors(current_id):
            neighbor_id = edge.to_id
            
            if neighbor_id not in visited:
                previous[neighbor_id] = current_id
                distances[neighbor_id] = current_dist + edge.weight
                
                if dfs_visit(neighbor_id, current_dist + edge.weight):
                    return True
        
        return False
    
    found = dfs_visit(source_id, 0)
    
    # Reconstruct path
    path = []
    if found:
        current = dest_id
        while current is not None:
            path.append(current)
            current = previous.get(current)
        path.reverse()
    
    execution_time = (time.time() - start_time) * 1000
    
    return PathResult(
        path,
        distances.get(dest_id, -1) if found else -1,
        nodes_visited[0],
        execution_time,
        "DFS"
    )


# ============================================================================
# Map Data
# ============================================================================

def load_usa_map() -> Graph:
    """Load USA cities map"""
    graph = Graph()
    
    # Add nodes (cities)
    cities = [
        ('nyc', 'New York', 850, 300),
        ('la', 'Los Angeles', 150, 450),
        ('chicago', 'Chicago', 650, 280),
        ('houston', 'Houston', 450, 550),
        ('phoenix', 'Phoenix', 250, 500),
        ('philadelphia', 'Philadelphia', 820, 320),
        ('san_diego', 'San Diego', 120, 520),
        ('dallas', 'Dallas', 450, 520),
        ('san_jose', 'San Jose', 100, 380),
        ('austin', 'Austin', 420, 580),
        ('seattle', 'Seattle', 110, 150),
        ('denver', 'Denver', 350, 340),
        ('boston', 'Boston', 880, 260),
        ('miami', 'Miami', 780, 680),
        ('las_vegas', 'Las Vegas', 200, 420),
    ]
    
    for city_id, name, x, y in cities:
        graph.add_node(city_id, name, x, y)
    
    # Add edges (connections with distances in km)
    edges = [
        ('nyc', 'philadelphia', 95),
        ('nyc', 'boston', 215),
        ('philadelphia', 'boston', 310),
        ('chicago', 'denver', 920),
        ('houston', 'dallas', 240),
        ('dallas', 'austin', 195),
        ('la', 'san_diego', 120),
        ('la', 'phoenix', 370),
        ('san_diego', 'phoenix', 355),
        ('seattle', 'denver', 1300),
        ('denver', 'las_vegas', 750),
        ('denver', 'phoenix', 600),
        ('las_vegas', 'la', 270),
        ('houston', 'phoenix', 1180),
        ('dallas', 'denver', 780),
        ('chicago', 'nyc', 790),
        ('miami', 'houston', 1190),
    ]
    
    for from_id, to_id, distance in edges:
        graph.add_edge(from_id, to_id, distance)
    
    return graph


def load_europe_map() -> Graph:
    """Load European cities map"""
    graph = Graph()
    
    # Add nodes (cities)
    cities = [
        ('london', 'London', 400, 250),
        ('paris', 'Paris', 420, 300),
        ('berlin', 'Berlin', 550, 220),
        ('madrid', 'Madrid', 320, 400),
        ('rome', 'Rome', 550, 420),
        ('barcelona', 'Barcelona', 380, 420),
        ('amsterdam', 'Amsterdam', 450, 220),
        ('vienna', 'Vienna', 600, 300),
        ('prague', 'Prague', 570, 260),
        ('budapest', 'Budapest', 620, 320),
        ('warsaw', 'Warsaw', 650, 220),
        ('brussels', 'Brussels', 440, 260),
        ('munich', 'Munich', 530, 300),
        ('milan', 'Milan', 500, 360),
        ('zurich', 'Zurich', 490, 320),
    ]
    
    for city_id, name, x, y in cities:
        graph.add_node(city_id, name, x, y)
    
    # Add edges (connections with distances in km)
    edges = [
        ('london', 'paris', 340),
        ('london', 'amsterdam', 360),
        ('london', 'brussels', 320),
        ('paris', 'brussels', 265),
        ('paris', 'barcelona', 830),
        ('paris', 'zurich', 490),
        ('barcelona', 'madrid', 505),
        ('madrid', 'paris', 1050),
        ('rome', 'milan', 480),
        ('rome', 'vienna', 765),
        ('milan', 'zurich', 220),
        ('milan', 'munich', 410),
        ('berlin', 'amsterdam', 580),
        ('berlin', 'prague', 280),
        ('berlin', 'warsaw', 520),
        ('berlin', 'munich', 505),
        ('prague', 'vienna', 250),
        ('prague', 'munich', 305),
        ('vienna', 'budapest', 215),
        ('vienna', 'munich', 355),
        ('budapest', 'warsaw', 545),
        ('amsterdam', 'brussels', 175),
        ('brussels', 'zurich', 520),
    ]
    
    for from_id, to_id, distance in edges:
        graph.add_edge(from_id, to_id, distance)
    
    return graph


def load_india_map() -> Graph:
    """Load Indian cities map"""
    graph = Graph()
    
    # Add nodes (cities)
    cities = [
        ('delhi', 'New Delhi', 500, 200),
        ('mumbai', 'Mumbai', 400, 350),
        ('bangalore', 'Bangalore', 450, 500),
        ('hyderabad', 'Hyderabad', 500, 450),
        ('chennai', 'Chennai', 520, 550),
        ('kolkata', 'Kolkata', 650, 300),
        ('pune', 'Pune', 420, 380),
        ('ahmedabad', 'Ahmedabad', 380, 280),
        ('jaipur', 'Jaipur', 450, 230),
        ('lucknow', 'Lucknow', 550, 240),
        ('chandigarh', 'Chandigarh', 480, 180),
        ('kochi', 'Kochi', 420, 600),
        ('indore', 'Indore', 450, 300),
        ('bhopal', 'Bhopal', 480, 290),
        ('nagpur', 'Nagpur', 520, 370),
    ]
    
    for city_id, name, x, y in cities:
        graph.add_node(city_id, name, x, y)
    
    # Add edges (connections with distances in km)
    edges = [
        ('delhi', 'jaipur', 280),
        ('delhi', 'chandigarh', 245),
        ('delhi', 'lucknow', 555),
        ('delhi', 'ahmedabad', 935),
        ('jaipur', 'ahmedabad', 680),
        ('ahmedabad', 'mumbai', 525),
        ('ahmedabad', 'indore', 390),
        ('mumbai', 'pune', 150),
        ('mumbai', 'bangalore', 985),
        ('pune', 'bangalore', 840),
        ('pune', 'hyderabad', 560),
        ('bangalore', 'hyderabad', 575),
        ('bangalore', 'chennai', 350),
        ('bangalore', 'kochi', 560),
        ('chennai', 'hyderabad', 625),
        ('chennai', 'kochi', 695),
        ('hyderabad', 'nagpur', 500),
        ('nagpur', 'mumbai', 800),
        ('nagpur', 'bhopal', 350),
        ('indore', 'bhopal', 195),
        ('bhopal', 'delhi', 740),
        ('lucknow', 'kolkata', 985),
        ('kolkata', 'delhi', 1450),
    ]
    
    for from_id, to_id, distance in edges:
        graph.add_edge(from_id, to_id, distance)
    
    return graph


# ============================================================================
# Terminal Interface
# ============================================================================

def print_banner():
    """Print application banner"""
    print("\n" + "="*70)
    print("  🗺️  PathFinder Pro - Terminal Edition")
    print("  Graph-Based Navigation System")
    print("="*70)


def print_menu():
    """Print main menu"""
    print("\n📋 Available Commands:")
    print("  0. map         - Switch map (USA/Europe/India)")
    print("  1. list        - List all cities")
    print("  2. dijkstra    - Find path using Dijkstra's algorithm")
    print("  3. astar       - Find path using A* search")
    print("  4. bfs         - Find path using Breadth-First Search")
    print("  5. dfs         - Find path using Depth-First Search")
    print("  6. compare     - Compare all algorithms")
    print("  7. stats       - Show graph statistics")
    print("  8. help        - Show this menu")
    print("  9. exit        - Exit program")


def print_path_result(result: PathResult, graph: Graph):
    """Print path finding result"""
    print("\n" + "="*70)
    print(f"🔍 Algorithm: {result.algorithm}")
    print("="*70)
    
    if not result.path or result.distance < 0:
        print("❌ No path found!")
        return
    
    print(f"✅ Path found!")
    print(f"📏 Total Distance: {result.distance:.2f} km")
    print(f"🔢 Path Length: {len(result.path)} cities")
    print(f"👁️  Nodes Visited: {result.nodes_visited}")
    print(f"⚡ Execution Time: {result.execution_time:.2f} ms")
    
    print(f"\n🛣️  Route:")
    for i, node_id in enumerate(result.path, 1):
        node = graph.get_node(node_id)
        print(f"  {i}. {node.name}")
    print()


def list_cities(graph: Graph):
    """List all available cities"""
    print("\n📍 Available Cities:")
    print("-" * 40)
    for i, (node_id, node) in enumerate(sorted(graph.nodes.items(), key=lambda x: x[1].name), 1):
        print(f"  {i:2d}. {node.name:20s} ({node_id})")
    print()


def show_stats(graph: Graph):
    """Show graph statistics"""
    edge_count = sum(len(edges) for edges in graph.adjacency_list.values()) // 2
    print("\n📊 Graph Statistics:")
    print("-" * 40)
    print(f"  Cities (Nodes): {len(graph.nodes)}")
    print(f"  Connections (Edges): {edge_count}")
    print(f"  Average Connections per City: {edge_count * 2 / len(graph.nodes):.1f}")
    print()


def compare_algorithms(graph: Graph, source_id: str, dest_id: str):
    """Compare all algorithms"""
    print("\n" + "="*70)
    print("🏁 Algorithm Comparison")
    print("="*70)
    
    algorithms = [
        ('Dijkstra', lambda: dijkstra(graph, source_id, dest_id)),
        ('A* (Euclidean)', lambda: astar(graph, source_id, dest_id, 'euclidean')),
        ('A* (Manhattan)', lambda: astar(graph, source_id, dest_id, 'manhattan')),
        ('BFS', lambda: bfs(graph, source_id, dest_id)),
        ('DFS', lambda: dfs(graph, source_id, dest_id)),
    ]
    
    results = []
    for name, algo_func in algorithms:
        result = algo_func()
        results.append((name, result))
    
    print(f"\n{'Algorithm':<20} {'Distance':>12} {'Nodes':>8} {'Time (ms)':>12} {'Optimal':>10}")
    print("-" * 70)
    
    min_distance = min(r.distance for _, r in results if r.distance > 0)
    
    for name, result in results:
        if result.distance > 0:
            is_optimal = "✅ Yes" if abs(result.distance - min_distance) < 0.01 else "❌ No"
            print(f"{name:<20} {result.distance:>10.2f} km {result.nodes_visited:>8} {result.execution_time:>10.2f} ms {is_optimal:>10}")
        else:
            print(f"{name:<20} {'No path':>12} {result.nodes_visited:>8} {result.execution_time:>10.2f} ms {'N/A':>10}")
    print()


def main():
    """Main application loop"""
    print_banner()
    
    # Available maps
    maps = {
        'usa': ('USA Major Cities', load_usa_map),
        'europe': ('European Cities', load_europe_map),
        'india': ('Indian Cities', load_india_map),
    }
    
    current_map = 'usa'
    print(f"\n🔄 Loading {maps[current_map][0]}...")
    graph = maps[current_map][1]()
    print(f"✅ Loaded {len(graph.nodes)} cities with {sum(len(e) for e in graph.adjacency_list.values()) // 2} connections")
    
    print_menu()
    
    while True:
        try:
            command = input("\n💻 Enter command: ").strip().lower()
            
            if command in ['exit', 'quit', '9']:
                print("\n👋 Thank you for using PathFinder Pro!")
                break
            
            elif command in ['help', '8']:
                print_menu()
            
            elif command in ['map', '0']:
                print("\n🗺️  Available Maps:")
                print("  1. USA Major Cities")
                print("  2. European Cities")
                print("  3. Indian Cities")
                choice = input("Select map (1-3): ").strip()
                
                if choice == '1':
                    current_map = 'usa'
                elif choice == '2':
                    current_map = 'europe'
                elif choice == '3':
                    current_map = 'india'
                else:
                    print("❌ Invalid choice!")
                    continue
                
                print(f"\n🔄 Loading {maps[current_map][0]}...")
                graph = maps[current_map][1]()
                print(f"✅ Loaded {len(graph.nodes)} cities with {sum(len(e) for e in graph.adjacency_list.values()) // 2} connections")
            
            elif command in ['list', '1']:
                list_cities(graph)
            
            elif command in ['stats', '7']:
                show_stats(graph)
            
            elif command in ['dijkstra', '2']:
                list_cities(graph)
                source = input("Enter source city ID: ").strip()
                dest = input("Enter destination city ID: ").strip()
                
                if source in graph.nodes and dest in graph.nodes:
                    result = dijkstra(graph, source, dest)
                    print_path_result(result, graph)
                else:
                    print("❌ Invalid city ID!")
            
            elif command in ['astar', '3']:
                list_cities(graph)
                source = input("Enter source city ID: ").strip()
                dest = input("Enter destination city ID: ").strip()
                heuristic = input("Heuristic (euclidean/manhattan) [euclidean]: ").strip() or 'euclidean'
                
                if source in graph.nodes and dest in graph.nodes:
                    result = astar(graph, source, dest, heuristic)
                    print_path_result(result, graph)
                else:
                    print("❌ Invalid city ID!")
            
            elif command in ['bfs', '4']:
                list_cities(graph)
                source = input("Enter source city ID: ").strip()
                dest = input("Enter destination city ID: ").strip()
                
                if source in graph.nodes and dest in graph.nodes:
                    result = bfs(graph, source, dest)
                    print_path_result(result, graph)
                else:
                    print("❌ Invalid city ID!")
            
            elif command in ['dfs', '5']:
                list_cities(graph)
                source = input("Enter source city ID: ").strip()
                dest = input("Enter destination city ID: ").strip()
                
                if source in graph.nodes and dest in graph.nodes:
                    result = dfs(graph, source, dest)
                    print_path_result(result, graph)
                else:
                    print("❌ Invalid city ID!")
            
            elif command in ['compare', '6']:
                list_cities(graph)
                source = input("Enter source city ID: ").strip()
                dest = input("Enter destination city ID: ").strip()
                
                if source in graph.nodes and dest in graph.nodes:
                    compare_algorithms(graph, source, dest)
                else:
                    print("❌ Invalid city ID!")
            
            else:
                print("❌ Unknown command. Type 'help' for available commands.")
        
        except KeyboardInterrupt:
            print("\n\n👋 Goodbye!")
            break
        except Exception as e:
            print(f"❌ Error: {e}")


if __name__ == "__main__":
    main()

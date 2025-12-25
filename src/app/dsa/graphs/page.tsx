"use client";

import Link from "next/link";
import BackButton from "@/components/ui/BackButton";
import { motion } from "framer-motion";
import { Network, Share2, CornerDownRight } from "lucide-react";

const graphImplementations = [
  { 
      name: "Graph Builder", 
      description: "Sandbox to create, edit, and visualize directed/undirected weighted graphs.", 
      icon: <Network className="w-6 h-6" />, 
      href: "/dsa/graphs/builder" 
  },
  { 
      name: "Breadth-First Search (BFS)", 
      description: "Level-order traversal useful for finding shortest paths in unweighted graphs.", 
      icon: <Share2 className="w-6 h-6" />, 
      href: "/dsa/graphs/bfs" 
  },
  { 
      name: "Depth-First Search (DFS)", 
      description: "Depth-first traversal useful for path finding, cycle detection, and topological sorting.", 
      icon: <CornerDownRight className="w-6 h-6" />, 
      href: "/dsa/graphs/dfs" 
  },

  { 
      name: "Topological Sort", 
      description: "Linear ordering of vertices in a DAG where for every edge u->v, u comes before v.", 
      icon: <Network className="w-6 h-6" />, 
      href: "/dsa/graphs/topological-sort" 
  },
  { 
      name: "Minimum Spanning Tree", 
      description: "Finds the subset of edges calculating the minimum total weight to connect all vertices (Prim's & Kruskal's).", 
      icon: <Network className="w-6 h-6" />, 
      href: "/dsa/graphs/mst" 
  },
  { 
      name: "Bellman-Ford Algorithm", 
      description: "Computes shortest paths from a single source node to all other nodes, accommodating negative edge weights.", 
      icon: <Network className="w-6 h-6" />, 
      href: "/dsa/graphs/bellman-ford" 
  },
  { 
      name: "Dijkstra's Algorithm", 
      description: "Finds the shortest path between nodes in a graph with non-negative edge weights.", 
      icon: <Network className="w-6 h-6" />, 
      href: "/dsa/graphs/dijkstra" 
  },
  { 
      name: "Union Find (Disjoint Set)", 
      description: "Data structure for tracking set elements partitioned into disjoint subsets.", 
      icon: <Network className="w-6 h-6" />, 
      href: "/dsa/graphs/union-find" 
  },
  { 
      name: "Floyd-Warshall Algorithm", 
      description: "All-Pairs Shortest Path algorithm for finding shortest paths in a weighted graph.", 
      icon: <Network className="w-6 h-6" />, 
      href: "/dsa/graphs/floyd-warshall" 
  },
  { 
      name: "Strongly Connected Components", 
      description: "Find sets of vertices in a directed graph where every vertex is reachable from every other vertex (Kosaraju's).", 
      icon: <Network className="w-6 h-6" />, 
      href: "/dsa/graphs/scc" 
  },
];

export default function GraphsDashboard() {
  return (
    <div className="min-h-screen px-4 py-12">
      <div className="max-w-7xl mx-auto">
        <BackButton href="/dsa" />
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <h1 className="text-4xl font-bold tracking-tight text-foreground mb-4">
            Graph Algorithms
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
             Explore nodes, edges, DFS, BFS, and shortest paths.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Graph impls defined in chunks above */}
          {graphImplementations.map((impl, index) => (
            <motion.div
              key={impl.name}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2, delay: index * 0.1 }}
            >
              <Link href={impl.href}>
                <div className="group h-full p-6 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-background hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors cursor-pointer">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-2 rounded-md bg-zinc-100 dark:bg-zinc-800 text-foreground group-hover:bg-zinc-200 dark:group-hover:bg-zinc-700 transition">
                      {impl.icon}
                    </div>
                    <h2 className="text-xl font-semibold text-foreground group-hover:underline decoration-zinc-400 underline-offset-4 decoration-2">
                      {impl.name}
                    </h2>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    {impl.description}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

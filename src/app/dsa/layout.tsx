"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";
import { 
  Layers, 
  GitBranch, 
  Database, 
  Server, 
  Trees, 
  Network, 
  Hash, 
  Cpu, 
  Type, 
  Binary, 
  Share2, 
  RefreshCcw,
  ChevronRight,
  ChevronLeft
} from "lucide-react";
import { useState } from "react";

const sidebarItems = [
  { name: "Arrays", icon: <Layers className="w-4 h-4" />, href: "/dsa/arrays" },
  { name: "Linked Lists", icon: <GitBranch className="w-4 h-4" />, href: "/dsa/linked-lists" },
  { name: "Stacks", icon: <Database className="w-4 h-4" />, href: "/dsa/stacks" },
  { name: "Queues", icon: <Server className="w-4 h-4" />, href: "/dsa/queues" },
  { name: "Trees", icon: <Trees className="w-4 h-4" />, href: "/dsa/trees" },
  { name: "Graphs", icon: <Network className="w-4 h-4" />, href: "/dsa/graphs" },
  { name: "Hashing", icon: <Hash className="w-4 h-4" />, href: "/dsa/hashing" },
  { name: "DP", icon: <Cpu className="w-4 h-4" />, href: "/dsa/dynamic-programming" },
  { name: "Strings", icon: <Type className="w-4 h-4" />, href: "/dsa/strings" },
  { name: "Greedy", icon: <Share2 className="w-4 h-4" />, href: "/dsa/greedy" },
  { name: "Backtracking", icon: <RefreshCcw className="w-4 h-4" />, href: "/dsa/backtracking" },
  { name: "Bit Mani.", icon: <Binary className="w-4 h-4" />, href: "/dsa/bit-manipulation" },
];

export default function DsaLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      {/* Sidebar - Desktop */}
      <aside 
        className={clsx(
          "hidden md:block sticky top-16 h-[calc(100vh-4rem)] border-r border-zinc-200 dark:border-zinc-800 overflow-y-auto transition-all duration-300 bg-background",
          isSidebarOpen ? "w-64" : "w-16"
        )}
      >
        <div className="p-3 space-y-1">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="w-full flex items-center justify-end p-2 mb-2 text-muted-foreground hover:text-foreground transition-colors"
          >
             {isSidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4 mx-auto" />}
          </button>
          
          <div className="space-y-0.5">
            {sidebarItems.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={clsx(
                    "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    isActive 
                      ? "bg-zinc-100 dark:bg-zinc-800 text-foreground" 
                      : "text-muted-foreground hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-foreground"
                  )}
                >
                  <div>
                    {item.icon}
                  </div>
                  {isSidebarOpen && <span>{item.name}</span>}
                </Link>
              );
            })}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-x-hidden p-6 bg-background">
        {children}
      </main>
    </div>
  );
}

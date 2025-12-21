"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

const navItems = [
  { name: 'Home', path: '/' },
  { name: 'DSA Explorer', path: '/dsa' },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-black/50 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center gap-2 group">
               <div className="w-8 h-8 flex items-center justify-center bg-black dark:bg-white text-white dark:text-black rounded-lg font-bold text-lg transition-transform group-hover:rotate-12">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="transform scale-90">
                    <path d="M12 2L2 22H22L12 2Z" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
                  </svg>
               </div>
               <span className="font-bold text-lg tracking-tight text-zinc-900 dark:text-zinc-100">
                 AlgoViz
               </span>
            </Link>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center space-x-6">
              {navItems.map((item) => {
                const isActive = pathname === item.path;
                return (
                  <Link
                    key={item.name}
                    href={item.path}
                    className={clsx(
                      "text-sm font-medium transition-colors hover:text-foreground/80",
                       isActive ? "text-foreground" : "text-muted-foreground"
                    )}
                  >
                     {item.name}
                  </Link>
                );
              })}
            </div>
            <div className="w-px h-6 bg-zinc-200 dark:bg-zinc-800" />
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
}

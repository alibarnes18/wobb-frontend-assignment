import type { ReactNode } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { ListSidebar } from "./ListSidebar";
import { useListStore } from "@/store/useListStore";
import { Sparkles, FolderHeart } from "lucide-react";

interface LayoutProps {
  children: ReactNode;
  title?: string;
}

export function Layout({ children, title }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const selectedCount = useListStore((state) => state.selectedProfiles.length);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans antialiased selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link 
            to="/" 
            className="flex items-center gap-2.5 group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-zinc-100 to-zinc-400">
              Wobb<span className="text-indigo-400 font-medium">Vibe</span>
            </span>
          </Link>

          {/* Campaign Drawer Toggle */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="relative flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 hover:border-zinc-700 text-zinc-200 hover:text-zinc-100 font-medium text-sm transition-all hover:shadow-lg shadow-indigo-500/5 cursor-pointer"
          >
            <FolderHeart className="w-4 h-4 text-indigo-400" />
            <span>My Campaign</span>
            {selectedCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-500 text-[10px] font-bold text-white ring-2 ring-zinc-950 animate-pulse">
                {selectedCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8 flex flex-col">
        {title && (
          <div className="mb-8 text-left">
            <h1 className="text-3xl font-extrabold tracking-tight text-zinc-100 sm:text-4xl mb-2">
              {title}
            </h1>
          </div>
        )}
        <div className="flex-1 w-full">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-900 bg-zinc-950 py-6 text-center text-xs text-zinc-600">
        <p>© 2026 Wobb Vibe. All rights reserved.</p>
      </footer>

      {/* Drawer Sidebar */}
      <ListSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </div>
  );
}

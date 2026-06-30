import type { Platform } from "@/types";
import { PLATFORMS, getPlatformLabel } from "@/utils/dataHelpers";
import { SearchBar } from "./SearchBar";
import { Instagram, Youtube, Play } from "lucide-react";

interface PlatformFilterProps {
  selected: Platform;
  onChange: (platform: Platform) => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export function PlatformFilter({
  selected,
  onChange,
  searchQuery,
  onSearchChange,
}: PlatformFilterProps) {
  const getPlatformIcon = (platform: Platform) => {
    switch (platform) {
      case "instagram":
        return <Instagram className="w-4 h-4" />;
      case "youtube":
        return <Youtube className="w-4 h-4" />;
      case "tiktok":
        return <Play className="w-4 h-4 fill-current" />;
      default:
        return null;
    }
  };

  const getPlatformStyles = (platform: Platform, isActive: boolean) => {
    if (!isActive) {
      return "bg-zinc-900/50 hover:bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200";
    }

    switch (platform) {
      case "instagram":
        return "bg-gradient-to-r from-pink-600 to-purple-600 border-pink-500/30 text-white shadow-lg shadow-pink-500/10";
      case "youtube":
        return "bg-gradient-to-r from-red-600 to-rose-600 border-red-500/30 text-white shadow-lg shadow-red-500/10";
      case "tiktok":
        return "bg-gradient-to-r from-cyan-650 to-indigo-650 border-cyan-500/30 text-white shadow-lg shadow-cyan-500/10";
      default:
        return "bg-indigo-600 border-indigo-500 text-white";
    }
  };

  return (
    <div className="space-y-6">
      {/* Platform Tabs */}
      <div className="flex justify-center gap-3">
        {PLATFORMS.map((p) => {
          const isActive = selected === p;
          return (
            <button
              key={p}
              type="button"
              onClick={() => onChange(p)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl border text-sm font-semibold transition-all duration-250 cursor-pointer hover:scale-[1.02] active:scale-[0.98] ${getPlatformStyles(
                p,
                isActive
              )}`}
            >
              {getPlatformIcon(p)}
              <span>{getPlatformLabel(p)}</span>
            </button>
          );
        })}
      </div>

      {/* Search Input */}
      <div className="pt-2">
        <SearchBar 
          value={searchQuery} 
          onChange={onSearchChange} 
          placeholder={`Search ${getPlatformLabel(selected)} creators...`}
        />
      </div>
    </div>
  );
}

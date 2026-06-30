import { useState, useMemo } from "react";
import type { Platform } from "@/types";
import { Layout } from "@/components/Layout";
import { PlatformFilter } from "@/components/PlatformFilter";
import { ProfileList } from "@/components/ProfileList";
import { extractProfiles, filterProfiles } from "@/utils/dataHelpers";
import { SlidersHorizontal } from "lucide-react";
import { formatFollowers, formatEngagementRate } from "@/utils/formatters";

type SortOption = "followers-desc" | "followers-asc" | "engagement-desc" | "name-asc";

export function SearchPage() {
  const [platform, setPlatform] = useState<Platform>("instagram");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("followers-desc");

  const allProfiles = useMemo(() => extractProfiles(platform), [platform]);
  
  const filteredAndSorted = useMemo(() => {
    const filtered = filterProfiles(allProfiles, searchQuery);
    
    // Sort
    return [...filtered].sort((a, b) => {
      if (sortBy === "followers-desc") {
        return b.followers - a.followers;
      }
      if (sortBy === "followers-asc") {
        return a.followers - b.followers;
      }
      if (sortBy === "engagement-desc") {
        return (b.engagement_rate || 0) - (a.engagement_rate || 0);
      }
      if (sortBy === "name-asc") {
        return a.fullname.localeCompare(b.fullname);
      }
      return 0;
    });
  }, [allProfiles, searchQuery, sortBy]);

  // Platform statistics
  const platformStats = useMemo(() => {
    if (allProfiles.length === 0) return { avgFollowers: 0, avgEngagement: 0 };
    const totalFollowers = allProfiles.reduce((sum, p) => sum + p.followers, 0);
    const totalEngagement = allProfiles.reduce((sum, p) => sum + (p.engagement_rate || 0), 0);
    return {
      avgFollowers: Math.round(totalFollowers / allProfiles.length),
      avgEngagement: totalEngagement / allProfiles.length
    };
  }, [allProfiles]);

  return (
    <Layout>
      <div className="space-y-8">
        {/* Hero Section */}
        <div className="text-center max-w-2xl mx-auto space-y-3.5">
          <h2 className="text-4xl font-extrabold tracking-tight text-zinc-100 sm:text-5xl">
            Discover Top <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-violet-400">Creators</span>
          </h2>
          <p className="text-zinc-400 text-base max-w-md mx-auto">
            Search and filter through premium influencers to build high-converting marketing campaigns.
          </p>
        </div>

        {/* Filters Card */}
        <div className="p-6 bg-zinc-900/25 border border-zinc-900 rounded-3xl backdrop-blur-md space-y-6">
          <PlatformFilter
            selected={platform}
            onChange={(p) => {
              setPlatform(p);
              setSearchQuery("");
            }}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        </div>

        {/* Platform Overview & Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-zinc-900/10 p-4 rounded-2xl border border-zinc-900 text-left">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-zinc-400">
            <div>
              Showing <span className="font-semibold text-zinc-200">{filteredAndSorted.length}</span> of{" "}
              <span className="font-semibold text-zinc-200">{allProfiles.length}</span> creators
            </div>
            <span className="hidden sm:inline text-zinc-700">•</span>
            <div className="flex items-center gap-1">
              <span className="text-zinc-500">Avg Reach:</span>
              <span className="font-semibold text-zinc-300">{formatFollowers(platformStats.avgFollowers)}</span>
            </div>
            <span className="hidden sm:inline text-zinc-700">•</span>
            <div className="flex items-center gap-1">
              <span className="text-zinc-500">Avg Engagement:</span>
              <span className="font-semibold text-zinc-300">{formatEngagementRate(platformStats.avgEngagement)}</span>
            </div>
          </div>

          {/* Sort Controls */}
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-zinc-500" />
            <span className="text-xs text-zinc-500 font-medium">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="bg-zinc-900 border border-zinc-800 focus:border-indigo-500 text-zinc-300 text-xs rounded-xl py-1.5 px-2.5 outline-none cursor-pointer hover:bg-zinc-850 transition-colors"
            >
              <option value="followers-desc">Followers (High to Low)</option>
              <option value="followers-asc">Followers (Low to High)</option>
              <option value="engagement-desc">Engagement Rate</option>
              <option value="name-asc">Name (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Creator Grid */}
        <div className="min-h-[400px]">
          <ProfileList
            profiles={filteredAndSorted}
            platform={platform}
          />
        </div>
      </div>
    </Layout>
  );
}

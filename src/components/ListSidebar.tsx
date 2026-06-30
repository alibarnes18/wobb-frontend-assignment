import { useListStore } from "@/store/useListStore";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import type { DropResult } from "@hello-pangea/dnd";
import { 
  X, 
  Trash2, 
  Download, 
  Copy, 
  Check, 
  Users, 
  TrendingUp, 
  Instagram, 
  Youtube, 
  Play,
  Sparkles
} from "lucide-react";
import { useState, useMemo } from "react";
import { formatFollowers, formatEngagementRate } from "@/utils/formatters";

interface ListSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ListSidebar({ isOpen, onClose }: ListSidebarProps) {
  const { selectedProfiles, removeProfile, clearList, reorderProfiles } = useListStore();
  const [copied, setCopied] = useState(false);

  const stats = useMemo(() => {
    if (selectedProfiles.length === 0) {
      return { totalReach: 0, avgEngagement: 0, platforms: { instagram: 0, youtube: 0, tiktok: 0 } };
    }

    const totalReach = selectedProfiles.reduce((sum, p) => sum + (p.followers || 0), 0);
    
    // Average engagement rate
    const profilesWithEngagement = selectedProfiles.filter(p => p.engagement_rate !== undefined);
    const avgEngagement = profilesWithEngagement.length > 0
      ? profilesWithEngagement.reduce((sum, p) => sum + (p.engagement_rate || 0), 0) / profilesWithEngagement.length
      : 0;

    // Platform counts
    const platforms = selectedProfiles.reduce(
      (acc, p) => {
        if (p.platform === "instagram" || p.platform === "youtube" || p.platform === "tiktok") {
          acc[p.platform] = (acc[p.platform] || 0) + 1;
        }
        return acc;
      },
      { instagram: 0, youtube: 0, tiktok: 0 }
    );

    return { totalReach, avgEngagement, platforms };
  }, [selectedProfiles]);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    reorderProfiles(result.source.index, result.destination.index);
  };

  const copyToClipboard = () => {
    if (selectedProfiles.length === 0) return;
    
    const text = selectedProfiles
      .map((p, index) => `${index + 1}. @${p.username} (${p.platform.toUpperCase()}) - Followers: ${formatFollowers(p.followers)} | Engagement: ${formatEngagementRate(p.engagement_rate)}`)
      .join("\n");

    navigator.clipboard.writeText(
      `Influencer Campaign List\n-----------------------\nTotal Creators: ${selectedProfiles.length}\nTotal Reach: ${formatFollowers(stats.totalReach)}\nAvg Engagement: ${formatEngagementRate(stats.avgEngagement)}\n\nCreators:\n${text}`
    );
    
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadJSON = () => {
    if (selectedProfiles.length === 0) return;
    
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(selectedProfiles, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `influencer_campaign_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "instagram":
        return <Instagram className="w-4 h-4 text-pink-500" />;
      case "youtube":
        return <Youtube className="w-4 h-4 text-red-500" />;
      case "tiktok":
        return <Play className="w-4 h-4 text-cyan-400 fill-current" />;
      default:
        return null;
    }
  };

  return (
    <div
      className={`fixed inset-y-0 right-0 z-50 w-full sm:w-96 bg-zinc-950/95 border-l border-zinc-800 shadow-2xl backdrop-blur-xl flex flex-col transform transition-transform duration-300 ease-out ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      {/* Header */}
      <div className="p-4 border-b border-zinc-850 flex items-center justify-between bg-zinc-900/40">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-indigo-400" />
          <h3 className="font-semibold text-zinc-100 text-lg">Campaign Builder</h3>
          <span className="bg-indigo-500/20 text-indigo-300 text-xs px-2 py-0.5 rounded-full font-mono">
            {selectedProfiles.length}
          </span>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Content Area */}
      {selectedProfiles.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-zinc-500">
          <div className="w-16 h-16 rounded-full bg-zinc-900/60 flex items-center justify-center border border-zinc-800 mb-4">
            <Users className="w-8 h-8 text-zinc-600" />
          </div>
          <p className="font-medium text-zinc-400 mb-1">Your campaign list is empty</p>
          <p className="text-xs text-zinc-500 max-w-xs">
            Browse creators and click "Add to List" to build your influencer campaign.
          </p>
        </div>
      ) : (
        <>
          {/* Stats Overview */}
          <div className="p-4 bg-zinc-900/20 border-b border-zinc-900 grid grid-cols-2 gap-3">
            <div className="bg-zinc-900/50 p-3 rounded-xl border border-zinc-850/50 flex flex-col">
              <span className="text-zinc-500 text-xs flex items-center gap-1.5 mb-1">
                <Users className="w-3.5 h-3.5 text-indigo-400" /> Total Reach
              </span>
              <span className="text-lg font-bold text-zinc-100 font-mono">
                {formatFollowers(stats.totalReach)}
              </span>
            </div>
            <div className="bg-zinc-900/50 p-3 rounded-xl border border-zinc-850/50 flex flex-col">
              <span className="text-zinc-500 text-xs flex items-center gap-1.5 mb-1">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400" /> Avg Engagement
              </span>
              <span className="text-lg font-bold text-zinc-100 font-mono">
                {formatEngagementRate(stats.avgEngagement)}
              </span>
            </div>
            
            {/* Platform Breakdown */}
            <div className="col-span-2 bg-zinc-900/30 px-3 py-2 rounded-lg flex items-center justify-between text-xs text-zinc-400 border border-zinc-900">
              <span className="text-[11px] uppercase tracking-wider text-zinc-500 font-medium">Platforms:</span>
              <div className="flex gap-3">
                {stats.platforms.instagram > 0 && (
                  <span className="flex items-center gap-1">
                    <Instagram className="w-3 h-3 text-pink-500" /> {stats.platforms.instagram}
                  </span>
                )}
                {stats.platforms.youtube > 0 && (
                  <span className="flex items-center gap-1">
                    <Youtube className="w-3 h-3 text-red-500" /> {stats.platforms.youtube}
                  </span>
                )}
                {stats.platforms.tiktok > 0 && (
                  <span className="flex items-center gap-1">
                    <Play className="w-3 h-3 text-cyan-400 fill-current" /> {stats.platforms.tiktok}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Drag & Drop List */}
          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
            <p className="text-[11px] text-zinc-500 mb-3 uppercase tracking-wider font-medium">
              Drag to prioritize list
            </p>
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="campaign-list">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="space-y-2.5"
                  >
                    {selectedProfiles.map((profile, index) => (
                      <Draggable
                        key={profile.user_id}
                        draggableId={profile.user_id}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`flex items-center gap-3 p-2.5 bg-zinc-900/80 hover:bg-zinc-850 border rounded-xl transition-all ${
                              snapshot.isDragging
                                ? "border-indigo-500 shadow-xl bg-zinc-800"
                                : "border-zinc-800/80"
                            }`}
                          >
                            <img
                              src={profile.picture}
                              alt={profile.fullname}
                              className="w-10 h-10 rounded-full object-cover border border-zinc-700/50"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span className="font-semibold text-zinc-200 text-sm truncate">
                                  {profile.fullname}
                                </span>
                                {getPlatformIcon(profile.platform)}
                              </div>
                              <div className="flex items-center gap-2 text-xs text-zinc-400 mt-0.5">
                                <span>@{profile.username}</span>
                                <span className="text-zinc-600">•</span>
                                <span className="font-mono text-zinc-300">{formatFollowers(profile.followers)}</span>
                              </div>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                removeProfile(profile.user_id);
                              }}
                              className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-500 hover:text-red-400 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>

          {/* Footer Actions */}
          <div className="p-4 border-t border-zinc-850 bg-zinc-900/40 space-y-2">
            <div className="flex gap-2">
              <button
                onClick={copyToClipboard}
                className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-zinc-800 hover:bg-zinc-750 text-zinc-200 hover:text-zinc-100 font-medium text-sm rounded-xl border border-zinc-700 transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy Summary</span>
                  </>
                )}
              </button>
              <button
                onClick={downloadJSON}
                className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-zinc-800 hover:bg-zinc-750 text-zinc-200 hover:text-zinc-100 font-medium text-sm rounded-xl border border-zinc-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Export JSON</span>
              </button>
            </div>
            <button
              onClick={clearList}
              className="w-full py-2 text-center text-xs text-zinc-500 hover:text-red-400 hover:bg-red-500/5 rounded-lg transition-colors"
            >
              Clear Campaign List
            </button>
          </div>
        </>
      )}
    </div>
  );
}

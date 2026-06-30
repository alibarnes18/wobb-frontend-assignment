import { useNavigate } from "react-router-dom";
import type { Platform, UserProfileSummary } from "@/types";
import { VerifiedBadge } from "./VerifiedBadge";
import { useListStore } from "@/store/useListStore";
import { Plus, Check, Trash2, Instagram, Youtube, Play } from "lucide-react";
import { formatFollowers, formatEngagementRate } from "@/utils/formatters";

interface ProfileCardProps {
  profile: UserProfileSummary;
  platform: Platform;
}

export function ProfileCard({ profile, platform }: ProfileCardProps) {
  const navigate = useNavigate();
  const { addProfile, removeProfile, isProfileSelected } = useListStore();
  const isSelected = isProfileSelected(profile.user_id);

  const handleClick = () => {
    navigate(`/profile/${profile.username}?platform=${platform}`);
  };

  const handleListToggle = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent navigating to detail page
    if (isSelected) {
      removeProfile(profile.user_id);
    } else {
      addProfile(profile, platform);
    }
  };

  const getPlatformIcon = () => {
    switch (platform) {
      case "instagram":
        return <Instagram className="w-3.5 h-3.5 text-pink-500" />;
      case "youtube":
        return <Youtube className="w-3.5 h-3.5 text-red-500" />;
      case "tiktok":
        return <Play className="w-3.5 h-3.5 text-cyan-400 fill-current" />;
      default:
        return null;
    }
  };

  return (
    <div
      onClick={handleClick}
      className="group relative flex flex-col justify-between p-5 bg-zinc-900/40 hover:bg-zinc-900/80 border border-zinc-900 hover:border-zinc-800 rounded-3xl cursor-pointer transition-all duration-300 hover:-translate-y-1 shadow-md hover:shadow-xl"
    >
      {/* Platform Badge */}
      <div className="absolute top-4 right-4 bg-zinc-950/80 p-2 rounded-xl border border-zinc-800/85 flex items-center justify-center">
        {getPlatformIcon()}
      </div>

      <div>
        {/* Profile Info */}
        <div className="flex items-center gap-3.5 mb-4">
          <img
            src={profile.picture}
            alt={profile.fullname}
            className="w-14 h-14 rounded-full object-cover border-2 border-zinc-800 group-hover:border-zinc-700 transition-colors"
          />
          <div className="text-left min-w-0">
            <h3 className="font-bold text-zinc-100 flex items-center text-base truncate">
              @{profile.username}
              <VerifiedBadge verified={profile.is_verified} />
            </h3>
            <p className="text-xs text-zinc-400 truncate mt-0.5">{profile.fullname}</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-2.5 mb-5 text-left">
          <div className="bg-zinc-950/50 p-2.5 rounded-xl border border-zinc-900">
            <span className="text-[10px] text-zinc-500 block font-medium uppercase tracking-wider">Followers</span>
            <span className="font-semibold font-mono text-zinc-200 text-sm">
              {formatFollowers(profile.followers)}
            </span>
          </div>
          <div className="bg-zinc-950/50 p-2.5 rounded-xl border border-zinc-900">
            <span className="text-[10px] text-zinc-500 block font-medium uppercase tracking-wider">Engagement</span>
            <span className="font-semibold font-mono text-zinc-200 text-sm">
              {formatEngagementRate(profile.engagement_rate)}
            </span>
          </div>
        </div>
      </div>

      {/* Toggle Button */}
      <button
        onClick={handleListToggle}
        className={`w-full py-2.5 px-4 rounded-xl font-medium text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
          isSelected
            ? "bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 group/btn"
            : "bg-zinc-100 hover:bg-white text-zinc-950 hover:scale-[1.01] active:scale-[0.99]"
        }`}
      >
        {isSelected ? (
          <>
            <span className="group-hover/btn:hidden flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5" /> Added
            </span>
            <span className="hidden group-hover/btn:flex items-center gap-1.5">
              <Trash2 className="w-3.5 h-3.5" /> Remove
            </span>
          </>
        ) : (
          <>
            <Plus className="w-3.5 h-3.5" /> Add to List
          </>
        )}
      </button>
    </div>
  );
}

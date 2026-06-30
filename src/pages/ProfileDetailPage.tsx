import { useEffect, useState, useMemo } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { VerifiedBadge } from "@/components/VerifiedBadge";
import type { FullUserProfile, ProfileDetailResponse, Platform } from "@/types";
import { formatEngagementRate, formatFollowers } from "@/utils/formatters";
import { loadProfileByUsername } from "@/utils/profileLoader";
import { useListStore } from "@/store/useListStore";
import { 
  ArrowLeft, 
  Plus, 
  Check, 
  Trash2, 
  Instagram, 
  Youtube, 
  Play, 
  ExternalLink,
  Users,
  Flame,
  FileText,
  Heart,
  MessageSquare,
  Eye,
  Hash,
  AtSign,
  TrendingUp,
  Tag
} from "lucide-react";

export function ProfileDetailPage() {
  const { username } = useParams<{ username: string }>();
  const [searchParams] = useSearchParams();
  const platform = (searchParams.get("platform") || "instagram") as Platform;
  const [profileData, setProfileData] = useState<ProfileDetailResponse | null>(
    null
  );
  const [loaded, setLoaded] = useState(false);

  const { addProfile, removeProfile, isProfileSelected } = useListStore();

  useEffect(() => {
    if (!username) return;
    let active = true;

    loadProfileByUsername(username).then((data) => {
      if (active) {
        setProfileData(data);
        setLoaded(true);
      }
    });

    return () => {
      active = false;
      setProfileData(null);
      setLoaded(false);
    };
  }, [username]);

  const user: FullUserProfile | undefined = profileData?.data?.user_profile;
  const isSelected = useMemo(() => {
    if (!user) return false;
    return isProfileSelected(user.user_id);
  }, [user, isProfileSelected]);

  const handleListToggle = () => {
    if (!user) return;
    if (isSelected) {
      removeProfile(user.user_id);
    } else {
      addProfile(user, platform);
    }
  };

  const getPlatformIcon = (p: Platform) => {
    switch (p) {
      case "instagram":
        return <Instagram className="w-5 h-5 text-pink-500" />;
      case "youtube":
        return <Youtube className="w-5 h-5 text-red-500" />;
      case "tiktok":
        return <Play className="w-5 h-5 text-cyan-400 fill-current" />;
      default:
        return null;
    }
  };

  if (!username) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-red-500 font-medium mb-4">Invalid profile username</p>
          <Link to="/" className="text-indigo-400 hover:underline">
            Back to Search
          </Link>
        </div>
      </Layout>
    );
  }

  if (!loaded) {
    return (
      <Layout>
        <div className="flex-1 flex flex-col items-center justify-center py-24">
          <div className="w-12 h-12 rounded-full border-4 border-zinc-800 border-t-indigo-500 animate-spin mb-4"></div>
          <p className="text-zinc-500 text-sm">Loading creator analytics...</p>
        </div>
      </Layout>
    );
  }

  if (!profileData || !user) {
    return (
      <Layout>
        <div className="text-center py-12 max-w-md mx-auto space-y-4">
          <div className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center mx-auto">
            <XIcon className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-zinc-200">Failed to load profile</h3>
          <p className="text-sm text-zinc-500">
            We couldn't find detailed analytics for <span className="text-zinc-300">@{username}</span>.
          </p>
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 py-2 px-4 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 rounded-xl text-sm text-zinc-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to search
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8 text-left max-w-4xl mx-auto">
        {/* Back Link */}
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-200 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to search
        </Link>

        {/* Creator Header Card */}
        <div className="p-6 sm:p-8 bg-zinc-900/40 border border-zinc-900 rounded-3xl backdrop-blur-md flex flex-col md:flex-row gap-6 items-start justify-between">
          <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center">
            <img
              src={user.picture}
              alt={user.fullname}
              className="w-24 h-24 rounded-full object-cover border-4 border-zinc-800"
            />
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold text-zinc-100">
                  {user.fullname}
                </h2>
                <VerifiedBadge verified={user.is_verified} />
              </div>
              <div className="flex items-center gap-2 text-zinc-400 text-sm">
                <span>@{user.username}</span>
                <span>•</span>
                <span className="flex items-center gap-1 bg-zinc-950/60 py-0.5 px-2 rounded-lg border border-zinc-800 text-xs">
                  {getPlatformIcon(platform)}
                  <span className="capitalize">{platform}</span>
                </span>
              </div>
              {user.description && (
                <p className="text-sm text-zinc-300 max-w-xl leading-relaxed pt-1">
                  {user.description}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-3 w-full md:w-auto pt-4 md:pt-0">
            {user.url && (
              <a
                href={user.url}
                target="_blank"
                rel="noreferrer"
                className="flex-1 md:flex-initial flex items-center justify-center gap-2 py-2.5 px-4 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 hover:border-zinc-700 text-zinc-200 hover:text-zinc-100 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
              >
                <span>View on {platform === "youtube" ? "YouTube" : platform === "tiktok" ? "TikTok" : "Instagram"}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
            <button
              onClick={handleListToggle}
              className={`flex-grow md:flex-grow-0 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                isSelected
                  ? "bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 group/btn"
                  : "bg-zinc-100 hover:bg-white text-zinc-950 hover:scale-[1.02] active:scale-[0.98]"
              }`}
            >
              {isSelected ? (
                <>
                  <span className="group-hover/btn:hidden flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5" /> Added to Campaign
                  </span>
                  <span className="hidden group-hover/btn:flex items-center gap-1.5">
                    <Trash2 className="w-3.5 h-3.5" /> Remove from Campaign
                  </span>
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5" /> Add to Campaign
                </>
              )}
            </button>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-zinc-900/20 border border-zinc-900 p-5 rounded-2xl">
            <span className="text-zinc-500 text-xs flex items-center gap-1.5 mb-2 uppercase tracking-wider font-medium">
              <Users className="w-4 h-4 text-indigo-400" /> Followers
            </span>
            <span className="text-2xl font-bold text-zinc-100 font-mono">
              {formatFollowers(user.followers)}
            </span>
          </div>

          <div className="bg-zinc-900/20 border border-zinc-900 p-5 rounded-2xl">
            <span className="text-zinc-500 text-xs flex items-center gap-1.5 mb-2 uppercase tracking-wider font-medium">
              <Flame className="w-4 h-4 text-emerald-400" /> Engagement Rate
            </span>
            <span className="text-2xl font-bold text-zinc-100 font-mono">
              {formatEngagementRate(user.engagement_rate)}
            </span>
          </div>

          <div className="bg-zinc-900/20 border border-zinc-900 p-5 rounded-2xl">
            <span className="text-zinc-500 text-xs flex items-center gap-1.5 mb-2 uppercase tracking-wider font-medium">
              <TrendingUp className="w-4 h-4 text-amber-400" /> Engagements
            </span>
            <span className="text-2xl font-bold text-zinc-100 font-mono">
              {user.engagements !== undefined ? formatFollowers(user.engagements) : "N/A"}
            </span>
          </div>

          <div className="bg-zinc-900/20 border border-zinc-900 p-5 rounded-2xl">
            <span className="text-zinc-500 text-xs flex items-center gap-1.5 mb-2 uppercase tracking-wider font-medium">
              <FileText className="w-4 h-4 text-blue-400" /> Total Posts
            </span>
            <span className="text-2xl font-bold text-zinc-100 font-mono">
              {user.posts_count !== undefined ? user.posts_count.toLocaleString() : "N/A"}
            </span>
          </div>
        </div>

        {/* Detailed Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Averages & Performance */}
          <div className="p-6 bg-zinc-900/10 border border-zinc-900 rounded-3xl space-y-4">
            <h3 className="font-bold text-zinc-200 text-base border-b border-zinc-900 pb-3">Performance Metrics</h3>
            <div className="space-y-3.5">
              {user.avg_likes !== undefined && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-zinc-500 flex items-center gap-1.5"><Heart className="w-4 h-4 text-pink-500/70" /> Avg Likes</span>
                  <span className="font-semibold text-zinc-300 font-mono">{formatFollowers(user.avg_likes)}</span>
                </div>
              )}
              {user.avg_comments !== undefined && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-zinc-500 flex items-center gap-1.5"><MessageSquare className="w-4 h-4 text-purple-500/70" /> Avg Comments</span>
                  <span className="font-semibold text-zinc-300 font-mono">{user.avg_comments.toLocaleString()}</span>
                </div>
              )}
              {user.avg_views !== undefined && user.avg_views > 0 && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-zinc-500 flex items-center gap-1.5"><Eye className="w-4 h-4 text-cyan-550/70" /> Avg Views</span>
                  <span className="font-semibold text-zinc-300 font-mono">{formatFollowers(user.avg_views)}</span>
                </div>
              )}
              {user.avg_reels_plays !== undefined && user.avg_reels_plays > 0 && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-zinc-500 flex items-center gap-1.5"><Play className="w-4 h-4 text-indigo-500/70" /> Avg Reels Plays</span>
                  <span className="font-semibold text-zinc-300 font-mono">{formatFollowers(user.avg_reels_plays)}</span>
                </div>
              )}
              {user.gender && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-zinc-500">Demographic Gender</span>
                  <span className="font-semibold text-zinc-300 capitalize">{user.gender.toLowerCase()}</span>
                </div>
              )}
              {user.age_group && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-zinc-500">Target Age Group</span>
                  <span className="font-semibold text-zinc-300">{user.age_group}</span>
                </div>
              )}
            </div>
          </div>

          {/* Hashtags, Mentions, Interests (from JSON) */}
          <div className="p-6 bg-zinc-900/10 border border-zinc-900 rounded-3xl space-y-5">
            <h3 className="font-bold text-zinc-200 text-base border-b border-zinc-900 pb-3">Creator DNA</h3>
            
            {/* Top Hashtags */}
            {user.top_hashtags && user.top_hashtags.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs text-zinc-500 flex items-center gap-1 uppercase font-semibold"><Hash className="w-3.5 h-3.5 text-indigo-400" /> Top Hashtags</span>
                <div className="flex flex-wrap gap-1.5">
                  {user.top_hashtags.slice(0, 6).map((item) => (
                    <span key={item.tag} className="text-xs bg-zinc-900/65 text-zinc-300 border border-zinc-800/80 px-2.5 py-1 rounded-lg font-mono">
                      #{item.tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Top Mentions */}
            {user.top_mentions && user.top_mentions.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs text-zinc-500 flex items-center gap-1 uppercase font-semibold"><AtSign className="w-3.5 h-3.5 text-pink-400" /> Top Mentions</span>
                <div className="flex flex-wrap gap-1.5">
                  {user.top_mentions.slice(0, 6).map((item) => (
                    <span key={item.tag} className="text-xs bg-zinc-900/65 text-zinc-300 border border-zinc-800/80 px-2.5 py-1 rounded-lg font-mono">
                      @{item.tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Interests */}
            {user.interests && user.interests.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs text-zinc-500 flex items-center gap-1 uppercase font-semibold"><Tag className="w-3.5 h-3.5 text-emerald-400" /> Interests</span>
                <div className="flex flex-wrap gap-1.5">
                  {user.interests.map((item) => (
                    <span key={item.id} className="text-xs bg-emerald-500/5 text-emerald-355 border border-emerald-500/10 px-2.5 py-1 rounded-lg font-medium">
                      {item.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Similar Creators */}
        {user.similar_users && user.similar_users.length > 0 && (
          <div className="p-6 bg-zinc-900/10 border border-zinc-900 rounded-3xl space-y-4">
            <h3 className="font-bold text-zinc-200 text-base border-b border-zinc-900 pb-3 flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-400" /> Similar Creators
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {user.similar_users.slice(0, 3).map((sim) => (
                <Link
                  key={sim.user_id}
                  to={`/profile/${sim.username}?platform=${platform}`}
                  className="flex items-center gap-3 p-3 bg-zinc-955/50 hover:bg-zinc-900 border border-zinc-900 hover:border-zinc-800 rounded-2xl transition-all"
                >
                  <img
                    src={sim.picture}
                    alt={sim.fullname}
                    className="w-11 h-11 rounded-full object-cover border border-zinc-800"
                  />
                  <div className="min-w-0 text-left">
                    <span className="font-semibold text-zinc-200 text-sm truncate flex items-center gap-0.5">
                      {sim.fullname}
                      <VerifiedBadge verified={sim.is_verified} />
                    </span>
                    <span className="text-zinc-500 text-xs truncate block">@{sim.username}</span>
                    <span className="text-zinc-450 text-[11px] font-mono block mt-0.5">{formatFollowers(sim.followers)}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

function XIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  );
}

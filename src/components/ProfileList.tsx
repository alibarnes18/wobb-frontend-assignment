import type { Platform, UserProfileSummary } from "@/types";
import { ProfileCard } from "./ProfileCard";
import { Search } from "lucide-react";

interface ProfileListProps {
  profiles: UserProfileSummary[];
  platform: Platform;
}

export function ProfileList({
  profiles,
  platform,
}: ProfileListProps) {
  if (profiles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
        <div className="w-14 h-14 rounded-full bg-zinc-900 flex items-center justify-center border border-zinc-800 text-zinc-500 mb-4">
          <Search className="w-6 h-6" />
        </div>
        <h3 className="font-semibold text-zinc-300 text-base mb-1">No creators found</h3>
        <p className="text-sm text-zinc-500 max-w-xs">
          We couldn't find any creators matching your search query. Try adjusting your terms.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {profiles.map((profile) => (
        <ProfileCard
          key={profile.user_id}
          profile={profile}
          platform={platform}
        />
      ))}
    </div>
  );
}

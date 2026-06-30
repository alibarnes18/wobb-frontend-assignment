export type Platform = "instagram" | "youtube" | "tiktok";

export interface UserProfileSummary {
  user_id: string;
  username: string;
  url: string;
  picture: string;
  fullname: string;
  is_verified: boolean;
  followers: number;
  engagements?: number;
  engagement_rate?: number;
  handle?: string;
  avg_views?: number;
}

export interface SearchAccount {
  account: {
    user_profile: UserProfileSummary;
    audience_source: string;
  };
}

export interface SearchData {
  total: number;
  accounts: SearchAccount[];
}

export interface FullUserProfile extends UserProfileSummary {
  type?: string;
  description?: string;
  is_business?: boolean;
  posts_count?: number;
  avg_likes?: number;
  avg_comments?: number;
  avg_reels_plays?: number;
  gender?: string;
  age_group?: string;
  top_hashtags?: { tag: string; weight: number }[];
  top_mentions?: { tag: string; weight: number }[];
  interests?: { id: number; name: string }[];
  similar_users?: (UserProfileSummary & { score?: number })[];
}

export interface ProfileDetailResponse {
  cached?: boolean;
  data: {
    success: boolean;
    user_profile: FullUserProfile;
  };
}

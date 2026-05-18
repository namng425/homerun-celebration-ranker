export type League = "AL" | "NL";
export type Division = "East" | "Central" | "West";
export type MediaType = "gif_url" | "uploaded_gif" | "external_link";
export type MediaStatus = "active" | "needs_review" | "broken" | "archived";

export interface Team {
  id: string;
  name: string;
  city: string;
  nickname: string;
  abbreviation: string;
  league: League;
  division: Division;
}

export interface CelebrationMedia {
  id: string;
  teamId: string;
  title: string;
  description?: string;
  mediaType: MediaType;
  mediaUrl: string;
  thumbnailUrl?: string;
  sourceUrl?: string;
  attribution?: string;
  season?: string;
  isPrimary: boolean;
  status: MediaStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Vote {
  id: string;
  teamId: string;
  voterId: string;
  voterName?: string;
  score: number;
  createdAt: string;
  updatedAt: string;
}

export interface TeamScoreSummary {
  teamId: string;
  averageScore: number | null;
  voteCount: number;
  minScore: number | null;
  maxScore: number | null;
  scoreVariance: number | null;
  rankBest?: number;
  rankWorst?: number;
}

export interface AppState {
  media: CelebrationMedia[];
  votes: Vote[];
}

export interface TeamViewModel extends Team {
  primaryMedia?: CelebrationMedia;
  score: TeamScoreSummary;
}


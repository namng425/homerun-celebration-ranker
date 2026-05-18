import { teams } from "./teams";
import type { AppState, TeamScoreSummary, TeamViewModel, Vote } from "./types";

export function summarizeVotes(votes: Vote[]): Map<string, TeamScoreSummary> {
  const summaries = new Map<string, TeamScoreSummary>();

  for (const team of teams) {
    const teamVotes = votes.filter((vote) => vote.teamId === team.id);
    const scores = teamVotes.map((vote) => vote.score);
    const voteCount = scores.length;
    const averageScore = voteCount ? scores.reduce((sum, score) => sum + score, 0) / voteCount : null;
    const variance =
      averageScore === null ? null : scores.reduce((sum, score) => sum + (score - averageScore) ** 2, 0) / voteCount;

    summaries.set(team.id, {
      teamId: team.id,
      averageScore,
      voteCount,
      minScore: voteCount ? Math.min(...scores) : null,
      maxScore: voteCount ? Math.max(...scores) : null,
      scoreVariance: variance,
    });
  }

  const ratedHigh = [...summaries.values()]
    .filter((summary) => summary.averageScore !== null)
    .sort((a, b) => (b.averageScore ?? 0) - (a.averageScore ?? 0) || b.voteCount - a.voteCount || a.teamId.localeCompare(b.teamId));
  ratedHigh.forEach((summary, index) => {
    summary.rankBest = index + 1;
  });

  const ratedLow = [...summaries.values()]
    .filter((summary) => summary.averageScore !== null)
    .sort((a, b) => (a.averageScore ?? 0) - (b.averageScore ?? 0) || b.voteCount - a.voteCount || a.teamId.localeCompare(b.teamId));
  ratedLow.forEach((summary, index) => {
    summary.rankWorst = index + 1;
  });

  return summaries;
}

export function buildTeamViewModels(state: AppState): TeamViewModel[] {
  const summaries = summarizeVotes(state.votes);
  return teams.map((team) => ({
    ...team,
    primaryMedia:
      state.media.find((media) => media.teamId === team.id && media.isPrimary && media.status === "active") ??
      state.media.find((media) => media.teamId === team.id && media.status === "active"),
    score: summaries.get(team.id) ?? {
      teamId: team.id,
      averageScore: null,
      voteCount: 0,
      minScore: null,
      maxScore: null,
      scoreVariance: null,
    },
  }));
}

export function nowIso() {
  return new Date().toISOString();
}

export function createId(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
}


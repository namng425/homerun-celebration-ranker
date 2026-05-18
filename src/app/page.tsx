"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import type { CelebrationMedia, Division, League, TeamViewModel, Vote } from "@/lib/types";

type ApiState = {
  teams: TeamViewModel[];
  media: CelebrationMedia[];
  votes: Vote[];
  persistence: string;
};

type SortMode = "highest" | "lowest" | "votes" | "team" | "updated";
type MediaFilter = "all" | "has" | "missing";

const anonymousName = "Guest voter";

function getVoter() {
  if (typeof window === "undefined") {
    return { voterId: "", voterName: anonymousName };
  }

  const existingId = window.localStorage.getItem("hcr-voter-id");
  const voterId = existingId ?? `voter-${crypto.randomUUID()}`;
  if (!existingId) {
    window.localStorage.setItem("hcr-voter-id", voterId);
  }

  const voterName = window.localStorage.getItem("hcr-voter-name") ?? anonymousName;
  return { voterId, voterName };
}

function scoreLabel(score: number | null) {
  return score === null ? "Unrated" : score.toFixed(1);
}

function isGifUrl(url: string) {
  return /\.gif($|\?)/i.test(url);
}

function AnimatedMedia({ media, className = "" }: { media?: CelebrationMedia; className?: string }) {
  if (!media) {
    return (
      <div className={`mediaPlaceholder ${className}`}>
        <span>Missing GIF</span>
        <small>Add an animated celebration preview</small>
      </div>
    );
  }

  const alt = `${media.title} animated home run celebration`;
  if (isGifUrl(media.mediaUrl)) {
    // Use a plain img so animated GIF previews keep animating instead of being optimized into static assets.
    // eslint-disable-next-line @next/next/no-img-element
    return <img className={`animatedMedia ${className}`} src={media.mediaUrl} alt={alt} loading="lazy" />;
  }

  return (
    <div className={`mediaPlaceholder ${className}`}>
      <span>External media</span>
      <a href={media.mediaUrl} target="_blank" rel="noreferrer">
        Open celebration link
      </a>
    </div>
  );
}

export default function Home() {
  const [state, setState] = useState<ApiState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [league, setLeague] = useState<League | "all">("all");
  const [division, setDivision] = useState<Division | "all">("all");
  const [mediaFilter, setMediaFilter] = useState<MediaFilter>("all");
  const [sortMode, setSortMode] = useState<SortMode>("highest");
  const [selectedTeam, setSelectedTeam] = useState<TeamViewModel | null>(null);
  const [showContribute, setShowContribute] = useState(false);
  const [{ voterId, voterName }, setVoter] = useState({ voterId: "", voterName: anonymousName });
  const [nameDraft, setNameDraft] = useState(anonymousName);
  const [isSaving, setIsSaving] = useState(false);
  const [mediaDraft, setMediaDraft] = useState({
    teamId: "",
    title: "",
    mediaUrl: "",
    sourceUrl: "",
    attribution: "",
    description: "",
    season: "2026",
  });

  async function loadState() {
    setIsLoading(true);
    setError("");
    try {
      const response = await fetch("/api/state", { cache: "no-store" });
      if (!response.ok) {
        throw new Error("Could not load app state.");
      }
      const next = (await response.json()) as ApiState;
      setState(next);
      if (selectedTeam) {
        setSelectedTeam(next.teams.find((team) => team.id === selectedTeam.id) ?? null);
      }
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    queueMicrotask(() => {
      const voter = getVoter();
      setVoter(voter);
      setNameDraft(voter.voterName);
      void loadState();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const myVotes = useMemo(() => {
    const votes = new Map<string, Vote>();
    for (const vote of state?.votes ?? []) {
      if (vote.voterId === voterId) {
        votes.set(vote.teamId, vote);
      }
    }
    return votes;
  }, [state?.votes, voterId]);

  const filteredTeams = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return [...(state?.teams ?? [])]
      .filter((team) => {
        const matchesSearch =
          !normalized ||
          team.name.toLowerCase().includes(normalized) ||
          team.city.toLowerCase().includes(normalized) ||
          team.nickname.toLowerCase().includes(normalized) ||
          team.abbreviation.toLowerCase().includes(normalized);
        const matchesLeague = league === "all" || team.league === league;
        const matchesDivision = division === "all" || team.division === division;
        const matchesMedia =
          mediaFilter === "all" ||
          (mediaFilter === "has" && Boolean(team.primaryMedia)) ||
          (mediaFilter === "missing" && !team.primaryMedia);
        return matchesSearch && matchesLeague && matchesDivision && matchesMedia;
      })
      .sort((a, b) => {
        if (sortMode === "team") {
          return a.name.localeCompare(b.name);
        }
        if (sortMode === "votes") {
          return b.score.voteCount - a.score.voteCount || a.name.localeCompare(b.name);
        }
        if (sortMode === "updated") {
          return (b.primaryMedia?.updatedAt ?? "").localeCompare(a.primaryMedia?.updatedAt ?? "") || a.name.localeCompare(b.name);
        }
        if (sortMode === "lowest") {
          return (a.score.averageScore ?? 99) - (b.score.averageScore ?? 99) || b.score.voteCount - a.score.voteCount;
        }
        return (b.score.averageScore ?? -1) - (a.score.averageScore ?? -1) || b.score.voteCount - a.score.voteCount;
      });
  }, [division, league, mediaFilter, query, sortMode, state?.teams]);

  const bestTeams = useMemo(
    () => [...(state?.teams ?? [])].filter((team) => team.score.averageScore !== null).sort((a, b) => (a.score.rankBest ?? 999) - (b.score.rankBest ?? 999)).slice(0, 5),
    [state?.teams],
  );
  const worstTeams = useMemo(
    () => [...(state?.teams ?? [])].filter((team) => team.score.averageScore !== null).sort((a, b) => (a.score.rankWorst ?? 999) - (b.score.rankWorst ?? 999)).slice(0, 5),
    [state?.teams],
  );

  const missingMediaCount = (state?.teams ?? []).filter((team) => !team.primaryMedia).length;
  const votedCount = myVotes.size;

  async function saveName(event: FormEvent) {
    event.preventDefault();
    const nextName = nameDraft.trim() || anonymousName;
    window.localStorage.setItem("hcr-voter-name", nextName);
    setVoter((current) => ({ ...current, voterName: nextName }));
  }

  async function submitVote(teamId: string, score: number) {
    setIsSaving(true);
    setError("");
    try {
      const response = await fetch("/api/votes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teamId, score, voterId, voterName }),
      });
      if (!response.ok) {
        const body = (await response.json()) as { error?: string };
        throw new Error(body.error ?? "Could not save vote.");
      }
      await loadState();
    } catch (voteError) {
      setError(voteError instanceof Error ? voteError.message : "Could not save vote.");
    } finally {
      setIsSaving(false);
    }
  }

  async function submitMedia(event: FormEvent) {
    event.preventDefault();
    setIsSaving(true);
    setError("");
    try {
      const response = await fetch("/api/media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...mediaDraft, mediaType: isGifUrl(mediaDraft.mediaUrl) ? "gif_url" : "external_link", isPrimary: true }),
      });
      if (!response.ok) {
        const body = (await response.json()) as { error?: string };
        throw new Error(body.error ?? "Could not save media.");
      }
      setMediaDraft({ teamId: "", title: "", mediaUrl: "", sourceUrl: "", attribution: "", description: "", season: "2026" });
      setShowContribute(false);
      await loadState();
    } catch (mediaError) {
      setError(mediaError instanceof Error ? mediaError.message : "Could not save media.");
    } finally {
      setIsSaving(false);
    }
  }

  function openContribution(team?: TeamViewModel) {
    setMediaDraft((current) => ({
      ...current,
      teamId: team?.id ?? current.teamId,
      title: team?.primaryMedia?.title ?? "",
    }));
    setShowContribute(true);
  }

  return (
    <main className="appShell">
      <section className="hero">
        <div>
          <p className="eyebrow">Unofficial coworker debate machine</p>
          <h1>MLB Home Run Celebration Ranker</h1>
          <p className="heroCopy">
            Browse animated celebration GIFs, add better links, and vote 1-10 on which teams have elite baseball theater.
          </p>
        </div>
        <div className="heroActions">
          <button className="primaryButton" onClick={() => openContribution()}>
            Add celebration
          </button>
          <div className="statPill">
            <strong>{votedCount}/30</strong>
            <span>your votes</span>
          </div>
        </div>
      </section>

      {error && <div className="errorBanner">{error}</div>}

      <section className="controlPanel" aria-label="Search and filters">
        <label>
          <span>Search</span>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Team, city, nickname..." />
        </label>
        <label>
          <span>League</span>
          <select value={league} onChange={(event) => setLeague(event.target.value as League | "all")}>
            <option value="all">All</option>
            <option value="AL">AL</option>
            <option value="NL">NL</option>
          </select>
        </label>
        <label>
          <span>Division</span>
          <select value={division} onChange={(event) => setDivision(event.target.value as Division | "all")}>
            <option value="all">All</option>
            <option value="East">East</option>
            <option value="Central">Central</option>
            <option value="West">West</option>
          </select>
        </label>
        <label>
          <span>Media</span>
          <select value={mediaFilter} onChange={(event) => setMediaFilter(event.target.value as MediaFilter)}>
            <option value="all">All</option>
            <option value="has">Has GIF/link</option>
            <option value="missing">Missing media</option>
          </select>
        </label>
        <label>
          <span>Sort</span>
          <select value={sortMode} onChange={(event) => setSortMode(event.target.value as SortMode)}>
            <option value="highest">Highest rated</option>
            <option value="lowest">Lowest rated</option>
            <option value="votes">Most votes</option>
            <option value="team">Team name</option>
            <option value="updated">Recently updated</option>
          </select>
        </label>
      </section>

      <section className="dashboard">
        <aside className="leaderboard">
          <form className="voterCard" onSubmit={saveName}>
            <label>
              <span>Your display name</span>
              <input value={nameDraft} onChange={(event) => setNameDraft(event.target.value)} />
            </label>
            <button type="submit">Save name</button>
            <small>{state?.persistence === "redis" ? "Shared persistence enabled" : "Local/dev persistence active"}</small>
          </form>

          <Leaderboard title="Best celebrations" teams={bestTeams} empty="No votes yet." />
          <Leaderboard title="Worst celebrations" teams={worstTeams} empty="No votes yet." danger />
          <button className="missingButton" onClick={() => setMediaFilter("missing")}>
            {missingMediaCount} teams need media
          </button>
        </aside>

        <section className="teamGrid" aria-label="Team cards">
          {isLoading && <div className="loadingCard">Loading celebrations...</div>}
          {!isLoading &&
            filteredTeams.map((team) => (
              <article key={team.id} className={`teamCard ${team.primaryMedia ? "" : "missingMedia"}`}>
                <AnimatedMedia media={team.primaryMedia} />
                <div className="teamCardBody">
                  <div className="teamHeader">
                    <div>
                      <p className="teamMeta">
                        {team.league} {team.division} · {team.abbreviation}
                      </p>
                      <h2>{team.name}</h2>
                    </div>
                    <span className="rankBadge">{team.score.rankBest ? `#${team.score.rankBest}` : "—"}</span>
                  </div>
                  <div className="scoreRow">
                    <strong>{scoreLabel(team.score.averageScore)}</strong>
                    <span>{team.score.voteCount} votes</span>
                    {myVotes.get(team.id) && <span>Your vote: {myVotes.get(team.id)?.score}</span>}
                  </div>
                  <VoteButtons current={myVotes.get(team.id)?.score} disabled={isSaving} onVote={(score) => submitVote(team.id, score)} />
                  <div className="cardActions">
                    <button onClick={() => setSelectedTeam(team)}>View</button>
                    <button onClick={() => openContribution(team)}>{team.primaryMedia ? "Update media" : "Add GIF"}</button>
                  </div>
                </div>
              </article>
            ))}
        </section>
      </section>

      {selectedTeam && (
        <div className="modalBackdrop" role="dialog" aria-modal="true" aria-label={`${selectedTeam.name} details`}>
          <section className="teamModal">
            <button className="closeButton" onClick={() => setSelectedTeam(null)} aria-label="Close team details">
              ×
            </button>
            <AnimatedMedia media={selectedTeam.primaryMedia} className="detailMedia" />
            <div className="detailPanel">
              <p className="teamMeta">
                {selectedTeam.league} {selectedTeam.division} · {selectedTeam.abbreviation}
              </p>
              <h2>{selectedTeam.name}</h2>
              <p>{selectedTeam.primaryMedia?.description ?? "No celebration notes yet. Add context when you add the GIF."}</p>
              <div className="detailScore">
                <strong>{scoreLabel(selectedTeam.score.averageScore)}</strong>
                <span>{selectedTeam.score.voteCount} votes</span>
              </div>
              <VoteButtons current={myVotes.get(selectedTeam.id)?.score} disabled={isSaving} onVote={(score) => submitVote(selectedTeam.id, score)} />
              {selectedTeam.primaryMedia?.sourceUrl && (
                <a className="sourceLink" href={selectedTeam.primaryMedia.sourceUrl} target="_blank" rel="noreferrer">
                  Source / attribution
                </a>
              )}
              <button className="primaryButton" onClick={() => openContribution(selectedTeam)}>
                Update celebration media
              </button>
            </div>
          </section>
        </div>
      )}

      {showContribute && (
        <div className="modalBackdrop" role="dialog" aria-modal="true" aria-label="Add celebration media">
          <form className="contributeModal" onSubmit={submitMedia}>
            <button className="closeButton" type="button" onClick={() => setShowContribute(false)} aria-label="Close contribution form">
              ×
            </button>
            <div>
              <p className="eyebrow">Media contribution</p>
              <h2>Add or update a celebration</h2>
              <p>Paste an animated GIF URL for immediate animated preview support. External links are saved with attribution.</p>
            </div>
            <label>
              <span>Team</span>
              <select required value={mediaDraft.teamId} onChange={(event) => setMediaDraft((draft) => ({ ...draft, teamId: event.target.value }))}>
                <option value="">Select a team</option>
                {(state?.teams ?? []).map((team) => (
                  <option key={team.id} value={team.id}>
                    {team.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span>Celebration title</span>
              <input required value={mediaDraft.title} onChange={(event) => setMediaDraft((draft) => ({ ...draft, title: event.target.value }))} />
            </label>
            <label>
              <span>GIF or media URL</span>
              <input required type="url" value={mediaDraft.mediaUrl} onChange={(event) => setMediaDraft((draft) => ({ ...draft, mediaUrl: event.target.value }))} placeholder="https://.../celebration.gif" />
            </label>
            <div className="previewBox">
              <AnimatedMedia
                media={
                  mediaDraft.mediaUrl
                    ? {
                        id: "draft",
                        teamId: mediaDraft.teamId,
                        title: mediaDraft.title || "Draft celebration",
                        mediaUrl: mediaDraft.mediaUrl,
                        mediaType: isGifUrl(mediaDraft.mediaUrl) ? "gif_url" : "external_link",
                        isPrimary: true,
                        status: "active",
                        createdAt: "",
                        updatedAt: "",
                      }
                    : undefined
                }
              />
            </div>
            <label>
              <span>Source URL</span>
              <input type="url" value={mediaDraft.sourceUrl} onChange={(event) => setMediaDraft((draft) => ({ ...draft, sourceUrl: event.target.value }))} />
            </label>
            <label>
              <span>Attribution</span>
              <input value={mediaDraft.attribution} onChange={(event) => setMediaDraft((draft) => ({ ...draft, attribution: event.target.value }))} />
            </label>
            <label>
              <span>Notes</span>
              <textarea value={mediaDraft.description} onChange={(event) => setMediaDraft((draft) => ({ ...draft, description: event.target.value }))} />
            </label>
            <button className="primaryButton" type="submit" disabled={isSaving}>
              {isSaving ? "Saving..." : "Save celebration"}
            </button>
          </form>
        </div>
      )}
    </main>
  );
}

function VoteButtons({ current, disabled, onVote }: { current?: number; disabled: boolean; onVote: (score: number) => void }) {
  return (
    <div className="voteButtons" aria-label="Vote from 1 to 10">
      {Array.from({ length: 10 }, (_, index) => index + 1).map((score) => (
        <button key={score} disabled={disabled} className={current === score ? "selected" : ""} onClick={() => onVote(score)} aria-label={`Vote ${score}`}>
          {score}
        </button>
      ))}
    </div>
  );
}

function Leaderboard({ title, teams, empty, danger = false }: { title: string; teams: TeamViewModel[]; empty: string; danger?: boolean }) {
  return (
    <section className={`leaderboardCard ${danger ? "danger" : ""}`}>
      <h2>{title}</h2>
      {teams.length === 0 && <p>{empty}</p>}
      {teams.map((team, index) => (
        <div key={team.id} className="leaderboardItem">
          <span>{index + 1}</span>
          <strong>{team.abbreviation}</strong>
          <em>{scoreLabel(team.score.averageScore)}</em>
        </div>
      ))}
    </section>
  );
}


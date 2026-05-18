# MLB Home Run Celebration Ranker — Functional Spec

## 1. Product Overview

The app lets users browse, watch, compare, and vote on each MLB team’s home run celebration or tradition using animated GIFs or externally hosted media links. It should be easy for a small group of coworkers to add or update celebration media, score teams, and see a ranked leaderboard.

The intended deployment target is **Vercel**, with a lightweight web architecture suitable for fast iteration.

## 2. Goals

### Primary Goals

1. Show all 30 MLB teams in a clean, browsable interface.
2. Let users view each team’s home run celebration as an animated GIF or linked media embed.
3. Allow easy adding/editing of celebration GIFs or media links.
4. Support voting/scoring so coworkers can rank the best and worst celebrations.
5. Provide a leaderboard sorted by average score, total votes, or custom categories.
6. Be simple enough to host on Vercel without heavy infrastructure.

### Secondary Goals

1. Support notes/context for each celebration.
2. Allow multiple media entries per team over time.
3. Make it obvious which teams are missing GIFs.
4. Keep contribution flows lightweight so any user can add or update celebration media.
5. Preserve source attribution for linked media.

## 3. Non-Goals for Initial Version

The first version should not need:

1. Full user account management with complex permissions.
2. Real-time multiplayer voting.
3. Native mobile apps.
4. Video editing or GIF generation.
5. Automatic scraping of MLB/team/social media content.
6. Public internet-scale abuse prevention.

## 4. Target Users

### App Users

Coworkers/friends participating in a casual MLB celebration ranking conversation. There is only one user type in the MVP. Every user can browse teams, add or update celebration media, and vote.

### Optional Future Users

Public visitors, if the app is later shared outside the original group.

## 5. Core User Stories

### Browsing

1. As a visitor, I want to see all MLB teams so I can compare celebrations.
2. As a visitor, I want to filter by league/division so I can find teams quickly.
3. As a visitor, I want to search by team name, city, or nickname.
4. As a visitor, I want to open a team detail view and watch the celebration GIF.

### Media Management

1. As a user, I want to add a GIF URL for a team.
2. As a user, I want to upload a GIF file if we own or have permission to use it.
3. As a user, I want to add a source URL and attribution.
4. As a user, I want to mark one media item as the team’s primary celebration.
5. As a user, I want to replace outdated or broken media links.

### Voting

1. As a voter, I want to score each team’s celebration.
2. As a voter, I want to see which teams I have already voted on.
3. As a voter, I want to update my vote.
4. As a visitor, I want to see leaderboard rankings.
5. As a visitor, I want to see both “best” and “worst” ranked celebrations.

### Comparison

1. As a visitor, I want to compare teams side-by-side.
2. As a visitor, I want to sort teams by score, team name, division, or number of votes.
3. As a visitor, I want to see teams missing media so the group can fill them in.

## 6. MVP Feature Set

## 6.1 Home Page

The home page should present the app as a ranked gallery of MLB home run celebrations.

### Required Elements

1. App title, such as **MLB Home Run Celebration Rankings**.
2. Short description of the voting/ranking purpose.
3. Search input.
4. Filters:
   - League: AL / NL / All
   - Division: East / Central / West / All
   - Media status: Has GIF / Missing GIF / All
5. Sort options:
   - Highest rated
   - Lowest rated
   - Most votes
   - Team name
   - Recently updated
6. Team cards for all 30 MLB teams.
7. Leaderboard section or leaderboard mode.

### Team Card Contents

Each card should show:

1. Team name.
2. Team logo or simple team abbreviation.
3. Current primary celebration GIF preview, with animated GIF playback supported.
4. Average score.
5. Vote count.
6. User’s own vote, if available.
7. Status indicator:
   - GIF available
   - Missing GIF
   - Link broken, if detected later
8. Button/link to detail view.

## 6.2 Team Detail Page / Modal

Each team should have a dedicated detail view.

### Required Elements

1. Team name.
2. League and division.
3. Primary animated GIF/media embed.
4. Celebration name/title, if known.
5. Short description.
6. Source URL/attribution.
7. Voting control.
8. Current score summary.
9. Optional comments/notes area.
10. Edit controls for updating the team’s celebration media.

### Media Display Behavior

The app should support:

1. Direct GIF URLs.
2. Uploaded GIFs.
3. Hosted image links, such as Imgur direct image links.
4. Embedded media links where technically feasible.
5. Fallback link display if embed fails.

All GIF previews must support animated GIF playback. This includes team cards, team detail views, media preview validation, and any leaderboard or compact mobile previews that display celebration media.

For Redgifs or other platforms, the app may initially store/display the link and open it externally unless embedding is straightforward and allowed.

## 6.3 Add/Edit Celebration Media

The media contribution UI should make adding or updating celebration media very straightforward for any user.

### Add/Edit Form Fields

1. Team selector.
2. Celebration title.
3. Media type:
   - GIF URL
   - Uploaded GIF
   - External media link
4. Media URL.
5. Upload field, if uploads are enabled.
6. Source URL.
7. Attribution/credit.
8. Description/notes.
9. Season/year observed.
10. Checkbox: “Set as primary celebration.”
11. Save button.
12. Preview button that plays animated GIFs before saving.

### Validation

The form should validate:

1. A team is selected.
2. Either a media URL or upload is provided.
3. URL format is valid.
4. Uploaded file is an allowed type.
5. Uploaded file is below configured size limit.
6. Source URL is encouraged, and possibly required for non-uploaded media.

### Supported Upload Types

For MVP:

1. `.gif`
2. Optional later: `.mp4`, `.webm`, `.webp`

For `.gif` files, animation must be preserved in previews and detail views. The app should not convert an uploaded or linked animated GIF into a static image unless the user explicitly chooses a static fallback/poster behavior in a future feature.

### Upload Limits

Recommended initial limits:

1. GIF max size: 10–25 MB.
2. One primary media item per team.
3. Multiple historical/media alternatives allowed per team.

## 6.4 Voting System

The voting system should be simple, fun, and easy to understand.

### Recommended MVP Voting Model

Use a **1–10 score** per team.

1. 1 = deeply tragic, please stop.
2. 10 = elite baseball theater.

Each user can cast one score per team.

### Vote Data

Each vote should store:

1. Team ID.
2. Voter identifier.
3. Score.
4. Created timestamp.
5. Updated timestamp.

### Voter Identification

Use **simple named voting with localStorage identity**:

1. First visit prompts user for display name.
2. App stores display name + generated voter ID locally.
3. Votes are associated with that voter ID.
4. User can change display name later.

This keeps the app simple while supporting a coworker-friendly experience.

### Scoring Display

Each team should show:

1. Average score.
2. Number of votes.
3. User’s current score.
4. Rank position.
5. Optional score distribution.

### Leaderboards

The app should support:

1. Best celebrations: highest average score.
2. Worst celebrations: lowest average score.
3. Most divisive: highest score variance.
4. Most voted.
5. Missing votes from current user.

## 7. Nice-to-Have Voting Categories

A future version could allow scoring multiple dimensions:

1. **Originality**
2. **Team personality**
3. **Entertainment value**
4. **Execution**
5. **Absurdity**
6. **Rewatchability**

Then each team could have:

1. Overall score.
2. Category breakdown.
3. Radar/spider chart.
4. “Best prop,” “best choreography,” “most unhinged,” etc.

For MVP, keep it to one overall 1–10 score.

## 8. Data Model

## 8.1 Team

```ts
Team {
  id: string;
  name: string;
  city: string;
  nickname: string;
  abbreviation: string;
  league: "AL" | "NL";
  division: "East" | "Central" | "West";
  logoUrl?: string;
  primaryMediaId?: string;
  createdAt: string;
  updatedAt: string;
}
```

## 8.2 CelebrationMedia

```ts
CelebrationMedia {
  id: string;
  teamId: string;
  title: string;
  description?: string;
  mediaType: "gif_url" | "uploaded_gif" | "external_link";
  mediaUrl: string;
  thumbnailUrl?: string;
  sourceUrl?: string;
  attribution?: string;
  season?: string;
  isPrimary: boolean;
  status: "active" | "needs_review" | "broken" | "archived";
  createdAt: string;
  updatedAt: string;
}
```

## 8.3 Vote

```ts
Vote {
  id: string;
  teamId: string;
  voterId: string;
  voterName?: string;
  score: number;
  createdAt: string;
  updatedAt: string;
}
```

## 8.4 TeamScoreSummary

This can be computed dynamically or cached.

```ts
TeamScoreSummary {
  teamId: string;
  averageScore: number;
  voteCount: number;
  minScore: number;
  maxScore: number;
  scoreVariance?: number;
  rankBest?: number;
  rankWorst?: number;
}
```

## 9. Pages / Routes

Assuming a Next.js app hosted on Vercel:

| Route | Purpose |
|---|---|
| `/` | Main gallery and leaderboard |
| `/teams/[teamId]` | Team detail page |
| `/media/new` | Add celebration media |
| `/media/[mediaId]` | Edit existing media |
| `/leaderboard` | Dedicated leaderboard view |
| `/about` | App explanation/source/usage notes |

For MVP, `/` can handle gallery, team modal, and leaderboard in one page.

## 10. Media Contribution Requirements

## 10.1 Media Dashboard

A media dashboard or contribution view should show:

1. All 30 teams.
2. Current media status for each team.
3. Whether a primary celebration exists.
4. Last updated date.
5. Vote count.
6. Quick edit button.
7. Add media button.

## 10.2 Media Review Workflow

Media status options:

1. **Active** — visible to users.
2. **Needs review** — uploaded/linked but not yet public.
3. **Broken** — link no longer works.
4. **Archived** — old media no longer used.

For MVP, new media added by any user can go straight to **Active**.

## 10.3 Broken Link Handling

MVP behavior:

1. If media fails to load, show a fallback message.
2. Provide “Open source link” if available.
3. Users can mark media as broken manually.

Future behavior:

1. Scheduled link checker.
2. Automatic broken status.
3. User-visible broken media report.

## 11. UI/UX Requirements

## 11.1 Overall Style

The app should feel modern, polished, responsive, and like a fun sports debate board, not a heavy enterprise tool.

### Visual Direction

1. Card-based gallery.
2. Large media previews.
3. Clear ranking badges.
4. Playful but clean typography.
5. Team colors can be used subtly if desired, but the base app should remain visually consistent.
6. Modern visual hierarchy with generous spacing, clean controls, clear empty states, and minimal clutter.
7. Smooth but restrained interaction states for hover, focus, active, loading, and selected states.
8. Contemporary responsive design that works well across desktop, tablet, and mobile.

## 11.2 Main Gallery Layout

Desktop:

1. Header and controls at top.
2. Leaderboard summary row.
3. Responsive grid of team cards, likely 3–4 columns.
4. Sticky or prominent filter/sort controls.

Tablet:

1. Two-column card grid where space allows.
2. Filters should remain visible but may wrap into multiple rows.
3. Leaderboard can move below the main controls or into a collapsible panel.
4. Team detail view should use a centered modal or full-width panel depending on available space.

Mobile:

1. Single-column card layout.
2. Collapsible filters.
3. Large tap targets.
4. GIFs should lazy-load.
5. Sort, filter, and leaderboard controls should be easy to reach without crowding the screen.
6. Team detail should become a full-screen sheet or dedicated route instead of a cramped modal.
7. Voting controls should be thumb-friendly and not require precise tapping.

## 11.3 Responsive Design Requirements

The app must be fully responsive across common viewport sizes.

Recommended layout behavior:

| Viewport | Expected Behavior |
|---|---|
| Large desktop | 3–4 column card grid, persistent leaderboard rail or summary panel |
| Small desktop / tablet landscape | 2–3 column card grid, leaderboard moves into a stacked panel if needed |
| Tablet portrait | 2 column card grid, wrapped controls, modal or full-width team detail panel |
| Mobile | 1 column card grid, collapsible filters, full-screen team detail, thumb-friendly voting |

Responsive requirements:

1. No horizontal scrolling on standard mobile widths.
2. Team cards should resize fluidly while preserving readable media previews.
3. Search, filters, sort controls, voting controls, and contribution forms must remain usable on mobile.
4. Media previews should preserve aspect ratio and avoid layout shifts while loading.
5. Long team names, media titles, and source links should wrap or truncate gracefully.
6. Buttons and form controls should meet mobile-friendly touch target sizing.
7. The app should support both pointer/mouse and touch-first interactions.
8. Layout should be tested at representative mobile, tablet, and desktop widths before release.

## 11.4 Team Card States

Each team card should support:

1. Default state.
2. Hover/focus state.
3. Missing media state.
4. Voted state.
5. Top-ranked state.
6. Low-ranked state.
7. Loading skeleton state.
8. Compact mobile state.

## 11.5 Accessibility

The app should include:

1. Keyboard navigable controls.
2. Alt text for images/GIFs.
3. Reduced motion option or respect `prefers-reduced-motion`.
4. Captions/descriptions for media where possible.
5. Sufficient color contrast.
6. Button labels that do not rely only on icons.

## 12. Media and Copyright Considerations

The app should not automatically scrape or redistribute copyrighted MLB/broadcast/social media content.

Recommended approach:

1. Allow user-provided links.
2. Store source URL and attribution.
3. Prefer embeds or links where allowed by the hosting platform.
4. Upload only media the group has rights or permission to use.
5. For private coworker use, keep the app access-limited if using questionable clips.
6. Avoid representing the app as officially affiliated with MLB or any team.

Add a disclaimer somewhere like:

> This is an unofficial fan-made ranking app. Team names and media belong to their respective owners. Media is linked or uploaded for discussion purposes by app users.

## 13. Technical Architecture

## 13.1 Recommended Stack

Since the target host is Vercel:

1. **Framework:** Next.js
2. **Hosting:** Vercel
3. **Database:** Vercel Postgres, Neon, Supabase Postgres, or Turso
4. **ORM:** Prisma or Drizzle
5. **File Storage:** Vercel Blob or Supabase Storage
6. **Auth:** None required for MVP; use local display names and generated voter IDs
7. **Styling:** Tailwind CSS or CSS modules
8. **Deployment:** GitHub + Vercel

## 13.2 Recommended MVP Architecture

```txt
Browser
  |
  | Next.js pages/components
  |
Next.js App Router
  |
  | Server Actions / API Routes
  |
Database: Teams, Media, Votes
  |
Storage: Uploaded GIFs
```

## 13.3 Data Storage Options

### Option A — Vercel-Native

1. Vercel Postgres for metadata.
2. Vercel Blob for uploaded GIFs.
3. Vercel deployment previews.

Best if staying inside the Vercel ecosystem.

### Option B — Supabase

1. Supabase Postgres for metadata.
2. Supabase Storage for GIFs.
3. Optional Supabase Auth.

Best if future identity or moderation features matter.

### Option C — JSON File / Static MVP

1. Team/media data stored in a JSON file.
2. Votes stored in localStorage only.

Fastest prototype, but not useful for group voting unless backend storage is added.

### Recommendation

Use **Next.js + Postgres + Blob/Object Storage** for the real app. For the very first prototype, use local mock data and localStorage voting, then add persistence.

## 14. API / Server Actions

## 14.1 Teams

### `GET /api/teams`

Returns all teams with score summaries and primary media.

### `GET /api/teams/:teamId`

Returns one team with media history and score summary.

## 14.2 Media

### `POST /api/media`

Creates a media record.

### `PATCH /api/media/:mediaId`

Updates metadata, status, or primary flag.

### `DELETE /api/media/:mediaId`

Archives or deletes a media record. Prefer archive over hard delete.

### `POST /api/uploads`

Uploads GIF/media to storage and returns URL.

## 14.3 Votes

### `POST /api/votes`

Creates or updates the current voter’s score for a team.

### `GET /api/votes/me`

Returns current voter’s votes.

### `GET /api/leaderboard`

Returns ranked score summaries.

## 15. Initial Data Requirements

The app should ship with all 30 MLB teams preloaded.

Each team should include:

1. ID slug.
2. City.
3. Nickname.
4. Full display name.
5. Abbreviation.
6. League.
7. Division.

Example:

```ts
{
  id: "seattle-mariners",
  city: "Seattle",
  nickname: "Mariners",
  name: "Seattle Mariners",
  abbreviation: "SEA",
  league: "AL",
  division: "West"
}
```

## 16. Voting Rules

MVP rules:

1. One vote per voter per team.
2. Score must be integer 1–10.
3. Voter can update score.
4. Average score recalculates after each vote.
5. Teams with zero votes appear as “Unrated.”
6. Leaderboard should separate unrated teams from rated teams.

Tie-breaking:

1. Higher vote count wins for “best” leaderboard.
2. Alphabetical by team name after that.

Worst leaderboard:

1. Lower average score ranks worse.
2. Higher vote count wins tie.
3. Alphabetical after that.

## 17. Environment Variables

Potential Vercel environment variables:

```txt
DATABASE_URL=
BLOB_READ_WRITE_TOKEN=
NEXT_PUBLIC_APP_NAME=MLB Home Run Celebration Rankings
```

If using Supabase:

```txt
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

## 18. Performance Requirements

1. Main page should load quickly even with 30 GIF cards.
2. GIFs should lazy-load.
3. Only play/load full media when visible or opened.
4. Use thumbnails where possible.
5. Avoid loading all full-size GIFs at once.
6. Cache team and score data where practical.
7. Use optimized image handling carefully, because remote GIF optimization can be tricky.
8. Responsive layout changes should not cause major layout shift or jank.
9. Mobile interactions should remain fast even on slower connections and mid-range devices.

## 19. GIF Handling Requirements

GIFs can be large and expensive to load.

The app should:

1. Lazy-load GIFs.
2. Allow pausing or replacing with static poster if possible.
3. Avoid autoplaying dozens of huge GIFs simultaneously.
4. Support animated GIF previews on cards and compact/mobile media surfaces.
5. Load full animation in team detail view.
6. Show fallback for failed media.
7. Preserve GIF animation for linked and uploaded `.gif` assets.

Future improvement:

1. Convert uploaded GIFs to short MP4/WebM previews.
2. Store a thumbnail separately.
3. Generate preview images automatically.

## 20. Error States

The app should handle:

1. Missing media.
2. Broken media URL.
3. Failed upload.
4. Invalid URL.
5. Vote save failure.
6. Database unavailable.
7. Duplicate vote update.
8. Invalid media update.
9. File too large.
10. Unsupported file type.

Error messages should be friendly and specific.

Examples:

```txt
This team does not have a celebration GIF yet.
That media link could not be previewed. You can still save it as an external link.
Your vote could not be saved. Please try again.
Only GIF files up to 25 MB are supported.
```

## 21. Privacy and Abuse Considerations

For a small group app:

1. Do not collect unnecessary personal data.
2. If using display names, let users change them.
3. Rate-limit voting if publicly shared later.
4. Avoid allowing arbitrary public uploads without moderation if the app moves beyond a trusted coworker group.

## 22. Analytics

Optional, not MVP.

Could track:

1. Most viewed team.
2. Most voted team.
3. Missing media teams.
4. Vote completion percentage.

Avoid invasive analytics for a casual coworker app.

## 23. MVP Acceptance Criteria

The MVP is complete when:

1. All 30 MLB teams are visible.
2. Each team can have a primary GIF/media link.
3. Users can add/edit media for a team.
4. Users can score each team 1–10.
5. Votes persist across users.
6. Leaderboard ranks best and worst celebrations.
7. Missing media teams are easy to identify.
8. App can be deployed on Vercel.
9. GIFs do not all eagerly load at full size on initial page load.
10. Source/attribution fields exist for media.
11. UI is modern, polished, and responsive across desktop, tablet, and mobile.
12. Search, filters, voting, team detail, and media contribution flows are usable on mobile without horizontal scrolling.
13. All GIF previews support animated GIF playback instead of displaying only a static first frame.

## 24. Suggested MVP Build Phases

### Phase 1 — Static Prototype

1. Create Next.js app.
2. Add all 30 MLB teams as static seed data.
3. Build gallery, team detail modal, and leaderboard UI.
4. Use mock GIF/media URLs.
5. Store votes in localStorage.

### Phase 2 — Persistence

1. Add database.
2. Add teams/media/votes schema.
3. Seed teams.
4. Save votes server-side.
5. Compute leaderboard from database.

### Phase 3 — Media Contribution

1. Add media create/edit UI.
2. Add media URL preview.
3. Add uploaded GIF support.
4. Add primary media selection.

### Phase 4 — Polish

1. Add thumbnails/lazy loading.
2. Improve mobile layout.
3. Add missing media dashboard.
4. Add basic source attribution display.
5. Add deployment configuration for Vercel.

## 25. Open Product Decisions

These should be decided before coding:

| Decision | Recommended Default |
|---|---|
| Voting scale | 1–10 overall score |
| User identity | Local display name + generated voter ID |
| Media source | Links first, uploads second |
| Storage | Vercel Blob or Supabase Storage |
| Database | Vercel Postgres/Neon/Supabase Postgres |
| Team detail style | Modal from gallery, with route later |
| Public or private | Private/unlisted for MVP |
| Multiple celebrations per team | Yes, but one primary |

## 26. Recommended MVP Definition

The first useful version should be:

> A Vercel-hosted Next.js app where coworkers can browse all 30 MLB teams, watch each team’s primary home run celebration GIF/link, add or update celebration media through a simple shared contribution UI, and vote 1–10 to produce best/worst leaderboards.

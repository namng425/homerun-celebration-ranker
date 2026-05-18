import { NextResponse } from "next/server";
import { buildTeamViewModels } from "@/lib/state";
import { readState } from "@/lib/storage";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  const state = await readState();
  return NextResponse.json({
    teams: buildTeamViewModels(state),
    media: state.media,
    votes: state.votes,
    persistence:
      process.env.UPSTASH_REDIS_REST_URL || process.env.UPSTASH_REDIS_REST_KV_REST_API_URL || process.env.KV_REST_API_URL
        ? "redis"
        : "local-file",
  });
}


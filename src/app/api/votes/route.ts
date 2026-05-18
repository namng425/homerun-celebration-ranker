import { NextRequest, NextResponse } from "next/server";
import { createId, nowIso } from "@/lib/state";
import { updateState } from "@/lib/storage";
import { teamIds } from "@/lib/teams";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const body = (await request.json()) as {
    teamId?: string;
    voterId?: string;
    voterName?: string;
    score?: number;
  };

  if (!body.teamId || !teamIds.has(body.teamId)) {
    return NextResponse.json({ error: "A valid teamId is required." }, { status: 400 });
  }

  if (!body.voterId || body.voterId.trim().length < 6) {
    return NextResponse.json({ error: "A valid voterId is required." }, { status: 400 });
  }

  const score = body.score;
  if (!Number.isInteger(score) || score === undefined || score < 1 || score > 10) {
    return NextResponse.json({ error: "Score must be an integer from 1 to 10." }, { status: 400 });
  }

  const saved = await updateState((state) => {
    const existing = state.votes.find((vote) => vote.teamId === body.teamId && vote.voterId === body.voterId);
    const timestamp = nowIso();

    if (existing) {
      existing.score = score;
      existing.voterName = body.voterName?.trim() || existing.voterName;
      existing.updatedAt = timestamp;
      return state;
    }

    state.votes.push({
      id: createId("vote"),
      teamId: body.teamId as string,
      voterId: body.voterId as string,
      voterName: body.voterName?.trim() || undefined,
      score,
      createdAt: timestamp,
      updatedAt: timestamp,
    });
    return state;
  });

  return NextResponse.json({ votes: saved.votes });
}


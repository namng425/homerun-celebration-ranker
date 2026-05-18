import { NextRequest, NextResponse } from "next/server";
import { createId, nowIso } from "@/lib/state";
import { updateState } from "@/lib/storage";
import { teamIds } from "@/lib/teams";
import type { MediaType } from "@/lib/types";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const mediaTypes = new Set<MediaType>(["gif_url", "uploaded_gif", "external_link"]);

function parseUrl(value: string | undefined) {
  if (!value) {
    return null;
  }
  try {
    return new URL(value).toString();
  } catch {
    return null;
  }
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as {
    teamId?: string;
    title?: string;
    description?: string;
    mediaType?: MediaType;
    mediaUrl?: string;
    sourceUrl?: string;
    attribution?: string;
    season?: string;
    isPrimary?: boolean;
  };

  if (!body.teamId || !teamIds.has(body.teamId)) {
    return NextResponse.json({ error: "A valid team is required." }, { status: 400 });
  }

  const mediaUrl = parseUrl(body.mediaUrl);
  if (!mediaUrl) {
    return NextResponse.json({ error: "A valid media URL is required." }, { status: 400 });
  }

  const mediaType = body.mediaType && mediaTypes.has(body.mediaType) ? body.mediaType : "gif_url";
  const title = body.title?.trim() || "Home run celebration";
  const timestamp = nowIso();

  const saved = await updateState((state) => {
    if (body.isPrimary !== false) {
      for (const media of state.media) {
        if (media.teamId === body.teamId) {
          media.isPrimary = false;
          media.updatedAt = timestamp;
        }
      }
    }

    state.media.push({
      id: createId("media"),
      teamId: body.teamId as string,
      title,
      description: body.description?.trim() || undefined,
      mediaType,
      mediaUrl,
      sourceUrl: parseUrl(body.sourceUrl) ?? undefined,
      attribution: body.attribution?.trim() || undefined,
      season: body.season?.trim() || undefined,
      isPrimary: body.isPrimary !== false,
      status: "active",
      createdAt: timestamp,
      updatedAt: timestamp,
    });
    return state;
  });

  return NextResponse.json({ media: saved.media });
}


import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const maxGifSizeBytes = 25 * 1024 * 1024;

export async function POST(request: Request) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json({ error: "GIF upload storage is not configured." }, { status: 503 });
  }

  const body = (await request.json()) as HandleUploadBody;

  try {
    const result = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        if (!pathname.startsWith("celebrations/") || !pathname.toLowerCase().endsWith(".gif")) {
          throw new Error("Only celebration GIF uploads are allowed.");
        }

        return {
          allowedContentTypes: ["image/gif"],
          maximumSizeInBytes: maxGifSizeBytes,
          addRandomSuffix: true,
          cacheControlMaxAge: 60 * 60 * 24 * 30,
        };
      },
      onUploadCompleted: async () => {},
    });

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Could not upload GIF." }, { status: 400 });
  }
}

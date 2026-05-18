# MLB Home Run Celebration Ranker

A Vercel-ready Next.js app for browsing, adding, and voting on MLB home run celebration GIFs.

## Local development

```bash
npm install
npm run dev
```

## Persistence

The app uses a server-side storage abstraction:

- If `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` are configured, shared app state is stored in Redis.
- Otherwise, local development falls back to `data/app-state.json`.

For a production Vercel deployment with shared cross-user votes/media, configure Upstash Redis environment variables in Vercel.

## GIF uploads

The contribution form supports either a GIF/media URL or a direct `.gif` upload. Direct uploads use Vercel Blob through `BLOB_READ_WRITE_TOKEN`; uploaded GIFs are saved as public Blob URLs and then stored in the same media records as linked GIFs.


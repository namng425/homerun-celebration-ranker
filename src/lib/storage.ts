import { promises as fs } from "node:fs";
import path from "node:path";
import type { AppState } from "./types";

const stateKey = "homerun-celebration-ranker-state";
const dataFile = process.env.VERCEL ? path.join("/tmp", "homerun-celebration-ranker-state.json") : path.join(process.cwd(), "data", "app-state.json");

const initialState: AppState = {
  media: [],
  votes: [],
};

function redisUrl() {
  return process.env.UPSTASH_REDIS_REST_URL ?? process.env.UPSTASH_REDIS_REST_KV_REST_API_URL ?? process.env.KV_REST_API_URL;
}

function redisToken() {
  return process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.UPSTASH_REDIS_REST_KV_REST_API_TOKEN ?? process.env.KV_REST_API_TOKEN;
}

function redisConfigured() {
  return Boolean(redisUrl() && redisToken());
}

async function redisRequest<T>(command: unknown[]): Promise<T> {
  const url = redisUrl();
  const token = redisToken();
  if (!url || !token) {
    throw new Error("Redis is not configured.");
  }

  const response = await fetch(`${url}/pipeline`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify([command]),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Redis request failed: ${response.status} ${response.statusText}`);
  }

  const [result] = (await response.json()) as [{ result: T; error?: string }];
  if (result.error) {
    throw new Error(result.error);
  }
  return result.result;
}

async function readFromFile(): Promise<AppState> {
  try {
    const raw = await fs.readFile(dataFile, "utf8");
    return JSON.parse(raw) as AppState;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
      throw error;
    }
    await writeToFile(initialState);
    return initialState;
  }
}

async function writeToFile(state: AppState) {
  await fs.mkdir(path.dirname(dataFile), { recursive: true });
  await fs.writeFile(dataFile, JSON.stringify(state, null, 2), "utf8");
}

export async function readState(): Promise<AppState> {
  if (redisConfigured()) {
    const raw = await redisRequest<string | null>(["GET", stateKey]);
    return raw ? (JSON.parse(raw) as AppState) : initialState;
  }

  return readFromFile();
}

export async function writeState(state: AppState): Promise<AppState> {
  if (redisConfigured()) {
    await redisRequest<"OK">(["SET", stateKey, JSON.stringify(state)]);
    return state;
  }

  await writeToFile(state);
  return state;
}

export async function updateState(mutator: (state: AppState) => AppState | Promise<AppState>) {
  const current = await readState();
  const next = await mutator(structuredClone(current));
  return writeState(next);
}


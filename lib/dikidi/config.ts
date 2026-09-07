import { promises as fs } from "fs";
import path from "path";

export const COMPANY_ID =
  process.env.DIKIDI_COMPANY_ID?.trim() || "874400";

export const BEAUTY_BASE = "https://beauty.dikidi.ru/api/v1";
export const WIDGET_BASE = "https://dikidi.net";
export const WIDGET_LANG = "ru";

export const WIDGET_UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

const SECRETS_PATH = "/home/box/agent-data/box-secrets.json";

let cachedKey: string | null | undefined;

/** Prefer DIKIDI_API_KEY env; optionally fall back to box-secrets for local box runs. */
export async function getDikidiApiKey(): Promise<string | null> {
  const fromEnv = process.env.DIKIDI_API_KEY?.trim();
  if (fromEnv) return fromEnv;
  if (cachedKey !== undefined) return cachedKey;
  try {
    const raw = await fs.readFile(SECRETS_PATH, "utf8");
    const json = JSON.parse(raw) as { secrets?: { DIKIDI_API_KEY?: string } };
    const key = json.secrets?.DIKIDI_API_KEY?.trim() || null;
    cachedKey = key;
    return key;
  } catch {
    cachedKey = null;
    return null;
  }
}

export function widgetHeaders(extra?: Record<string, string>): HeadersInit {
  return {
    "User-Agent": WIDGET_UA,
    Accept: "application/json, text/javascript, */*; q=0.01",
    "X-Requested-With": "XMLHttpRequest",
    Referer: `${WIDGET_BASE}/${COMPANY_ID}`,
    ...extra,
  };
}

export function widgetPageUrl(): string {
  return `${WIDGET_BASE}/${WIDGET_LANG}/${COMPANY_ID}`;
}

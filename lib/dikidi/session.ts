import {
  COMPANY_ID,
  widgetHeaders,
  widgetPageUrl,
  WIDGET_BASE,
  WIDGET_UA,
} from "./config";

export type DikidiSession = {
  session: string;
  cookie: string;
  fetchedAt: number;
};

const TTL_MS = 25 * 60 * 1000;

let cache: DikidiSession | null = null;

function parseSetCookie(res: Response): string {
  const anyHeaders = res.headers as Headers & {
    getSetCookie?: () => string[];
  };
  const parts: string[] = [];
  if (typeof anyHeaders.getSetCookie === "function") {
    for (const raw of anyHeaders.getSetCookie()) {
      const pair = raw.split(";")[0]?.trim();
      if (pair) parts.push(pair);
    }
  } else {
    const single = res.headers.get("set-cookie");
    if (single) {
      for (const chunk of single.split(/,(?=[^;]+?=)/)) {
        const pair = chunk.split(";")[0]?.trim();
        if (pair) parts.push(pair);
      }
    }
  }
  return parts.join("; ");
}

function mergeCookies(existing: string, incoming: string): string {
  const map = new Map<string, string>();
  for (const src of [existing, incoming]) {
    if (!src) continue;
    for (const part of src.split(";")) {
      const trimmed = part.trim();
      if (!trimmed || !trimmed.includes("=")) continue;
      const eq = trimmed.indexOf("=");
      const name = trimmed.slice(0, eq);
      const value = trimmed.slice(eq + 1);
      map.set(name, value);
    }
  }
  return [...map.entries()].map(([k, v]) => `${k}=${v}`).join("; ");
}

export async function getWidgetSession(
  force = false
): Promise<DikidiSession> {
  if (!force && cache && Date.now() - cache.fetchedAt < TTL_MS) {
    return cache;
  }

  // Do NOT send X-Requested-With — the HTML widget page omits session otherwise.
  const res = await fetch(widgetPageUrl(), {
    headers: {
      "User-Agent": WIDGET_UA,
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "Accept-Language": "ru-RU,ru;q=0.9,en;q=0.8",
      Referer: `${WIDGET_BASE}/${COMPANY_ID}`,
    },
    cache: "no-store",
    redirect: "follow",
  });
  if (!res.ok) {
    throw new Error(`Dikidi session page HTTP ${res.status}`);
  }
  const html = await res.text();
  const match =
    html.match(/"session"\s*:\s*"([^"]+)"/) ||
    html.match(/session["']?\s*[:=]\s*["']([^"']+)["']/);
  if (!match?.[1]) {
    throw new Error("Не удалось получить session Dikidi");
  }
  const cookie = parseSetCookie(res);
  cache = {
    session: match[1],
    cookie,
    fetchedAt: Date.now(),
  };
  return cache;
}

export function rememberSessionCookies(
  session: DikidiSession,
  res: Response
): void {
  const incoming = parseSetCookie(res);
  if (!incoming) return;
  session.cookie = mergeCookies(session.cookie, incoming);
  if (cache?.session === session.session) {
    cache.cookie = session.cookie;
  }
}

export async function widgetFetch(
  pathWithQuery: string,
  init?: RequestInit & { session?: DikidiSession }
): Promise<{ res: Response; session: DikidiSession; json: unknown }> {
  let session = init?.session ?? (await getWidgetSession());
  const url = pathWithQuery.startsWith("http")
    ? pathWithQuery
    : `${WIDGET_BASE}${pathWithQuery}`;

  const doFetch = async (s: DikidiSession) => {
    const headers = new Headers(widgetHeaders());
    if (s.cookie) headers.set("Cookie", s.cookie);
    if (init?.headers) {
      const extra = new Headers(init.headers);
      extra.forEach((v, k) => headers.set(k, v));
    }
    const { session: _s, ...rest } = init || {};
    return fetch(url, { ...rest, headers, cache: "no-store" });
  };

  let res = await doFetch(session);
  rememberSessionCookies(session, res);

  if (res.status === 401 || res.status === 403) {
    session = await getWidgetSession(true);
    res = await doFetch(session);
    rememberSessionCookies(session, res);
  }

  const text = await res.text();
  let json: unknown = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = { raw: text.slice(0, 500) };
  }
  return { res, session, json };
}

export function companyId(): string {
  return COMPANY_ID;
}

import { BEAUTY_BASE, COMPANY_ID, getDikidiApiKey } from "./config";
import type { Master, Service } from "@/lib/data";

type BeautyCategory = { id?: string; name?: string };
type BeautyService = {
  id: string | number;
  name: string;
  price?: number;
  priceFrom?: boolean;
  category?: BeautyCategory;
};
type BeautyMaster = {
  id: string | number;
  name?: string;
  surname?: string;
  username?: string;
  post?: string;
  image?: { id?: string; type?: string; src?: string } | string | null;
};

function masterImageUrl(m: BeautyMaster): string | undefined {
  const img = m.image;
  if (!img) return undefined;
  if (typeof img === "string") return img || undefined;
  return img.src || undefined;
}

async function beautyGet<T>(path: string): Promise<T> {
  const key = await getDikidiApiKey();
  const headers: HeadersInit = { Accept: "application/json" };
  if (key) headers.Authorization = `Bearer ${key}`;
  const res = await fetch(`${BEAUTY_BASE}${path}`, {
    headers,
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`Beauty API ${path} → HTTP ${res.status}`);
  }
  return (await res.json()) as T;
}

function displayMasterName(m: BeautyMaster): string {
  // Prefer given name from Dikidi for airy cards; fall back to username / full name.
  const base =
    m.name?.trim() ||
    m.username?.trim() ||
    [m.name, m.surname].filter(Boolean).join(" ").trim() ||
    String(m.id);
  return base.toUpperCase();
}

export async function fetchBeautyServices(): Promise<Service[]> {
  const payload = await beautyGet<{ data: BeautyService[] }>(
    `/companies/${COMPANY_ID}/services`
  );
  return (payload.data || []).map((s) => ({
    id: String(s.id),
    name: s.name,
    price: Number(s.price ?? 0),
    priceFrom: Boolean(s.priceFrom),
    category: s.category?.name?.trim() || "Другое",
  }));
}

export async function fetchBeautyMasters(): Promise<Master[]> {
  const payload = await beautyGet<{ data: BeautyMaster[] }>(
    `/companies/${COMPANY_ID}/masters`
  );
  return (payload.data || []).map((m) => ({
    id: String(m.id),
    name: displayMasterName(m),
    specialty: (m.post || "").trim() || "мастер",
    image: masterImageUrl(m),
  }));
}

export async function fetchBeautyMastersForService(
  serviceId: string
): Promise<Master[]> {
  const payload = await beautyGet<{ data: BeautyMaster[] }>(
    `/companies/${COMPANY_ID}/services/${encodeURIComponent(serviceId)}/masters`
  );
  return (payload.data || []).map((m) => ({
    id: String(m.id),
    name: displayMasterName(m),
    specialty: (m.post || "").trim() || "мастер",
    image: masterImageUrl(m),
  }));
}

export async function fetchBeautyServicesForMaster(
  masterId: string
): Promise<Service[]> {
  const all = await fetchBeautyServices();
  const mid = String(masterId);
  const matched: Service[] = [];
  await Promise.all(
    all.map(async (svc) => {
      try {
        const masters = await fetchBeautyMastersForService(svc.id);
        if (masters.some((m) => m.id === mid)) matched.push(svc);
      } catch {
        /* skip service on error */
      }
    })
  );
  // Keep catalog order
  const order = new Map(all.map((s, i) => [s.id, i]));
  matched.sort((a, b) => (order.get(a.id) ?? 0) - (order.get(b.id) ?? 0));
  return matched;
}


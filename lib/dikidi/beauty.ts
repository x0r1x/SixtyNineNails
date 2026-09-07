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
};

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
  const base =
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
  }));
}

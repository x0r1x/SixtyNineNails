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

export type CompanyContacts = {
  name: string;
  description?: string;
  phone?: string;
  phones: string[];
  whatsappUrl?: string;
  addressLine: string;
  city?: string;
  street?: string;
  district?: string;
  lat?: number;
  lng?: number;
  scheduleLabel: string;
  dikidiUrl: string;
  links: { title: string; url: string }[];
};

type BeautyCompany = {
  id?: string | number;
  name?: string;
  description?: string;
  link?: string;
  contacts?: {
    phones?: string[];
    links?: { title?: string; url?: string; name?: string; href?: string }[];
    address?: {
      city?: string;
      street?: string;
      house?: string;
      district?: string;
      lat?: number;
      lng?: number;
    };
  };
  schedule?: { day?: string; workFrom?: string; workTo?: string }[];
};

function formatPhoneTel(phone: string): string {
  return phone.replace(/[^\d+]/g, "");
}

function scheduleToLabel(
  schedule?: { day?: string; workFrom?: string; workTo?: string }[]
): string {
  if (!schedule?.length) return "";
  const from = schedule[0]?.workFrom?.slice(0, 5);
  const to = schedule[0]?.workTo?.slice(0, 5);
  if (!from || !to) return "";
  const same = schedule.every(
    (d) => d.workFrom?.slice(0, 5) === from && d.workTo?.slice(0, 5) === to
  );
  return same ? `ежедневно ${from}–${to}` : `${from}–${to}`;
}

export async function fetchBeautyCompany(): Promise<CompanyContacts> {
  const payload = await beautyGet<{ data: BeautyCompany }>(
    `/companies/${COMPANY_ID}`
  );
  const c = payload.data || {};
  const phones = (c.contacts?.phones || []).map(String).filter(Boolean);
  const phone = phones[0];
  const addr = c.contacts?.address;
  const streetParts = [addr?.street, addr?.house].filter(Boolean).join(", ");
  const addressLine = [addr?.city, streetParts, addr?.district]
    .filter(Boolean)
    .join(", ");
  const links = (c.contacts?.links || [])
    .map((l) => {
      const url = (l.url || l.href || "").trim();
      const title = (l.title || l.name || url).trim();
      return url ? { title, url } : null;
    })
    .filter(Boolean) as { title: string; url: string }[];
  const telDigits = phone ? formatPhoneTel(phone).replace(/^\+/, "") : "";
  return {
    name: c.name || "SixtyNineNails",
    description: c.description?.trim() || undefined,
    phone,
    phones,
    whatsappUrl: telDigits ? `https://wa.me/${telDigits}` : undefined,
    addressLine,
    city: addr?.city,
    street: addr?.street,
    district: addr?.district,
    lat: addr?.lat,
    lng: addr?.lng,
    scheduleLabel: scheduleToLabel(c.schedule),
    dikidiUrl: `https://dikidi.net/ru/${COMPANY_ID}`,
    links,
  };
}


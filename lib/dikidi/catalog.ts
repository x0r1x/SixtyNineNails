import {
  masters as staticMasters,
  services as staticServices,
  type Master,
  type Service,
} from "@/lib/data";
import {
  fetchBeautyMasters,
  fetchBeautyMastersForService,
  fetchBeautyServices,
  fetchBeautyServicesForMaster,
} from "./beauty";

export async function getCatalogServices(): Promise<{
  services: Service[];
  source: "live" | "static";
}> {
  try {
    const services = await fetchBeautyServices();
    if (!services.length) throw new Error("empty");
    return { services, source: "live" };
  } catch {
    return { services: staticServices, source: "static" };
  }
}

export async function getCatalogMasters(): Promise<{
  masters: Master[];
  source: "live" | "static";
}> {
  try {
    const masters = await fetchBeautyMasters();
    if (!masters.length) throw new Error("empty");
    return { masters, source: "live" };
  } catch {
    return { masters: staticMasters, source: "static" };
  }
}

export async function getMastersForService(serviceId: string): Promise<{
  masters: Master[];
  source: "live" | "static" | "filtered-static";
}> {
  try {
    const masters = await fetchBeautyMastersForService(serviceId);
    if (!masters.length) throw new Error("empty");
    return { masters, source: "live" };
  } catch {
    const all = await getCatalogMasters();
    return { masters: all.masters, source: all.source };
  }
}

export async function getServicesForMaster(masterId: string): Promise<{
  services: Service[];
  source: "live" | "static";
}> {
  try {
    const services = await fetchBeautyServicesForMaster(masterId);
    if (!services.length) throw new Error("empty");
    return { services, source: "live" };
  } catch {
    const all = await getCatalogServices();
    return { services: all.services, source: all.source };
  }
}

export function categoriesFromServices(services: Service[]): string[] {
  const set = new Set<string>();
  for (const s of services) set.add(s.category);
  const preferred = ["Дизайн", "Маникюр", "Педикюр", "Макияж, прическа"];
  const ordered = preferred.filter((c) => set.has(c));
  for (const c of set) if (!ordered.includes(c)) ordered.push(c);
  return ordered;
}

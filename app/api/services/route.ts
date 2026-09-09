import { NextRequest, NextResponse } from "next/server";
import {
  categoriesFromServices,
  getCatalogServices,
  getServicesForMaster,
} from "@/lib/dikidi";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const masterId = request.nextUrl.searchParams.get("masterId");
  if (masterId) {
    const { services, source } = await getServicesForMaster(masterId);
    return NextResponse.json({
      services,
      categories: categoriesFromServices(services),
      source,
      masterId,
    });
  }
  const { services, source } = await getCatalogServices();
  return NextResponse.json({
    services,
    categories: categoriesFromServices(services),
    source,
  });
}

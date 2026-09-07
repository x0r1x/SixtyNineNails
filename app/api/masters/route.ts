import { NextRequest, NextResponse } from "next/server";
import { getCatalogMasters, getMastersForService } from "@/lib/dikidi";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const serviceId = request.nextUrl.searchParams.get("serviceId");
  if (serviceId) {
    const { masters, source } = await getMastersForService(serviceId);
    return NextResponse.json({ masters, source, serviceId });
  }
  const { masters, source } = await getCatalogMasters();
  return NextResponse.json({ masters, source });
}

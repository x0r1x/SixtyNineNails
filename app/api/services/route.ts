import { NextResponse } from "next/server";
import {
  categoriesFromServices,
  getCatalogServices,
} from "@/lib/dikidi";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const { services, source } = await getCatalogServices();
  return NextResponse.json({
    services,
    categories: categoriesFromServices(services),
    source,
  });
}

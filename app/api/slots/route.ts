import { NextRequest, NextResponse } from "next/server";
import { getDatetimes } from "@/lib/dikidi";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const sp = request.nextUrl.searchParams;
  const serviceId = sp.get("serviceId") || "";
  const masterId = sp.get("masterId") || undefined;
  const date = sp.get("date") || undefined;

  if (!serviceId) {
    return NextResponse.json(
      { error: "Нужен serviceId" },
      { status: 400 }
    );
  }

  try {
    const data = await getDatetimes({
      serviceId,
      masterId: masterId || undefined,
      date,
      withFirst: true,
    });

    const mid = masterId || Object.keys(data.times)[0];
    const times = mid ? data.times[mid] || [] : [];

    return NextResponse.json({
      datesTrue: data.datesTrue,
      dateNear: data.dateNear,
      times,
      timesByMaster: data.times,
      masters: data.masters,
      session: data.session,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Ошибка слотов";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}

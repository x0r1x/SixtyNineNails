import { NextResponse } from "next/server";
import { timeReservation } from "@/lib/dikidi";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { serviceId, masterId, time } = body || {};
    if (!serviceId || !masterId || !time) {
      return NextResponse.json(
        { error: "Нужны serviceId, masterId, time" },
        { status: 400 }
      );
    }
    const result = await timeReservation({
      serviceId: String(serviceId),
      masterId: String(masterId),
      time: String(time),
    });
    return NextResponse.json({
      recordId: result.recordId,
      masterId: result.masterId,
      session: result.session,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Ошибка резервации";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}

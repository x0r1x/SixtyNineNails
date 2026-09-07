import { NextResponse } from "next/server";

export const runtime = "nodejs";

/** Legacy local JSON bookings — replaced by Dikidi live booking. */
export async function GET() {
  return NextResponse.json(
    {
      error: "Локальные записи отключены. Используйте /api/booking/* и Dikidi.",
      bookings: [],
    },
    { status: 410 }
  );
}

export async function POST() {
  return NextResponse.json(
    {
      error:
        "Локальные записи отключены. Используйте поток /api/booking/reserve → send-code → confirm.",
    },
    { status: 410 }
  );
}

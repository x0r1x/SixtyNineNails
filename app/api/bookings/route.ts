import { NextResponse } from "next/server";
import { addBooking, getBookings } from "@/lib/bookings";

export const runtime = "nodejs";

export async function GET() {
  const bookings = await getBookings();
  return NextResponse.json({ bookings });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { serviceId, masterId, date, day, time, clientName } = body || {};
    if (!serviceId || !masterId || !date || !day || !time) {
      return NextResponse.json(
        { error: "Не хватает полей" },
        { status: 400 }
      );
    }
    const booking = await addBooking({
      serviceId,
      masterId,
      date,
      day,
      time,
      clientName,
    });
    return NextResponse.json({ booking }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Ошибка сервера";
    const status = message.includes("занят") ? 409 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

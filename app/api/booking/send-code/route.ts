import { NextResponse } from "next/server";
import { sendCode } from "@/lib/dikidi";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { phone, firstName, lastName } = body || {};
    if (!phone || !firstName) {
      return NextResponse.json(
        { error: "Нужны phone и firstName" },
        { status: 400 }
      );
    }
    const result = await sendCode({
      phone: String(phone),
      firstName: String(firstName),
      lastName: lastName ? String(lastName) : "",
    });
    if (result.status === "error" && !result.info) {
      return NextResponse.json(
        { error: "Не удалось отправить код", status: result.status },
        { status: 400 }
      );
    }
    return NextResponse.json({
      status: result.status,
      info: result.info,
      session: result.session,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Ошибка SMS";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}

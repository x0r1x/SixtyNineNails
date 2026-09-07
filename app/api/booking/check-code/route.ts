import { NextResponse } from "next/server";
import { checkCode } from "@/lib/dikidi";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { phone, code } = body || {};
    if (!phone || !code) {
      return NextResponse.json(
        { error: "Нужны phone и code" },
        { status: 400 }
      );
    }
    const result = await checkCode({
      phone: String(phone),
      code: String(code),
    });
    if (!result.ok) {
      return NextResponse.json(
        { error: result.message || "Неверный код", ok: false },
        { status: 400 }
      );
    }
    return NextResponse.json({ ok: true, session: result.session });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Ошибка проверки кода";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}

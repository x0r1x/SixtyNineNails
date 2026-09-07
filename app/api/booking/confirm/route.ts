import { NextResponse } from "next/server";
import {
  checkCode,
  createRecord,
  timeReservation,
} from "@/lib/dikidi";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Cohesive confirm: optionally re-reserve, verify SMS code, finalize record.
 * Expects prior reserve + send-code in the same Dikidi widget session (server cache).
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      serviceId,
      masterId,
      time,
      phone,
      code,
      firstName,
      lastName,
      comment,
      skipReserve,
    } = body || {};

    if (!phone || !code || !firstName) {
      return NextResponse.json(
        { error: "Нужны phone, code, firstName" },
        { status: 400 }
      );
    }

    if (!skipReserve) {
      if (!serviceId || !masterId || !time) {
        return NextResponse.json(
          { error: "Нужны serviceId, masterId, time (или skipReserve)" },
          { status: 400 }
        );
      }
      await timeReservation({
        serviceId: String(serviceId),
        masterId: String(masterId),
        time: String(time),
      });
    }

    const checked = await checkCode({
      phone: String(phone),
      code: String(code),
    });
    if (!checked.ok) {
      return NextResponse.json(
        { error: checked.message || "Неверный код" },
        { status: 400 }
      );
    }

    const result = await createRecord({
      firstName: String(firstName),
      lastName: lastName ? String(lastName) : "",
      phone: String(phone),
      code: String(code),
      comment: comment ? String(comment) : "",
    });

    return NextResponse.json({
      ok: true,
      bookings: result.bookings,
      session: result.session,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Ошибка подтверждения";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}

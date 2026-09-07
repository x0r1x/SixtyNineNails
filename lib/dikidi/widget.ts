import { COMPANY_ID, WIDGET_LANG } from "./config";
import {
  getWidgetSession,
  rememberSessionCookies,
  widgetFetch,
  type DikidiSession,
} from "./session";

export type DatetimesResult = {
  datesTrue: string[];
  dateNear: string | null;
  times: Record<string, string[]>;
  masters: Record<
    string,
    { id: string; username?: string; price?: string; time?: string }
  >;
  session: string;
};

function asRecord(v: unknown): Record<string, unknown> {
  return v && typeof v === "object" ? (v as Record<string, unknown>) : {};
}

export async function getDatetimes(opts: {
  serviceId: string;
  masterId?: string;
  date?: string;
  withFirst?: boolean;
}): Promise<DatetimesResult> {
  const session = await getWidgetSession();
  const params = new URLSearchParams();
  params.set("session", session.session);
  params.set("company_id", COMPANY_ID);
  params.set("service_id", opts.serviceId);
  if (opts.masterId) params.set("master_id", opts.masterId);
  if (opts.date) params.set("date", opts.date);
  params.set("with_first", opts.withFirst === false ? "0" : "1");

  const { res, json, session: s } = await widgetFetch(
    `/${WIDGET_LANG}/mobile/ajax/newrecord/get_datetimes/?${params}`,
    { session }
  );
  if (!res.ok) {
    throw new Error(`get_datetimes HTTP ${res.status}`);
  }
  const root = asRecord(json);
  const err = asRecord(root.error);
  if (err.code && Number(err.code) !== 0) {
    throw new Error(String(err.message || "Ошибка слотов"));
  }
  const data = asRecord(root.data);
  const timesRaw = asRecord(data.times);
  const times: Record<string, string[]> = {};
  for (const [mid, list] of Object.entries(timesRaw)) {
    times[mid] = Array.isArray(list) ? list.map(String) : [];
  }
  const mastersRaw = asRecord(data.masters);
  const masters: DatetimesResult["masters"] = {};
  for (const [mid, info] of Object.entries(mastersRaw)) {
    const m = asRecord(info);
    masters[mid] = {
      id: String(m.id ?? mid),
      username: m.username ? String(m.username) : undefined,
      price: m.price != null ? String(m.price) : undefined,
      time: m.time != null ? String(m.time) : undefined,
    };
  }
  return {
    datesTrue: Array.isArray(data.dates_true)
      ? data.dates_true.map(String)
      : [],
    dateNear: data.date_near ? String(data.date_near) : null,
    times,
    masters,
    session: s.session,
  };
}

export async function timeReservation(opts: {
  masterId: string;
  serviceId: string;
  time: string;
  session?: DikidiSession;
}): Promise<{ recordId: number; masterId: string; session: string }> {
  const session = opts.session ?? (await getWidgetSession());
  // jQuery serializes services_id as services_id[]=...
  const params = new URLSearchParams();
  params.set("company_id", COMPANY_ID);
  params.set("master_id", opts.masterId);
  params.append("services_id[]", opts.serviceId);
  params.set("time", opts.time);
  params.set("session", session.session);
  params.set("action_source", "direct_link");

  const { res, json, session: s } = await widgetFetch(
    `/${WIDGET_LANG}/ajax/newrecord/time_reservation/?${params}`,
    { session }
  );
  const root = asRecord(json);
  if (!res.ok || root.error) {
    const err = asRecord(root.error);
    throw new Error(
      String(err.message || root.message || `reserve HTTP ${res.status}`)
    );
  }
  if (!root.record_id) {
    throw new Error("Нет record_id в ответе резервации");
  }
  return {
    recordId: Number(root.record_id),
    masterId: String(root.master_id ?? opts.masterId),
    session: s.session,
  };
}

export async function clearReservation(
  session?: DikidiSession
): Promise<void> {
  const s = session ?? (await getWidgetSession());
  const params = new URLSearchParams({ session: s.session });
  await widgetFetch(
    `/${WIDGET_LANG}/ajax/newrecord/time_reservation_clear/?${params}`,
    { session: s }
  );
}

export async function sendCode(opts: {
  phone: string;
  firstName: string;
  lastName?: string;
  session?: DikidiSession;
}): Promise<{ status: string; info?: string; session: string }> {
  const session = opts.session ?? (await getWidgetSession());
  const params = new URLSearchParams({
    company_id: COMPANY_ID,
    name: opts.firstName,
    first_name: opts.firstName,
    last_name: opts.lastName || "",
    phone: opts.phone,
    action_source: "direct_link",
    session: session.session,
    push: "0",
    telegram: "0",
  });
  const { res, json, session: s } = await widgetFetch(
    `/${WIDGET_LANG}/ajax/newrecord/send_code/?${params}`,
    { session }
  );
  const root = asRecord(json);
  if (!res.ok) {
    throw new Error(`send_code HTTP ${res.status}`);
  }
  return {
    status: String(root.status || ""),
    info: root.info != null ? String(root.info) : undefined,
    session: s.session,
  };
}

export async function checkCode(opts: {
  phone: string;
  code: string;
  session?: DikidiSession;
}): Promise<{ ok: boolean; message?: string; session: string }> {
  const session = opts.session ?? (await getWidgetSession());
  const params = new URLSearchParams({
    company_id: COMPANY_ID,
    phone: opts.phone,
    code: opts.code,
    action_source: "direct_link",
    session: session.session,
  });
  const { res, json, session: s } = await widgetFetch(
    `/${WIDGET_LANG}/ajax/newrecord/check_code/?${params}`,
    { session }
  );
  const root = asRecord(json);
  if (!res.ok) {
    throw new Error(`check_code HTTP ${res.status}`);
  }
  if (root.status === "ok") {
    return { ok: true, session: s.session };
  }
  return {
    ok: false,
    message: String(root.message || "Неверный код"),
    session: s.session,
  };
}

export async function createRecord(opts: {
  firstName: string;
  lastName?: string;
  phone: string;
  code: string;
  comment?: string;
  session?: DikidiSession;
}): Promise<{ bookings: unknown; session: string }> {
  const session = opts.session ?? (await getWidgetSession());
  const unique = String(Date.now());
  const qs = new URLSearchParams({
    company_id: COMPANY_ID,
    session: session.session,
    social_key: "",
    action: "",
    unique_num: unique,
  });

  const body = new URLSearchParams();
  body.set("type", "normal");
  body.set("name", opts.firstName);
  body.set("first_name", opts.firstName);
  body.set("last_name", opts.lastName || "");
  body.set("phone", opts.phone);
  body.set("code", opts.code);
  body.set("remind", "1");
  body.set("comments", opts.comment || "");
  body.set("is_show_all_times", "3");
  body.set("action_source", "direct_link");
  body.set("session", session.session);
  body.set("social_key", "");
  body.set("agreement", "1");
  body.set("agreements[agreement2]", "1");

  const { res, json, session: s } = await widgetFetch(
    `/${WIDGET_LANG}/ajax/newrecord/record/?${qs}`,
    {
      method: "POST",
      session,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
      },
      body: body.toString(),
    }
  );
  const root = asRecord(json);
  if (!res.ok || root.error) {
    const err = asRecord(root.error);
    throw new Error(
      String(err.message || root.message || `record HTTP ${res.status}`)
    );
  }
  if (!root.bookings) {
    throw new Error("Неожиданный ответ записи");
  }
  return { bookings: root.bookings, session: s.session };
}

export { getWidgetSession, rememberSessionCookies };

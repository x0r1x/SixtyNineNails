"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { formatPrice, type Master, type Service } from "@/lib/data";

type Step = "slot" | "contacts" | "sms" | "done";

const WEEKDAY_HEADERS = ["ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ", "ВС"] as const;
const MONTH_NAMES = [
  "Январь",
  "Февраль",
  "Март",
  "Апрель",
  "Май",
  "Июнь",
  "Июль",
  "Август",
  "Сентябрь",
  "Октябрь",
  "Ноябрь",
  "Декабрь",
] as const;

function toIsoDate(d: Date): string {
  const y = d.getFullYear();
  const m = (d.getMonth() + 1).toString().padStart(2, "0");
  const day = d.getDate().toString().padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function parseIso(iso: string): Date {
  return new Date(iso + "T12:00:00");
}

function formatSelectedDate(iso: string): string {
  const d = parseIso(iso);
  return d.toLocaleDateString("ru-RU", {
    weekday: "short",
    day: "numeric",
    month: "long",
  });
}

function timeLabel(full: string): string {
  const m = full.match(/\d{2}:\d{2}/);
  return m ? m[0] : full;
}

/** Monday-first month grid cells (null = padding). */
function buildMonthGrid(year: number, month: number): (string | null)[] {
  const first = new Date(year, month, 1);
  // JS getDay: 0=Sun … convert to Mon=0
  const startPad = (first.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (string | null)[] = [];
  for (let i = 0; i < startPad; i++) cells.push(null);
  for (let day = 1; day <= daysInMonth; day++) {
    cells.push(toIsoDate(new Date(year, month, day)));
  }
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

type MonthCalendarProps = {
  year: number;
  month: number;
  available: Set<string>;
  selected: string;
  onSelect: (iso: string) => void;
  onPrev: () => void;
  onNext: () => void;
  loading?: boolean;
};

function MonthCalendar({
  year,
  month,
  available,
  selected,
  onSelect,
  onPrev,
  onNext,
  loading,
}: MonthCalendarProps) {
  const cells = useMemo(() => buildMonthGrid(year, month), [year, month]);
  const todayIso = toIsoDate(new Date());

  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="mb-4 flex items-center justify-between">
        <button
          type="button"
          onClick={onPrev}
          className="px-3 py-1 text-sm font-light text-white/70 transition hover:text-white"
          aria-label="Предыдущий месяц"
        >
          ←
        </button>
        <p className="text-sm font-light tracking-wide text-white">
          {MONTH_NAMES[month]} {year}
        </p>
        <button
          type="button"
          onClick={onNext}
          className="px-3 py-1 text-sm font-light text-white/70 transition hover:text-white"
          aria-label="Следующий месяц"
        >
          →
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center">
        {WEEKDAY_HEADERS.map((h) => (
          <div
            key={h}
            className="pb-2 text-[10px] font-light tracking-wider text-white/40"
          >
            {h}
          </div>
        ))}
        {cells.map((iso, idx) => {
          if (!iso) {
            return <div key={"e" + idx} className="aspect-square" />;
          }
          const dayNum = parseIso(iso).getDate();
          const isAvailable = available.has(iso);
          const isSelected = selected === iso;
          const isPast = iso < todayIso;
          const canPick = isAvailable && !isPast;
          return (
            <button
              key={iso}
              type="button"
              disabled={!canPick}
              onClick={() => canPick && onSelect(iso)}
              className={
                "sn-chip mx-auto flex h-9 w-9 items-center justify-center rounded-full text-xs font-light " +
                (isSelected
                  ? "border border-burgundy bg-burgundy text-white"
                  : canPick
                    ? "border border-white/50 text-white hover:border-burgundy"
                    : "border border-transparent text-white/25")
              }
              title={
                canPick
                  ? "Есть свободные слоты"
                  : isAvailable
                    ? "Дата недоступна"
                    : "Нет записи"
              }
            >
              {dayNum}
            </button>
          );
        })}
      </div>
      {loading ? (
        <p className="mt-3 text-center text-xs font-light text-white/40">
          Обновляем даты…
        </p>
      ) : null}
    </div>
  );
}

export default function BookingForm() {
  const searchParams = useSearchParams();
  const masterFromQuery = searchParams.get("master") || "";
  const serviceFromQuery = searchParams.get("service") || "";

  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [masters, setMasters] = useState<Master[]>([]);
  const [catalogLoading, setCatalogLoading] = useState(true);

  const [serviceId, setServiceId] = useState("");
  const [masterId, setMasterId] = useState("");
  const [datesTrue, setDatesTrue] = useState<string[]>([]);
  const [date, setDate] = useState("");
  const [times, setTimes] = useState<string[]>([]);
  const [time, setTime] = useState("");
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [noSlotsWarn, setNoSlotsWarn] = useState(false);

  const now = new Date();
  const [viewYear, setViewYear] = useState(now.getFullYear());
  const [viewMonth, setViewMonth] = useState(now.getMonth());

  const [step, setStep] = useState<Step>("slot");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [comment, setComment] = useState("");
  const [smsCode, setSmsCode] = useState("");
  const [recordId, setRecordId] = useState<number | null>(null);

  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">(
    "idle"
  );
  const [message, setMessage] = useState("");

  const availableSet = useMemo(() => new Set(datesTrue), [datesTrue]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [svcRes, mstRes] = await Promise.all([
          fetch("/api/services"),
          fetch("/api/masters"),
        ]);
        const svcJson = await svcRes.json();
        const mstJson = await mstRes.json();
        if (cancelled) return;
        const svcList = (svcJson.services || []) as Service[];
        const mstList = (mstJson.masters || []) as Master[];
        setServices(svcList);
        setCategories(
          (svcJson.categories as string[]) ||
            [...new Set(svcList.map((s) => s.category))]
        );
        setMasters(mstList);
        const preferredMaster =
          masterFromQuery && mstList.some((m) => m.id === masterFromQuery)
            ? masterFromQuery
            : "";

        let preferredService =
          serviceFromQuery && svcList.some((s) => s.id === serviceFromQuery)
            ? serviceFromQuery
            : "";

        // Master deep-link (e.g. Varvara/визажист): pick a service she actually does.
        // Otherwise defaulting to svcList[0] (often manicure) drops the master and 400s slots.
        if (preferredMaster && !preferredService) {
          try {
            const forMasterRes = await fetch(
              "/api/services?masterId=" + encodeURIComponent(preferredMaster)
            );
            const forMasterJson = await forMasterRes.json();
            const masterSvcs = (forMasterJson.services || []) as Service[];
            if (masterSvcs.length) {
              preferredService = masterSvcs[0].id;
            }
          } catch {
            /* fall through */
          }
        }

        if (!preferredService) {
          preferredService = svcList[0]?.id || "";
        }

        // If both query params conflict (master cannot do service), prefer master.
        if (preferredMaster && preferredService && serviceFromQuery) {
          try {
            const check = await fetch(
              "/api/masters?serviceId=" + encodeURIComponent(preferredService)
            );
            const checkJson = await check.json();
            const forSvc = (checkJson.masters || []) as Master[];
            if (!forSvc.some((m) => m.id === preferredMaster)) {
              const forMasterRes = await fetch(
                "/api/services?masterId=" + encodeURIComponent(preferredMaster)
              );
              const forMasterJson = await forMasterRes.json();
              const masterSvcs = (forMasterJson.services || []) as Service[];
              if (masterSvcs.length) preferredService = masterSvcs[0].id;
            }
          } catch {
            /* keep preferredService */
          }
        }

        setServiceId(preferredService);
        setMasterId(preferredMaster || mstList[0]?.id || "");
      } catch {
        if (!cancelled) {
          setStatus("error");
          setMessage("Не удалось загрузить каталог");
        }
      } finally {
        if (!cancelled) setCatalogLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [masterFromQuery, serviceFromQuery]);

  useEffect(() => {
    if (!serviceId) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(
          "/api/masters?serviceId=" + encodeURIComponent(serviceId)
        );
        const data = await res.json();
        if (cancelled) return;
        const list = (data.masters || []) as Master[];
        if (list.length) {
          setMasters(list);
          setMasterId((prev) =>
            list.some((m) => m.id === prev) ? prev : list[0].id
          );
        }
      } catch {
        /* keep previous */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [serviceId]);

  const loadSlots = useCallback(
    async (sid: string, mid: string, d?: string, opts?: { fromPick?: boolean }) => {
      if (!sid || !mid) return;
      setSlotsLoading(true);
      setMessage("");
      setNoSlotsWarn(false);
      try {
        const fetchOnce = async (dateParam?: string) => {
          const q = new URLSearchParams({ serviceId: sid, masterId: mid });
          if (dateParam) q.set("date", dateParam);
          const res = await fetch("/api/slots?" + q.toString());
          const data = await res.json();
          if (!res.ok) throw new Error(data.error || "Ошибка слотов");
          return data as {
            datesTrue?: string[];
            dateNear?: string;
            times?: string[];
          };
        };

        let data = await fetchOnce(d);
        let dates = (data.datesTrue || []) as string[];
        setDatesTrue(dates);

        const near = (data.dateNear as string) || dates[0] || "";
        let nextDate = "";
        if (d) {
          // Keep picked day even if it has no slots in this response
          nextDate = d;
        } else {
          nextDate = near || dates[0] || "";
        }

        // Align month view to selected / near date
        const alignTo = nextDate || near;
        if (alignTo) {
          const nd = parseIso(alignTo);
          setViewYear(nd.getFullYear());
          setViewMonth(nd.getMonth());
        }

        let slotTimes = (data.times || []) as string[];
        let forDay = nextDate
          ? slotTimes.filter((t) => t.startsWith(nextDate))
          : [];

        // Without an explicit date, times may be empty until we request that day
        if (!d && nextDate && forDay.length === 0) {
          data = await fetchOnce(nextDate);
          dates = (data.datesTrue || dates) as string[];
          setDatesTrue(dates);
          slotTimes = (data.times || []) as string[];
          forDay = slotTimes.filter((t) => t.startsWith(nextDate));
        }

        setDate(nextDate);
        setTimes(forDay);
        setTime((prev) =>
          forDay.includes(prev) ? prev : forDay[0] || ""
        );

        // Adaptive calendar visibility
        if (opts?.fromPick) {
          if (forDay.length > 0) {
            setShowCalendar(false);
            setNoSlotsWarn(false);
          } else {
            setShowCalendar(true);
            setNoSlotsWarn(true);
          }
        } else if (!d) {
          // Auto after service/master change
          if (!nextDate || dates.length === 0) {
            setShowCalendar(true);
            setNoSlotsWarn(false);
          } else if (forDay.length === 0) {
            setShowCalendar(true);
            setNoSlotsWarn(true);
          } else {
            setShowCalendar(false);
            setNoSlotsWarn(false);
          }
        } else if (forDay.length === 0) {
          setShowCalendar(true);
          setNoSlotsWarn(true);
        }
      } catch (err) {
        setDatesTrue([]);
        setTimes([]);
        setTime("");
        setShowCalendar(true);
        setStatus("error");
        setMessage(err instanceof Error ? err.message : "Ошибка слотов");
      } finally {
        setSlotsLoading(false);
      }
    },
    []
  );

  // After service+master chosen — fetch availability (dates_true)
  useEffect(() => {
    if (!serviceId || !masterId || step !== "slot") return;
    setDate("");
    setTime("");
    setTimes([]);
    setShowCalendar(false);
    setNoSlotsWarn(false);
    void loadSlots(serviceId, masterId);
  }, [serviceId, masterId, loadSlots, step]);

  const selectedService = useMemo(
    () => services.find((s) => s.id === serviceId),
    [services, serviceId]
  );

  function shiftMonth(delta: number) {
    const d = new Date(viewYear, viewMonth + delta, 1);
    setViewYear(d.getFullYear());
    setViewMonth(d.getMonth());
  }

  async function onPickDate(iso: string) {
    setDate(iso);
    setTime("");
    setTimes([]);
    await loadSlots(serviceId, masterId, iso, { fromPick: true });
  }

  async function goToContacts(e: React.FormEvent) {
    e.preventDefault();
    if (!serviceId || !masterId || !date || !time) {
      setStatus("error");
      setMessage("Выберите услугу, мастера, дату и время");
      return;
    }
    setStep("contacts");
    setStatus("idle");
    setMessage("");
  }

  async function reserveAndSendCode(e: React.FormEvent) {
    e.preventDefault();
    if (!firstName.trim() || !phone.trim()) {
      setStatus("error");
      setMessage("Укажите имя и телефон");
      return;
    }
    setStatus("loading");
    setMessage("");
    try {
      const reserveRes = await fetch("/api/booking/reserve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ serviceId, masterId, time }),
      });
      const reserveData = await reserveRes.json();
      if (!reserveRes.ok) {
        throw new Error(reserveData.error || "Не удалось зарезервировать слот");
      }
      setRecordId(reserveData.recordId);

      const smsRes = await fetch("/api/booking/send-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: phone.trim(),
          firstName: firstName.trim(),
          lastName: lastName.trim(),
        }),
      });
      const smsData = await smsRes.json();
      if (!smsRes.ok) {
        throw new Error(smsData.error || "Не удалось отправить SMS");
      }
      setStep("sms");
      setStatus("idle");
      setMessage(smsData.info || "Код отправлен в SMS");
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Ошибка");
    }
  }

  async function confirmBooking(e: React.FormEvent) {
    e.preventDefault();
    if (!smsCode.trim()) {
      setStatus("error");
      setMessage("Введите код из SMS");
      return;
    }
    setStatus("loading");
    setMessage("");
    try {
      const res = await fetch("/api/booking/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId,
          masterId,
          time,
          phone: phone.trim(),
          code: smsCode.trim(),
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          comment: comment.trim(),
          skipReserve: Boolean(recordId),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Ошибка подтверждения");
      setStep("done");
      setStatus("ok");
      setMessage("Запись создана");
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Ошибка подтверждения");
    }
  }

  if (catalogLoading) {
    return <p className="text-sm font-light text-white/60">Загрузка…</p>;
  }

  if (step === "done") {
    return (
      <div className="sn-step-panel flex w-full max-w-xl flex-col items-center gap-6 text-center">
        <span className="sn-success-check" aria-hidden>
          ✓
        </span>
        <p className="text-lg font-light text-white">Вы записаны</p>
        <p className="text-sm font-light text-white/70">
          {selectedService?.name}
          {date ? ` · ${formatSelectedDate(date)}` : ""}
          {time ? ` · ${timeLabel(time)}` : ""}
        </p>
        <button
          type="button"
          onClick={() => {
            setStep("slot");
            setSmsCode("");
            setRecordId(null);
            setStatus("idle");
            setMessage("");
          }}
          className="sn-link-burgundy text-sm font-light text-burgundy"
        >
          Записаться ещё
        </button>
      </div>
    );
  }

  if (step === "sms") {
    return (
      <form
        onSubmit={confirmBooking}
        className="sn-step-panel flex w-full max-w-md flex-col items-center gap-8"
      >
        <p className="text-center text-sm font-light text-white/80">
          Введите код из SMS, отправленный на {phone}
        </p>
        <label className="flex w-full flex-col gap-3 text-sm font-light text-white">
          <span>Код</span>
          <input
            value={smsCode}
            onChange={(e) => setSmsCode(e.target.value)}
            inputMode="numeric"
            autoComplete="one-time-code"
            className="border-0 border-b border-white bg-transparent pb-2 text-center text-lg tracking-[0.3em] text-white outline-none"
            placeholder="••••"
          />
        </label>
        <button
          type="submit"
          disabled={status === "loading"}
          className="sn-btn bg-burgundy px-14 py-3 text-xs font-light tracking-label text-white hover:brightness-110 disabled:opacity-60 md:text-sm"
        >
          {status === "loading" ? "…" : "ПОДТВЕРДИТЬ"}
        </button>
        <button
          type="button"
          className="text-xs font-light text-white/50"
          onClick={() => {
            setStep("contacts");
            setStatus("idle");
            setMessage("");
          }}
        >
          ← назад
        </button>
        {message ? (
          <p
            className={
              "text-sm font-light " +
              (status === "error" ? "text-burgundy" : "text-white/70")
            }
          >
            {message}
          </p>
        ) : null}
      </form>
    );
  }

  if (step === "contacts") {
    return (
      <form
        onSubmit={reserveAndSendCode}
        className="sn-step-panel flex w-full max-w-md flex-col items-center gap-8"
      >
        <p className="text-center text-sm font-light text-white/70">
          {selectedService?.name}
          {date ? ` · ${formatSelectedDate(date)}` : ""}
          {time ? ` · ${timeLabel(time)}` : ""}
        </p>
        <label className="flex w-full flex-col gap-3 text-sm font-light text-white">
          <span>Имя</span>
          <input
            required
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="border-0 border-b border-white bg-transparent pb-2 text-sm text-white outline-none"
          />
        </label>
        <label className="flex w-full flex-col gap-3 text-sm font-light text-white">
          <span>Фамилия</span>
          <input
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="border-0 border-b border-white bg-transparent pb-2 text-sm text-white outline-none"
          />
        </label>
        <label className="flex w-full flex-col gap-3 text-sm font-light text-white">
          <span>Телефон</span>
          <input
            required
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+7…"
            className="border-0 border-b border-white bg-transparent pb-2 text-sm text-white outline-none"
          />
        </label>
        <label className="flex w-full flex-col gap-3 text-sm font-light text-white">
          <span>Комментарий</span>
          <input
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="border-0 border-b border-white bg-transparent pb-2 text-sm text-white outline-none"
          />
        </label>
        <button
          type="submit"
          disabled={status === "loading"}
          className="sn-btn bg-burgundy px-14 py-3 text-xs font-light tracking-label text-white hover:brightness-110 disabled:opacity-60 md:text-sm"
        >
          {status === "loading" ? "…" : "ПОЛУЧИТЬ SMS-КОД"}
        </button>
        <button
          type="button"
          className="text-xs font-light text-white/50"
          onClick={() => {
            setStep("slot");
            setStatus("idle");
            setMessage("");
          }}
        >
          ← назад
        </button>
        {message ? (
          <p className="text-sm font-light text-burgundy">{message}</p>
        ) : null}
      </form>
    );
  }

  return (
    <form
      onSubmit={goToContacts}
      className="sn-step-panel flex w-full max-w-3xl flex-col items-center gap-12"
    >
      <div className="grid w-full grid-cols-1 gap-10 sm:grid-cols-2">
        <label className="flex flex-col gap-3 text-sm font-light text-white">
          <span>Услуга</span>
          <select
            value={serviceId}
            onChange={(e) => {
              setServiceId(e.target.value);
              setDate("");
              setTime("");
              setTimes([]);
            }}
            className="appearance-none border-0 border-b border-white bg-transparent pb-2 text-sm text-white outline-none"
          >
            {categories.map((category) => (
              <optgroup
                key={category}
                label={category}
                className="bg-black text-white"
              >
                {services
                  .filter((s) => s.category === category)
                  .map((s) => (
                    <option
                      key={s.id}
                      value={s.id}
                      className="bg-black text-white"
                    >
                      {s.name} — {formatPrice(s.price, s.priceFrom)}
                    </option>
                  ))}
              </optgroup>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-3 text-sm font-light text-white">
          <span>Мастер</span>
          <select
            value={masterId}
            onChange={(e) => {
              setMasterId(e.target.value);
              setDate("");
              setTime("");
              setTimes([]);
            }}
            className="appearance-none border-0 border-b border-white bg-transparent pb-2 text-sm text-white outline-none"
          >
            {masters.map((m) => (
              <option key={m.id} value={m.id} className="bg-black text-white">
                {m.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      {serviceId && masterId ? (
        <>
          {/* Compact A: selected date line */}
          {!showCalendar && date ? (
            <div className="w-full text-center">
              <p className="text-sm font-light text-white">
                {formatSelectedDate(date)}
                {" · "}
                <button
                  type="button"
                  onClick={() => setShowCalendar(true)}
                  className="sn-link-burgundy text-burgundy underline-offset-4 hover:underline"
                >
                  другая дата
                </button>
              </p>
            </div>
          ) : null}

          {/* Month calendar B */}
          {showCalendar ? (
            <div className="sn-calendar-enter w-full">
              <p className="mb-5 text-center text-xs font-light tracking-label text-white/60">
                КАЛЕНДАРЬ
              </p>
              <MonthCalendar
                year={viewYear}
                month={viewMonth}
                available={availableSet}
                selected={date}
                onSelect={(iso) => void onPickDate(iso)}
                onPrev={() => shiftMonth(-1)}
                onNext={() => shiftMonth(1)}
                loading={slotsLoading}
              />
              {!slotsLoading && datesTrue.length === 0 ? (
                <p className="mt-4 text-center text-sm font-light text-white/50">
                  Нет свободных дат у этого мастера
                </p>
              ) : null}
              {noSlotsWarn ? (
                <p className="mt-4 text-center text-sm font-light text-burgundy">
                  На эту дату свободных слотов нет. Выберите другую дату.
                </p>
              ) : null}
            </div>
          ) : null}

          {/* Time chips (compact or under calendar when day has times) */}
          {date && (!showCalendar || times.length > 0 || slotsLoading) ? (
            <div className="w-full">
              {showCalendar ? (
                <p className="mb-4 text-center text-xs font-light tracking-label text-white/60">
                  СВОБОДНОЕ ВРЕМЯ · {formatSelectedDate(date)}
                </p>
              ) : (
                <p className="mb-4 text-center text-xs font-light tracking-label text-white/60">
                  ВРЕМЯ
                </p>
              )}
              <div className="sn-reveal flex flex-wrap justify-center gap-2">
                {slotsLoading ? (
                  <span className="text-sm font-light text-white/50">…</span>
                ) : times.length === 0 ? (
                  <span className="text-sm font-light text-white/50">
                    На этот день нет свободных слотов
                  </span>
                ) : (
                  times.map((t) => {
                    const selected = time === t;
                    return (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setTime(t)}
                        className={
                          "sn-chip min-w-[4.25rem] border px-3 py-2 text-xs font-light tracking-wide " +
                          (selected
                            ? "is-selected border-burgundy bg-burgundy text-white"
                            : "border-white/80 text-white hover:border-burgundy")
                        }
                      >
                        {timeLabel(t)}
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          ) : null}
        </>
      ) : null}

      <button
        type="submit"
        disabled={!time || slotsLoading}
        className="sn-btn bg-burgundy px-14 py-3 text-xs font-light tracking-label text-white hover:brightness-110 disabled:opacity-60 md:text-sm"
      >
        ЗАБРОНИРОВАТЬ
      </button>

      {message ? (
        <p
          className={
            "text-sm font-light " +
            (status === "ok" ? "text-white/80" : "text-burgundy")
          }
        >
          {message}
        </p>
      ) : null}
    </form>
  );
}

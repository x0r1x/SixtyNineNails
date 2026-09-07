"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  masters,
  services,
  timeSlotsByDay,
  weekDays,
} from "@/lib/data";
import type { Booking } from "@/lib/bookings";

type Props = {
  initialBookings: Booking[];
};

function nextDateForDay(dayLabel: string): string {
  const map: Record<string, number> = {
    ПН: 1,
    ВТ: 2,
    СР: 3,
    ЧТ: 4,
    ПТ: 5,
    СБ: 6,
    ВС: 0,
  };
  const target = map[dayLabel];
  const d = new Date();
  const current = d.getDay();
  let delta = (target - current + 7) % 7;
  if (delta === 0) delta = 7;
  d.setDate(d.getDate() + delta);
  return d.toISOString().slice(0, 10);
}

export default function BookingForm({ initialBookings }: Props) {
  const searchParams = useSearchParams();
  const masterFromQuery = searchParams.get("master") || "";

  const [serviceId, setServiceId] = useState(services[0]?.id || "");
  const [masterId, setMasterId] = useState(
    masters.some((m) => m.id === masterFromQuery)
      ? masterFromQuery
      : masters[0]?.id || ""
  );
  const [date, setDate] = useState("");
  const [day, setDay] = useState<string>("ВТ");
  const [time, setTime] = useState("14:00");
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">(
    "idle"
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (masterFromQuery && masters.some((m) => m.id === masterFromQuery)) {
      setMasterId(masterFromQuery);
    }
  }, [masterFromQuery]);

  useEffect(() => {
    if (!date) setDate(nextDateForDay(day));
  }, [day, date]);

  const busySet = useMemo(() => {
    const set = new Set<string>();
    for (const b of bookings) {
      if (b.masterId === masterId) set.add(b.day + "|" + b.time);
    }
    return set;
  }, [bookings, masterId]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!serviceId || !masterId || !date || !day || !time) {
      setStatus("error");
      setMessage("Заполните все поля");
      return;
    }
    if (busySet.has(day + "|" + time)) {
      setStatus("error");
      setMessage("Этот слот занят");
      return;
    }
    setStatus("loading");
    setMessage("");
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ serviceId, masterId, date, day, time }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Ошибка записи");
      setBookings((prev) => [...prev, data.booking as Booking]);
      setStatus("ok");
      setMessage("Запись сохранена");
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Ошибка записи");
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="flex w-full max-w-3xl flex-col items-center gap-12"
    >
      <div className="grid w-full grid-cols-1 gap-10 sm:grid-cols-3">
        <label className="flex flex-col gap-3 text-sm font-light text-white">
          <span>Услуга</span>
          <select
            value={serviceId}
            onChange={(e) => setServiceId(e.target.value)}
            className="appearance-none border-0 border-b border-white bg-transparent pb-2 text-sm text-white outline-none"
          >
            {services.map((s) => (
              <option key={s.id} value={s.id} className="bg-black text-white">
                {s.name}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-3 text-sm font-light text-white">
          <span>Мастер</span>
          <select
            value={masterId}
            onChange={(e) => setMasterId(e.target.value)}
            className="appearance-none border-0 border-b border-white bg-transparent pb-2 text-sm text-white outline-none"
          >
            {masters.map((m) => (
              <option key={m.id} value={m.id} className="bg-black text-white">
                {m.name}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-3 text-sm font-light text-white">
          <span>Дата</span>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="appearance-none border-0 border-b border-white bg-transparent pb-2 text-sm text-white outline-none [color-scheme:dark]"
          />
        </label>
      </div>

      <div className="grid w-full grid-cols-7 gap-2 md:gap-4">
        {weekDays.map((d) => {
          const slots = timeSlotsByDay[d] || [];
          return (
            <div key={d} className="flex flex-col items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setDay(d);
                  setDate(nextDateForDay(d));
                  if (slots[0]) setTime(slots[0]);
                }}
                className={
                  "text-xs font-light tracking-wider md:text-sm " +
                  (day === d ? "text-white" : "text-white/50")
                }
              >
                {d}
              </button>
              <div className="flex flex-col gap-2">
                {slots.map((t) => {
                  const busy = busySet.has(d + "|" + t);
                  const selected = day === d && time === t;
                  return (
                    <button
                      key={d + t}
                      type="button"
                      disabled={busy}
                      onClick={() => {
                        setDay(d);
                        setTime(t);
                        setDate(nextDateForDay(d));
                      }}
                      className={
                        "relative min-w-[3.25rem] border px-2 py-1.5 text-[11px] font-light tracking-wide transition md:min-w-[3.75rem] md:text-xs " +
                        (busy
                          ? "cursor-not-allowed border-white/20 text-white/30"
                          : selected
                            ? "border-burgundy bg-burgundy text-white"
                            : "border-white/80 text-white hover:border-burgundy")
                      }
                    >
                      {t}
                      {busy ? (
                        <span className="absolute -right-1 -top-1 text-[8px] text-white">
                          ●
                        </span>
                      ) : null}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <button
        type="submit"
        disabled={status === "loading"}
        className="bg-burgundy px-14 py-3 text-xs font-light tracking-[0.22em] text-white transition hover:brightness-110 disabled:opacity-60 md:text-sm"
      >
        {status === "loading" ? "…" : "ЗАБРОНИРОВАТЬ"}
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

import { promises as fs } from "fs";
import path from "path";

export type Booking = {
  id: string;
  serviceId: string;
  masterId: string;
  date: string;
  day: string;
  time: string;
  createdAt: string;
  clientName?: string;
};

const DATA_PATH = path.join(process.cwd(), "data", "bookings.json");

const seed: Booking[] = [
  {
    id: "seed-1",
    serviceId: "gel",
    masterId: "anastasiya",
    date: "2026-09-08",
    day: "ВТ",
    time: "11:00",
    createdAt: "2026-09-01T10:00:00.000Z",
    clientName: "Елена",
  },
  {
    id: "seed-2",
    serviceId: "combo",
    masterId: "polina",
    date: "2026-09-10",
    day: "ЧТ",
    time: "14:00",
    createdAt: "2026-09-02T12:00:00.000Z",
    clientName: "Ольга",
  },
  {
    id: "seed-3",
    serviceId: "extension",
    masterId: "mariya",
    date: "2026-09-12",
    day: "СБ",
    time: "13:00",
    createdAt: "2026-09-03T09:30:00.000Z",
    clientName: "Ирина",
  },
];

async function ensureFile(): Promise<void> {
  try {
    await fs.access(DATA_PATH);
  } catch {
    await fs.mkdir(path.dirname(DATA_PATH), { recursive: true });
    await fs.writeFile(DATA_PATH, JSON.stringify(seed, null, 2), "utf8");
  }
}

export async function getBookings(): Promise<Booking[]> {
  await ensureFile();
  const raw = await fs.readFile(DATA_PATH, "utf8");
  return JSON.parse(raw) as Booking[];
}

export async function addBooking(
  input: Omit<Booking, "id" | "createdAt">
): Promise<Booking> {
  const bookings = await getBookings();
  const conflict = bookings.find(
    (b) =>
      b.masterId === input.masterId &&
      b.day === input.day &&
      b.time === input.time &&
      b.date === input.date
  );
  if (conflict) {
    throw new Error("Слот уже занят");
  }
  const booking: Booking = {
    ...input,
    id: "b-" + Date.now().toString(36),
    createdAt: new Date().toISOString(),
  };
  bookings.push(booking);
  await fs.writeFile(DATA_PATH, JSON.stringify(bookings, null, 2), "utf8");
  return booking;
}

export function isSlotBusy(
  bookings: Booking[],
  masterId: string,
  day: string,
  time: string
): boolean {
  return bookings.some(
    (b) => b.masterId === masterId && b.day === day && b.time === time
  );
}

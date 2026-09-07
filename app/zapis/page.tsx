import { Suspense } from "react";

export const dynamic = "force-dynamic";
import BookingForm from "@/components/BookingForm";
import { getBookings } from "@/lib/bookings";

export default async function ZapisPage() {
  const bookings = await getBookings();

  return (
    <div className="relative flex flex-1 flex-col items-center px-4 pb-16 pt-10 md:px-6">
      <h1 className="mb-12 text-4xl font-extralight tracking-wide text-white md:text-5xl">
        Запись
      </h1>
      <Suspense
        fallback={
          <p className="text-sm font-light text-white/60">Загрузка…</p>
        }
      >
        <BookingForm initialBookings={bookings} />
      </Suspense>
      <p className="absolute bottom-6 left-6 text-xs font-light text-white/70">
        ● точка = занято
      </p>
    </div>
  );
}

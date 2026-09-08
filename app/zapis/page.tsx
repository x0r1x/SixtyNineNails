import { Suspense } from "react";
import BookingForm from "@/components/BookingForm";

export const dynamic = "force-dynamic";

export default function ZapisPage() {
  return (
    <div className="relative flex flex-1 flex-col items-center px-4 pb-16 pt-10 md:px-6">
      <h1 className="sn-reveal mb-12 text-4xl font-extralight tracking-display text-white md:text-5xl">
        Запись
      </h1>
      <Suspense
        fallback={
          <p className="text-sm font-light text-white/60">Загрузка…</p>
        }
      >
        <BookingForm />
      </Suspense>
    </div>
  );
}

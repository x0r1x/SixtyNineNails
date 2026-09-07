import Link from "next/link";
import MasterCircle from "@/components/MasterCircle";
import { getCatalogMasters } from "@/lib/dikidi";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const { masters } = await getCatalogMasters();

  return (
    <div className="flex flex-1 flex-col">
      <section className="flex flex-1 flex-col items-center justify-center px-6 pb-10 pt-8 text-center">
        <h1 className="text-5xl font-extralight tracking-wide text-white md:text-7xl">
          Маникюр
        </h1>
        <p className="mt-5 max-w-md text-sm font-light leading-relaxed text-white/90 md:text-base">
          Красота в деталях. Уверенность в каждом жесте.
        </p>
        <div className="mt-6 h-px w-16 bg-burgundy" />
        <Link
          href="/zapis"
          className="mt-8 border border-burgundy px-10 py-3 text-xs font-light tracking-[0.2em] text-white transition hover:bg-burgundy/20 md:text-sm"
        >
          ЗАПИСАТЬСЯ
        </Link>
      </section>

      <div className="mx-auto w-full max-w-3xl border-t border-white/20 px-6 pb-16 pt-10">
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4 sm:gap-6">
          {masters.map((m) => (
            <MasterCircle key={m.id} name={m.name} showDash />
          ))}
        </div>
      </div>
    </div>
  );
}

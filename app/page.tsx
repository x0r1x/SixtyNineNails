import Link from "next/link";
import MasterCircle from "@/components/MasterCircle";
import { getCatalogMasters } from "@/lib/dikidi";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const { masters } = await getCatalogMasters();

  return (
    <div className="flex flex-1 flex-col">
      <section className="flex flex-1 flex-col items-center justify-center px-6 pb-10 pt-8 text-center">
        <h1
          className="sn-reveal text-5xl font-extralight tracking-display text-white md:text-7xl"
          style={{ ["--sn-delay" as string]: "0ms" }}
        >
          Маникюр
        </h1>
        <p
          className="sn-reveal mt-5 max-w-md text-sm font-light leading-relaxed text-white/90 md:text-base"
          style={{ ["--sn-delay" as string]: "60ms" }}
        >
          Красота в деталях. Уверенность в каждом жесте.
        </p>
        <div
          className="sn-reveal mt-6 h-px w-16 bg-burgundy"
          style={{ ["--sn-delay" as string]: "100ms" }}
        />
        <Link
          href="/zapis"
          className="sn-reveal sn-btn mt-8 border border-burgundy px-10 py-3 text-xs font-light tracking-label text-white hover:bg-burgundy/20 md:text-sm"
          style={{ ["--sn-delay" as string]: "140ms" }}
        >
          ЗАПИСАТЬСЯ
        </Link>
      </section>

      <div className="mx-auto w-full max-w-3xl border-t border-white/20 px-6 pb-16 pt-10">
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4 sm:gap-6">
          {masters.map((m, i) => (
            <div
              key={m.id}
              className="sn-reveal"
              style={{ ["--sn-delay" as string]: `${160 + i * 40}ms` }}
            >
              <MasterCircle name={m.name} image={m.image} showDash />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

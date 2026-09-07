import MasterCircle from "@/components/MasterCircle";
import { getCatalogMasters } from "@/lib/dikidi";

export const dynamic = "force-dynamic";

export default async function MasteraPage() {
  const { masters, source } = await getCatalogMasters();

  return (
    <div className="flex flex-1 flex-col items-center px-6 pb-20 pt-10">
      <h1 className="mb-14 text-4xl font-extralight tracking-wide text-white md:text-5xl">
        Мастера
      </h1>
      <div className="grid w-full max-w-4xl grid-cols-2 gap-10 sm:grid-cols-4 sm:gap-8">
        {masters.map((m) => (
          <MasterCircle
            key={m.id}
            name={m.name}
            specialty={m.specialty}
            chooseHref={"/zapis?master=" + m.id}
          />
        ))}
      </div>
      {source === "static" ? (
        <p className="mt-10 text-xs font-light text-white/40">
          Показаны локальные данные (API недоступен)
        </p>
      ) : null}
    </div>
  );
}

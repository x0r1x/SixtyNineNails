import MasterCircle from "@/components/MasterCircle";
import { masters } from "@/lib/data";

export default function MasteraPage() {
  return (
    <div className="flex flex-1 flex-col items-center px-6 pb-20 pt-10">
      <h1 className="mb-14 text-4xl font-extralight tracking-wide text-white md:text-5xl">
        Мастера
      </h1>
      <div className="grid w-full max-w-3xl grid-cols-1 gap-12 sm:grid-cols-3 sm:gap-8">
        {masters.map((m) => (
          <MasterCircle
            key={m.id}
            name={m.name}
            specialty={m.specialty}
            chooseHref={"/zapis?master=" + m.id}
          />
        ))}
      </div>
    </div>
  );
}

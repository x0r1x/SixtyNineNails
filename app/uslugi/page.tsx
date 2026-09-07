import Link from "next/link";
import { formatPrice } from "@/lib/data";
import {
  categoriesFromServices,
  getCatalogServices,
} from "@/lib/dikidi";

export const dynamic = "force-dynamic";

export default async function UslugiPage() {
  const { services, source } = await getCatalogServices();
  const categories = categoriesFromServices(services);

  return (
    <div className="flex flex-1 flex-col items-center px-6 pb-20 pt-10">
      <h1 className="mb-12 text-4xl font-extralight tracking-wide text-white md:text-5xl">
        Услуги
      </h1>
      <div className="w-full max-w-xl space-y-10">
        {categories.map((category) => {
          const items = services.filter((s) => s.category === category);
          if (items.length === 0) return null;
          return (
            <section key={category}>
              <h2 className="mb-3 text-xs font-light uppercase tracking-[0.25em] text-burgundy">
                {category}
              </h2>
              <ul>
                {items.map((service) => (
                  <li
                    key={service.id}
                    className="flex items-baseline justify-between gap-6 border-b border-white/15 py-4 text-sm font-light text-white md:text-base"
                  >
                    <span>{service.name}</span>
                    <span className="shrink-0 tabular-nums text-white/90">
                      {formatPrice(service.price, service.priceFrom)}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
      {source === "static" ? (
        <p className="mt-6 text-xs font-light text-white/40">
          Показан локальный прайс (API недоступен)
        </p>
      ) : null}
      <Link
        href="/zapis"
        className="mt-14 text-sm font-light text-burgundy transition hover:opacity-80"
      >
        Записаться →
      </Link>
    </div>
  );
}

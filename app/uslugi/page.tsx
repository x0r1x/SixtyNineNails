import Link from "next/link";
import { formatPrice } from "@/lib/data";
import {
  categoriesFromServices,
  getCatalogServices,
} from "@/lib/dikidi";

export const dynamic = "force-dynamic";

function categoryAnchor(category: string): string {
  const slug = category
    .toLowerCase()
    .replace(/[^a-zа-яё0-9]+/gi, "-")
    .replace(/^-|-$/g, "");
  return "cat-" + (slug || "other");
}

export default async function UslugiPage() {
  const { services, source } = await getCatalogServices();
  const categories = categoriesFromServices(services);

  return (
    <div className="flex flex-1 flex-col items-center px-6 pb-20 pt-10">
      <h1 className="mb-10 text-4xl font-extralight tracking-display text-white md:text-5xl">
        Услуги
      </h1>

      {categories.length > 1 ? (
        <nav
          className="mb-12 flex max-w-2xl flex-wrap justify-center gap-2"
          aria-label="Категории услуг"
        >
          {categories.map((category) => (
            <a
              key={category}
              href={"#" + categoryAnchor(category)}
              className="border border-white/40 px-3 py-2 text-[11px] font-light tracking-[0.16em] text-white/80 transition hover:border-burgundy hover:text-white"
            >
              {category}
            </a>
          ))}
        </nav>
      ) : null}

      <div className="w-full max-w-xl space-y-12">
        {categories.map((category) => {
          const items = services.filter((s) => s.category === category);
          if (items.length === 0) return null;
          const id = categoryAnchor(category);
          return (
            <section key={category} id={id} className="scroll-mt-28">
              <h2 className="mb-3 text-xs font-light uppercase tracking-[0.25em] text-burgundy">
                {category}
              </h2>
              <ul>
                {items.map((service) => (
                  <li key={service.id}>
                    <Link
                      href={"/zapis?service=" + encodeURIComponent(service.id)}
                      className="flex items-baseline justify-between gap-6 border-b border-white/15 py-4 text-sm font-light text-white transition hover:text-white/80 md:text-base"
                    >
                      <span>{service.name}</span>
                      <span className="shrink-0 sn-price tabular-nums text-white/90">
                        {formatPrice(service.price, service.priceFrom)}
                      </span>
                    </Link>
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

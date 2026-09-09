import Link from "next/link";
import { fetchBeautyCompany } from "@/lib/dikidi";

export const dynamic = "force-dynamic";

export default async function AboutPage() {
  let company: Awaited<ReturnType<typeof fetchBeautyCompany>> | null = null;
  try {
    company = await fetchBeautyCompany();
  } catch {
    company = null;
  }

  const phone = company?.phone;
  const telHref = phone
    ? "tel:" + phone.replace(/[^\d+]/g, "")
    : undefined;
  const mapSrc =
    company?.lat != null && company?.lng != null
      ? `https://yandex.ru/map-widget/v1/?ll=${company.lng}%2C${company.lat}&z=16&pt=${company.lng},${company.lat},pm2rdm&l=map`
      : null;

  return (
    <div className="flex flex-1 flex-col items-center px-6 pb-20 pt-10">
      <h1 className="sn-reveal mb-12 text-4xl font-extralight tracking-display text-white md:mb-14 md:text-5xl">
        О нас
      </h1>

      <div className="w-full max-w-xl space-y-6 text-center">
        <p
          className="sn-reveal text-sm font-light leading-relaxed tracking-[0.04em] text-white/75 md:text-base"
          style={{ ["--sn-delay" as string]: "60ms" }}
        >
          Sixty Nine Nails — студия ногтевого сервиса, визажа и бровей. Спокойный
          ритм, внимание к форме и деталям.
        </p>
        {company?.description ? (
          <p
            className="sn-reveal text-xs font-light tracking-[0.12em] text-white/45"
            style={{ ["--sn-delay" as string]: "110ms" }}
          >
            {company.description}
          </p>
        ) : null}
        {company?.scheduleLabel ? (
          <p
            className="sn-reveal text-xs font-light tracking-[0.16em] text-white/55"
            style={{ ["--sn-delay" as string]: "140ms" }}
          >
            {company.scheduleLabel}
          </p>
        ) : null}
      </div>

      <div className="mt-12 w-full max-w-xl space-y-5 text-center">
        {company?.addressLine ? (
          <div
            className="sn-reveal-stagger space-y-1"
            style={{ ["--sn-delay" as string]: "180ms" }}
          >
            <p className="text-[10px] font-light uppercase tracking-[0.22em] text-white/40">
              адрес
            </p>
            <p className="text-sm font-light tracking-[0.06em] text-white/85 md:text-base">
              {company.addressLine}
            </p>
          </div>
        ) : null}

        {phone && telHref ? (
          <div
            className="sn-reveal-stagger space-y-1"
            style={{ ["--sn-delay" as string]: "240ms" }}
          >
            <p className="text-[10px] font-light uppercase tracking-[0.22em] text-white/40">
              телефон
            </p>
            <a
              href={telHref}
              className="sn-link-burgundy text-sm font-light tracking-[0.08em] text-white hover:text-burgundy md:text-base"
            >
              {phone}
            </a>
          </div>
        ) : null}

        <div
          className="sn-reveal-stagger flex flex-wrap items-center justify-center gap-x-5 gap-y-2 pt-2"
          style={{ ["--sn-delay" as string]: "300ms" }}
        >
          {company?.whatsappUrl ? (
            <a
              href={company.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="sn-link-burgundy text-xs font-light tracking-[0.14em] text-burgundy"
            >
              WhatsApp
            </a>
          ) : null}
          {company?.links.map((l) => (
            <a
              key={l.url}
              href={l.url}
              target="_blank"
              rel="noopener noreferrer"
              className="sn-link-burgundy text-xs font-light tracking-[0.14em] text-burgundy"
            >
              {l.title}
            </a>
          ))}
          {company?.dikidiUrl ? (
            <a
              href={company.dikidiUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="sn-link-burgundy text-xs font-light tracking-[0.14em] text-burgundy"
            >
              Dikidi
            </a>
          ) : null}
        </div>
      </div>

      {mapSrc ? (
        <div
          className="sn-reveal mt-14 w-full max-w-3xl overflow-hidden rounded-sm border border-white/15"
          style={{ ["--sn-delay" as string]: "360ms" }}
        >
          <iframe
            title="Карта — SixtyNineNails"
            src={mapSrc}
            className="h-64 w-full border-0 md:h-80"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>
      ) : null}

      <div
        className="sn-reveal mt-14 flex flex-col items-center gap-4"
        style={{ ["--sn-delay" as string]: "420ms" }}
      >
        <Link
          href="/zapis"
          className="sn-btn border border-burgundy bg-burgundy px-14 py-3 text-xs font-light tracking-label text-white hover:brightness-110 md:text-sm"
        >
          записаться
        </Link>
        <Link
          href="/mastera"
          className="sn-link-burgundy text-xs font-light tracking-wide text-burgundy"
        >
          посмотреть мастеров
        </Link>
      </div>
    </div>
  );
}

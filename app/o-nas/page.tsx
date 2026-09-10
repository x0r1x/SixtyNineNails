import Link from "next/link";
import { fetchBeautyCompany } from "@/lib/dikidi";

export const dynamic = "force-dynamic";

const SOCIAL_LINKS = [
  { label: "Telegram", href: "https://t.me/SixtyNineNails" },
  { label: "ВКонтакте", href: "https://m.vk.ru/club217259252" },
] as const;

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

  const lat = company?.lat;
  const lng = company?.lng;
  const hasCoords = lat != null && lng != null;
  const staticMapSrc = hasCoords
    ? `https://static-maps.yandex.ru/1.x/?ll=${lng},${lat}&size=650,450&z=16&l=map&pt=${lng},${lat},pm2rdm&lang=ru_RU`
    : null;
  const yandexMapsUrl = hasCoords
    ? `https://yandex.ru/maps/?pt=${lng},${lat}&z=16&l=map`
    : null;

  const socials = [
    ...(company?.whatsappUrl
      ? [{ label: "WhatsApp", href: company.whatsappUrl }]
      : []),
    ...SOCIAL_LINKS,
    ...(company?.links || []).map((l) => ({ label: l.title, href: l.url })),
  ];

  return (
    <div className="flex flex-1 flex-col items-center px-6 pb-20 pt-10">
      <h1 className="sn-reveal mb-10 text-4xl font-extralight tracking-display text-white md:text-5xl">
        О нас
      </h1>

      <div className="w-full max-w-xl space-y-12">
        <section
          className="sn-reveal"
          style={{ ["--sn-delay" as string]: "60ms" }}
        >
          <h2 className="mb-3 text-xs font-light uppercase tracking-[0.25em] text-burgundy">
            студия
          </h2>
          <p className="text-sm font-light leading-relaxed text-white/80 md:text-base">
            Sixty Nine Nails — ногтевой сервис, визаж и брови. Спокойный ритм и
            внимание к форме и деталям.
          </p>
          {company?.description ? (
            <p className="mt-3 text-sm font-light text-white/50">
              {company.description}
            </p>
          ) : null}
        </section>

        <section
          className="sn-reveal"
          style={{ ["--sn-delay" as string]: "120ms" }}
        >
          <h2 className="mb-3 text-xs font-light uppercase tracking-[0.25em] text-burgundy">
            контакты
          </h2>
          <ul>
            {company?.addressLine ? (
              <li className="border-b border-white/15 px-1 py-4">
                <p className="text-[11px] font-light tracking-[0.16em] text-white/45">
                  адрес
                </p>
                <p className="mt-1 text-sm font-light text-white md:text-base">
                  {company.addressLine}
                </p>
              </li>
            ) : null}
            {phone && telHref ? (
              <li className="border-b border-white/15 px-1 py-4">
                <p className="text-[11px] font-light tracking-[0.16em] text-white/45">
                  телефон
                </p>
                <a
                  href={telHref}
                  className="mt-1 inline-block text-sm font-light text-white hover:text-burgundy md:text-base"
                >
                  {phone}
                </a>
              </li>
            ) : null}
            {company?.scheduleLabel ? (
              <li className="border-b border-white/15 px-1 py-4">
                <p className="text-[11px] font-light tracking-[0.16em] text-white/45">
                  часы
                </p>
                <p className="mt-1 text-sm font-light text-white md:text-base">
                  {company.scheduleLabel}
                </p>
              </li>
            ) : null}
            {socials.length > 0 ? (
              <li className="border-b border-white/15 px-1 py-4">
                <p className="text-[11px] font-light tracking-[0.16em] text-white/45">
                  связь
                </p>
                <div className="mt-2 flex flex-wrap gap-x-5 gap-y-2">
                  {socials.map((s) => (
                    <a
                      key={s.href}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="sn-link-burgundy text-sm font-light text-burgundy"
                    >
                      {s.label}
                    </a>
                  ))}
                </div>
              </li>
            ) : null}
          </ul>
        </section>

        {staticMapSrc && yandexMapsUrl ? (
          <section
            className="sn-reveal"
            style={{ ["--sn-delay" as string]: "180ms" }}
          >
            <h2 className="mb-3 text-xs font-light uppercase tracking-[0.25em] text-burgundy">
              на карте
            </h2>
            <a
              href={yandexMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block overflow-hidden border border-white/15 transition hover:border-white/30"
              aria-label="Открыть адрес в Яндекс.Картах"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={staticMapSrc}
                alt="SixtyNineNails на карте"
                width={650}
                height={450}
                className="h-auto w-full object-cover"
              />
            </a>
            <a
              href={yandexMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="sn-link-burgundy mt-3 inline-block text-xs font-light text-burgundy"
            >
              открыть в Яндекс.Картах →
            </a>
          </section>
        ) : null}
      </div>

      <div
        className="sn-reveal mt-14 flex flex-col items-center gap-3"
        style={{ ["--sn-delay" as string]: "240ms" }}
      >
        <Link
          href="/zapis"
          className="sn-link-burgundy text-sm font-light text-burgundy"
        >
          Записаться →
        </Link>
        <Link
          href="/mastera"
          className="text-xs font-light tracking-wide text-white/45 hover:text-white/70"
        >
          мастера
        </Link>
      </div>
    </div>
  );
}

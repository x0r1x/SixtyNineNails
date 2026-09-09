import Link from "next/link";

const pillars = [
  {
    title: "маникюр и педикюр",
    text: "аккуратная работа с формой и покрытием — без спешки и лишнего шума",
  },
  {
    title: "макияж и образ",
    text: "если нужен выходной look — рядом визаж и укладка в том же спокойном ритме",
  },
  {
    title: "запись онлайн",
    text: "выбираете мастера и время на сайте — без переписок и ожидания ответа",
  },
];

export default function AboutPage() {
  return (
    <div className="flex flex-1 flex-col items-center px-6 pb-20 pt-10">
      <h1 className="sn-reveal mb-14 text-4xl font-extralight tracking-display text-white md:mb-16 md:text-5xl">
        О нас
      </h1>

      <div className="w-full max-w-xl space-y-8 text-center">
        <p
          className="sn-reveal text-sm font-light leading-relaxed tracking-[0.04em] text-white/75 md:text-base md:leading-relaxed"
          style={{ ["--sn-delay" as string]: "70ms" }}
        >
          Sixty Nine Nails — студия, где маникюр и уход звучат тихо: чистые линии,
          внимательные руки и пространство без суеты.
        </p>
        <p
          className="sn-reveal text-sm font-light leading-relaxed tracking-[0.04em] text-white/65 md:text-base"
          style={{ ["--sn-delay" as string]: "140ms" }}
        >
          Мы собираем мастеров, которым важны детали — от формы ногтя до финального
          блеска. Здесь можно просто прийти и доверить процесс.
        </p>
        <p
          className="sn-reveal text-sm font-light leading-relaxed tracking-[0.04em] text-white/65 md:text-base"
          style={{ ["--sn-delay" as string]: "210ms" }}
        >
          Запись — онлайн: выберите услугу, мастера и удобный слот. Мы на связи
          через сайт.
        </p>
      </div>

      <div className="mt-16 grid w-full max-w-3xl gap-4 sm:grid-cols-3 sm:gap-5">
        {pillars.map((item, i) => (
          <div
            key={item.title}
            className="sn-reveal-stagger rounded-sm border border-white/15 px-5 py-6 text-center"
            style={{ ["--sn-delay" as string]: `${280 + i * 70}ms` }}
          >
            <p className="text-[11px] font-light uppercase tracking-[0.2em] text-white/90">
              {item.title}
            </p>
            <p className="mt-3 text-[12px] font-light leading-snug text-white/50 md:text-xs">
              {item.text}
            </p>
          </div>
        ))}
      </div>

      <div
        className="sn-reveal mt-16 flex flex-col items-center gap-4"
        style={{ ["--sn-delay" as string]: "520ms" }}
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

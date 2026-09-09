import Image from "next/image";
import Link from "next/link";

type Props = {
  name: string;
  specialty?: string;
  image?: string;
  showDash?: boolean;
  chooseHref?: string;
  size?: "sm" | "lg";
};

export default function MasterCircle({
  name,
  specialty,
  image,
  showDash = false,
  chooseHref,
  size = "sm",
}: Props) {
  const dim =
    size === "lg" ? "h-40 w-40 md:h-44 md:w-44" : "h-24 w-24 md:h-28 md:w-28";
  const px = size === "lg" ? 176 : 112;

  return (
    <div className="sn-master flex flex-col items-center gap-3 text-center">
      <div className={`relative ${dim}`}>
        <div
          className={`sn-master-ring relative h-full w-full overflow-hidden rounded-full border border-white/80 bg-white/5`}
        >
          {image ? (
            <Image
              src={image}
              alt={name}
              width={px}
              height={px}
              className="h-full w-full object-cover"
              unoptimized
            />
          ) : null}
        </div>
        {chooseHref ? (
          <Link
            href={chooseHref}
            className="absolute inset-0 z-10 rounded-full outline-none focus-visible:ring-1 focus-visible:ring-burgundy"
            aria-label={`Выбрать мастера ${name}`}
          />
        ) : null}
      </div>
      <div className="space-y-1">
        <p
          className={`font-light tracking-[0.18em] text-white ${
            size === "lg" ? "text-xs md:text-sm" : "text-xs md:text-sm"
          }`}
        >
          {name}
        </p>
        {specialty ? (
          <p className="max-w-[10rem] text-[11px] font-light leading-snug text-white/55 md:text-xs">
            {specialty}
          </p>
        ) : null}
        {showDash ? (
          <div className="mx-auto mt-1 h-px w-6 bg-white/80" />
        ) : null}
        {chooseHref ? (
          <Link
            href={chooseHref}
            className="sn-link-burgundy mt-2 inline-block text-xs font-light tracking-wide text-burgundy"
          >
            выбрать
          </Link>
        ) : null}
      </div>
    </div>
  );
}

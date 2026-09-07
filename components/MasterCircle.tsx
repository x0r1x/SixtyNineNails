type Props = {
  name: string;
  specialty?: string;
  showDash?: boolean;
  chooseHref?: string;
};

export default function MasterCircle({
  name,
  specialty,
  showDash = false,
  chooseHref,
}: Props) {
  return (
    <div className="flex flex-col items-center gap-3 text-center">
      <div className="h-24 w-24 rounded-full border border-white/80 md:h-28 md:w-28" />
      <div className="space-y-1">
        <p className="text-xs font-light tracking-[0.18em] text-white md:text-sm">
          {name}
        </p>
        {specialty ? (
          <p className="text-[11px] font-light text-white/70 md:text-xs">
            {specialty}
          </p>
        ) : null}
        {showDash ? (
          <div className="mx-auto mt-1 h-px w-6 bg-white/80" />
        ) : null}
        {chooseHref ? (
          <a
            href={chooseHref}
            className="mt-2 inline-block text-xs font-light text-burgundy transition hover:opacity-80"
          >
            выбрать
          </a>
        ) : null}
      </div>
    </div>
  );
}

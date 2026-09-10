type SocialItem = {
  label: string;
  href: string;
  kind: "whatsapp" | "telegram" | "vk" | "other";
};

function IconWhatsApp({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M12.04 2C6.58 2 2.15 6.4 2.15 11.83c0 1.97.55 3.8 1.51 5.4L2 22l4.95-1.6a10 10 0 0 0 5.09 1.4h.01c5.46 0 9.89-4.4 9.89-9.83C21.94 6.4 17.5 2 12.04 2zm5.77 13.99c-.24.68-1.4 1.25-1.93 1.33-.5.07-1.13.1-1.82-.11-.42-.14-.96-.31-1.66-.61-2.92-1.26-4.82-4.2-4.97-4.4-.14-.2-1.2-1.6-1.2-3.05 0-1.45.76-2.16 1.03-2.45.27-.3.59-.37.79-.37h.57c.18 0 .43-.07.67.51.24.6.82 2.07.89 2.22.07.15.12.32.02.52-.1.2-.15.32-.3.5-.15.17-.31.39-.45.52-.15.15-.3.31-.13.6.17.3.76 1.25 1.63 2.02 1.12 1 2.07 1.31 2.36 1.46.3.15.47.12.64-.07.17-.2.74-.86.94-1.15.2-.3.4-.24.67-.14.27.1 1.72.81 2.02.96.3.15.5.22.57.34.07.13.07.74-.17 1.42z" />
    </svg>
  );
}

function IconTelegram({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm4.6 6.8-1.55 7.3c-.12.53-.42.66-.86.41l-2.37-1.75-1.14 1.1c-.13.13-.23.23-.47.23l.17-2.4 4.37-3.95c.19-.17-.04-.26-.3-.1l-5.4 3.4-2.33-.73c-.5-.16-.51-.5.11-.75l9.1-3.51c.42-.16.79.1.67.55z" />
    </svg>
  );
}

function IconVk({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M12.63 16.5h1.18s.36-.04.54-.24c.17-.18.16-.52.16-.52s-.02-1.58.71-1.81c.72-.23 1.64 1.53 2.62 2.2.74.51 1.3.4 1.3.4l2.61-.04s1.37-.08.72-1.16c-.05-.09-.38-.8-1.95-2.26-1.65-1.53-1.43-1.28.56-3.92.1-.21 1.2-2.2.98-2.58-.21-.36-.8-.27-.8-.27l-2.78.02s-.2-.03-.36.07c-.15.09-.25.3-.25.3s-.45 1.2-1.05 2.22c-1.26 2.16-1.77 2.27-1.97 2.14-.48-.3-.36-1.22-.36-1.87 0-2.03.31-2.88-.6-3.1-.3-.07-.52-.12-1.29-.13-.99-.01-1.82.01-2.3.23-.31.14-.56.47-.41.49.19.02.61.11.84.42.29.4.28 1.3.28 1.3s.17 2.36-.39 2.65c-.38.2-.91-.21-2.04-2.18-.58-1-1.01-2.12-1.01-2.12s-.08-.2-.23-.31c-.18-.13-.43-.17-.43-.17l-2.64.02s-.4.01-.54.18c-.13.15-.01.47-.01.47s1.89 4.43 4.03 6.66c1.96 2.04 4.19 1.91 4.19 1.91z" />
    </svg>
  );
}

function kindFrom(label: string, href: string): SocialItem["kind"] {
  const s = (label + " " + href).toLowerCase();
  if (s.includes("whatsapp") || s.includes("wa.me")) return "whatsapp";
  if (s.includes("telegram") || s.includes("t.me")) return "telegram";
  if (s.includes("vk") || s.includes("vk.ru") || s.includes("vkontakte"))
    return "vk";
  return "other";
}

export default function SocialLinks({
  items,
}: {
  items: { label: string; href: string }[];
}) {
  const list: SocialItem[] = items.map((i) => ({
    ...i,
    kind: kindFrom(i.label, i.href),
  }));

  return (
    <div className="mt-2 flex flex-wrap items-center gap-4">
      {list.map((s) => (
        <a
          key={s.href}
          href={s.href}
          target="_blank"
          rel="noopener noreferrer"
          className="sn-link-burgundy inline-flex items-center gap-2 text-sm font-light text-burgundy"
          aria-label={s.label}
        >
          {s.kind === "whatsapp" ? (
            <IconWhatsApp className="h-5 w-5 shrink-0" />
          ) : null}
          {s.kind === "telegram" ? (
            <IconTelegram className="h-5 w-5 shrink-0" />
          ) : null}
          {s.kind === "vk" ? <IconVk className="h-5 w-5 shrink-0" /> : null}
          <span>{s.label}</span>
        </a>
      ))}
    </div>
  );
}

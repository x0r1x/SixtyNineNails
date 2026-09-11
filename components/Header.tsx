"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/uslugi", label: "Услуги" },
  { href: "/mastera", label: "Мастера" },
  { href: "/zapis", label: "Запись" },
  { href: "/o-nas", label: "О нас" },
];

export default function Header() {
  const pathname = usePathname();

  // Home owns Soft splash → Hero header + flying logo
  if (pathname === "/") return null;

  return (
    <header className="relative z-20 flex w-full items-center gap-3 px-4 py-4 md:gap-6 md:px-12 md:py-6">
      <Link href="/" className="shrink-0" aria-label="SixtyNineNails — главная">
        <Image
          src="/logo-small.png"
          alt="SixtyNineNails"
          width={72}
          height={72}
          className="h-11 w-11 object-contain md:h-[72px] md:w-[72px]"
          priority
        />
      </Link>
      <nav
        className="sn-header-nav flex min-w-0 flex-1 items-center gap-3 overflow-x-auto text-sm font-light tracking-nav text-white md:justify-end md:gap-4 md:overflow-visible md:text-base"
        aria-label="Основное меню"
      >
        {links.map((link, i) => {
          const active =
            pathname === link.href || pathname.startsWith(link.href + "/");
          return (
            <span
              key={link.href}
              className="flex shrink-0 items-center gap-3 md:gap-4"
            >
              {i > 0 && (
                <span className="text-[10px] text-white/70" aria-hidden>
                  •
                </span>
              )}
              <Link
                href={link.href}
                className={
                  active
                    ? "sn-nav-link whitespace-nowrap border-b border-burgundy pb-0.5 text-white"
                    : "sn-nav-link whitespace-nowrap border-b border-transparent pb-0.5 text-white/90 hover:border-burgundy hover:text-white"
                }
              >
                {link.label}
              </Link>
            </span>
          );
        })}
      </nav>
    </header>
  );
}

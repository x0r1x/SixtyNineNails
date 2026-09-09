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
    <header className="relative z-20 flex w-full items-center justify-between px-5 py-4 md:px-12 md:py-6">
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
      <nav className="flex items-center gap-3 text-sm font-light tracking-nav text-white md:gap-4 md:text-base">
        {links.map((link, i) => {
          const active =
            pathname === link.href || pathname.startsWith(link.href + "/");
          return (
            <span key={link.href} className="flex items-center gap-3 md:gap-4">
              {i > 0 && (
                <span className="text-[10px] text-white/70" aria-hidden>
                  •
                </span>
              )}
              <Link
                href={link.href}
                className={
                  active
                    ? "sn-nav-link border-b border-burgundy pb-0.5 text-white"
                    : "sn-nav-link border-b border-transparent pb-0.5 text-white/90 hover:border-burgundy hover:text-white"
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

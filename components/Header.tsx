"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/uslugi", label: "Услуги" },
  { href: "/mastera", label: "Мастера" },
  { href: "/zapis", label: "Запись" },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="flex w-full items-center justify-between px-6 py-6 md:px-12">
      <Link href="/" className="shrink-0" aria-label="SixtyNineNails — главная">
        <Image
          src="/logo.png"
          alt="SixtyNineNails"
          width={72}
          height={72}
          className="h-14 w-14 rounded-full object-cover md:h-16 md:w-16"
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
                    ? "border-b border-burgundy pb-0.5 text-white"
                    : "border-b border-transparent pb-0.5 text-white/90 transition hover:text-white"
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

"use client";

import { usePathname } from "next/navigation";

export default function PageEnter({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Home owns Soft splash → Hero; skip route enter there
  if (pathname === "/") {
    return <>{children}</>;
  }

  return (
    <div key={pathname} className="sn-page-enter flex min-h-0 flex-1 flex-col">
      {children}
    </div>
  );
}

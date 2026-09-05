"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { useReportLinkNavigation } from "./navigation-progress";
import { navItems, type NavItem } from "./nav-config";

function NavItemBody({ item, active }: { item: NavItem; active: boolean }) {
  const pending = useReportLinkNavigation();
  const Icon = item.icon;

  return (
    <span
      className={cn(
        "flex flex-1 items-center gap-3",
        pending && "opacity-90",
      )}
    >
      {pending ? (
        <Loader2 className="size-5 shrink-0 animate-spin" />
      ) : (
        <Icon className="size-5 shrink-0" />
      )}
      <span className="truncate">{item.title}</span>
      {pending && (
        <span className="ml-auto text-xs font-normal text-sidebar-muted">
          abrindo…
        </span>
      )}
      {!pending && active && (
        <span className="ml-auto size-1.5 shrink-0 rounded-full bg-primary" />
      )}
    </span>
  );
}

export function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-1 flex-col gap-1 px-3 py-4">
      {navItems.map((item) => {
        const active =
          item.href === "/"
            ? pathname === "/"
            : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={cn(
              "group flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              active
                ? "bg-sidebar-accent text-sidebar-foreground"
                : "text-sidebar-muted hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
            )}
          >
            <NavItemBody item={item} active={active} />
          </Link>
        );
      })}
    </nav>
  );
}

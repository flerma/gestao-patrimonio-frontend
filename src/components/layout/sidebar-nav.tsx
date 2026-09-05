"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useReportLinkNavigation } from "./navigation-progress";
import { navItems, type NavItem } from "./nav-config";

function NavItemBody({
  item,
  active,
  collapsed,
}: {
  item: NavItem;
  active: boolean;
  collapsed: boolean;
}) {
  const pending = useReportLinkNavigation();
  const Icon = item.icon;
  const icon = pending ? (
    <Loader2 className="size-5 shrink-0 animate-spin" />
  ) : (
    <Icon className="size-5 shrink-0" />
  );

  if (collapsed) return icon;

  return (
    <span className="flex flex-1 items-center gap-3">
      {icon}
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

export function SidebarNav({
  onNavigate,
  collapsed = false,
}: {
  onNavigate?: () => void;
  collapsed?: boolean;
}) {
  const pathname = usePathname();

  return (
    <TooltipProvider delayDuration={0} disableHoverableContent>
      <nav
        className={cn(
          "flex flex-1 flex-col gap-1 py-4",
          collapsed ? "items-center px-2" : "px-3",
        )}
      >
        {navItems.map((item) => {
          const active =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

          const link = (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              aria-label={collapsed ? item.title : undefined}
              className={cn(
                "group flex items-center rounded-lg text-sm font-medium transition-colors",
                collapsed ? "size-10 justify-center p-0" : "w-full px-3 py-2.5",
                active
                  ? "bg-sidebar-accent text-sidebar-foreground"
                  : "text-sidebar-muted hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
              )}
            >
              <NavItemBody item={item} active={active} collapsed={collapsed} />
            </Link>
          );

          if (!collapsed) return link;

          return (
            <Tooltip key={item.href}>
              <TooltipTrigger asChild>{link}</TooltipTrigger>
              <TooltipContent side="right" sideOffset={10}>
                {item.title}
              </TooltipContent>
            </Tooltip>
          );
        })}
      </nav>
    </TooltipProvider>
  );
}

"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Users,
  Package,
  CreditCard,
  BarChart3,
  Radio,
} from "lucide-react"

import { cn } from "@/lib/utils"

const menus = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Client",
    href: "/dashboard/clients",
    icon: Users,
  },
  {
    title: "Paket Iklan",
    href: "/dashboard/packages",
    icon: Package,
  },
  {
    title: "Subscription",
    href: "/dashboard/subscriptions",
    icon: Radio,
  },
  {
    title: "Pembayaran",
    href: "/dashboard/payments",
    icon: CreditCard,
  },
  {
    title: "Statistik Pendengar",
    href: "/dashboard/listener-stats",
    icon: BarChart3,
  },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden w-64 border-r bg-white lg:block">
      <div className="flex h-16 items-center border-b px-6">
        <div>
          <h2 className="text-lg font-bold tracking-tight">SIMERA</h2>
          <p className="text-xs text-muted-foreground">
            SaaS Manajemen Iklan dan Radio
          </p>
        </div>
      </div>

      <div className="space-y-2 p-4">
        <p className="px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Menu Utama
        </p>

        <nav className="grid gap-1">
          {menus.map((menu) => {
            const Icon = menu.icon

            const isActive =
              menu.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname === menu.href ||
                  pathname.startsWith(`${menu.href}/`)

            return (
              <Link
                key={menu.href}
                href={menu.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-slate-100",
                  isActive
                    ? "bg-slate-100 font-medium text-slate-900"
                    : "text-slate-600"
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{menu.title}</span>
              </Link>
            )
          })}
        </nav>
      </div>
    </aside>
  )
}
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BarChart3,
  CreditCard,
  LayoutDashboard,
  Package,
  Users,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"

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
    title: "Pembayaran",
    href: "/dashboard/payments",
    icon: CreditCard,
  },
  {
    title: "Statistik",
    href: "/dashboard/stats",
    icon: BarChart3,
  },
]

export function AppSidebar() {
  const pathname = usePathname()

  const isMenuActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard"
    }

    return pathname === href || pathname.startsWith(`${href}/`)
  }

  return (
    <Sidebar collapsible="icon" variant="sidebar">
      <SidebarHeader className="border-b px-4 py-4">
        <Link href="/dashboard" className="block space-y-1">
          <h2 className="text-lg font-bold tracking-tight">SIMERA</h2>
          <p className="text-xs text-muted-foreground">
            Manajemen Iklan Radio
          </p>
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-2 py-3">
        <SidebarGroup>
          <SidebarGroupLabel>Menu Utama</SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {menus.map((item) => {
                const Icon = item.icon
                const isActive = isMenuActive(item.href)

                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.title}
                      className="gap-3 rounded-lg"
                    >
                      <Link href={item.href}>
                        <Icon className="h-4 w-4 shrink-0" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t px-4 py-4">
        <div className="rounded-lg border bg-background/50 px-3 py-2">
          <p className="text-sm font-medium">Admin Radio</p>
          <p className="text-xs text-muted-foreground">
            admin@radioads.com
          </p>
        </div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
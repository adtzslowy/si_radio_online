"use client";

import Link from "next/link";
import { Menu, Bell, LogOut } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { signOut } from "@/app/(auth)/logout/actions";

const mobileMenus = [
  { title: "Dashboard", href: "/dashboard" },
  { title: "Client", href: "/dashboard/clients" },
  { title: "Paket Iklan", href: "/dashboard/packages" },
  { title: "Subscription", href: "/dashboard/subscriptions" },
  { title: "Pembayaran", href: "/dashboard/payments" },
  { title: "Statistik Pendengar", href: "/dashboard/listener-stats" },
];

export function AppNavbar() {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-white px-4 lg:px-6">
      <div className="flex items-center gap-3">
        <Sheet>
          <SheetTrigger asChild className="lg:hidden">
            <Button variant="outline" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>

          <SheetContent side="left" className="w-72 p-0">
            <div className="border-b px-6 py-4">
              <h2 className="text-lg font-bold">SIMERA</h2>
              <p className="text-xs text-muted-foreground">
                SaaS Manajemen Iklan dan Radio
              </p>
            </div>

            <nav className="grid gap-1 p-4">
              {mobileMenus.map((menu) => (
                <Link
                  key={menu.href}
                  href={menu.href}
                  className="rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
                >
                  {menu.title}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>

        <div>
          <h1 className="text-base font-semibold lg:text-lg">Dashboard</h1>
          <p className="text-xs text-muted-foreground">
            Kelola layanan iklan radio dengan mudah
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
        </Button>

        <Separator orientation="vertical" className="h-6" />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex h-auto items-center gap-2 px-2 py-1.5"
            >
              <Avatar className="h-8 w-8">
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
              <div className="hidden text-left md:block">
                <p className="text-sm font-medium">Admin Radio</p>
                <p className="text-xs text-muted-foreground">
                  admin@radioads.com
                </p>
              </div>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem asChild>
              <Link href="/dashboard/profile">Profil</Link>
            </DropdownMenuItem>

            <DropdownMenuItem asChild>
              <Link href="/dashboard/settings">Pengaturan</Link>
            </DropdownMenuItem>

            <DropdownMenuItem asChild className="p-0">
              <form action={signOut} className="w-full">
                <button
                  type="submit"
                  className="flex w-full cursor-pointer items-center gap-2 px-2 py-1.5 text-left text-sm text-red-600 outline-none hover:bg-red-50 focus:bg-red-50 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </form>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

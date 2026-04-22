"use client"

import { SidebarTrigger } from "@/components/ui/sidebar"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"

export function AppNavbar() {
  return (
    <header className="flex h-14 items-center justify-between border-b px-4">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="cursor-pointer hover:bg-black/10 transition-colors duration-200 p-2"/>
        <h1 className="text-lg font-semibold">Dashboard</h1>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
        </Button>
      </div>
    </header>
  )
}
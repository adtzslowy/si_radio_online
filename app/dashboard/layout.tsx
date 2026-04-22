import { AppNavbar } from "@/components/shared/app-navbar"
import { AppSidebar } from "@/components/shared/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <SidebarProvider>
            <AppSidebar/>

            <SidebarInset>
                <AppNavbar/>
                <main className="p-4 lg:p-6">{children}</main>
            </SidebarInset>
        </SidebarProvider>
    )
}
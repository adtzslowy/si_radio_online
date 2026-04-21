import { AppNavbar } from "@/components/shared/app-navbar"
import { AppSidebar } from "@/components/shared/app-sidebar"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-slate-100">
            <div className="flex min-h-screen">
                <AppSidebar/>

                <div className="flex flex-1 flex-col">
                    <AppNavbar/>
                    <main className="flex-1 p-4 lg:p-6">{children}</main>
                </div>
            </div>
        </div>
    )
}
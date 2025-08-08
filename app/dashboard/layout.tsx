import type React from "react"
import { Sidebar } from "@/components/sidebar"
import ProtectedRoute from "@/components/protected-route"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute>
      <div className="flex min-h-screen flex-col bg-background">
        <Sidebar />
        <div className="md:pl-64">
          <header className="sticky top-0 z-10 h-16 border-b border-border bg-white shadow-sm">
            <div className="flex h-full items-center justify-between px-4 md:px-6">
              <div className="text-sm text-muted-foreground">Cruooze Admin System </div>
              <div className="flex items-center gap-4">{/* Header content can be added here */}</div>
            </div>
          </header>
          <main className="flex-1 animate-fadeIn">
            <div className="container mx-auto py-6 px-4 md:px-6">{children}</div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}

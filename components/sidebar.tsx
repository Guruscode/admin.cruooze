"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useAuth } from "./auth-provider"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  LayoutDashboard,
  Car,
  Settings,
  LogOut,
  Menu,
  X,
  HelpCircle,
  BookOpen,
  CreditCard,
  FileText,
  Receipt,
  Users,
  MessageCircle,
  Languages,
  Tag,
  ClipboardList,
  Star,
  Package,
} from "lucide-react"
import { motion } from "framer-motion"
import { SupportModal } from "./support-modal"

interface NavItem {
  title: string
  href: string
  icon: React.ElementType
}

const navItems: NavItem[] = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "Users", href: "/dashboard/users", icon: Users },
  { title: "Drivers", href: "/dashboard/driver", icon: Car }, // merged driver_document, driver_rules, driver_users
  { title: "Orders & Intercity", href: "/dashboard/orders", icon: Package }, // merged orders + orders_intercity
  { title: "Payments", href: "/dashboard/payments", icon: CreditCard }, // bank_details, wallet_transaction, withdrawal_history
  // { title: "Services", href: "/dashboard/services", icon: ClipboardList }, // service, intercity_service, vehicle_type
  { title: "Documents", href: "/dashboard/documents", icon: FileText }, // documents + driver docs if needed
  { title: "Reviews", href: "/dashboard/reviews", icon: Star }, // review_customer, review_driver
  // { title: "Chat", href: "/dashboard/chat", icon: MessageCircle },
  { title: "Coupons", href: "/dashboard/coupons", icon: Tag },
  { title: "Currency", href: "/dashboard/currency", icon: CreditCard },
  { title: "Languages", href: "/dashboard/languages", icon: Languages },
  { title: "FAQ", href: "/dashboard/faq", icon: HelpCircle },
  // { title: "Onboarding", href: "/dashboard/onboarding", icon: BookOpen },
  { title: "Referrals", href: "/dashboard/referrals", icon: Users },
  { title: "Settings", href: "/dashboard/settings", icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const { logout } = useAuth()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false)

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  return (
    <>
      {/* Mobile Sidebar */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="md:hidden bg-transparent">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 bg-white border-r border-gray-200">
          <div className="flex h-16 items-center border-b border-gray-200 px-4">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 font-semibold text-gray-900"
              onClick={() => setOpen(false)}
            >
              <Car className="h-6 w-6" />
              <span>Cruooze Dashboard</span>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="ml-auto text-sidebar-foreground hover:bg-white/10"
              onClick={() => setOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          <ScrollArea className="h-[calc(100vh-4rem)]">
            <div className="flex flex-col h-full">
              <div className="flex-1 p-4">
                <nav className="grid gap-2">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "flex items-center gap-3 rounded-md px-3 py-3 text-sm transition-all duration-150 hover:bg-gray-100",
                        pathname === item.href ? "bg-gray-100 text-gray-900" : "text-gray-600",
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </Link>
                  ))}
                  <button
                    className="flex items-center gap-3 rounded-md px-3 py-3 text-sm transition-all duration-150 hover:bg-gray-100 text-gray-600"
                    onClick={() => {
                      setOpen(false)
                      setIsSupportModalOpen(true)
                    }}
                  >
                    <HelpCircle className="h-5 w-5" />
                    <span>Customer Support</span>
                  </button>
                </nav>
              </div>
              <div className="p-4 border-t border-gray-200">
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 text-gray-600 hover:bg-gray-100"
                  onClick={handleLogout}
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </Button>
              </div>
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <div className="hidden bg-white border-r border-gray-200 md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className="flex h-16 items-center border-b border-gray-200 px-6">
          <Link href="/dashboard" className="flex items-center gap-2 font-semibold text-gray-900">
            <Car className="h-6 w-6" />
            <span>Cruooze Dashboard</span>
          </Link>
        </div>
        <ScrollArea className="flex-1">
          <div className="flex flex-col h-full">
            <div className="flex-1 p-4">
              <nav className="grid gap-2">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-3 text-sm transition-all duration-150 hover:bg-gray-100 relative",
                      pathname === item.href ? "bg-gray-100 text-gray-900" : "text-gray-600",
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.title}</span>
                    {pathname === item.href && (
                      <motion.div
                        layoutId="sidebar-indicator"
                        className="absolute left-0 h-full w-1 rounded-r-lg bg-primary"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.2 }}
                      />
                    )}
                  </Link>
                ))}
                <button
                  className="flex items-center gap-3 rounded-md px-3 py-3 text-sm transition-all duration-150 hover:bg-gray-100 text-gray-600"
                  onClick={() => setIsSupportModalOpen(true)}
                >
                  <HelpCircle className="h-5 w-5" />
                  <span>Customer Support</span>
                </button>
              </nav>
            </div>
            <div className="p-4 border-t border-gray-200">
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 text-gray-600 hover:bg-gray-100"
                onClick={handleLogout}
              >
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </ScrollArea>
      </div>
      <SupportModal isOpen={isSupportModalOpen} onOpenChange={setIsSupportModalOpen} title="Customer Support" />
    </>
  )
}

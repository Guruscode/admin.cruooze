"use client"

import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"

interface DashboardCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  iconColor: string
  iconBackground: string
  linkColor: string
  linkHref: string
  className?: string
}

export function DashboardCard({
  title,
  value,
  icon: Icon,
  iconColor,
  iconBackground,
  linkColor,
  linkHref,
  className,
}: DashboardCardProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <Card className={cn("overflow-hidden", className)}>
        <div className="p-6">
          <div className="flex items-center gap-4">
            <div className={cn("rounded-md p-3", iconBackground)}>
              <Icon className={cn("h-5 w-5", iconColor)} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{title}</p>
              <h3 className="text-3xl font-bold mt-1">{value}</h3>
            </div>
          </div>
        </div>
        <div className="border-t p-4">
          <Link href={linkHref} className={cn("text-sm font-medium hover:underline", linkColor)}>
            View vehicle types
          </Link>
        </div>
      </Card>
    </motion.div>
  )
}

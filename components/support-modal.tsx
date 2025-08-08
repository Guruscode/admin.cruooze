"use client"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { HelpCircle } from "lucide-react"

interface SupportModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  title: string
}

export function SupportModal({ isOpen, onOpenChange, title }: SupportModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white/70 backdrop-blur-xl border border-white/50 text-gray-800 shadow-xl rounded-xl">
        <div className="absolute inset-0 bg-gradient-to-b from-white/80 to-white/60 pointer-events-none rounded-xl" />

        <div className="mx-auto -mt-12 bg-primary/90 w-16 h-16 rounded-full flex items-center justify-center shadow-lg border-4 border-white">
          <HelpCircle className="h-8 w-8 text-white" />
        </div>

        <DialogHeader className="relative mt-2">
          <DialogTitle className="text-gray-800 text-xl font-bold text-center">{title}</DialogTitle>
        </DialogHeader>

        <DialogDescription className="pt-4 pb-2 text-center text-gray-700 relative">
          Contact Richfield Technical team to reset your account password
          <br />
          Thank you for your cooperation
        </DialogDescription>

        <div className="flex justify-center pt-4 relative">
          <Button
            onClick={() => onOpenChange(false)}
            className="bg-primary hover:bg-primary/90 text-white border-none shadow-md px-8 py-5 rounded-lg transition-all duration-200"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

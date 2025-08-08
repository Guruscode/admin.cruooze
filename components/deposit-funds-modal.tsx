"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { InfoIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

interface DepositFundsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DepositFundsModal({ open, onOpenChange }: DepositFundsModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Deposit Funds</DialogTitle>
          <DialogDescription>
            Make a deposit to your Cruooze wallet by transferring to the bank account below.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Bank Name</Label>
                <p className="font-medium">First Bank of Nigeria</p>
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Account Number</Label>
                <p className="font-medium">3142857901</p>
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Account Name</Label>
              <p className="font-medium">Delta State Vehicle Administration System</p>
            </div>
          </div>

          <Alert variant="default" className="bg-amber-50 text-amber-800 border-amber-200">
            <InfoIcon className="h-4 w-4" />
            <AlertDescription>
              Please note that a 1.5% processing fee applies to all deposits. Your account will be credited within 1-2
              business hours after payment confirmation.
            </AlertDescription>
          </Alert>

          <div className="flex justify-between">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              className="bg-primary hover:bg-primary/90"
              onClick={() => {
                navigator.clipboard.writeText("3142857901")
                alert("Account number copied to clipboard!")
              }}
            >
              Copy Account Number
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

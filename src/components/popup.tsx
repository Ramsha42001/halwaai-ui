"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface CustomPopupProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  description?: string
  children?: React.ReactNode
  footer?: React.ReactNode
  className?: string
  showCloseButton?: boolean
}

export function CustomPopup({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  className,
  showCloseButton = true,
}: CustomPopupProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={cn("sm:max-w-[425px]", className)}>
        {(title || description) && (
          <DialogHeader>
            {title && <DialogTitle>{title}</DialogTitle>}
            {description && (
              <DialogDescription>{description}</DialogDescription>
            )}
          </DialogHeader>
        )}
        
        <div className="py-4">{children}</div>
        
        <DialogFooter className="flex items-center justify-end gap-2">
          {footer}
          {showCloseButton && (
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
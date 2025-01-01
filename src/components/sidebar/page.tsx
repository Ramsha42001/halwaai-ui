'use client'

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from 'lucide-react'

export function Sidebar() {
  return (
    <div className="w-64">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" className="bg-black text-white hover:bg-black/90">
            <Menu className="mr-2 h-4 w-4" />
             View Thali Progress
          </Button>
        </SheetTrigger>

        <SheetContent side="left">
          <SheetHeader>
            {/* Title for screen readers */}
            <SheetTitle className="sr-only">Sidebar Menu</SheetTitle>
            <SheetDescription>
              Here's the sidebar menu content
            </SheetDescription>
          </SheetHeader>
          <div className="mt-4">
            {/* Sidebar content will be here */}
            <p className="text-sm text-muted-foreground">This is the sidebar content</p>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}

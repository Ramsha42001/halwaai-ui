"use client"

import * as React from "react"
import { LogInIcon as Logs, ChevronLeft, ChevronRight } from 'lucide-react'
import { Progress } from "@/components/ui/progress"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// Sample data for menu items and descriptions
const menuItems = [
  { name: "Breads", description: "Naan, Roti, and more" },
  { name: "Main Course", description: "Curries and other dishes" },
  { name: "Sides", description: "Accompaniments and extras" },
  { name: "Desserts", description: "Sweet treats to finish" },
]

export default function SidebarB() {
  const { state } = useSidebar()

  return (
    <Sidebar className="border-r mt-[80px] z-[50]">
      <SidebarHeader className="border-b px-4 py-6">
        <div className="flex items-center space-x-3">
          <Logs className="h-6 w-6" />
          <h3 className={cn("text-2xl font-medium font-poorStory transition-opacity", 
            state === "collapsed" && "opacity-0")}>
            Thali Progress
          </h3>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-4">
        <div className="space-y-6">
          <div>
            <h4 className={cn("mb-2 text-sm font-semibold transition-opacity", 
              state === "collapsed" && "opacity-0")}>
              Progress
            </h4>
            <Progress value={30} className="h-2 w-full" />
          </div>
          <div>
            <h4 className={cn("mb-2 text-sm font-semibold transition-opacity", 
              state === "collapsed" && "opacity-0")}>
              Menu Categories
            </h4>
            <SidebarMenu>
              {menuItems.map((item, index) => (
                <SidebarMenuItem key={index}>
                  <SidebarMenuButton className="w-full">
                    <div className="flex flex-col items-start">
                      <span className="text-sm font-medium">{item.name}</span>
                      <span className={cn("text-xs text-muted-foreground transition-opacity", 
                        state === "collapsed" && "opacity-0")}>
                        {item.description}
                      </span>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </div>
        </div>
      </SidebarContent>
      <SidebarFooter className="border-t p-4">
        <p className={cn("text-xs text-center text-muted-foreground transition-opacity", 
          state === "collapsed" && "opacity-0")}>
          © 2024 Thali Progress
        </p>
      </SidebarFooter>
      <SidebarTrigger className="absolute right-[-50px] top-4 z-50 w-[30px] h-[30px] border-[2px] border-[black]">
  <Button 
    variant="outline" 
    className="rounded-full p-5 w-18 h-18 border-4 border-gray-500 bg-gray-100 hover:bg-gray-200" // Enhanced size and border
  >
    {state === "expanded" ? (
      <ChevronLeft className="h-12 w-12 text-gray-700" /> // Larger Chevron icon
    ) : (
      <ChevronRight className="h-12 w-12 text-gray-700" />
    )}
  </Button>
</SidebarTrigger>


    </Sidebar>
  )
}


"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

const menuItems = [
  "Breads",
  "Appetizers",
  "Rice",
  "Sabzi",
  "Paneer ki Sabzi",
  "Dal",
  "Desert",
  "Beverages",
  "Add-Ons",
]

export default function MenuBar() {
  const [activeTab, setActiveTab] = React.useState("Breads")

  return (
    <div className="w-[700px] bg-black border rounded-[8px] p-1 z-[1000] relative">
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        // className="w-full"
      >
        <TabsList className="w-full bg-transparent">
          {menuItems.map((item) => (
            <TabsTrigger
              key={item}
              value={item}
              className={cn(
                "rounded-full text-white data-[state=active]:bg-[#D84315] data-[state=active]:text-white",
                "transition-all duration-200"
              )}
            >
              {item}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  )
}

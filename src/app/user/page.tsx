'use client'

import React, { useMemo } from 'react'
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import SidebarB from '@/components/sidebar/page'
import MenuBar from '@/components/MenuBar/page'
import Header from "@/components/uheader/page"
import { Button } from '@/components/ui/button'
import MenuItemCard from '@/components/menuItemCard/page'

export default function Dashboard() {
   const breads = useMemo(() => [
     {
        id: 1,
        title: "Naan",
        description: "Soft, fluffy naan, hand-tossed and baked in a hot tandoor",
        imageUrl: "/placeholder.svg?height=400&width=400"
     },
     {
        id: 2,
        title: "Roti",
        description: "Whole wheat flatbread, a staple in Indian cuisine",
        imageUrl: "/placeholder.svg?height=400&width=400"
     },
     {
        id: 3,
        title: "Paratha",
        description: "Flaky, layered flatbread, often stuffed with various fillings",
        imageUrl: "/placeholder.svg?height=400&width=400"
     },
     {
        id: 4,
        title: "Kulcha",
        description: "Leavened bread, often flavored with various spices",
        imageUrl: "/placeholder.svg?height=400&width=400"
     },
     {
        id: 5,
        title: "Bhatura",
        description: "Deep-fried, fluffy bread, often served with chole",
        imageUrl: "/placeholder.svg?height=400&width=400"
     },
     {
        id: 6,
        title: "Puri",
        description: "Small, deep-fried bread that puffs up when cooked",
        imageUrl: "/placeholder.svg?height=400&width=400"
     },
   ], [])

   return (
      <SidebarProvider>
        <div className="min-h-screen bg-foreground flex">
          <SidebarB />
          <SidebarInset className="flex-1 bg-foreground mt-[50px]">
            <div className="min-h-screen">
              <Header />
              
              {/* Fixed Top Navigation Area */}
                  <div className="fixed top-[13%] left-[25%] z-10 flex justify-center">
                    <MenuBar />
                  </div>

              <main className="w-full min-h-screen pb-20 mt-[80px]">
                {/* Main Content */}
                <div className="px-4 md:px-6 mt-6">
                  <h1 className="text-3xl md:text-4xl font-bold font-poorStory text-black mt-6">
                    Breads
                  </h1>

                  {/* Menu Items Grid */}
                  <div className="flex flex-row flex-wrap gap-4 mt-6 py-[10px]">
                    {breads.map((bread) => (
                      <MenuItemCard
                        key={bread.id}
                        title={bread.title}
                        description={bread.description}
                        imageUrl={bread.imageUrl}
                      />
                    ))}
                  </div>
                </div>

                {/* Bottom Navigation */}
                <div className="fixed bottom-0 left-0 right-0 p-4 border-t md:border-none bg-foreground">
                  <div className="flex justify-between max-w-md mx-auto md:max-w-none md:justify-end md:pr-8">
                    <Button 
                      variant="outline" 
                      className="flex-1 max-w-[200px] bg-black text-white hover:bg-white hover:text-black border-black"
                    >
                      View Thali
                    </Button>
                    <Button 
                      variant="outline"
                      className="flex-1 max-w-[200px] ml-4 bg-black text-white hover:bg-white hover:text-black border-black"
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </main>
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
   )
}

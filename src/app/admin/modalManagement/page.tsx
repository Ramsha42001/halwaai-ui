"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import ModalCard from "@/components/modalCard/page"
import { modalData } from "@/app/data/modal";
import  SubHeader  from "@/components/sub-header"

export default function Home() {
  return (
    <div className="min-h-screen bg-[#fff5f5] text-[black] flex-column">
        <SubHeader />
        <main className="container mx-auto p-8">
      <div className="mb-8">
        
        <h1 className="text-3xl font-bold mb-6">Modal Management</h1>
        <div className="flex gap-4">
          <Tabs defaultValue="existing" className="w-full">
            <TabsList className="flex gap-4 justify-between bg-[#FBEDE9]">
              <TabsTrigger className="w-auto h-[30px]" value="existing">Existing Models</TabsTrigger>
              <TabsTrigger className=" text-black w-auto h-[30px]" value="new">
                <Plus className="w-4 h-4 mr-2" />
                Add New Model
              </TabsTrigger>
            </TabsList>
            <TabsContent value="existing">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                {modalData.map((modal, index) => (
                  <ModalCard key={index} {...modal} />
                ))}
              </div>
            </TabsContent>
            <TabsContent value="new">
              <div className="mt-6">
                <h2 className="text-xl font-semibold mb-4">Create New Modal</h2>
                {/* Add form component here */}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </main>
    </div>
    
  );
}
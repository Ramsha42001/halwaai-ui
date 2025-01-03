"use client"

import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import MenuCategories from "@/components/menu-cards";
import MenuItemCard from "@/components/menu-items-card";
import Header from '@/components/uheader/page'
import { CustomPopup } from "@/components/popup"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ImageUpload } from "@/components/image-upload"
import { useState } from "react"
import  SubHeader  from "@/components/sub-header"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function MenuPage() {
  const[isCategoryFormOpen , setIsCategoryFormOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [isMenuFormOpen, setIsMenuFormOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#fff5f5] text-[black] flex-column pb-[5%]">
      {/* <Header /> */}
      <div className="hidden lg:block"><SubHeader /></div>
        {/* <SubHeader /> */}
      <main className="p-4 md:p-8 mt-[70px]">
        <h1 className="text-2xl md:text-4xl font-bold mb-6 md:mb-8">Menu Items</h1>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 md:mb-12">
          <MenuCategories />
          <div className="flex gap-2 md:gap-4">
            <Button onClick={() => setIsCategoryFormOpen(true)} variant="default" className="bg-black hover:bg-gray-800">
              <span className="mr-2">Add Category</span>
              <span>+</span>
            </Button>
            <CustomPopup
              isOpen={isCategoryFormOpen}
              footer={
                <Button className="text-black" onClick={() => setIsCategoryFormOpen(true)} variant="default">
                  Submit
                </Button>
              }
              onClose={() => setIsCategoryFormOpen(false)}
              title="Add Category Item"
              className="sm:max-w-[500px] bg-[#fff5f5] text-black"
            >
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-black">Name</Label>
                  <Input 
                    placeholder="Enter name of the category"
                    className="bg-white"
                  />
                </div>
                
              </div>
            </CustomPopup>
            <Button onClick={() => setIsMenuFormOpen(true)} variant="outline" className="border-2">
              <span className="mr-2">Add item</span>
            </Button>
            <CustomPopup
              isOpen={isMenuFormOpen}
              footer={
                <Button className="text-black" onClick={() => setIsMenuFormOpen(false)} variant="default">
                  Submit
                </Button>
              }
              onClose={() => setIsMenuFormOpen(false)}
              title="Add Menu Item"
              className="sm:max-w-[500px] bg-[#fff5f5] text-black"
            >
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-black">Name</Label>
                  <Input 
                    placeholder="Enter name of the item"
                    className="bg-white"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-black">Description</Label>
                  <textarea
                    className="w-full min-h-[100px] px-3 py-2 rounded-md border border-input bg-white text-gray-600"
                    placeholder="Enter description"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-black">Price (₹)</Label>
                    <Input 
                      type="number"
                      placeholder="Enter price"
                      className="bg-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-black">Category</Label>
                    <Select>
                      <SelectTrigger className="bg-white text-gray-600">
                        <SelectValue placeholder="Choose a category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dessert">Dessert</SelectItem>
                        <SelectItem value="appetizers">Appetizers</SelectItem>
                        <SelectItem value="main">Main Course</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-black">Image</Label>
                  <ImageUpload
                    value={selectedImage}
                    onChange={setSelectedImage}
                  />
                </div>
              </div>
            </CustomPopup>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-[100px]">
          <MenuItemCard
            title="Gulab Jamun"
            description="Sweet dumplings soaked in sugar syrup"
            price={100}
            image="/images/gulabJamun.png"
          />
          <MenuItemCard
            title="Jalebi"
            description="Sweet dumplings soaked in sugar syrup"
            price={100}
            image="/images/jalebi.png"
          />
          <MenuItemCard
            title="Rasmalai"
            description="Sweet dumplings soaked in sugar syrup"
            price={100}
            image="/images/rasmalaai.png"
          />
        </div>
      </main>
    </div>
  );
}
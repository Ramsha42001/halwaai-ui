"use client"

import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import MenuCategories from "../../components/menu-cards";
import MenuItemCard from "../../components/menu-items-card";
import SubHeader from "@/components/sub-header";
import Header from '@/components/uheader/page'
import { CustomPopup } from "@/components/popup"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ImageUpload } from "@/components/image-upload"
import { useState } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function MenuPage() {
  const [isCategoryFormOpen, setIsCategoryFormOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)

  const [isMenuFormOpen, setIsMenuFormOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#fff5f5]">
      {/* Header */}
      <Header />
      <SubHeader />

      {/* Main Content */}
      <main className="p-4 md:p-8">
        <h1 className="text-2xl md:text-4xl font-bold mb-6 md:mb-8">Menu Items</h1>

        {/* Categories and Action Buttons */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 md:mb-12">
          <MenuCategories />
          <div className="flex gap-2 md:gap-4">
            <Button onClick={() => setIsCategoryFormOpen(true)} variant="default" className="bg-black hover:bg-gray-800">
              <span className="mr-2">Add Category</span>
              <span>+</span>
            </Button>
            <CustomPopup
            isOpen={isCategoryFormOpen}
            onClose={() => setIsCategoryFormOpen(false)}
            title="Add Category"
            className="sm:max-w-[500px] bg-[#fff5f5]"
            footer={
              <Button className="text-black" onClick={() => setIsCategoryFormOpen(false)} variant="default">
                Submit
              </Button>
            }
          >
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" placeholder="Enter name of the category" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Price(₹)</Label>
                <Input id="email" type="email" placeholder="Enter price" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <textarea
                  id="description"
                  className="w-full min-h-[100px] px-3 py-2 rounded-md border border-input bg-[#fff5f5]"
                  placeholder="Enter your description"
                />
              </div>
              <div className="space-y-2">
                <Label>Image</Label>
                <ImageUpload
                  value={selectedImage}
                  onChange={setSelectedImage}
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
        className="sm:max-w-[500px] bg-[#fff5f5]"
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input 
              placeholder="Enter name of the item"
              className="bg-white"
            />
          </div>
          
          <div className="space-y-2">
            <Label>Description</Label>
            <textarea
              className="w-full min-h-[100px] px-3 py-2 rounded-md border border-input bg-white"
              placeholder="Enter description"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Price (₹)</Label>
              <Input 
                type="number"
                placeholder="Enter price"
                className="bg-white"
              />
            </div>

            <div className="space-y-2">
              <Label>Category</Label>
              <Select>
                <SelectTrigger className="bg-white">
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
            <Label>Image</Label>
            <ImageUpload
              value={selectedImage}
              onChange={setSelectedImage}
            />
          </div>

          {/* <Button 
            className="w-full bg-black text-white hover:bg-gray-800"
            onClick={() => setIsMenuFormOpen(false)}
          >
            Add Item
          </Button> */}
        </div>
      </CustomPopup>
          </div>
        </div>

        {/* Menu Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          <MenuItemCard
            title="Gulab Jamun"
            description="Sweet dumplings soaked in sugar syrup"
            price={100}
            image="/placeholder.svg?height=300&width=400"
          />
          <MenuItemCard
            title="Jalebi"
            description="Sweet dumplings soaked in sugar syrup"
            price={100}
            image="/placeholder.svg?height=300&width=400"
          />
          <MenuItemCard
            title="Rasmalai"
            description="Sweet dumplings soaked in sugar syrup"
            price={100}
            image="/placeholder.svg?height=300&width=400"
          />
        </div>
      </main>
    </div>
  );
}

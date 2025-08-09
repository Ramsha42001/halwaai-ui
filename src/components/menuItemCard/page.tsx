'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Minus, Plus, Heart, Star, Clock } from 'lucide-react'
import { useState, useEffect } from "react"
import { YesNoToggle } from "../toggle/page"
import Image from "next/image"
import { storageService } from "@/utils/storage"
import { useStore } from '@/services/store/menuItemsStore'
import { CustomPopup } from "@/components/popup"
import { Pencil, Trash2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ImageUpload } from "@/components/image-upload"
import { menuItemService } from "@/services/api/menuItemService"
import { toast } from "sonner"
import { Skeleton } from '@/components/ui/skeleton'
import { motion, AnimatePresence } from 'framer-motion'
import { Badge } from '@/components/ui/badge'

interface MenuItemProps {
  id?: string
  name?: string
  description: string
  image: string
  price: number
  isSelected?: boolean
  category?: string
  isAdminPage: boolean
  onUpdate?: () => void
  onAdd?: () => void
  onRemove?: () => void
  requiredCategory?: RequiredCategoryItems[]
  onQuantityChange?: (id: string | undefined, quantity: number) => void
}

interface RequiredCategoryItems {
  _id: string,
  selectedForThali: boolean
}

export function MenuItemCard({
  id,
  name,
  description,
  image,
  price,
  isSelected = false,
  category,
  onQuantityChange,
  requiredCategory,
  isAdminPage,
  onUpdate,
  onAdd,
  onRemove
}: MenuItemProps) {

  const { selectedItems, addItem, removeItem } = useStore()
  const [quantity, setQuantity] = useState(0)
  const [isEditFormOpen, setIsEditFormOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [isFavorite, setIsFavorite] = useState(false)
  const [formData, setFormData] = useState({
    name: name,
    description: description,
    price: price,
  })

  useEffect(() => {
    if (id) {
      const found = selectedItems.find(i => i._id === id)
      setQuantity(found ? found.quantity : 0)
    }
  }, [selectedItems, id])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setFormData(prev => ({
      ...prev,
      [id]: id === 'price' ? parseFloat(value) : value
    }))
  }

  const deleteMenuItem = async (id: string) => {
    try {
      setIsDeleting(true)
      setError("")

      const response = await menuItemService.deleteMenuItem(id)

      if (response) {
        toast.success("Menu item deleted successfully")
        if (onUpdate) {
          await onUpdate()
        }
      }
    } catch (error) {
      console.error('Error deleting menu item:', error)
      setError("Failed to delete menu item")
      toast.error("Failed to delete menu item")
    } finally {
      setIsDeleting(false)
    }
  }

  const handleSubmit = async () => {
    try {
      setIsLoading(true)
      setError("")

      const formDataToSend = new FormData()
      formDataToSend.append('name', formData.name || '')
      formDataToSend.append('description', formData.description)
      formDataToSend.append('price', formData.price.toString())

      if (selectedImage) {
        formDataToSend.append('image', selectedImage)
      }

      let response: any = ''
      if (id) {
        response = await menuItemService.updateMenuItem(id, formDataToSend)
      }

      if (response) {
        setIsEditFormOpen(false)
        if (onUpdate) onUpdate()
      }
    } catch (error) {
      console.error('Error updating menu item:', error)
      setError("Failed to update menu item")
    } finally {
      setIsLoading(false)
    }
  }

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    },
    hover: {
      y: -8,
      transition: { duration: 0.2 }
    }
  }

  const quantityVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { type: "spring", stiffness: 500, damping: 30 }
    }
  }

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      className="group h-full"
    >
      <Card className={`relative overflow-hidden bg-[#997864] border-0 rounded-2xl h-full flex flex-col shadow-xl hover:shadow-2xl transition-shadow duration-300 ${isSelected ? 'ring-2 ring-amber-400 shadow-amber-100' : ''
        }`}>
        <CardContent className="p-0 flex flex-col h-full">
          {/* Image Section */}
          <div className="relative overflow-hidden flex-shrink-0">
            <div className="aspect-[5/3] relative">
              <img
                src={image}
                alt={name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />

              {/* Quantity Badge */}
              <AnimatePresence>
                {quantity > 0 && (
                  <motion.div
                    variants={quantityVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    className="absolute top-3 right-3 z-20"
                  >
                    <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg font-semibold px-3 py-1">
                      {quantity} added
                    </Badge>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Price Badge */}
              <div className="absolute top-3 left-3 z-20">
                <Badge variant="secondary" className="bg-white/95 text-gray-800 font-bold text-base px-3 py-1.5 shadow-lg">
                  ₹{price}
                </Badge>
              </div>

              {/* Admin Actions */}
              {isAdminPage && (
                <div className="absolute top-3 right-3 z-20 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Button
                    onClick={() => setIsEditFormOpen(true)}
                    size="icon"
                    variant="secondary"
                    className="h-9 w-9 bg-white/95 hover:bg-white shadow-lg"
                    disabled={isDeleting}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={() => id && deleteMenuItem(id)}
                    size="icon"
                    variant="destructive"
                    className="h-9 w-9 shadow-lg"
                    disabled={isDeleting}
                  >
                    {isDeleting ? (
                      <div className="animate-spin h-4 w-4 border-2 border-white rounded-full border-t-transparent" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              )}

              {/* Quick Actions Overlay */}
              {!isAdminPage && (
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="flex items-center gap-4 bg-white/95 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 hover:bg-red-100 text-red-600 rounded-full"
                      onClick={onRemove}
                      disabled={quantity === 0}
                    >
                      <Minus className="h-5 w-5" />
                    </Button>
                    <span className="font-bold text-gray-800 min-w-[24px] text-center text-lg">
                      {quantity}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 hover:bg-green-100 text-green-600 rounded-full"
                      onClick={onAdd}
                    >
                      <Plus className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Content Section */}
          <div className="p-6 flex flex-col flex-grow">
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-bold text-xl text-white font-poorStory line-clamp-2 leading-tight">
                {name}
              </h3>
            </div>

            <p className="text-white/90 text-sm font-poppins line-clamp-3 mb-6 leading-relaxed flex-grow">
              {description}
            </p>

            {/* Action Buttons */}
            {!isAdminPage && (
              <div className="flex items-center gap-3 mt-auto">
                {quantity === 0 ? (
                  <Button
                    onClick={onAdd}
                    className="flex-1 bg-black hover:bg-gray-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl py-3 font-semibold"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add to Thali
                  </Button>
                ) : (
                  <div className="flex-1 flex items-center justify-between bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-xl px-5 py-3 shadow-md">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 hover:bg-red-100 text-red-600 rounded-full"
                      onClick={onRemove}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="font-bold text-amber-700 text-lg">{quantity}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 hover:bg-green-100 text-green-600 rounded-full"
                      onClick={onAdd}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>

        {/* Edit Modal for Admin */}
        <CustomPopup
          isOpen={isEditFormOpen}
          onClose={() => setIsEditFormOpen(false)}
          title="Edit Menu Item"
          className="sm:max-w-[500px] bg-white"
          footer={
            <div className="flex justify-end gap-2">
              {error && <span className="text-red-500 mr-auto text-sm">{error}</span>}
              <Button
                onClick={handleSubmit}
                variant="default"
                disabled={isLoading}
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-orange-500 hover:to-amber-600"
              >
                {isLoading ? "Updating..." : "Update Item"}
              </Button>
            </div>
          }
        >
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-700 font-medium">
                Item Name
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter item name"
                className="border-gray-200 focus:ring-amber-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price" className="text-gray-700 font-medium">
                Price (₹)
              </Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="Enter price"
                className="border-gray-200 focus:ring-amber-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-gray-700 font-medium">
                Description
              </Label>
              <textarea
                id="description"
                className="w-full min-h-[100px] px-3 py-2 rounded-md border border-gray-200 bg-white focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter item description"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-gray-700 font-medium">Item Image</Label>
              <ImageUpload
                value={selectedImage}
                onChange={setSelectedImage}
              />
            </div>
          </div>
        </CustomPopup>
      </Card>
    </motion.div>
  )
}

// Enhanced Skeleton for MenuItemCard
export function MenuItemCardSkeleton() {
  return (
    <div className="bg-white/90 backdrop-blur-sm border-0 shadow-lg rounded-2xl overflow-hidden h-full">
      <div className="aspect-[4/3] relative">
        <Skeleton className="w-full h-full bg-gray-200" />
        <div className="absolute top-4 left-4">
          <Skeleton className="h-6 w-16 bg-gray-300 rounded-full" />
        </div>
      </div>
      <div className="p-6 space-y-4 flex flex-col flex-grow">
        <div className="flex items-start justify-between">
          <Skeleton className="h-6 w-32 bg-gray-200" />
          <Skeleton className="h-8 w-8 bg-gray-200 rounded-full" />
        </div>
        <Skeleton className="h-4 w-full bg-gray-200" />
        <Skeleton className="h-4 w-3/4 bg-gray-200" />
        <div className="flex gap-2">
          <Skeleton className="h-6 w-16 bg-gray-200 rounded-full" />
          <Skeleton className="h-6 w-14 bg-gray-200 rounded-full" />
        </div>
        <div className="mt-auto">
          <Skeleton className="h-10 w-full bg-gray-200 rounded-xl" />
        </div>
      </div>
    </div>
  )
}
'use client'

import { Button } from "@/components/ui/button";
import MenuCategories from "@/components/menu-cards";
import { MenuItemCard } from '@/components/menuItemCard/page'
import { CustomPopup } from "@/components/popup";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageUpload } from "@/components/image-upload";
import { useState, useEffect } from "react";
import SubHeader from "@/components/sub-header";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { menuItemService } from "@/services/api/menuItemService";
import { categoryService } from "@/services/api/categoryService";
import { toast } from "react-hot-toast";

interface Category {
  _id: string;
  name: string;
  __v: number;
  requiredThali: string;
}

interface MenuItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  category: {
    _id: string;
    name: string;
  };
  hasButter?: boolean;
}

export default function MenuPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isAddItemOpen, setIsAddItemOpen] = useState(false);
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [newItemData, setNewItemData] = useState({
    name: '',
    description: '',
    price: 0,
    category: '',
    requiredThali: false,
  });
  const [newCategoryName, setNewCategoryName] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [requiredThali, setRequiredThali] = useState<string>("no");
  const [thaliProgress, setThaliProgress] = useState(0);

  useEffect(() => {
    fetchMenuItems();
    fetchCategories();
  }, []);

  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      const response = await menuItemService.getMenuItems();
      console.log('API Response:', response);
      setMenuItems(response);
    } catch (err) {
      console.error('Error fetching menu items:', err);
      setError("Failed to fetch menu items");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await categoryService.getCategories();
      setCategories(response);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  const filteredMenuItems = selectedCategory
    ? menuItems.filter(item => item.category && item.category._id === selectedCategory)
    : menuItems;

  const refreshMenuItems = async () => {
    try {
      setLoading(true);
      const response = await menuItemService.getMenuItems();
      setMenuItems(response);
    } catch (err) {
      console.error("Error refreshing menu items:", err);
      toast.error("Failed to refresh menu items");
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('name', newItemData.name);
      formData.append('description', newItemData.description);
      formData.append('price', newItemData.price.toString());
      formData.append('category', newItemData.category);

      if (selectedImage) {
        formData.append('image', selectedImage);
      }

      console.log('Form Data:', Object.fromEntries(formData.entries()));

      const response = await menuItemService.createMenuItem(formData);
      if (response) {
        toast.success('Menu item added successfully');
        setIsAddItemOpen(false);
        refreshMenuItems();
        setNewItemData({ name: '', description: '', price: 0, category: '', requiredThali: false });
        setSelectedImage(null);
      }
    } catch (error) {
      console.error('Error adding menu item:', error);
      toast.error('Failed to add menu item');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async () => {
    try {
      setLoading(true);
      const response = await categoryService.createCategory(newCategoryName, requiredThali);
      if (response) {
        toast.success('Category added successfully');
        setIsAddCategoryOpen(false);
        fetchCategories();
        setNewCategoryName('');
      }
    } catch (error) {
      console.error('Error adding category:', error);
      toast.error('Failed to add category');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-[#fff5f5] text-[black] flex-column pb-[5%]">
      {/* <div className="hidden lg:block"><SubHeader /></div> */}

      <main className="p-4 md:p-8 ">
        <div className="flex justify-between items-center mb-6 md:mb-8">
          <h1 className="text-2xl md:text-4xl font-bold">Menu Items</h1>
          <div className="flex gap-4">
            <Button
              onClick={() => setIsAddCategoryOpen(true)}
              variant="outline"
              className="bg-[transparent] text-blacks border-2 border-black hover:bg-[white]"
            >
              Add Category
            </Button>
            <Button
              onClick={() => setIsAddItemOpen(true)}
              className="bg-[black] text-white hover:bg-[gray]"
            >
              Add Item
            </Button>
          </div>
        </div>

        {/* Add Category Popup */}
        <CustomPopup
          isOpen={isAddCategoryOpen}
          onClose={() => setIsAddCategoryOpen(false)}
          title="Add New Category"
          className="sm:max-w-[500px] bg-[#fff5f5] text-black"
          footer={
            <div className="flex justify-end gap-2 ">
              <Button
                onClick={handleAddCategory}
                disabled={loading}
                className="bg-[black] text-white hover:bg-[gray]"
              >
                {loading ? "Adding..." : "Add Category"}
              </Button>
            </div>
          }
        >
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="categoryName">Category Name</Label>
              <Input
                id="categoryName"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="Enter category name"
                style={{ padding: '3px' }}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="requiredThali">Required for Thali?</Label>
              <Select
                value={requiredThali}
                onValueChange={(value) => setRequiredThali(value)}
              >
                <SelectTrigger className="bg-[#fff5f5]">
                  <SelectValue placeholder="Select if required" />
                </SelectTrigger>
                <SelectContent className="bg-[#fff5f5]">
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CustomPopup>

        {/* Add Item Popup */}
        <CustomPopup
          isOpen={isAddItemOpen}
          onClose={() => setIsAddItemOpen(false)}
          title="Add New Menu Item"
          className="sm:max-w-[500px] bg-[#fff5f5] text-black"
          footer={
            <div className="flex justify-end gap-2">
              <Button
                onClick={handleAddItem}
                disabled={loading}
                className="text-black"
              >
                {loading ? "Adding..." : "Add Item"}
              </Button>
            </div>
          }
        >
          <div className="space-y-4 max-h-[400px] overflow-y-auto p-3">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={newItemData.name}
                onChange={(e) => setNewItemData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter item name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price (₹)</Label>
              <Input
                id="price"
                type="number"
                value={newItemData.price}
                onChange={(e) => setNewItemData(prev => ({ ...prev, price: parseFloat(e.target.value) }))}
                placeholder="Enter price"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={newItemData.category}
                onValueChange={(value) => setNewItemData(prev => ({ ...prev, category: value }))}
              >
                <SelectTrigger className="bg-[#fff5f5]">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="bg-[#fff5f5]">
                  {categories.map((category) => (
                    <SelectItem key={category._id} value={category._id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                className="w-full min-h-[100px] px-3 py-2 rounded-md border border-input bg-[#fff5f5]"
                value={newItemData.description}
                onChange={(e) => setNewItemData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter description"
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

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 md:mb-12">
          <MenuCategories
            categories={categories}
            onCategoryChange={handleCategoryChange}
          />
        </div>

        {loading && (
          <div className="text-center py-8">
            Loading menu items...
          </div>
        )}

        {error && (
          <div className="text-red-500 text-center py-4">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-[100px]">
          {filteredMenuItems.length > 0 ? (
            filteredMenuItems.map((item) => (
              <div key={item._id} className="relative">
                <MenuItemCard
                  id={item._id}
                  name={item.name}
                  description={item.description}
                  price={item.price}
                  image={item.imageUrl ?? '/images/default-dish.png'}
                  onUpdate={refreshMenuItems}
                  category={selectedCategory}
                  isAdminPage={true}
                />
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-8 text-gray-500">
              No menu items found in this category
            </div>
          )}
        </div>

        <div>


        </div>
      </main>
    </div>
  );
}

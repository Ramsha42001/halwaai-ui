import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import MenuCategories from "../../components/menu-cards";
import MenuItemCard from "../../components/menu-items-card";
import SubHeader from "@/components/sub-header";

export default function MenuPage() {
  return (
    <div className="min-h-screen bg-[#fff5f5]">
      {/* Header */}
      <SubHeader />

      {/* Main Content */}
      <main className="p-4 md:p-8">
        <h1 className="text-2xl md:text-4xl font-bold mb-6 md:mb-8">Menu Items</h1>

        {/* Categories and Action Buttons */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 md:mb-12">
          <MenuCategories />
          <div className="flex gap-2 md:gap-4">
            <Button variant="default" className="bg-black hover:bg-gray-800">
              <span className="mr-2">Add Category</span>
              <span>+</span>
            </Button>
            <Button variant="outline" className="border-2">
              <span className="mr-2">Add Item</span>
              <span>+</span>
            </Button>
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

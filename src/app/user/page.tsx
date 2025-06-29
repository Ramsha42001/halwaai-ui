'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from "@/components/ui/button"
import { ChevronRight } from 'lucide-react'
import { MenuItemCard } from '@/components/menuItemCard/page'
import { Sidebar } from '@/components/sidebar/page'
import { MenuBar } from '@/components/MenuBar/page'
import menuItemService from '@/services/api/menuItemService'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useStore } from '@/services/store/menuItemsStore'
import categoryService from '@/services/api/categoryService'
import withAuth from '@/utils/withAuth';


interface MenuItem {
  _id: string
  name: string
  description: string
  imageUrl: string
  price: number
  category: {
    _id: string
    name: string
  }
  hasButter?: boolean
  quantity: number
}

interface Category {
  _id: string,
  name: string,
  requiredThali: string
}

interface RequiredCategoryItems {
  _id: string,
  selectedForThali: boolean
}



function MenuPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const { selectedItems, orderTotal, thaliProgress, loading, error, requiredCategories, subscribe, unsubscribe, addItem, removeItem } = useStore();
  const router = useRouter();
  const [category, setCategory] = useState<Category[]>([]);

  const user = localStorage.getItem('authToken')


  useEffect(() => {
    menuItemService.getMenuItems().then((response) => {
      setMenuItems(response)
    })
  }, [])

  useEffect(() => {
    if (user) {
      subscribe(user);
      return () => unsubscribe();
    }

  }, [user, subscribe, unsubscribe]);

  console.log('requiredCategories', requiredCategories)
  console.log(thaliProgress)


  useEffect(() => {
    categoryService.getCategories().then((response) => {
      setCategory(response);
      console.log("Fetched Categories:", response); // Log fetched categories
      const requiredCategory = response.filter((cat: Category) => cat && cat.requiredThali === 'yes');
      console.log("Filtered Required Categories:", requiredCategory); // Log filtered categories
      const initialRequiredCategories = requiredCategory.map((item: Category) => ({
        _id: item._id,
        selectedForThali: false
      }));
      useStore.getState().setRequiredCategories(initialRequiredCategories);
    });
  }, []);

  const filteredMenuItems = selectedCategory
    ? menuItems.filter(item => item.category && item.category._id === selectedCategory)
    : menuItems

  // Memoize the category selection callback
  const handleCategorySelect = useCallback((category: string) => {
    setSelectedCategory(category);
  }, []);

  return (
    <div className="flex min-h-[100vh] h-auto bg-foreground flex-col text-[black] mt-[70px] pb-[20%] md:pb-[5%]">
      <MenuBar onCategorySelect={handleCategorySelect} />
      <div className="flex flex-1 md:flex-row flex-col mt-[80px] ml-[5px]">
        <div className='hidden md:block'>
          <Sidebar menuItems={selectedItems} />
        </div>
        <div className="flex-1 p-4">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-4xl font-bold font-poorStory capitalize">Menu Items</h1>
            </div>
            <div>
            </div>
            <div className="grid md:grid-cols-2 gap-2">
              {filteredMenuItems.map((item) => (
                <MenuItemCard
                  key={item._id}
                  id={item._id}
                  name={item.name}
                  description={item.description}
                  image={item.imageUrl}
                  price={item.price}
                  category={selectedCategory}
                  isAdminPage={false}
                  onAdd={() => addItem(user, item)}
                  onRemove={() => removeItem(user, item)}
                />
              ))}
            </div>
            <div className="flex justify-end mt-4">
              <Link
                href={{
                  pathname: '/user/thali',
                }}
              >
                {/* <Button
                  className="bg-black text-white hover:bg-black/90"
                >
                  Next
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button> */}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default withAuth(MenuPage);

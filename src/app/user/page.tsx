import MenuBar from '@/components/MenuBar/page'
import Sidebar from '@/components/sidebar/page'
import Header from "@/components/uheader/page"
import { Button } from '@/components/ui/button'
import MenuItemCard from '@/components/menuItemCard/page'

const breads = [
   {
      id: 1,
      title: "Tandoori Roti",
      description: "lalalalallalalalal",
      imageUrl: "/images/roti.png"
   },
   {
      id: 2,
      title: "Tandoori Roti",
      description: "lalalalallalalalal",
      imageUrl: "/images/roti.png"
   },
   {
      id: 3,
      title: "Tandoori Roti",
      description: "lalalalallalalalal",
      imageUrl: "/images/roti.png"
   },
   {
      id: 4,
      title: "Tandoori Roti",
      description: "lalalalallalalalal",
      imageUrl: "/images/roti.png"
   },
   {
      id: 5,
      title: "Tandoori Roti",
      description: "lalalalallalalalal",
      imageUrl: "/images/roti.png"
   },
   {
      id: 6,
      title: "Tandoori Roti",
      description: "lalalalallalalalal",
      imageUrl: "/images/roti.png"
   },

]

export default function Dashboard() {
   return (
      <>
         <Header />
         <Sidebar />

         <div className="bg-foreground w-[calc(100%-300px)] h-auto min-h-[100vh] ml-[300px] flex flex-col">
            <div className="w-full fixed top-[15%] left-[20%] w-[100%] h-auto flex flex-row justify-between px-[20px] z-[50]">
               <MenuBar />
              
            </div>

            <Button variant="default" className="bg-[black] hover:text-[black] w-[150px] p-4 fixed top-[15%] right-[5%] z-[50]">
                  View Thali
               </Button>

            <div className="text-[black] mt-[200px] ml-[50px] text-4xl font-bold font-poorStory">
               <h1>Breads</h1>
            </div>

            {/* Grid of Menu Item Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-[50px] mt-4">
               {breads.map((bread) => (
                  <MenuItemCard
                     key={bread.id}
                     title={bread.title}
                     description={bread.description}
                     imageUrl={bread.imageUrl}
                  />
               ))}
            </div>

            <Button
               variant="default"
               className="bg-[black] hover:text-[black] fixed bottom-[5%] right-[5%] p-4 w-[150px]"
            >
               Next
            </Button>
         </div>
      </>
   )
}


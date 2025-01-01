// app/user/layout.tsx
import Header from "@/components/uheader/page";
import { ToastProvider } from "@/components/ui/toast"
import BottomNav from "@/components/bottomNav/page";
export default function UserLayout({ children }: { children: React.ReactNode }) {
   return (
      <>
      <ToastProvider>
         <Header />
          <BottomNav />
         <div className="bg-foreground w-[100%] h-auto min-h-[100vh]">
            {children} 
         </div>
         </ToastProvider>
      </>
   );
}

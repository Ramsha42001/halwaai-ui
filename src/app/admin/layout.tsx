// app/user/layout.tsx
import AdminNav from "@/components/adminNav/page";
import Header from "@/components/uheader/page";
import { ToastProvider } from "@/components/ui/toast"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
   return (
      <>
      <ToastProvider>
         <Header />
         <AdminNav />
         <div className="bg-foreground w-[100%] h-auto min-h-[100vh]">
            {children} 
         </div>
         </ToastProvider>
      </>
   );
}

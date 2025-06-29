// app/user/layout.tsx
import AdminNav from "@/components/adminNav/page";
import SubHeader from "@/components/sub-header";
import Header from "@/components/uheader/page";
import { ToastProvider } from "@/components/ui/toast"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
   return (
      <>
         <ToastProvider>
            <Header />
            <SubHeader />
            <AdminNav />
            <div className="bg-[#fff5f5] mb-[0px] w-[100%] h-auto min-h-[100vh]">
               {children}
            </div>
         </ToastProvider>
      </>
   );
}

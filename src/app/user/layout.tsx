// app/user/layout.tsx
import Header from "@/components/uheader/page";
import { ToastProvider } from "@/components/ui/toast";
import BottomNav from "@/components/bottomNav/page";
import { FaWhatsapp } from 'react-icons/fa'; // Importing WhatsApp icon

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ToastProvider>
        <Header />
        <BottomNav />
        <div className="bg-foreground w-[100%] h-auto min-h-[100vh]">
          {children}
        </div>
        
        {/* WhatsApp Icon */}
        <a
          href="https://wa.me/8279243897" // Replace with your WhatsApp number or link
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-20 sm:bottom-20 lg:bottom-5 right-5 bg-green-500 p-3 rounded-full text-white z-[9999] hover:bg-green-600 transition-all"
        >
          <FaWhatsapp className="h-6 w-6" />
        </a>
      </ToastProvider>
    </>
  );
}

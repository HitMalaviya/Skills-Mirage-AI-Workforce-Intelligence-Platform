import { Plus_Jakarta_Sans } from "next/font/google";
import { AuthProvider } from "@/context/AuthContext";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata = {
  title: "Skills Mirage - Workforce Intelligence System",
  description: "Career intelligence and analytics dashboard",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${plusJakarta.className} bg-slate-50 text-slate-900 min-h-screen`} suppressHydrationWarning>
        <AuthProvider>
          <Header />
          <Sidebar />
          <main className="pl-64 pt-16 min-h-screen">
            <div className="p-8 max-w-7xl mx-auto w-full">
              {children}
            </div>
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}

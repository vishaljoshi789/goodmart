import type { Metadata } from "next";
import "../globals.css";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import Sidebar from "@/components/admin/Sidebar";
import Header from "@/components/admin/Header";
import { GMAdminProvider } from "../(utils)/context/GMAdminContext";
import AdminRoute from "@/components/admin/AdminRoute";

const fontInter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Admin Panel",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <GMAdminProvider>
      <AdminRoute>
        <div className={cn("flex", fontInter.className)}>
          <Sidebar />
          <div className="w-full">
            <Header />
            {children}
          </div>
        </div>
      </AdminRoute>
    </GMAdminProvider>
  );
}

'use client'
import { Inter } from "next/font/google";
import AuthProvider from "@/src/context/AuthProvider";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner"

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <AuthProvider>
      <body className={inter.className}>
        {children}
         <Toaster />
      </body>
      </AuthProvider>
      
    </html>
  );
}
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import QueryProvider from "@/components/QueryProvider";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Blue Umbrella | Expert Mutual Fund Advisory",
  description:
    "Professional mutual fund portfolio management for your financial growth. Expert guidance, proven track record.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <QueryProvider>
          <Navigation />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
          <Toaster position="top-center" richColors />
        </QueryProvider>
      </body>
    </html>
  );
}

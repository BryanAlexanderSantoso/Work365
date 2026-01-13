import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const viewport: Viewport = {
  themeColor: "#020617", // Matches Slate-950 navbar
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "Work365 - Your 365-Day Fitness Transformation",
  description: "Transform your body and mind with Work365. Track workouts, nutrition, running pace, and complete your 365-day fitness journey.",
  keywords: ["fitness", "workout", "nutrition", "running", "health", "HIIT", "timer"],
  authors: [{ name: "Work365 Team" }],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Work365",
  },
  icons: {
    icon: "/icons/icon-192x192.svg",
    shortcut: "/icons/icon-192x192.svg",
    apple: "/icons/icon-192x192.svg", // iOS Icon
  },
  openGraph: {
    title: "Work365 - Your 365-Day Fitness Transformation",
    description: "Transform your body and mind with Work365. Track workouts, nutrition, running pace, and complete your 365-day fitness journey.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased min-h-screen bg-white text-slate-900 selection:bg-red-100 selection:text-red-900">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}

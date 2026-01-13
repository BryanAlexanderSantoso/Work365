"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { DashboardNav } from "@/components/layout/DashboardNav";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        // Add timeout to prevent infinite loading
        const timeoutId = setTimeout(() => {
            if (loading) {
                console.warn("Auth loading timeout - redirecting to login");
                router.push("/login");
            }
        }, 10000); // 10 second timeout

        if (!loading && !user) {
            router.push("/login");
        }

        return () => clearTimeout(timeoutId);
    }, [user, loading, router]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-red-500/20 border-t-red-500 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-500 font-medium">Memuat dashboard...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    return (
        <div className="min-h-screen bg-[#FDFDFF] relative overflow-hidden">
            {/* Background elements */}
            <div className="fixed top-0 right-0 w-[50%] h-[50%] bg-red-500/5 blur-[150px] -z-10" />
            <div className="fixed bottom-0 left-0 w-[50%] h-[50%] bg-blue-500/5 blur-[150px] -z-10" />

            <DashboardNav />
            <main className="lg:pl-80 pt-16 lg:pt-0 min-h-screen">
                <div className="p-4 lg:p-12 max-w-[1400px] mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}

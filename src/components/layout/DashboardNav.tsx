"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Home,
    Timer,
    Footprints,
    Apple,
    Target,
    LogOut,
    Menu,
    X,
    CheckCircle2,
    Dumbbell,
    FileText,
    User,
    ShieldAlert,
    Zap,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

export function DashboardNav() {
    const pathname = usePathname();
    const { signOut, profile } = useAuth();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const navItems = [
        { href: "/dashboard", label: "Dashboard", icon: Home },
        { href: "/workout/timer", label: "Timer", icon: Timer },
        { href: "/run", label: "Aktivitas Lari", icon: Footprints },
        { href: "/nutrition", label: "Nutrisi Harian", icon: Apple },
        { href: "/todos", label: "Jadwal Harian", icon: CheckCircle2 },
        { href: "/program", label: "Rencana Program", icon: Target },
        { href: "/reports", label: "Laporan Progress", icon: FileText },
        { href: "/profile", label: "Profil Saya", icon: User },
        { href: "/upgrade", label: "Upgrade Pro", icon: Zap },
    ];

    if (profile?.is_admin) {
        navItems.push({ href: "/admin", label: "Admin Panel", icon: ShieldAlert });
    }

    return (
        <>
            {/* Mobile Header */}
            <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100">
                <div className="flex items-center justify-between px-6 h-16">
                    <Link href="/dashboard" className="flex items-center gap-3 group">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-500 to-rose-500 flex items-center justify-center shadow-lg shadow-red-500/20">
                            <Dumbbell className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-bold text-xl text-slate-900 tracking-tight">Work365</span>
                    </Link>
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="p-2 w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-500 hover:text-slate-900 transition-colors"
                    >
                        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <nav className="absolute top-16 left-0 right-0 bg-white/95 backdrop-blur-3xl border-b border-slate-100 p-6 shadow-2xl animate-in slide-in-from-top-4 duration-300">
                        <div className="flex flex-col gap-2">
                            {navItems.map((item) => {
                                const Icon = item.icon;
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className={cn(
                                            "flex items-center gap-4 px-6 py-4 rounded-2xl transition-all font-black uppercase text-xs tracking-widest",
                                            isActive
                                                ? "bg-red-600 text-white shadow-xl shadow-red-600/20"
                                                : "text-slate-400 hover:text-slate-900 hover:bg-slate-50"
                                        )}
                                    >
                                        <Icon className={cn("w-5 h-5", isActive ? "text-white" : "text-slate-400")} />
                                        <span>{item.label}</span>
                                    </Link>
                                );
                            })}
                            <div className="pt-6 mt-4 border-t border-slate-100">
                                <Button
                                    variant="ghost"
                                    onClick={signOut}
                                    className="w-full justify-start gap-4 h-14 rounded-2xl text-red-500 hover:text-red-600 hover:bg-red-50 font-black uppercase text-xs tracking-widest"
                                >
                                    <LogOut className="w-5 h-5" />
                                    <span>Keluar Sesi</span>
                                </Button>
                            </div>
                        </div>
                    </nav>
                )}
            </header>

            {/* Desktop Sidebar */}
            <aside className="hidden lg:flex flex-col fixed left-0 top-0 bottom-0 w-80 bg-white border-r border-slate-100 p-10 overflow-y-auto custom-scrollbar">
                {/* Logo Section */}
                <Link href="/dashboard" className="flex items-center gap-4 mb-20 group">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-600 to-rose-600 flex items-center justify-center shadow-2xl shadow-red-500/30 transition-all duration-500 group-hover:rotate-12 group-hover:scale-110">
                        <Dumbbell className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="font-black text-2xl text-slate-900 tracking-tighter leading-none">Work365</h1>
                        <p className="text-[10px] text-red-600 font-black tracking-[0.2em] uppercase mt-1">Life Transformation</p>
                    </div>
                </Link>

                {/* Nav Links */}
                <nav className="flex-1 flex flex-col gap-3">
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] mb-2 px-4">Menu Utama</p>
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-4 px-6 py-4 rounded-2xl transition-all group/nav relative",
                                    isActive
                                        ? "bg-slate-900 text-white shadow-2xl shadow-slate-900/10"
                                        : "text-slate-400 hover:text-slate-900 hover:bg-slate-50"
                                )}
                            >
                                {isActive && (
                                    <div className="absolute left-[-2px] w-1.5 h-6 bg-red-600 rounded-full" />
                                )}
                                <Icon className={cn(
                                    "w-5 h-5 transition-transform duration-300 group-hover/nav:scale-110",
                                    isActive ? "text-red-500" : "text-slate-400"
                                )} />
                                <span className="font-black uppercase text-[11px] tracking-widest">{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Bottom Profile Section */}
                <div className="mt-10 pt-10 border-t border-slate-100">
                    <Link href="/profile" className="block relative group/profile p-6 rounded-[2rem] bg-slate-50 border border-slate-100 mb-6 overflow-hidden hover:shadow-lg transition-all">
                        <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-rose-500/5 opacity-0 group-hover/profile:opacity-100 transition-opacity" />
                        <div className="relative z-10 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-white shadow-xl shadow-slate-200/50 flex items-center justify-center border border-slate-100 group-hover/profile:scale-110 transition-transform">
                                <span className="text-slate-900 font-black text-xl italic drop-shadow-sm">
                                    {profile?.full_name?.charAt(0)?.toUpperCase() || "J"}
                                </span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-slate-900 font-black truncate text-sm">
                                    {profile?.full_name?.split(" ")[0] || "Juara"}
                                </p>
                                <p className="text-[10px] text-slate-400 font-bold tracking-widest uppercase">
                                    Active Member
                                </p>
                            </div>
                        </div>
                    </Link>

                    <Button
                        variant="ghost"
                        onClick={signOut}
                        className="w-full justify-start gap-4 h-14 rounded-2xl text-slate-400 hover:text-red-600 hover:bg-red-50 font-black uppercase text-[10px] tracking-widest transition-all group/logout"
                    >
                        <LogOut className="w-5 h-5 group-hover/logout:translate-x-1 transition-transform" />
                        <span>Keluar Akun</span>
                    </Button>
                </div>
            </aside>
        </>
    );
}

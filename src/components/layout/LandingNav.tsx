"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Dumbbell, Zap, Target, ChartLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function LandingNav() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const navLinks = [
        { href: "#features", label: "Fitur" },
        { href: "#testimonials", label: "Testimoni" },
        { href: "#pricing", label: "Harga" },
    ];

    return (
        <header className="fixed top-0 left-1/2 -translate-x-1/2 z-50 w-full md:w-auto flex justify-center pt-0">
            <div className="bg-slate-950/90 backdrop-blur-md border md:border-t-0 border-white/10 shadow-2xl shadow-black/20 rounded-b-[2rem] px-6 md:px-10 h-20 md:h-24 flex items-center gap-8 md:gap-12 md:min-w-[700px] justify-between md:justify-center">

                {/* Logo */}
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-rose-600 flex items-center justify-center shadow-lg shadow-red-500/20 group-hover:scale-110 transition-transform">
                        <Dumbbell className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-black text-xl text-white tracking-tighter hidden md:block">Work365</span>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <a
                            key={link.href}
                            href={link.href}
                            className="text-slate-400 hover:text-white transition-colors font-bold text-xs uppercase tracking-widest"
                        >
                            {link.label}
                        </a>
                    ))}
                </nav>

                {/* Desktop Auth Buttons */}
                <div className="hidden md:flex items-center gap-4">
                    <Link href="/login">
                        <Button variant="ghost" className="text-slate-300 hover:text-white hover:bg-white/10 rounded-full h-10 px-5 font-bold text-xs">
                            Masuk
                        </Button>
                    </Link>
                    <Link href="/register">
                        <Button className="bg-white text-slate-950 hover:bg-slate-200 font-black text-xs uppercase tracking-widest rounded-full h-10 px-6 shadow-lg shadow-white/10">
                            Daftar
                        </Button>
                    </Link>
                </div>

                {/* Mobile Menu Button - Light Theme for dark background */}
                <div className="flex items-center gap-4 md:hidden">
                    <Link href="/register">
                        <Button size="sm" className="bg-white text-slate-950 hover:bg-slate-200 font-bold text-xs rounded-full">
                            Gabung
                        </Button>
                    </Link>
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white active:scale-95 transition-all"
                    >
                        {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {mobileMenuOpen && (
                <div className="md:hidden absolute top-24 left-4 right-4 animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="bg-slate-900/95 backdrop-blur-xl border border-white/10 p-6 rounded-[2rem] shadow-2xl">
                        <nav className="flex flex-col gap-2 mb-8">
                            {navLinks.map((link) => (
                                <a
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="px-4 py-3 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all font-bold text-sm uppercase tracking-widest"
                                >
                                    {link.label}
                                </a>
                            ))}
                        </nav>
                        <div className="grid grid-cols-2 gap-3">
                            <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                                <Button variant="outline" className="w-full bg-transparent border-slate-700 text-white hover:bg-white/5 h-12 rounded-xl">Masuk</Button>
                            </Link>
                            <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                                <Button className="w-full bg-red-600 hover:bg-red-700 text-white h-12 rounded-xl border-0">Daftar</Button>
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}

interface FeatureCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    gradient: string;
}

export function FeatureCard({ icon, title, description, gradient }: FeatureCardProps) {
    return (
        <div className="group relative p-8 rounded-2xl bg-white border border-slate-100 shadow-xl shadow-slate-200/50 hover:border-red-500/20 transition-all duration-300 hover:-translate-y-1">
            <div className={cn(
                "w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 shadow-lg",
                gradient
            )}>
                {icon}
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">{title}</h3>
            <p className="text-slate-500 font-medium leading-relaxed">{description}</p>
        </div>
    );
}

interface TestimonialCardProps {
    quote: string;
    author: string;
    role: string;
    avatar: string;
}

export function TestimonialCard({ quote, author, role, avatar }: TestimonialCardProps) {
    return (
        <div className="p-8 rounded-2xl bg-white border border-slate-100 shadow-xl shadow-slate-200/50">
            <p className="text-slate-600 mb-8 italic font-medium leading-relaxed">&ldquo;{quote}&rdquo;</p>
            <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-red-600 to-rose-500 flex items-center justify-center text-white font-black text-lg shadow-lg">
                    {avatar}
                </div>
                <div>
                    <p className="font-black text-slate-900 tracking-tight">{author}</p>
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{role}</p>
                </div>
            </div>
        </div>
    );
}

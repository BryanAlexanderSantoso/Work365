"use client";

import { useAuth } from "@/contexts/AuthContext";
import { getDayOfJourney } from "@/lib/utils";
import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
    Timer,
    Footprints,
    Apple,
    Target,
    TrendingUp,
    Flame,
    Trophy,
    ChevronRight,
    Zap,
    Calendar,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
    const { profile } = useAuth();

    const journeyStartDate = profile?.journey_start_date
        ? new Date(profile.journey_start_date)
        : new Date();
    const currentDay = getDayOfJourney(journeyStartDate);
    const progressPercent = (currentDay / 365) * 100;

    // Mock data for widgets
    const todayCalories = 1850;
    const targetCalories = profile?.tdee || 2200;
    const caloriesRemaining = targetCalories - todayCalories;
    const lastRunPace = "5:32";
    const workoutStatus = "Selesai";

    return (
        <div className="space-y-12 animate-in fade-in duration-1000">
            {/* Header with Glassmorphism */}
            <div className="relative p-10 rounded-[3rem] overflow-hidden border border-white/40 shadow-2xl shadow-slate-200/50 group">
                <div className="absolute inset-0 bg-gradient-to-br from-white/95 to-slate-50/90 backdrop-blur-3xl -z-10" />
                <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 blur-[100px] -z-10 group-hover:bg-red-500/10 transition-colors duration-1000" />

                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div>
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-50 text-red-600 text-[10px] font-black uppercase tracking-[0.2em] mb-4 border border-red-100/50">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
                            Active Journey
                        </div>
                        <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter mb-4 leading-tight">
                            Semangat, <br />
                            <span className="gradient-text drop-shadow-sm">{profile?.full_name?.split(" ")[0] || "Juara"}</span>! 🚀
                        </h1>
                        <p className="text-xl text-slate-400 font-bold max-w-md leading-relaxed">
                            Hari ini adalah peluang baru untuk melampaui batas dirimu sendiri.
                        </p>
                    </div>

                    <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-2xl shadow-slate-900/20 min-w-[240px] relative overflow-hidden group/card">
                        <div className="absolute top-[-20px] right-[-20px] w-24 h-24 bg-red-500/10 rounded-full blur-2xl group-hover/card:bg-red-500/20 transition-colors" />
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                                    <Target className="w-5 h-5 text-red-500" />
                                </div>
                                <span className="text-xs font-black uppercase tracking-widest text-slate-400">Milestone</span>
                            </div>
                            <div className="text-4xl font-black mb-1 italic">Day {currentDay}</div>
                            <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Dari total 365 hari</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Journey Map Card (Horizontal Progress) */}
            <div className="mager-card bg-white border-slate-100 p-10 shadow-3xl shadow-slate-200/40 relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1 h-full bg-red-500/20" />

                <div className="flex flex-col lg:flex-row items-center gap-16">
                    <div className="text-center lg:text-left">
                        <p className="text-sm font-black text-slate-400 uppercase tracking-[0.3em] mb-4">Current Progress</p>
                        <div className="text-8xl font-black text-slate-900 tracking-tighter mb-2 group-hover:scale-105 transition-transform duration-500">
                            {Math.round(progressPercent)}<span className="text-red-600 text-4xl">%</span>
                        </div>
                        <p className="text-lg font-bold text-slate-400">Transformasi Tubuhmu</p>
                    </div>

                    <div className="flex-1 w-full space-y-10">
                        <div className="relative h-20 flex items-center">
                            {/* Track */}
                            <div className="absolute w-full h-4 bg-slate-50 rounded-full border border-slate-100 shadow-inner" />
                            {/* Progress Fill */}
                            <div
                                className="absolute h-4 bg-gradient-to-r from-red-500 via-rose-500 to-red-600 rounded-full shadow-lg shadow-red-500/40 transition-all duration-1000 ease-out"
                                style={{ width: `${progressPercent}%` }}
                            >
                                <div className="absolute -right-2 -top-2 w-8 h-8 rounded-full bg-white border-4 border-red-600 shadow-xl flex items-center justify-center">
                                    <Flame className="w-4 h-4 text-red-600 fill-red-600" />
                                </div>
                            </div>

                            {/* Landmarks */}
                            <div className="absolute w-full flex justify-between px-0.5 pointer-events-none">
                                {[0, 25, 50, 75, 100].map(p => (
                                    <div key={p} className="flex flex-col items-center">
                                        <div className={cn(
                                            "w-1 h-8 rounded-full transition-colors duration-500",
                                            progressPercent >= p ? "bg-red-500/20" : "bg-slate-100"
                                        )} />
                                        <span className={cn(
                                            "mt-8 text-[10px] font-black uppercase tracking-widest",
                                            progressPercent >= p ? "text-red-500" : "text-slate-300"
                                        )}>{p}%</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-4">
                            <div className="p-5 rounded-3xl bg-slate-50/50 border border-slate-100 text-center">
                                <p className="text-2xl font-black text-slate-900">{currentDay}</p>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Hari Terlampaui</p>
                            </div>
                            <div className="p-5 rounded-3xl bg-slate-50/50 border border-slate-100 text-center">
                                <p className="text-2xl font-black text-slate-900">{365 - currentDay}</p>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Tersisa</p>
                            </div>
                            <div className="p-5 rounded-3xl bg-slate-50/50 border border-slate-100 text-center">
                                <p className="text-2xl font-black text-slate-900">12</p>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Lencana</p>
                            </div>
                            <div className="p-5 rounded-3xl bg-slate-50/50 border border-slate-100 text-center">
                                <p className="text-2xl font-black text-slate-900">4.2</p>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Bintang</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Overview Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {/* Calories Glass Widget */}
                <div className="mager-card bg-white border-slate-100 p-8 hover:translate-y-[-8px] transition-all duration-500 shadow-2xl shadow-slate-200/30 group">
                    <div className="flex items-center justify-between mb-8">
                        <div className="w-16 h-16 rounded-[1.5rem] bg-red-50 flex items-center justify-center shadow-lg shadow-red-500/5 group-hover:scale-110 transition-transform">
                            <Flame className="w-8 h-8 text-red-500 fill-red-500/20" />
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</p>
                            <span className="px-3 py-1 rounded-full bg-red-100 text-red-600 text-[10px] font-black uppercase tracking-widest">
                                {caloriesRemaining > 0 ? "Under Limit" : "Over Limit"}
                            </span>
                        </div>
                    </div>
                    <div className="space-y-1">
                        <p className="text-4xl font-black text-slate-900 tracking-tight">{todayCalories}</p>
                        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Kilokalori Terbakar</p>
                    </div>
                    <div className="mt-8 space-y-3">
                        <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-red-500 to-rose-500 rounded-full transition-all duration-1000"
                                style={{ width: `${Math.min((todayCalories / targetCalories) * 100, 100)}%` }}
                            />
                        </div>
                        <div className="flex justify-between text-[10px] font-bold text-slate-400 tracking-widest">
                            <span>Target: {targetCalories}</span>
                            <span className="text-red-500">{caloriesRemaining} Sisa</span>
                        </div>
                    </div>
                </div>

                {/* Training Glass Widget */}
                <div className="mager-card bg-slate-900/95 backdrop-blur-3xl border-0 p-8 hover:translate-y-[-8px] transition-all duration-500 shadow-3xl shadow-slate-900/40 text-white group">
                    <div className="flex items-center justify-between mb-8">
                        <div className="w-16 h-16 rounded-[1.5rem] bg-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Timer className="w-8 h-8 text-red-500" />
                        </div>
                        <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
                    </div>
                    <div className="space-y-1 mb-8">
                        <p className="text-2xl font-black tracking-tight leading-tight">HIIT Cardio Session</p>
                        <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">45 Menit • Menengah</p>
                    </div>
                    <Link href="/workout/timer">
                        <Button className="w-full h-14 rounded-2xl bg-red-600 hover:bg-red-700 text-sm font-black uppercase tracking-widest shadow-xl shadow-red-600/30 group-hover:shadow-red-600/50 active:scale-95 transition-all">
                            Start Session
                        </Button>
                    </Link>
                </div>

                {/* Running Glass Widget */}
                <div className="mager-card bg-white border-slate-100 p-8 hover:translate-y-[-8px] transition-all duration-500 shadow-2xl shadow-slate-200/30 group">
                    <div className="flex items-center justify-between mb-8">
                        <div className="w-16 h-16 rounded-[1.5rem] bg-red-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Footprints className="w-8 h-8 text-red-500" />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <p className="text-4xl font-black text-slate-900 tracking-tight">{lastRunPace}</p>
                        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Pace Menit/KM</p>
                    </div>
                    <div className="mt-8">
                        <Link href="/run">
                            <Button variant="ghost" className="w-full h-14 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-600 font-black text-xs uppercase tracking-widest">
                                Log Active Run
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Streak Glass Widget */}
                <div className="mager-card bg-gradient-to-br from-red-600 to-rose-700 border-0 p-8 hover:translate-y-[-8px] transition-all duration-500 shadow-3xl shadow-red-600/40 text-white group relative overflow-hidden">
                    <div className="absolute top-[-20px] right-[-20px] w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                    <div className="flex items-center justify-between mb-8 relative z-10">
                        <div className="w-16 h-16 rounded-[1.5rem] bg-white/20 backdrop-blur-md flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Trophy className="w-8 h-8 text-white" />
                        </div>
                    </div>
                    <div className="space-y-1 relative z-10">
                        <p className="text-4xl font-black tracking-tight">{currentDay} Hari</p>
                        <p className="text-sm font-bold text-white/70 uppercase tracking-widest leading-relaxed">Daily Streak <br /> Terjaga!</p>
                    </div>
                    <div className="absolute bottom-[-10px] right-[-10px] opacity-10 rotate-12 group-hover:scale-150 transition-transform duration-1000">
                        <Trophy className="w-32 h-32" />
                    </div>
                </div>
            </div>

            {/* Bottom Section - Detailed Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Nutrition Breakdown */}
                <div className="mager-card bg-white border-slate-100 p-10 shadow-3xl shadow-slate-200/40">
                    <div className="flex items-center justify-between mb-12">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
                                    <Apple className="w-6 h-6 text-orange-500" />
                                </div>
                                <h3 className="text-2xl font-black text-slate-900 tracking-tight">Status Gizi</h3>
                            </div>
                            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest ml-1">Daily Macro Intake</p>
                        </div>
                        <Link href="/nutrition">
                            <Button variant="ghost" className="h-12 px-6 rounded-2xl text-orange-600 font-black text-xs uppercase tracking-widest hover:bg-orange-50 gap-2">
                                Detail Nutrisi
                                <ChevronRight className="w-4 h-4" />
                            </Button>
                        </Link>
                    </div>

                    <div className="grid grid-cols-3 gap-8 mb-12">
                        {[
                            { label: "Protein", value: 125, target: 150, color: "stroke-orange-500", bg: "bg-orange-500" },
                            { label: "Karbo", value: 180, target: 250, color: "stroke-red-500", bg: "bg-red-500" },
                            { label: "Lemak", value: 55, target: 70, color: "stroke-rose-400", bg: "bg-rose-400" },
                        ].map((m) => (
                            <div key={m.label} className="flex flex-col items-center group/macro">
                                <div className="relative w-24 h-24 mb-6 group-hover/macro:scale-110 transition-transform">
                                    <svg className="w-full h-full -rotate-90">
                                        <circle cx="48" cy="48" r="42" fill="none" stroke="#f1f5f9" strokeWidth="10" />
                                        <circle
                                            cx="48"
                                            cy="48"
                                            r="42"
                                            fill="none"
                                            className={m.color}
                                            strokeWidth="10"
                                            strokeDasharray={2 * Math.PI * 42}
                                            strokeDashoffset={2 * Math.PI * 42 * (1 - m.value / m.target)}
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <span className="text-sm font-black text-slate-900">{Math.round((m.value / m.target) * 100)}%</span>
                                    </div>
                                </div>
                                <p className="text-lg font-black text-slate-900 mb-1">{m.value}g</p>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{m.label}</p>
                            </div>
                        ))}
                    </div>

                    <div className="space-y-4">
                        <div className="p-5 rounded-3xl bg-slate-50 border border-slate-100 flex items-center justify-between group hover:bg-white hover:shadow-xl transition-all">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-xl">🥗</div>
                                <div>
                                    <p className="font-bold text-slate-900">Makan Siang Sehat</p>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Salad Ayam & Quinoa</p>
                                </div>
                            </div>
                            <span className="text-lg font-black text-slate-900">650 <span className="text-xs text-slate-400 uppercase">cal</span></span>
                        </div>
                        <div className="p-5 rounded-3xl bg-slate-50 border border-slate-100 flex items-center justify-between group hover:bg-white hover:shadow-xl transition-all">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-xl">🥪</div>
                                <div>
                                    <p className="font-bold text-slate-900">Sarapan Pagi</p>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Oatmeal & Buah Beri</p>
                                </div>
                            </div>
                            <span className="text-lg font-black text-slate-900">420 <span className="text-xs text-slate-400 uppercase">cal</span></span>
                        </div>
                    </div>
                </div>

                {/* Upcoming Schedule */}
                <div className="mager-card bg-white border-slate-100 p-10 shadow-3xl shadow-slate-200/40">
                    <div className="flex items-center justify-between mb-12">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                                    <Calendar className="w-6 h-6 text-blue-500" />
                                </div>
                                <h3 className="text-2xl font-black text-slate-900 tracking-tight">Timeline</h3>
                            </div>
                            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest ml-1">Target Minggu Ini</p>
                        </div>
                        <Link href="/program">
                            <Button variant="ghost" className="h-12 px-6 rounded-2xl text-blue-600 font-black text-xs uppercase tracking-widest hover:bg-blue-50 gap-2">
                                Lihat Kalender
                                <ChevronRight className="w-4 h-4" />
                            </Button>
                        </Link>
                    </div>

                    <div className="space-y-6">
                        {[
                            { day: "Hari Ini", type: "Cardio", meta: "High Intensity", status: "Done", active: true },
                            { day: "Besok", type: "Strength", meta: "Upper Body", status: "Upcoming", active: false },
                            { day: "Rabu", type: "Active Recovery", meta: "Lari Ringan 3km", status: "Upcoming", active: false },
                            { day: "Kamis", type: "Strength", meta: "Lower Body", status: "Upcoming", active: false },
                        ].map((item, i) => (
                            <div key={i} className={cn(
                                "relative flex items-center justify-between p-6 rounded-[2rem] transition-all",
                                item.active ? "bg-slate-900 text-white shadow-2xl shadow-slate-900/40" : "bg-slate-50 text-slate-900 border border-slate-100"
                            )}>
                                {item.active && (
                                    <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-10 bg-red-600 rounded-full" />
                                )}
                                <div className="flex items-center gap-6">
                                    <div className={cn(
                                        "w-14 h-14 rounded-2xl flex flex-col items-center justify-center font-black",
                                        item.active ? "bg-white/10" : "bg-white shadow-sm"
                                    )}>
                                        <span className="text-[10px] uppercase tracking-tighter opacity-70 leading-none mb-1">{item.day.slice(0, 3)}</span>
                                        <span className="text-lg leading-none italic">{i + 10}</span>
                                    </div>
                                    <div>
                                        <p className="text-lg font-black leading-tight mb-1">{item.type}</p>
                                        <p className={cn("text-xs font-bold uppercase tracking-widest", item.active ? "text-slate-400" : "text-slate-400")}>{item.meta}</p>
                                    </div>
                                </div>
                                <div className={cn(
                                    "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest",
                                    item.active ? "bg-red-600 text-white" : "bg-white border border-slate-200 text-slate-400"
                                )}>
                                    {item.status}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-12">
                        <Link href="/workout/timer">
                            <Button className="w-full h-16 rounded-3xl bg-slate-900 hover:bg-slate-800 text-white font-black uppercase tracking-[0.2em] shadow-2xl shadow-slate-900/10 gap-3 group">
                                <Zap className="w-5 h-5 text-red-500 fill-red-500 group-hover:scale-125 transition-transform" />
                                Latihan Terjadwal
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

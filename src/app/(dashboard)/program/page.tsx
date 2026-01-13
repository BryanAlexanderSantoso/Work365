"use client";

import { useEffect, useState } from "react";
import {
    Trophy,
    MapPin,
    Calendar,
    Star,
    Lock,
    CheckCircle2,
    Medal,
    Flag,
    Zap
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/contexts/AuthContext";
import { getDayOfJourney, cn } from "@/lib/utils";

const MILESTONES = [
    { day: 1, title: "Awal Perjalanan", description: "Memulai transformasi diri Anda hari ini.", icon: Flag },
    { day: 7, title: "Minggu Pertama", description: "Berhasil melewati rintangan awal dengan kuat.", icon: Zap },
    { day: 30, title: "Pembentuk Kebiasaan", description: "30 hari konsistensi tanpa henti.", icon: Star },
    { day: 50, title: "Hampir Seperempat", description: "Membangun momentum yang serius.", icon: Calendar },
    { day: 100, title: "Klub Seratus", description: "Dedikasi 100 hari yang luar biasa.", icon: Trophy },
    { day: 180, title: "Titik Tengah", description: "Enam bulan transformasi yang menginspirasi.", icon: MapPin },
    { day: 250, title: "Status Elit", description: "Mendekati garis akhir perjalanan.", icon: Medal },
    { day: 300, title: "Hitung Mundur", description: "Garis finish sudah terlihat jelas.", icon: Calendar },
    { day: 365, title: "Transformasi Sempurna", description: "Selamat! Anda adalah versi terbaik diri sendiri.", icon: Trophy },
];

export default function ProgramPage() {
    const { profile } = useAuth();
    const [currentDay, setCurrentDay] = useState(1);

    useEffect(() => {
        if (profile?.journey_start_date) {
            setCurrentDay(getDayOfJourney(new Date(profile.journey_start_date)));
        }
    }, [profile]);

    return (
        <div className="space-y-12 animate-in fade-in duration-700 max-w-5xl mx-auto">
            {/* Header */}
            <div className="text-center space-y-6">
                <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-red-50 border border-red-100 text-red-600 font-bold text-sm tracking-tight">
                    <Calendar className="w-4 h-4" />
                    <span>Hari ke-{currentDay} dari 365</span>
                </div>
                <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tight">
                    Rencana <span className="text-red-600">Transformasi</span>
                </h1>
                <p className="text-lg text-slate-500 font-medium max-w-2xl mx-auto">
                    Setiap hari adalah langkah maju. Pantau progresmu, raih pencapaian, dan tetaplah konsisten untuk menjadi versi terbaik dirimu.
                </p>
            </div>

            {/* Main Progress Bar */}
            <div className="mager-card bg-white border-slate-100 p-10 md:p-14 shadow-2xl shadow-slate-200/50 relative overflow-hidden">
                <div className="absolute inset-0 bg-grid-slate-100/50 [mask-image:linear-gradient(to_bottom,white,transparent)]" />
                <div className="relative z-10">
                    <div className="flex justify-between text-xs font-black text-slate-400 uppercase tracking-widest mb-4">
                        <span>Awal</span>
                        <span>Garis Finish</span>
                    </div>
                    <div className="relative h-4 bg-slate-50 rounded-full overflow-hidden border border-slate-100 p-0.5">
                        <div
                            className="h-full bg-gradient-to-r from-red-600 to-rose-500 rounded-full transition-all duration-1000 ease-out relative"
                            style={{ width: `${Math.min((currentDay / 365) * 100, 100)}%` }}
                        >
                            <div className="absolute top-0 right-0 bottom-0 w-4 bg-white/30 blur-sm" />
                        </div>
                    </div>
                    <div className="mt-8 flex justify-between items-end">
                        <div className="text-left">
                            <p className="text-4xl font-black text-slate-900 tracking-tighter">{((currentDay / 365) * 100).toFixed(1)}%</p>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Telah Selesai</p>
                        </div>
                        <div className="text-right">
                            <p className="text-4xl font-black text-slate-900 tracking-tighter">{Math.max(0, 365 - currentDay)}</p>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sisa Hari Lagi</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Timeline Journey */}
            <div className="relative pt-10 px-4 md:px-0">
                <div className="absolute left-[39px] md:left-1/2 top-0 bottom-0 w-1 bg-slate-100 -translate-x-1/2" />

                <div className="space-y-16">
                    {MILESTONES.map((milestone, index) => {
                        const isUnlocked = currentDay >= milestone.day;
                        const Icon = milestone.icon;

                        return (
                            <div
                                key={milestone.day}
                                className={cn(
                                    "relative flex flex-col md:flex-row gap-10 items-start md:items-center",
                                    index % 2 === 0 ? "md:flex-row-reverse" : ""
                                )}
                            >
                                {/* Connector Dot */}
                                <div className={cn(
                                    "absolute left-[39px] md:left-1/2 top-10 md:top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full border-4 bg-white transition-all duration-500",
                                    isUnlocked
                                        ? "border-red-600 shadow-[0_0_20px_rgba(239,68,68,0.4)] scale-110"
                                        : "border-slate-100"
                                )} />

                                {/* Content Card */}
                                <div className="flex-1 w-full pl-20 md:pl-0">
                                    <div className={cn(
                                        "mager-card relative p-8 bg-white border-slate-100 transition-all duration-500 hover:scale-[1.02]",
                                        isUnlocked
                                            ? "shadow-xl shadow-slate-200/50"
                                            : "opacity-40 grayscale"
                                    )}>
                                        <div className="flex items-start justify-between mb-6">
                                            <div className={cn(
                                                "w-14 h-14 rounded-2xl flex items-center justify-center",
                                                isUnlocked
                                                    ? "bg-red-50 text-red-600"
                                                    : "bg-slate-50 text-slate-400"
                                            )}>
                                                <Icon className="w-8 h-8" />
                                            </div>
                                            <div className={cn(
                                                "text-[10px] font-black px-4 py-1.5 rounded-full border uppercase tracking-widest",
                                                isUnlocked
                                                    ? "bg-red-50 border-red-100 text-red-600"
                                                    : "bg-slate-50 border-slate-100 text-slate-400"
                                            )}>
                                                Hari {milestone.day}
                                            </div>
                                        </div>

                                        <h3 className={cn(
                                            "text-2xl font-black tracking-tight mb-2",
                                            isUnlocked ? "text-slate-900" : "text-slate-400"
                                        )}>
                                            {milestone.title}
                                        </h3>
                                        <p className="text-slate-500 font-medium">
                                            {milestone.description}
                                        </p>

                                        {/* Status Icon */}
                                        <div className="absolute top-8 right-8">
                                            {isUnlocked ? (
                                                <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                                                    <CheckCircle2 className="w-4 h-4 text-white" />
                                                </div>
                                            ) : (
                                                <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center">
                                                    <Lock className="w-3 h-3 text-slate-400" />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Empty Space for Balance */}
                                <div className="flex-1 hidden md:block" />
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

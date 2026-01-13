"use client";

import { useState } from "react";
import {
    FileText,
    Download,
    Calendar,
    ChevronRight,
    Loader2,
    CheckCircle2,
    Activity,
    Clock,
    Flame
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { generatePDFReport } from "@/lib/reports";
import { cn } from "@/lib/utils";

const reportTypes = [
    {
        id: "daily",
        title: "Laporan Harian",
        description: "Review aktivitas 24 jam terakhir Anda.",
        type: "Harian",
        icon: Clock,
        color: "bg-blue-500"
    },
    {
        id: "weekly",
        title: "Laporan Mingguan",
        description: "Tren progress dan konsistensi selama 7 hari.",
        type: "Mingguan",
        icon: Activity,
        color: "bg-red-600"
    },
    {
        id: "monthly",
        title: "Laporan Bulanan",
        description: "Analisis mendalam transformasi 30 hari.",
        type: "Bulanan",
        icon: Calendar,
        color: "bg-orange-600"
    },
    {
        id: "yearly",
        title: "Laporan Tahunan",
        description: "Arsip lengkap perjalanan 365 hari Anda.",
        type: "Tahunan",
        icon: Flame,
        color: "bg-slate-900"
    }
];

export default function ReportsPage() {
    const { user, profile } = useAuth();
    const [generating, setGenerating] = useState<string | null>(null);

    const handleDownload = async (report: typeof reportTypes[0]) => {
        if (!user) return;
        setGenerating(report.id);

        try {
            const now = new Date();
            let startDate = new Date();

            if (report.id === "daily") startDate.setDate(now.getDate() - 1);
            else if (report.id === "weekly") startDate.setDate(now.getDate() - 7);
            else if (report.id === "monthly") startDate.setMonth(now.getMonth() - 1);
            else if (report.id === "yearly") startDate.setFullYear(now.getFullYear() - 1);

            const startDateStr = startDate.toISOString();

            // Fetch Workouts
            const { data: workouts } = await supabase
                .from("workouts")
                .select("*")
                .eq("user_id", user.id)
                .gte("created_at", startDateStr)
                .order("created_at", { ascending: false });

            // Fetch Runs
            const { data: runs } = await supabase
                .from("runs")
                .select("*")
                .eq("user_id", user.id)
                .gte("created_at", startDateStr)
                .order("created_at", { ascending: false });

            // Fetch Nutrition
            const { data: nutrition } = await supabase
                .from("nutrition_logs")
                .select("*")
                .eq("user_id", user.id)
                .gte("created_at", startDateStr)
                .order("created_at", { ascending: false });

            const dateRange = `${startDate.toLocaleDateString("id-ID")} - ${now.toLocaleDateString("id-ID")}`;

            generatePDFReport({
                fullName: profile?.full_name || "Member Work365",
                workouts: workouts || [],
                runs: runs || [],
                nutrition: nutrition || [],
                type: report.type as any,
                dateRange: dateRange
            });

        } catch (error) {
            console.error("Error generating report:", error);
            alert("Gagal mengunduh laporan. Silakan coba lagi.");
        } finally {
            setGenerating(null);
        }
    };

    return (
        <div className="max-w-6xl mx-auto px-6 py-12">
            <div className="mb-12">
                <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-4">Pusat Laporan Progress</h1>
                <p className="text-slate-500 font-medium text-lg">
                    Dapatkan arsip data latihan, aktivitas lari, dan nutrisi Anda dalam format PDF pro.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                {reportTypes.map((report) => (
                    <div
                        key={report.id}
                        className="mager-card bg-white p-8 border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col group hover:border-red-100 transition-all"
                    >
                        <div className="flex items-start justify-between mb-8">
                            <div className={cn("w-16 h-16 rounded-[2rem] flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform", report.color)}>
                                <report.icon className="w-8 h-8 text-white" />
                            </div>
                            <div className="bg-slate-50 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 border border-slate-100 uppercase">
                                PDF Format
                            </div>
                        </div>

                        <h3 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">{report.title}</h3>
                        <p className="text-slate-500 font-medium leading-relaxed mb-10 flex-1">
                            {report.description}
                        </p>

                        <Button
                            onClick={() => handleDownload(report)}
                            disabled={generating !== null}
                            className={cn(
                                "w-full h-16 rounded-2xl font-black gap-3 text-lg transition-all",
                                report.id === "weekly" ? "bg-red-600 hover:bg-red-700" : "bg-slate-900 hover:bg-black"
                            )}
                        >
                            {generating === report.id ? (
                                <>
                                    <Loader2 className="w-6 h-6 animate-spin" />
                                    <span>Menyiapkan PDF...</span>
                                </>
                            ) : (
                                <>
                                    <Download className="w-6 h-6" />
                                    <span>Unduh Laporan</span>
                                </>
                            )}
                        </Button>
                    </div>
                ))}
            </div>

            <div className="mt-16 bg-slate-900 rounded-[3rem] p-12 text-white overflow-hidden relative">
                <div className="absolute top-0 right-0 w-80 h-80 bg-red-600/10 blur-[100px] rounded-full" />
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
                    <div className="max-w-xl text-center md:text-left">
                        <h4 className="text-3xl font-black mb-4 tracking-tight">Butuh Laporan Kustom?</h4>
                        <p className="text-slate-400 font-medium">
                            Fitur ekspor data mentah (CSV/Excel) untuk analisis mandiri akan segera hadir di Work365 Pro.
                        </p>
                    </div>
                    <Button variant="outline" className="h-16 px-10 rounded-2xl border-white/10 text-white hover:bg-white/5 font-black uppercase tracking-widest text-xs">
                        Tanya Support
                    </Button>
                </div>
            </div>
        </div>
    );
}

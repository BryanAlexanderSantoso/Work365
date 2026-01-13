"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
    Footprints,
    Timer,
    Calendar,
    TrendingUp,
    Plus,
    Trash2,
    ChevronRight,
    TrendingDown,
    MapPin
} from "lucide-react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area
} from "recharts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { formatPace, formatTime, cn } from "@/lib/utils";

interface RunLog {
    id: string;
    distance: number;
    duration: number; // in seconds
    pace: number; // minutes per km
    completed_at: string;
    notes: string | null;
}

export default function RunPage() {
    const { user, profile } = useAuth();
    const [logs, setLogs] = useState<RunLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [adding, setAdding] = useState(false);

    const [distance, setDistance] = useState("");
    const [minutes, setMinutes] = useState("");
    const [seconds, setSeconds] = useState("");
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [notes, setNotes] = useState("");

    const [calculatedPace, setCalculatedPace] = useState(0);

    useEffect(() => {
        if (user) {
            fetchRuns();
        }
    }, [user]);

    useEffect(() => {
        const dist = parseFloat(distance);
        const mins = parseInt(minutes) || 0;
        const secs = parseInt(seconds) || 0;

        if (dist > 0 && (mins > 0 || secs > 0)) {
            const totalMinutes = mins + secs / 60;
            setCalculatedPace(totalMinutes / dist);
        } else {
            setCalculatedPace(0);
        }
    }, [distance, minutes, seconds]);

    const fetchRuns = async () => {
        try {
            const { data, error } = await supabase
                .from("runs")
                .select("*")
                .order("completed_at", { ascending: false });

            if (error) throw error;
            setLogs(data || []);
        } catch (error) {
            console.error("Error fetching runs:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddRun = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        // Check subscription limit
        if (profile?.subscription_tier === 'free') {
            const now = new Date();
            const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
            startOfWeek.setHours(0, 0, 0, 0);

            const thisWeekRuns = logs.filter(log => new Date(log.completed_at) >= startOfWeek);

            if (thisWeekRuns.length >= 3) {
                alert("Anda telah mencapai batas 3 aktivitas minggu ini. Upgrade ke Pro untuk akses tanpa batas!");
                return;
            }
        }

        setAdding(true);

        try {
            const dist = parseFloat(distance);
            const mins = parseInt(minutes) || 0;
            const secs = parseInt(seconds) || 0;
            const duration = mins * 60 + secs;
            const pace = (mins + secs / 60) / dist;

            const { error } = await supabase.from("runs").insert({
                user_id: user.id,
                distance: dist,
                duration,
                pace,
                completed_at: new Date(date).toISOString(),
                notes: notes || null,
                unit: 'km'
            });

            if (error) throw error;

            setDistance("");
            setMinutes("");
            setSeconds("");
            setNotes("");
            setDate(new Date().toISOString().split('T')[0]);

            fetchRuns();
        } catch (error: any) {
            console.error("Error adding run:", error);
        } finally {
            setAdding(false);
        }
    };

    const handleDeleteRun = async (id: string) => {
        if (!confirm("Apakah Anda yakin ingin menghapus catatan lari ini?")) return;

        try {
            const { error } = await supabase
                .from("runs")
                .delete()
                .eq("id", id);

            if (error) throw error;
            setLogs(logs.filter(log => log.id !== id));
        } catch (error) {
            console.error("Error deleting run:", error);
        }
    };

    const chartData = [...logs].reverse().map(log => ({
        date: new Date(log.completed_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
        pace: parseFloat(log.pace.toFixed(2)),
        distance: log.distance
    }));

    const bestPace = logs.length > 0
        ? Math.min(...logs.map(l => l.pace))
        : 0;

    const totalDistance = logs.reduce((sum, log) => sum + log.distance, 0);

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Aktivitas Lari</h1>
                    <p className="text-lg text-slate-500 font-medium">Catat sesi lari Anda, pantau pace, dan lihat perkembangan Anda.</p>
                </div>
                <Link href="/run/live">
                    <Button size="lg" className="h-14 px-8 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black text-sm uppercase tracking-widest shadow-xl shadow-slate-900/20 hover:scale-105 transition-all">
                        <MapPin className="w-5 h-5 mr-2 text-red-500" />
                        Mulai GPS Run
                    </Button>
                </Link>
            </div>

            <div className="grid lg:grid-cols-3 gap-10">
                {/* Left Column: Input Form & Stats */}
                <div className="space-y-8">
                    <div className="mager-card bg-white border-slate-100 p-8 shadow-xl shadow-slate-200/50">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-10 h-10 rounded-2xl bg-red-50 flex items-center justify-center">
                                <Plus className="w-6 h-6 text-red-500" />
                            </div>
                            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Catat Lari</h2>
                        </div>

                        <form onSubmit={handleAddRun} className="space-y-6">
                            <div className="space-y-2">
                                <Label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Jarak (km)</Label>
                                <div className="relative group">
                                    <Footprints className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-red-500 transition-colors" />
                                    <Input
                                        type="number"
                                        step="0.01"
                                        placeholder="5.00"
                                        className="h-14 pl-12 rounded-2xl border-slate-100 bg-slate-50 focus:bg-white font-bold transition-all"
                                        value={distance}
                                        onChange={(e) => setDistance(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Menit</Label>
                                    <Input
                                        type="number"
                                        placeholder="25"
                                        className="h-14 rounded-2xl border-slate-100 bg-slate-50 focus:bg-white font-bold transition-all"
                                        value={minutes}
                                        onChange={(e) => setMinutes(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Detik</Label>
                                    <Input
                                        type="number"
                                        placeholder="30"
                                        max="59"
                                        className="h-14 rounded-2xl border-slate-100 bg-slate-50 focus:bg-white font-bold transition-all"
                                        value={seconds}
                                        onChange={(e) => setSeconds(e.target.value)}
                                    />
                                </div>
                            </div>

                            {calculatedPace > 0 && (
                                <div className="p-4 rounded-2xl bg-red-50/50 border border-red-100 flex justify-between items-center animate-in zoom-in-95 duration-300">
                                    <span className="text-sm font-bold text-slate-500">Estimasi Pace</span>
                                    <span className="font-black text-red-600">{formatPace(calculatedPace)} /km</span>
                                </div>
                            )}

                            <div className="space-y-2">
                                <Label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Tanggal</Label>
                                <div className="relative group">
                                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-red-500 transition-colors" />
                                    <Input
                                        type="date"
                                        className="h-14 pl-12 rounded-2xl border-slate-100 bg-slate-50 focus:bg-white font-bold transition-all"
                                        value={date}
                                        onChange={(e) => setDate(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Catatan (Opsional)</Label>
                                <Input
                                    placeholder="Bagaimana perasaanmu?"
                                    className="h-14 rounded-2xl border-slate-100 bg-slate-50 focus:bg-white font-bold transition-all"
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                />
                            </div>

                            <Button type="submit" className="w-full h-14 rounded-2xl font-bold bg-red-600 hover:bg-red-700 shadow-xl shadow-red-600/20" disabled={adding}>
                                {adding ? "Menyimpan..." : "Simpan Catatan Lari"}
                            </Button>
                        </form>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 gap-6">
                        <div className="mager-card bg-white border-slate-100 p-6 flex flex-col items-center justify-center text-center shadow-lg shadow-slate-100">
                            <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center mb-3">
                                <TrendingUp className="w-6 h-6 text-slate-600" />
                            </div>
                            <div className="text-3xl font-black text-slate-900 tracking-tighter">{totalDistance.toFixed(1)}</div>
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total km</div>
                        </div>
                        <div className="mager-card bg-white border-slate-100 p-6 flex flex-col items-center justify-center text-center shadow-lg shadow-slate-100">
                            <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center mb-3">
                                <Timer className="w-6 h-6 text-red-500" />
                            </div>
                            <div className="text-3xl font-black text-slate-900 tracking-tighter">
                                {bestPace > 0 ? formatPace(bestPace) : "--:--"}
                            </div>
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pace Terbaik</div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Charts & History */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Chart */}
                    <div className="mager-card bg-white border-slate-100 p-8 shadow-xl shadow-slate-200/50">
                        <div className="mb-8">
                            <h3 className="text-2xl font-black text-slate-900 tracking-tight">Tren Peningkatan Pace</h3>
                            <p className="text-slate-400 font-bold">Pace lari Anda seiring waktu (lebih rendah lebih baik)</p>
                        </div>
                        <div className="h-[350px] w-full">
                            {chartData.length > 1 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={chartData}>
                                        <defs>
                                            <linearGradient id="colorPace" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1} />
                                                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                                        <XAxis
                                            dataKey="date"
                                            stroke="#94a3b8"
                                            tick={{ fill: '#94a3b8', fontWeight: 'bold', fontSize: 12 }}
                                            tickLine={false}
                                            axisLine={false}
                                            dy={10}
                                        />
                                        <YAxis
                                            stroke="#94a3b8"
                                            tick={{ fill: '#94a3b8', fontWeight: 'bold', fontSize: 12 }}
                                            tickLine={false}
                                            axisLine={false}
                                            domain={['dataMin - 1', 'dataMax + 1']}
                                            reversed
                                            dx={-10}
                                        />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: '#fff',
                                                border: '1px solid #f1f5f9',
                                                borderRadius: '16px',
                                                boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
                                            }}
                                            itemStyle={{ color: '#0f172a', fontWeight: 'bold' }}
                                            labelStyle={{ color: '#64748b', fontWeight: 'bold', marginBottom: '4px' }}
                                            formatter={(value: any) => [`${formatPace(value)} /km`, 'Pace']}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="pace"
                                            stroke="#ef4444"
                                            strokeWidth={4}
                                            fillOpacity={1}
                                            fill="url(#colorPace)"
                                            animationDuration={1500}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-slate-300">
                                    <TrendingDown className="w-16 h-16 mb-6 opacity-20" />
                                    <p className="font-bold text-slate-400">Catat lebih banyak sesi lari untuk melihat tren perkembangan Anda.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Recent Logs */}
                    <div className="mager-card bg-white border-slate-100 p-8 shadow-xl shadow-slate-200/50">
                        <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-8">Riwayat Aktivitas</h3>
                        <div className="space-y-4">
                            {loading ? (
                                <div className="text-center py-12">
                                    <div className="w-10 h-10 border-4 border-red-500/20 border-t-red-600 rounded-full animate-spin mx-auto mb-4"></div>
                                    <p className="text-slate-400 font-bold">Memuat data lari...</p>
                                </div>
                            ) : logs.length === 0 ? (
                                <div className="text-center py-12 bg-slate-50/50 rounded-3xl border-2 border-slate-100 border-dashed text-slate-400 font-bold">
                                    Belum ada catatan lari. Mulailah perjalananmu hari ini!
                                </div>
                            ) : (
                                logs.map((log) => (
                                    <div
                                        key={log.id}
                                        className="group flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-2xl bg-white border border-slate-50 hover:border-red-100 shadow-sm hover:shadow-md transition-all sm:gap-4"
                                    >
                                        <div className="flex items-center gap-5">
                                            <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                                                <Footprints className="w-7 h-7 text-red-500" />
                                            </div>
                                            <div>
                                                <p className="font-black text-xl text-slate-900 flex items-center gap-3">
                                                    {log.distance.toFixed(2)} km
                                                    <span className="text-[10px] font-black text-slate-400 bg-slate-50 px-3 py-1 rounded-full uppercase tracking-tighter">
                                                        {new Date(log.completed_at).toLocaleDateString('id-ID')}
                                                    </span>
                                                </p>
                                                <div className="flex items-center gap-4 mt-1">
                                                    <span className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                                                        <Timer className="w-3.5 h-3.5" />
                                                        {formatTime(log.duration)}
                                                    </span>
                                                    <span className="flex items-center gap-1.5 text-xs font-black text-red-500 uppercase tracking-tight">
                                                        <TrendingUp className="w-3.5 h-3.5" />
                                                        {formatPace(log.pace)} /km
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between sm:justify-end gap-4 mt-4 sm:mt-0 pt-4 sm:pt-0 border-t sm:border-t-0 border-slate-50">
                                            <div className="text-sm font-bold text-slate-400 italic max-w-[200px] truncate">
                                                {log.notes}
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-10 w-10 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-xl"
                                                onClick={() => handleDeleteRun(log.id)}
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </Button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

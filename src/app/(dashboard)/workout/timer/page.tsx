"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import {
    Play,
    Pause,
    RotateCcw,
    SkipForward,
    Volume2,
    VolumeX,
    Settings,
    Clock,
    Zap,
    Flame,
    ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useTimerStore, IntervalType, WorkoutConfig } from "@/stores/timerStore";
import { formatTime, cn } from "@/lib/utils";

const intervalColors: Record<IntervalType, { bg: string; text: string; ring: string }> = {
    warmup: { bg: "from-orange-500 to-red-500", text: "text-orange-500", ring: "#f97316" },
    high: { bg: "from-red-500 to-rose-600", text: "text-red-500", ring: "#ef4444" },
    low: { bg: "from-slate-400 to-slate-500", text: "text-slate-400", ring: "#94a3b8" },
    cooldown: { bg: "from-rose-400 to-rose-500", text: "text-rose-400", ring: "#fb7185" },
    rest: { bg: "from-slate-200 to-slate-300", text: "text-slate-400", ring: "#e2e8f0" },
};

export default function WorkoutTimerPage() {
    const {
        workoutConfig,
        isRunning,
        isPaused,
        currentRound,
        currentSet,
        currentIntervalIndex,
        timeRemaining,
        totalTimeElapsed,
        presets,
        setWorkoutConfig,
        startTimer,
        pauseTimer,
        resumeTimer,
        resetTimer,
        tick,
    } = useTimerStore();

    const [soundEnabled, setSoundEnabled] = useState(true);
    const [showPresets, setShowPresets] = useState(!workoutConfig);
    const [showCustomForm, setShowCustomForm] = useState(false);
    const [customConfig, setCustomConfig] = useState({
        name: "Latihan Kustom",
        rounds: 4,
        sets: 1,
        warmup: 60,
        high: 40,
        low: 20,
        cooldown: 60
    });
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const playBeep = useCallback(() => {
        if (!soundEnabled) return;
        try {
            const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.frequency.value = timeRemaining <= 3 ? 880 : 440;
            oscillator.type = "sine";

            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);

            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.2);
        } catch (e) {
            console.log("Audio not supported");
        }
    }, [soundEnabled, timeRemaining]);

    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;
        if (isRunning && !isPaused) {
            interval = setInterval(() => {
                tick();
                if (timeRemaining <= 3 && timeRemaining > 0) {
                    playBeep();
                }
            }, 1000);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isRunning, isPaused, tick, timeRemaining, playBeep]);

    const currentInterval = workoutConfig?.intervals[currentIntervalIndex];
    const intervalColors_current = currentInterval
        ? intervalColors[currentInterval.type]
        : intervalColors.rest;

    const circumference = 2 * Math.PI * 140;
    const progress = currentInterval
        ? (timeRemaining / currentInterval.duration)
        : 0;
    const strokeDashoffset = circumference * (1 - progress);

    const calculateTotalTime = (config: WorkoutConfig) => {
        const warmup = config.intervals.find(i => i.type === "warmup")?.duration || 0;
        const cooldown = config.intervals.find(i => i.type === "cooldown")?.duration || 0;
        const workIntervals = config.intervals.filter(i => i.type !== "warmup" && i.type !== "cooldown");
        const workTime = workIntervals.reduce((sum, i) => sum + i.duration, 0) * config.rounds * config.sets;
        return warmup + workTime + cooldown;
    };

    const handleSelectPreset = (preset: WorkoutConfig) => {
        setWorkoutConfig(preset);
        setShowPresets(false);
    };

    const handlePlayPause = () => {
        if (!isRunning) startTimer();
        else if (isPaused) resumeTimer();
        else pauseTimer();
    };

    if (showPresets || !workoutConfig) {
        return (
            <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in duration-700">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Timer Latihan</h1>
                    <p className="text-lg text-slate-500 font-medium font-medium">Pilih preset latihan yang tersedia atau mulai sesi kustom.</p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Custom Form or Option */}
                    {showCustomForm ? (
                        <div className="mager-card bg-white border-red-100 p-8 shadow-2xl shadow-red-500/5 lg:col-span-2">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-2xl font-black text-slate-900 tracking-tight">Atur Sesi Kustom</h3>
                                <Button variant="ghost" onClick={() => setShowCustomForm(false)} className="rounded-xl font-bold">Batal</Button>
                            </div>

                            <div className="grid md:grid-cols-3 gap-8 mb-10">
                                <div className="space-y-4">
                                    <Label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Struktur</Label>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <span className="text-[10px] font-bold text-slate-400 ml-1">Ronde</span>
                                            <Input
                                                type="number"
                                                value={customConfig.rounds}
                                                onChange={(e) => setCustomConfig({ ...customConfig, rounds: parseInt(e.target.value) || 1 })}
                                                className="h-12 rounded-xl bg-slate-50 font-bold"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <span className="text-[10px] font-bold text-slate-400 ml-1">Set</span>
                                            <Input
                                                type="number"
                                                value={customConfig.sets}
                                                onChange={(e) => setCustomConfig({ ...customConfig, sets: parseInt(e.target.value) || 1 })}
                                                className="h-12 rounded-xl bg-slate-50 font-bold"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <Label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Durasi Inti (Detik)</Label>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <span className="text-[10px] font-bold text-slate-400 ml-1">Latihan</span>
                                            <Input
                                                type="number"
                                                value={customConfig.high}
                                                onChange={(e) => setCustomConfig({ ...customConfig, high: parseInt(e.target.value) || 1 })}
                                                className="h-12 rounded-xl bg-slate-50 font-bold"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <span className="text-[10px] font-bold text-slate-400 ml-1">Istirahat</span>
                                            <Input
                                                type="number"
                                                value={customConfig.low}
                                                onChange={(e) => setCustomConfig({ ...customConfig, low: parseInt(e.target.value) || 1 })}
                                                className="h-12 rounded-xl bg-slate-50 font-bold"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <Label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Pemanasan & Pendinginan</Label>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <span className="text-[10px] font-bold text-slate-400 ml-1">Warmup</span>
                                            <Input
                                                type="number"
                                                value={customConfig.warmup}
                                                onChange={(e) => setCustomConfig({ ...customConfig, warmup: parseInt(e.target.value) || 1 })}
                                                className="h-12 rounded-xl bg-slate-50 font-bold"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <span className="text-[10px] font-bold text-slate-400 ml-1">Cooldown</span>
                                            <Input
                                                type="number"
                                                value={customConfig.cooldown}
                                                onChange={(e) => setCustomConfig({ ...customConfig, cooldown: parseInt(e.target.value) || 1 })}
                                                className="h-12 rounded-xl bg-slate-50 font-bold"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <Button
                                onClick={() => {
                                    const config: WorkoutConfig = {
                                        name: customConfig.name,
                                        rounds: customConfig.rounds,
                                        sets: customConfig.sets,
                                        intervals: [
                                            { type: "warmup", duration: customConfig.warmup, label: "Warm Up" },
                                            { type: "high", duration: customConfig.high, label: "Latihan" },
                                            { type: "low", duration: customConfig.low, label: "Istirahat" },
                                            { type: "cooldown", duration: customConfig.cooldown, label: "Cool Down" },
                                        ]
                                    };
                                    handleSelectPreset(config);
                                }}
                                className="w-full h-16 rounded-2xl text-lg font-bold shadow-xl shadow-red-500/20"
                            >
                                Mulai Latihan Kustom
                            </Button>
                        </div>
                    ) : (
                        <>
                            <div
                                onClick={() => setShowCustomForm(true)}
                                className="mager-card bg-slate-900 border-0 p-8 cursor-pointer group hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20 relative overflow-hidden"
                            >
                                <div className="glow-spot top-[-20px] left-[-20px] bg-red-500/20" />
                                <div className="relative z-10">
                                    <div className="w-16 h-16 rounded-3xl bg-white/10 flex items-center justify-center group-hover:scale-110 transition-transform mb-8">
                                        <Settings className="w-8 h-8 text-white" />
                                    </div>
                                    <h3 className="text-2xl font-black text-white mb-2">Sesi Kustom</h3>
                                    <p className="text-slate-400 font-bold mb-8">Atur waktu latihan, istirahat, dan ronde sesukamu.</p>
                                    <div className="flex items-center justify-between pt-6 border-t border-white/10">
                                        <span className="text-xs font-black text-white uppercase tracking-widest">Buat Sekarang</span>
                                        <ChevronRight className="w-5 h-5 text-white" />
                                    </div>
                                </div>
                            </div>

                            {presets.map((preset, i) => (
                                <div
                                    key={i}
                                    onClick={() => handleSelectPreset(preset)}
                                    className="mager-card bg-white border-slate-100 p-8 cursor-pointer group hover:border-red-500/30 transition-all shadow-xl shadow-slate-200/50"
                                >
                                    <div className="flex items-start justify-between mb-8">
                                        <div className="w-16 h-16 rounded-3xl bg-red-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                                            <Zap className="w-8 h-8 text-red-500" />
                                        </div>
                                        <div className="text-right flex flex-col items-end">
                                            <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{preset.rounds} Ronde</span>
                                            <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{preset.sets} Set</span>
                                        </div>
                                    </div>
                                    <h3 className="text-2xl font-black text-slate-900 mb-2 group-hover:text-red-600 transition-colors">
                                        {preset.name}
                                    </h3>
                                    <div className="flex flex-wrap gap-2 mb-8">
                                        {preset.intervals.map((interval, j) => (
                                            <span
                                                key={j}
                                                className={cn(
                                                    "text-[10px] font-black px-3 py-1.5 rounded-full border uppercase tracking-widest",
                                                    intervalColors[interval.type].text,
                                                    "bg-slate-50 border-slate-100"
                                                )}
                                            >
                                                {interval.label}: {formatTime(interval.duration)}
                                            </span>
                                        ))}
                                    </div>
                                    <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                                        <div className="flex items-center gap-2 text-slate-400 font-bold">
                                            <Clock className="w-5 h-5" />
                                            <span>
                                                Total {formatTime(calculateTotalTime(preset))}
                                            </span>
                                        </div>
                                        <Button variant="ghost" className="rounded-xl font-bold text-red-600 hover:bg-red-50">
                                            Pilih Sesi
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-1">{workoutConfig.name}</h1>
                    <p className="text-slate-500 font-bold">
                        Ronde {currentRound}/{workoutConfig.rounds} • Set {currentSet}/{workoutConfig.sets}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSoundEnabled(!soundEnabled)}
                        className="h-12 w-12 rounded-2xl bg-white border border-slate-100 text-slate-400 hover:text-red-500 hover:bg-red-50"
                    >
                        {soundEnabled ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                            resetTimer();
                            setShowPresets(true);
                        }}
                        className="h-12 w-12 rounded-2xl bg-white border border-slate-100 text-slate-400 hover:text-red-500 hover:bg-red-50"
                    >
                        <Settings className="w-6 h-6" />
                    </Button>
                </div>
            </div>

            {/* Timer Display */}
            <div className="mager-card bg-white border-slate-100 shadow-2xl shadow-slate-200/50 overflow-hidden">
                {/* Interval Indicator */}
                <div className={cn(
                    "py-5 px-8 bg-gradient-to-r transition-all duration-500",
                    intervalColors_current.bg
                )}>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 text-white">
                            <Flame className="w-6 h-6" />
                            <span className="text-xl font-black uppercase tracking-wider">
                                {currentInterval?.label || "Siap"}
                            </span>
                        </div>
                        <span className="text-white/80 font-black tracking-widest text-xs uppercase">
                            Interval {currentIntervalIndex + 1}/{workoutConfig.intervals.length}
                        </span>
                    </div>
                </div>

                <div className="p-12 flex flex-col items-center">
                    <div className="relative w-80 h-80 mb-10">
                        <svg className="w-full h-full -rotate-90">
                            <circle
                                cx="160"
                                cy="160"
                                r="140"
                                fill="none"
                                className="stroke-slate-50"
                                strokeWidth="16"
                            />
                            <circle
                                cx="160"
                                cy="160"
                                r="140"
                                fill="none"
                                stroke={intervalColors_current.ring}
                                strokeWidth="16"
                                strokeDasharray={circumference}
                                strokeDashoffset={strokeDashoffset}
                                strokeLinecap="round"
                                className="transition-all duration-500"
                            />
                        </svg>

                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className={cn(
                                "text-8xl font-black tracking-tighter transition-all",
                                timeRemaining <= 3 && isRunning && !isPaused
                                    ? "text-red-600 scale-110"
                                    : "text-slate-900"
                            )}>
                                {formatTime(timeRemaining)}
                            </span>
                            <span className={cn(
                                "text-sm font-black uppercase tracking-[0.2em] mt-2",
                                intervalColors_current.text
                            )}>
                                {currentInterval?.type || "pause"}
                            </span>
                        </div>

                        {isRunning && !isPaused && (
                            <div
                                className="absolute inset-8 rounded-full animate-ping opacity-10"
                                style={{ backgroundColor: intervalColors_current.ring }}
                            />
                        )}
                    </div>

                    <div className="flex items-center gap-6">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={resetTimer}
                            className="w-16 h-16 rounded-3xl bg-slate-50 text-slate-400 hover:text-slate-900 hover:bg-slate-100"
                        >
                            <RotateCcw className="w-8 h-8" />
                        </Button>

                        <Button
                            onClick={handlePlayPause}
                            className={cn(
                                "w-24 h-24 rounded-[40px] text-white transition-all shadow-2xl",
                                isRunning && !isPaused
                                    ? "bg-slate-900 hover:bg-slate-800 shadow-slate-900/20"
                                    : "bg-red-600 hover:bg-red-700 shadow-red-600/30"
                            )}
                        >
                            {isRunning && !isPaused ? (
                                <Pause className="w-10 h-10" />
                            ) : (
                                <Play className="w-10 h-10 ml-2" />
                            )}
                        </Button>

                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => useTimerStore.getState().nextInterval()}
                            className="w-16 h-16 rounded-3xl bg-slate-50 text-slate-400 hover:text-slate-900 hover:bg-slate-100"
                        >
                            <SkipForward className="w-8 h-8" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Stats Summary */}
            <div className="mager-card bg-white border-slate-100 p-8 shadow-xl shadow-slate-200/50">
                <div className="grid grid-cols-3 gap-6">
                    <div className="text-center">
                        <div className="text-2xl font-black text-slate-900">{formatTime(totalTimeElapsed)}</div>
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Durasi</div>
                    </div>
                    <div className="text-center border-x border-slate-100">
                        <div className="text-2xl font-black text-red-600">{currentRound}/{workoutConfig.rounds}</div>
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ronde</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-black text-red-600">{currentSet}/{workoutConfig.sets}</div>
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Set</div>
                    </div>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-3">
                <div className="flex justify-between items-center px-1">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Progres Latihan</span>
                    <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">{Math.round((currentIntervalIndex / workoutConfig.intervals.length) * 100)}%</span>
                </div>
                <div className="flex h-1.5 gap-1.5">
                    {workoutConfig.intervals.map((interval, i) => (
                        <div
                            key={i}
                            className={cn(
                                "flex-1 rounded-full transition-all duration-500",
                                i < currentIntervalIndex
                                    ? `bg-red-500`
                                    : i === currentIntervalIndex
                                        ? `bg-red-200`
                                        : "bg-slate-100"
                            )}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

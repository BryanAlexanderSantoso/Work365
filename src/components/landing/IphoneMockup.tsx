"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Dumbbell, Timer, Footprints, Apple, Target, TrendingUp, Zap, ChevronLeft, Menu, Activity, Flame } from "lucide-react";
import { formatTime } from "@/lib/utils";

export type ScreenType = "hero" | "timer" | "run" | "nutrition" | "goals" | "stats" | "sync";

interface IphoneMockupProps {
    screen: ScreenType;
}

export function IphoneMockup({ screen }: IphoneMockupProps) {
    return (
        <div className="relative w-[300px] h-[600px] bg-black rounded-[55px] p-2 shadow-2xl border-[8px] border-slate-900 ring-4 ring-slate-200/50">
            {/* Dynamic Island / Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[35px] w-[120px] bg-black rounded-b-3xl z-50 flex items-center justify-center gap-2">
                <div className="w-16 h-4 bg-black rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-slate-800/50 ml-auto mr-2 animate-pulse"></div>
                </div>
            </div>

            {/* Screen Content Wrapper */}
            <div className="w-full h-full bg-white rounded-[45px] overflow-hidden relative">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={screen}
                        initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
                        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="w-full h-full"
                    >
                        {screen === "hero" && <HeroScreen />}
                        {screen === "timer" && <TimerScreen />}
                        {screen === "run" && <RunScreen />}
                        {screen === "nutrition" && <NutritionScreen />}
                        {screen === "goals" && <GoalsScreen />}
                        {/* Default fallback to hero if mostly similar or specific implementations for others */}
                        {(screen === "stats" || screen === "sync") && <HeroScreen />}
                    </motion.div>
                </AnimatePresence>

                {/* Global Bottom Bar */}
                <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-32 h-1 bg-black rounded-full z-40" />
            </div>

            {/* Side Buttons */}
            <div className="absolute top-24 -left-3 w-1.5 h-8 bg-slate-800 rounded-l-md" />
            <div className="absolute top-36 -left-3 w-1.5 h-12 bg-slate-800 rounded-l-md" />
            <div className="absolute top-52 -left-3 w-1.5 h-12 bg-slate-800 rounded-l-md" />
            <div className="absolute top-40 -right-3 w-1.5 h-16 bg-slate-800 rounded-r-md" />
        </div>
    );
}

// --- Screen Components ---

function HeroScreen() {
    return (
        <div className="w-full h-full bg-slate-50 flex flex-col pt-12">
            <div className="px-6 mb-6 flex justify-between items-center">
                <div className="flex gap-2 items-center">
                    <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center shadow-lg shadow-red-500/30">
                        <Dumbbell className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-bold text-slate-900">Work365</span>
                </div>
                <div className="w-8 h-8 rounded-full bg-slate-200"></div>
            </div>

            <div className="px-6 mb-8">
                <h2 className="text-2xl font-black text-slate-900 leading-tight mb-2">Hello, <br /><span className="text-red-600">Champion!</span></h2>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Siap latihan hari ini?</p>
            </div>

            <div className="flex-1 bg-white rounded-t-[3rem] shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] p-6 space-y-4">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-xl shadow-slate-900/20">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-white/10 rounded-lg">
                            <Activity className="w-5 h-5 text-red-500" />
                        </div>
                        <span className="text-xs font-bold bg-white/10 px-2 py-1 rounded-md">Today</span>
                    </div>
                    <div className="space-y-1">
                        <p className="text-3xl font-black">1,240</p>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Calories Burned</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-red-50 border border-red-100 flex flex-col items-center justify-center py-8">
                        <Timer className="w-6 h-6 text-red-500 mb-2" />
                        <span className="font-bold text-slate-900">45 Min</span>
                        <span className="text-[10px] text-slate-400 font-bold uppercase">Workout</span>
                    </div>
                    <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100 flex flex-col items-center justify-center py-8">
                        <Footprints className="w-6 h-6 text-blue-500 mb-2" />
                        <span className="font-bold text-slate-900">5.2 KM</span>
                        <span className="text-[10px] text-slate-400 font-bold uppercase">Run</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

function TimerScreen() {
    return (
        <div className="w-full h-full bg-slate-900 text-white flex flex-col pt-14 p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/20 blur-[100px] rounded-full"></div>

            <div className="flex items-center mb-8 relative z-10">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                    <ChevronLeft className="w-5 h-5" />
                </div>
                <span className="mx-auto font-bold">HIIT Workout</span>
                <div className="w-8"></div>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center relative z-10">
                <div className="w-48 h-48 rounded-full border-[6px] border-slate-800 flex items-center justify-center relative mb-12">
                    <div className="absolute inset-0 rounded-full border-[6px] border-red-500/50 border-t-red-500 rotate-45"></div>
                    <div className="text-center">
                        <span className="text-5xl font-black tracking-tighter">00:45</span>
                        <div className="flex items-center justify-center gap-1 mt-1 text-red-500">
                            <Flame className="w-3 h-3 fill-red-500" />
                            <span className="text-[10px] font-black uppercase tracking-widest">High Intensity</span>
                        </div>
                    </div>
                </div>

                <div className="flex gap-6 w-full justify-center">
                    <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center">
                        <div className="w-6 h-6 bg-white rounded-sm"></div>
                    </div>
                    <div className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center shadow-lg shadow-red-600/30">
                        <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[16px] border-l-white border-b-[10px] border-b-transparent ml-1"></div>
                    </div>
                </div>
            </div>

            <div className="bg-slate-800/50 rounded-2xl p-4 mt-8 backdrop-blur-md">
                <div className="flex justify-between items-center">
                    <div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Next Up</p>
                        <p className="font-bold">Rest Period</p>
                    </div>
                    <span className="text-xl font-bold text-slate-400">00:20</span>
                </div>
            </div>
        </div>
    );
}

function RunScreen() {
    return (
        <div className="w-full h-full bg-white flex flex-col pt-12 relative">
            <div className="abslute inset-0 bg-blue-50/50 h-1/2 w-full z-0"></div>

            {/* Map Placeholder */}
            <div className="h-[45%] bg-slate-100 relative w-full overflow-hidden">
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#cbd5e1 2px, transparent 2px)', backgroundSize: '20px 20px' }}></div>

                {/* Route Line */}
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <path d="M 20,80 Q 50,20 80,50 T 90,20" fill="none" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" strokeDasharray="5 5" />
                </svg>

                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-blue-500 border-2 border-white rounded-full shadow-lg pulse-ring"></div>
            </div>

            <div className="flex-1 bg-white rounded-t-[2rem] -mt-6 relative z-10 p-6 shadow-2xl">
                <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-8"></div>

                <div className="grid grid-cols-2 gap-8 mb-8">
                    <div>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-1">Distance</p>
                        <p className="text-4xl font-black text-slate-900">5.42 <span className="text-sm text-slate-400 font-medium">km</span></p>
                    </div>
                    <div>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-1">Pace</p>
                        <p className="text-4xl font-black text-slate-900">5:30 <span className="text-sm text-slate-400 font-medium">/km</span></p>
                    </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center border border-slate-100 shadow-sm">
                            <Timer className="w-5 h-5 text-blue-500" />
                        </div>
                        <div>
                            <p className="text-[10px] text-slate-400 font-bold uppercase">Duration</p>
                            <p className="font-bold text-slate-900">00:32:15</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center border border-slate-100 shadow-sm">
                            <Flame className="w-5 h-5 text-orange-500" />
                        </div>
                        <div>
                            <p className="text-[10px] text-slate-400 font-bold uppercase">Calories</p>
                            <p className="font-bold text-slate-900">320</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function NutritionScreen() {
    return (
        <div className="w-full h-full bg-[#FAFAFA] flex flex-col pt-12 p-6">
            <h2 className="text-2xl font-black text-slate-900 mb-6">Nutrition</h2>

            <div className="p-6 bg-white rounded-3xl shadow-sm border border-slate-100 mb-6">
                <div className="flex justify-between items-end mb-4">
                    <div>
                        <p className="text-3xl font-black text-slate-900">1,850</p>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Kcal Left</p>
                    </div>
                    <div className="w-12 h-12 rounded-full border-4 border-slate-100 border-t-green-500 rotate-45"></div>
                </div>
                <div className="flex justify-between text-xs font-bold text-slate-500">
                    <span>Protein</span>
                    <span>Carbs</span>
                    <span>Fat</span>
                </div>
                <div className="flex h-2 w-full gap-1 mt-2">
                    <div className="w-[30%] bg-green-500 rounded-full"></div>
                    <div className="w-[40%] bg-orange-400 rounded-full"></div>
                    <div className="w-[30%] bg-yellow-400 rounded-full"></div>
                </div>
            </div>

            <p className="text-sm font-bold text-slate-900 mb-4">Today's Meals</p>
            <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-4 p-3 bg-white rounded-2xl border border-slate-100">
                        <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-xl">
                            {i === 1 ? '🍳' : i === 2 ? '🥗' : '🥩'}
                        </div>
                        <div className="flex-1">
                            <p className="font-bold text-slate-900 text-sm">{i === 1 ? 'Breakfast' : i === 2 ? 'Lunch' : 'Dinner'}</p>
                            <p className="text-xs text-slate-400 font-medium">520 kcal</p>
                        </div>
                        <div className="w-6 h-6 rounded-full bg-green-50 flex items-center justify-center">
                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function GoalsScreen() {
    return (
        <div className="w-full h-full bg-slate-50 flex flex-col pt-12 p-6">
            <div className="text-center mb-8">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Target className="w-10 h-10 text-green-600" />
                </div>
                <h2 className="text-2xl font-black text-slate-900">Goals</h2>
                <p className="text-sm text-slate-500">Keep up the good work!</p>
            </div>

            <div className="space-y-4">
                <div className="p-5 bg-white rounded-2xl shadow-sm border border-slate-100">
                    <div className="flex justify-between mb-2">
                        <span className="font-bold text-sm">Weekly Workout</span>
                        <span className="font-bold text-sm text-green-600">3/4</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full w-[75%] bg-green-500 rounded-full"></div>
                    </div>
                </div>

                <div className="p-5 bg-white rounded-2xl shadow-sm border border-slate-100">
                    <div className="flex justify-between mb-2">
                        <span className="font-bold text-sm">Weight Loss</span>
                        <span className="font-bold text-sm text-blue-600">-2.5 kg</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full w-[40%] bg-blue-500 rounded-full"></div>
                    </div>
                </div>
            </div>
        </div>
    )
}

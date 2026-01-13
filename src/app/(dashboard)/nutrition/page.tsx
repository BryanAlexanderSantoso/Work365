"use client";

import { useState, useEffect, useMemo } from "react";
import {
    Search,
    Plus,
    Trash2,
    ChevronRight,
    Apple,
    Flame,
    PieChart as PieChartIcon,
    Utensils,
    Camera,
    Loader2,
    Sparkles,
    Settings,
    MessageSquareText,
    Dumbbell,
    Send
} from "lucide-react";
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip
} from "recharts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";

// Imports from lib
import { analyzeFoodImage, analyzeFoodText } from "@/lib/gemini";

// Mock Food Database
const foodDatabase = [
    { name: "Oatmeal (1 cup)", calories: 158, protein: 6, carbs: 27, fats: 3 },
    { name: "Banana (Medium)", calories: 105, protein: 1.3, carbs: 27, fats: 0.3 },
    { name: "Chicken Breast (100g)", calories: 165, protein: 31, carbs: 0, fats: 3.6 },
    { name: "Rice (1 cup)", calories: 206, protein: 4.3, carbs: 45, fats: 0.4 },
    { name: "Avocado (Half)", calories: 114, protein: 1.4, carbs: 6, fats: 10.5 },
    { name: "Egg (Large)", calories: 78, protein: 6, carbs: 0.6, fats: 5 },
    { name: "Greek Yogurt (1 cup)", calories: 130, protein: 12, carbs: 9, fats: 0 },
    { name: "Almonds (1 oz)", calories: 164, protein: 6, carbs: 6, fats: 14 },
    { name: "Salmon (100g)", calories: 208, protein: 20, carbs: 0, fats: 13 },
    { name: "Sweet Potato (Medium)", calories: 112, protein: 2, carbs: 26, fats: 0.1 },
];

interface FoodLog {
    id: string;
    food_name: string;
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
    meal_type: string;
    logged_at: string;
}

export default function NutritionPage() {
    const { user, profile } = useAuth();
    const [activeTab, setActiveTab] = useState("breakfast");
    const [logs, setLogs] = useState<FoodLog[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [showCustomForm, setShowCustomForm] = useState(false);
    const [customFood, setCustomFood] = useState({
        name: "",
        calories: "",
        protein: "",
        carbs: "",
        fats: ""
    });

    const [analyzing, setAnalyzing] = useState(false);
    const [analyzingText, setAnalyzingText] = useState(false);
    const [aiQuery, setAiQuery] = useState("");
    // Hardcoded API Key
    const geminiKey = "AIzaSyC5a7HHfBon8-lNqZrvfM94pg_n_tTck_0";

    const handleImageAnalysis = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file) return;

        setAnalyzing(true);
        setShowCustomForm(true); // Open form to show results

        // Convert to Base64
        const reader = new FileReader();
        reader.onloadend = async () => {
            const base64 = reader.result as string;
            try {
                const result = await analyzeFoodImage(base64, geminiKey);

                if (result.error) {
                    alert("Bukan makanan terdeteksi!");
                    setAnalyzing(false);
                    return;
                }

                setCustomFood({
                    name: result.name || "",
                    calories: String(result.calories || 0),
                    protein: String(result.protein || 0),
                    carbs: String(result.carbs || 0),
                    fats: String(result.fats || 0)
                });
            } catch (error: any) {
                console.error("AI Error:", error);
                alert(`Gagal menganalisis gambar: ${error.message || "Unknown error"}`);
            } finally {
                setAnalyzing(false);
            }
        };
        reader.readAsDataURL(file);
        e.target.value = ""; // Reset input so same file can be selected again
    };

    const handleTextAnalysis = async () => {
        if (!aiQuery.trim()) return;

        setAnalyzingText(true);
        setShowCustomForm(true);

        try {
            const result = await analyzeFoodText(aiQuery, geminiKey);
            if (result) {
                setCustomFood({
                    name: result.name || "",
                    calories: String(result.calories || 0),
                    protein: String(result.protein || 0),
                    carbs: String(result.carbs || 0),
                    fats: String(result.fats || 0)
                });
                setAiQuery("");
            }
        } catch (error: any) {
            console.error("Text AI Error:", error);
            alert(`Gagal menganalisis teks: ${error.message}`);
        } finally {
            setAnalyzingText(false);
        }
    };

    const targetCalories = profile?.tdee || 2200;

    const totalCalories = logs.reduce((sum, log) => sum + log.calories, 0);
    const totalProtein = logs.reduce((sum, log) => sum + log.protein, 0);
    const totalCarbs = logs.reduce((sum, log) => sum + log.carbs, 0);
    const totalFats = logs.reduce((sum, log) => sum + log.fats, 0);

    const filteredFood = foodDatabase.filter(food =>
        food.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        if (user) {
            fetchLogs();
        }
    }, [user]);

    const fetchLogs = async () => {
        try {
            const today = new Date().toISOString().split('T')[0];
            const { data, error } = await supabase
                .from("nutrition_logs")
                .select("*")
                .eq("user_id", user?.id)
                .gte("logged_at", `${today}T00:00:00`)
                .lte("logged_at", `${today}T23:59:59`)
                .order("created_at", { ascending: true });

            if (error) throw error;
            setLogs(data || []);
        } catch (error) {
            console.error("Error fetching logs:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddFood = async (food: typeof foodDatabase[0]) => {
        if (!user) return;

        try {
            const { data, error } = await supabase.from("nutrition_logs").insert({
                user_id: user.id,
                meal_type: activeTab,
                food_name: food.name,
                calories: food.calories,
                protein: food.protein,
                carbs: food.carbs,
                fats: food.fats,
                logged_at: new Date().toISOString(),
            }).select();

            if (error) throw error;
            if (data && data.length > 0) {
                setLogs(prev => [...prev, data[0]]);
                setSearchTerm("");
            }
        } catch (error: any) {
            console.error("Error adding food:", error);
        }
    };

    const handleDeleteLog = async (id: string) => {
        const itemToRemove = logs.find(l => l.id === id);
        if (!itemToRemove) return;

        // Instant remove
        setLogs(prev => prev.filter(l => l.id !== id));

        try {
            const { error } = await supabase
                .from("nutrition_logs")
                .delete()
                .eq("id", id);

            if (error) throw error;
        } catch (error) {
            // Revert
            setLogs(prev => [...prev, itemToRemove]);
            console.error("Error deleting log:", error);
        }
    };

    const macroData = [
        { name: 'Protein', value: totalProtein, color: '#f43f5e' },
        { name: 'Carbs', value: totalCarbs, color: '#ef4444' },
        { name: 'Lemak', value: totalFats, color: '#db2777' },
    ];

    const getLogsByMeal = (meal: string) => logs.filter(log => log.meal_type === meal);

    const mealLabels: Record<string, string> = {
        breakfast: "Sarapan",
        lunch: "Makan Siang",
        dinner: "Makan Malam",
        snack: "Camilan"
    };

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Pelacak Nutrisi</h1>
                    <p className="text-lg text-slate-500 font-medium">Pantau asupan harian dan penuhi target makromu.</p>
                </div>
                <div className="flex items-center gap-4 bg-white px-6 py-4 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50">
                    <div className="w-10 h-10 rounded-2xl bg-red-50 flex items-center justify-center">
                        <Flame className="w-6 h-6 text-red-500" />
                    </div>
                    <div>
                        <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-black text-slate-900">{totalCalories}</span>
                            <span className="text-sm font-bold text-slate-400">/ {targetCalories} kcal</span>
                        </div>
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Kalori Hari Ini</div>
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-10">
                {/* Left Column: Food Search & List */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="mager-card bg-white border-slate-100 p-8 shadow-xl shadow-slate-200/50">
                        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-10">
                            <TabsList className="w-full h-14 p-1.5 bg-slate-50 rounded-2xl">
                                {Object.keys(mealLabels).map((key) => (
                                    <TabsTrigger
                                        key={key}
                                        value={key}
                                        className="h-full rounded-xl font-bold transition-all data-[state=active]:bg-white data-[state=active]:text-red-600 data-[state=active]:shadow-sm"
                                    >
                                        {mealLabels[key]}
                                    </TabsTrigger>
                                ))}
                            </TabsList>
                        </Tabs>

                        {/* Search Bar */}
                        <div className="relative mb-10 group">
                            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-red-500 transition-colors">
                                <Search className="w-6 h-6" />
                            </div>
                            <Input
                                placeholder="Cari makanan (contoh: Dada Ayam, Nasi)..."
                                className="h-16 pl-14 pr-6 rounded-2xl border-slate-100 bg-slate-50 focus:bg-white text-lg font-bold transition-all"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />

                            {/* Camera / Scan Button */}
                            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
                                <input
                                    type="file"
                                    accept="image/*"
                                    capture="environment"
                                    id="food-camera"
                                    className="hidden"
                                    onChange={handleImageAnalysis}
                                    disabled={analyzing}
                                />
                                <label
                                    htmlFor="food-camera"
                                    className={cn(
                                        "flex items-center gap-2 px-4 py-2 rounded-xl text-white font-bold cursor-pointer transition-all active:scale-95 shadow-lg",
                                        analyzing ? "bg-slate-300 w-32 justify-center" : "bg-gradient-to-r from-violet-600 to-indigo-600 hover:shadow-indigo-500/25"
                                    )}
                                >
                                    {analyzing ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            <span className="text-xs">Scanning...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Camera className="w-5 h-5" />
                                            <span className="hidden md:inline text-xs uppercase tracking-widest">Scan AI</span>
                                        </>
                                    )}
                                </label>
                            </div>
                        </div>

                        {/* Alternative Path: AI Text Prompt */}
                        <div className="mb-10 p-6 rounded-[2rem] bg-slate-900 text-white shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/20 blur-3xl -mr-16 -mt-16 group-hover:bg-red-600/30 transition-all" />
                            <div className="relative flex flex-col md:flex-row items-center gap-6">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Sparkles className="w-5 h-5 text-red-500 fill-red-500 animate-pulse" />
                                        <h4 className="text-sm font-black uppercase tracking-[0.2em]">Jalan Pintas AI</h4>
                                    </div>
                                    <p className="text-slate-400 text-xs font-bold mb-4">Ketik apa yang kamu makan (Contoh: "2 butir telur rebus & nasi merah")</p>
                                    <div className="relative">
                                        <Input
                                            placeholder="Tulis di sini..."
                                            className="h-14 bg-white/5 border-white/10 rounded-2xl pr-14 text-white placeholder:text-slate-600 font-bold focus:bg-white/10 transition-all border-2"
                                            value={aiQuery}
                                            onChange={(e) => setAiQuery(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleTextAnalysis()}
                                        />
                                        <Button
                                            size="icon"
                                            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-red-600 hover:bg-red-500 shadow-lg shadow-red-600/20"
                                            onClick={handleTextAnalysis}
                                            disabled={analyzingText}
                                        >
                                            {analyzingText ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                                        </Button>
                                    </div>
                                </div>
                                <div className="hidden md:flex flex-col items-center justify-center p-4 rounded-3xl bg-white/5 border border-white/10 animate-in zoom-in-95">
                                    <MessageSquareText className="w-8 h-8 text-red-500 mb-2" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Analisis Teks Instan</span>
                                </div>
                            </div>
                        </div>

                        {/* Search Results & Custom Addition */}
                        <div className="mb-10 space-y-4">
                            <div className="flex items-center justify-between ml-1">
                                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">{searchTerm ? 'Hasil Pencarian' : 'Opsi Penambahan'}</h3>
                                <Button
                                    variant="link"
                                    onClick={() => setShowCustomForm(!showCustomForm)}
                                    className="h-auto p-0 text-red-600 font-bold text-xs uppercase tracking-widest"
                                >
                                    {showCustomForm ? 'Tutup Form' : 'Tambah Manual +'}
                                </Button>
                            </div>

                            {showCustomForm ? (
                                <div className="p-6 rounded-2xl bg-red-50/50 border border-red-100/50 animate-in fade-in slide-in-from-top-2">
                                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                        <div className="col-span-2 md:col-span-1">
                                            <Label className="text-[10px] font-black uppercase text-slate-400 mb-1.5 block">Nama Makanan</Label>
                                            <Input
                                                placeholder="Contoh: Jus Alpukat"
                                                value={customFood.name}
                                                onChange={(e) => setCustomFood({ ...customFood, name: e.target.value })}
                                                className="h-10 text-sm bg-white"
                                            />
                                        </div>
                                        <div>
                                            <Label className="text-[10px] font-black uppercase text-slate-400 mb-1.5 block">Kkal</Label>
                                            <Input
                                                type="number"
                                                placeholder="0"
                                                value={customFood.calories}
                                                onChange={(e) => setCustomFood({ ...customFood, calories: e.target.value })}
                                                className="h-10 text-sm bg-white"
                                            />
                                        </div>
                                        <div>
                                            <Label className="text-[10px] font-black uppercase text-slate-400 mb-1.5 block">Protein</Label>
                                            <Input
                                                type="number"
                                                placeholder="0"
                                                value={customFood.protein}
                                                onChange={(e) => setCustomFood({ ...customFood, protein: e.target.value })}
                                                className="h-10 text-sm bg-white"
                                            />
                                        </div>
                                        <div>
                                            <Label className="text-[10px] font-black uppercase text-slate-400 mb-1.5 block">Karbo</Label>
                                            <Input
                                                type="number"
                                                placeholder="0"
                                                value={customFood.carbs}
                                                onChange={(e) => setCustomFood({ ...customFood, carbs: e.target.value })}
                                                className="h-10 text-sm bg-white"
                                            />
                                        </div>
                                        <div>
                                            <Label className="text-[10px] font-black uppercase text-slate-400 mb-1.5 block">Lemak</Label>
                                            <Input
                                                type="number"
                                                placeholder="0"
                                                value={customFood.fats}
                                                onChange={(e) => setCustomFood({ ...customFood, fats: e.target.value })}
                                                className="h-10 text-sm bg-white"
                                            />
                                        </div>
                                    </div>
                                    <Button
                                        onClick={() => {
                                            if (customFood.name) {
                                                handleAddFood({
                                                    name: customFood.name,
                                                    calories: parseInt(customFood.calories) || 0,
                                                    protein: parseInt(customFood.protein) || 0,
                                                    carbs: parseInt(customFood.carbs) || 0,
                                                    fats: parseInt(customFood.fats) || 0,
                                                });
                                                setCustomFood({ name: "", calories: "", protein: "", carbs: "", fats: "" });
                                                setShowCustomForm(false);
                                            }
                                        }}
                                        className="w-full mt-4 h-11 text-sm font-bold"
                                    >
                                        Simpan Makanan
                                    </Button>
                                </div>
                            ) : searchTerm && (
                                <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
                                    {filteredFood.length > 0 ? (
                                        filteredFood.map((food, i) => (
                                            <button
                                                key={i}
                                                onClick={() => handleAddFood(food)}
                                                className="w-full flex items-center justify-between p-5 rounded-2xl bg-white border border-slate-50 hover:border-red-500/30 hover:shadow-xl hover:shadow-red-500/5 transition-all group text-left"
                                            >
                                                <div>
                                                    <div className="font-bold text-lg text-slate-900 group-hover:text-red-600 transition-colors">
                                                        {food.name}
                                                    </div>
                                                    <div className="text-sm font-bold text-slate-400">
                                                        {food.calories} kcal • P: {food.protein}g • C: {food.carbs}g • F: {food.fats}g
                                                    </div>
                                                </div>
                                                <div className="bg-red-50 p-2.5 rounded-xl group-hover:scale-110 transition-transform">
                                                    <Plus className="w-5 h-5 text-red-500" />
                                                </div>
                                            </button>
                                        ))
                                    ) : (
                                        <div className="text-center py-6 text-slate-400 font-bold">Makanan tidak ditemukan.</div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Today's Logs */}
                        <div className="space-y-6">
                            <h3 className="text-xs font-black text-slate-400 flex items-center gap-2 uppercase tracking-widest ml-1">
                                <Utensils className="w-4 h-4" />
                                Daftar Makan {mealLabels[activeTab]}
                            </h3>

                            {getLogsByMeal(activeTab).length > 0 ? (
                                <div className="space-y-4">
                                    {getLogsByMeal(activeTab).map((log) => (
                                        <div
                                            key={log.id}
                                            className="flex items-center justify-between p-5 rounded-2xl bg-white border border-slate-100 shadow-sm hover:border-red-100 transition-colors"
                                        >
                                            <div>
                                                <div className="font-bold text-lg text-slate-900">{log.food_name}</div>
                                                <div className="text-sm font-bold text-slate-400">
                                                    {log.calories} kcal • P: {log.protein}g • C: {log.carbs}g • F: {log.fats}g
                                                </div>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-10 w-10 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-xl"
                                                onClick={() => handleDeleteLog(log.id)}
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-14 bg-slate-50/50 rounded-3xl border-2 border-slate-100 border-dashed text-slate-400 font-bold">
                                    Belum ada makanan yang dicatat untuk {mealLabels[activeTab]}.
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column: Macro Visualization */}
                <div className="space-y-8">
                    <div className="mager-card bg-white border-slate-100 p-8 shadow-xl shadow-slate-200/50">
                        <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-8">Ringkasan Harian</h3>

                        {/* Calorie Progress Circle */}
                        <div className="mb-12 text-center">
                            <div className="relative w-56 h-56 mx-auto mb-6">
                                <svg className="w-full h-full -rotate-90">
                                    <circle
                                        cx="112"
                                        cy="112"
                                        r="104"
                                        fill="none"
                                        className="stroke-slate-100"
                                        strokeWidth="14"
                                    />
                                    <circle
                                        cx="112"
                                        cy="112"
                                        r="104"
                                        fill="none"
                                        stroke={totalCalories > targetCalories ? "#ef4444" : "#f43f5e"}
                                        strokeWidth="14"
                                        strokeDasharray={2 * Math.PI * 104}
                                        strokeDashoffset={2 * Math.PI * 104 * (1 - Math.min(totalCalories, targetCalories * 1.5) / targetCalories)}
                                        strokeLinecap="round"
                                        className="transition-all duration-1000"
                                    />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-5xl font-black text-slate-900 tracking-tighter">
                                        {Math.max(0, targetCalories - totalCalories)}
                                    </span>
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">
                                        Sisa Kalori
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Macro Breakdown */}
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <div className="flex justify-between items-end">
                                    <span className="text-sm font-black text-slate-900">Protein</span>
                                    <span className="text-sm font-bold text-slate-400">{totalProtein}g <span className="text-slate-200">/ 150g</span></span>
                                </div>
                                <div className="h-2.5 bg-slate-50 rounded-full overflow-hidden">
                                    <div className="h-full bg-red-600 rounded-full" style={{ width: `${Math.min((totalProtein / 150) * 100, 100)}%` }} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between items-end">
                                    <span className="text-sm font-black text-slate-900">Karbohidrat</span>
                                    <span className="text-sm font-bold text-slate-400">{totalCarbs}g <span className="text-slate-200">/ 250g</span></span>
                                </div>
                                <div className="h-2.5 bg-slate-50 rounded-full overflow-hidden">
                                    <div className="h-full bg-rose-500 rounded-full" style={{ width: `${Math.min((totalCarbs / 250) * 100, 100)}%` }} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between items-end">
                                    <span className="text-sm font-black text-slate-900">Lemak</span>
                                    <span className="text-sm font-bold text-slate-400">{totalFats}g <span className="text-slate-200">/ 70g</span></span>
                                </div>
                                <div className="h-2.5 bg-slate-50 rounded-full overflow-hidden">
                                    <div className="h-full bg-pink-500 rounded-full" style={{ width: `${Math.min((totalFats / 70) * 100, 100)}%` }} />
                                </div>
                            </div>
                        </div>

                        {/* Pie Chart Replacement for Premium Look */}
                        <div className="mt-12 pt-8 border-t border-slate-50">
                            <div className="flex items-center gap-3 mb-6">
                                <PieChartIcon className="w-5 h-5 text-slate-900" />
                                <h4 className="font-black text-slate-900">Komposisi Kalori</h4>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                {macroData.map((macro) => (
                                    <div key={macro.name} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50/50">
                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: macro.color }} />
                                        <div>
                                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{macro.name}</div>
                                            <div className="font-bold text-slate-900">{macro.value}g</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

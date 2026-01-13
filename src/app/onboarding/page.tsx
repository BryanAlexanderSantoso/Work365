"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Dumbbell, Loader2, ChevronRight, ChevronLeft, User, Ruler, Weight, Calendar, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { calculateBMR, calculateTDEE, cn } from "@/lib/utils";

const activityLevels = [
    { value: "sedentary", label: "Kurang Aktif", description: "Jarang atau tidak pernah olahraga" },
    { value: "light", label: "Ringan", description: "Olahraga ringan 1-3 hari/minggu" },
    { value: "moderate", label: "Moderat", description: "Olahraga rutin 3-5 hari/minggu" },
    { value: "active", label: "Sangat Aktif", description: "Olahraga berat 6-7 hari/minggu" },
    { value: "veryActive", label: "Ekstrem", description: "Olahraga sangat berat & pekerjaan fisik" },
];

export default function OnboardingPage() {
    const router = useRouter();
    const { user, loading: authLoading, updateProfile, profile } = useAuth();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        full_name: "",
        height: "",
        weight: "",
        age: "",
        gender: "male" as "male" | "female",
        activity_level: "moderate",
    });

    useEffect(() => {
        if (!authLoading) {
            if (!user) {
                router.push("/login");
            } else if (user.user_metadata?.full_name) {
                setFormData(prev => ({ ...prev, full_name: user.user_metadata.full_name }));
            }
        }
    }, [authLoading, user, router]);

    if (authLoading) {
        return (
            <div className="min-h-screen grid-bg flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-red-500/20 border-t-red-500 rounded-full animate-spin mx-auto mb-6 shadow-lg shadow-red-500/20"></div>
                    <p className="text-slate-500 font-bold tracking-tight">Menyiapkan profil Anda...</p>
                </div>
            </div>
        );
    }

    const handleChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async () => {
        setLoading(true);
        setError(null);

        const height = parseFloat(formData.height);
        const weight = parseFloat(formData.weight);
        const age = parseInt(formData.age);

        if (isNaN(height) || isNaN(weight) || isNaN(age)) {
            setError("Mohon masukkan angka statistik yang valid");
            setLoading(false);
            return;
        }

        const bmr = calculateBMR(weight, height, age, formData.gender);
        const tdee = calculateTDEE(bmr, formData.activity_level);

        const { error } = await updateProfile({
            full_name: formData.full_name,
            height,
            weight,
            age,
            gender: formData.gender,
            activity_level: formData.activity_level,
            bmr: Math.round(bmr),
            tdee: Math.round(tdee),
            journey_start_date: new Date().toISOString(),
        });

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            router.push("/dashboard");
        }
    };

    const nextStep = () => {
        if (step < 4) setStep(step + 1);
        else handleSubmit();
    };

    const prevStep = () => {
        if (step > 1) setStep(step - 1);
    };

    const canProceed = () => {
        switch (step) {
            case 1:
                return formData.full_name.trim().length > 0;
            case 2:
                return formData.height && formData.weight;
            case 3:
                return formData.age && formData.gender;
            case 4:
                return formData.activity_level;
            default:
                return false;
        }
    };

    return (
        <div className="min-h-screen grid-bg flex items-center justify-center px-4 py-20">
            {/* Glow Spots */}
            <div className="glow-spot top-[-100px] left-[-100px] bg-red-500/10" />
            <div className="glow-spot bottom-[-100px] right-[-100px] bg-red-400/5" />

            <div className="relative w-full max-w-2xl">
                {/* Logo */}
                <div className="flex items-center justify-center gap-3 mb-12">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-500 to-rose-500 flex items-center justify-center shadow-lg shadow-red-500/25">
                        <Dumbbell className="w-7 h-7 text-white" />
                    </div>
                    <span className="font-bold text-3xl text-slate-900 tracking-tight">Work365</span>
                </div>

                {/* Progress Steps */}
                <div className="flex items-center justify-center gap-3 mb-12">
                    {[1, 2, 3, 4].map((s) => (
                        <div
                            key={s}
                            className={cn(
                                "h-2 rounded-full transition-all duration-500",
                                s <= step ? "w-16 bg-red-500" : "w-12 bg-slate-200"
                            )}
                        />
                    ))}
                </div>

                <div className="mager-card bg-white/80 backdrop-blur-xl border-slate-200/50 shadow-2xl shadow-slate-200/50 p-8 md:p-12">
                    <div className="text-center mb-10">
                        <h1 className="text-3xl font-bold text-slate-900 mb-3 tracking-tight">
                            {step === 1 && "Mari Mulai Perjalananmu"}
                            {step === 2 && "Statistik Tubuh"}
                            {step === 3 && "Detail Personal"}
                            {step === 4 && "Tingkat Aktivitas"}
                        </h1>
                        <p className="text-slate-500 text-lg">
                            {step === 1 && "Beri tahu kami namamu untuk memulainya."}
                            {step === 2 && "Data ini digunakan untuk menghitung target kalori."}
                            {step === 3 && "Sedikit lagi detail untuk mendapatkan hasil akurat."}
                            {step === 4 && "Seberapa sering Anda bergerak dalam seminggu?"}
                        </p>
                    </div>

                    <div className="min-h-[280px]">
                        {error && (
                            <div className="p-4 rounded-2xl bg-red-50 border border-red-100 text-red-600 font-semibold mb-8 animate-in fade-in slide-in-from-top-2">
                                {error}
                            </div>
                        )}

                        {/* Step 1: Name */}
                        {step === 1 && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
                                <Label htmlFor="name" className="text-slate-700 font-bold ml-1">Siapa nama panggilanmu?</Label>
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-red-500 transition-colors">
                                        <User className="w-6 h-6" />
                                    </div>
                                    <Input
                                        id="name"
                                        type="text"
                                        placeholder="Contoh: Alex"
                                        value={formData.full_name}
                                        onChange={(e) => handleChange("full_name", e.target.value)}
                                        className="h-16 pl-14 rounded-2xl border-slate-200 focus:border-red-500 focus:ring-red-500/20 text-xl font-bold"
                                        autoFocus
                                    />
                                </div>
                            </div>
                        )}

                        {/* Step 2: Height & Weight */}
                        {step === 2 && (
                            <div className="grid md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-right-4 duration-500">
                                <div className="space-y-4">
                                    <Label htmlFor="height" className="text-slate-700 font-bold ml-1">Tinggi Badan (cm)</Label>
                                    <div className="relative group">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-red-500 transition-colors">
                                            <Ruler className="w-6 h-6" />
                                        </div>
                                        <Input
                                            id="height"
                                            type="number"
                                            placeholder="170"
                                            value={formData.height}
                                            onChange={(e) => handleChange("height", e.target.value)}
                                            className="h-16 pl-14 rounded-2xl border-slate-200 focus:border-red-500 focus:ring-red-500/20 text-xl font-bold"
                                            autoFocus
                                        />
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <Label htmlFor="weight" className="text-slate-700 font-bold ml-1">Berat Badan (kg)</Label>
                                    <div className="relative group">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-red-500 transition-colors">
                                            <Weight className="w-6 h-6" />
                                        </div>
                                        <Input
                                            id="weight"
                                            type="number"
                                            placeholder="65"
                                            value={formData.weight}
                                            onChange={(e) => handleChange("weight", e.target.value)}
                                            className="h-16 pl-14 rounded-2xl border-slate-200 focus:border-red-500 focus:ring-red-500/20 text-xl font-bold"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Age & Gender */}
                        {step === 3 && (
                            <div className="grid md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-right-4 duration-500">
                                <div className="space-y-4">
                                    <Label htmlFor="age" className="text-slate-700 font-bold ml-1">Usia Saat Ini</Label>
                                    <div className="relative group">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-red-500 transition-colors">
                                            <Calendar className="w-6 h-6" />
                                        </div>
                                        <Input
                                            id="age"
                                            type="number"
                                            placeholder="24"
                                            value={formData.age}
                                            onChange={(e) => handleChange("age", e.target.value)}
                                            className="h-16 pl-14 rounded-2xl border-slate-200 focus:border-red-500 focus:ring-red-500/20 text-xl font-bold"
                                            autoFocus
                                        />
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <Label className="text-slate-700 font-bold ml-1">Jenis Kelamin</Label>
                                    <div className="grid grid-cols-2 gap-4">
                                        <button
                                            type="button"
                                            onClick={() => handleChange("gender", "male")}
                                            className={cn(
                                                "h-16 rounded-2xl border-2 transition-all flex items-center justify-center gap-3 font-bold",
                                                formData.gender === "male"
                                                    ? "border-red-500 bg-red-50 text-red-600 shadow-lg shadow-red-500/10"
                                                    : "border-slate-100 bg-slate-50 text-slate-400 hover:border-slate-200"
                                            )}
                                        >
                                            <span className="text-2xl">♂</span> Pria
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleChange("gender", "female")}
                                            className={cn(
                                                "h-16 rounded-2xl border-2 transition-all flex items-center justify-center gap-3 font-bold",
                                                formData.gender === "female"
                                                    ? "border-red-500 bg-red-50 text-red-600 shadow-lg shadow-red-500/10"
                                                    : "border-slate-100 bg-slate-50 text-slate-400 hover:border-slate-200"
                                            )}
                                        >
                                            <span className="text-2xl">♀</span> Wanita
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 4: Activity Level */}
                        {step === 4 && (
                            <div className="grid gap-3 animate-in fade-in slide-in-from-right-4 duration-500">
                                {activityLevels.map((level) => (
                                    <button
                                        key={level.value}
                                        type="button"
                                        onClick={() => handleChange("activity_level", level.value)}
                                        className={cn(
                                            "w-full p-5 rounded-2xl border-2 transition-all text-left flex items-center gap-4",
                                            formData.activity_level === level.value
                                                ? "border-red-500 bg-red-50 shadow-lg shadow-red-500/10"
                                                : "border-slate-50 bg-slate-50/50 hover:border-slate-200"
                                        )}
                                    >
                                        <Activity
                                            className={cn(
                                                "w-6 h-6 shrink-0",
                                                formData.activity_level === level.value ? "text-red-500" : "text-slate-400"
                                            )}
                                        />
                                        <div>
                                            <div className={cn(
                                                "font-bold text-lg",
                                                formData.activity_level === level.value ? "text-red-600" : "text-slate-700"
                                            )}>
                                                {level.label}
                                            </div>
                                            <div className="text-sm text-slate-500 font-medium">{level.description}</div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex gap-4 mt-12 pt-8 border-t border-slate-100">
                        {step > 1 && (
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={prevStep}
                                className="h-14 px-8 rounded-2xl border-slate-200 text-slate-600"
                            >
                                <ChevronLeft className="w-5 h-5 mr-1" />
                                Kembali
                            </Button>
                        )}
                        <Button
                            type="button"
                            onClick={nextStep}
                            disabled={!canProceed() || loading}
                            className="flex-1 h-14 rounded-2xl text-lg font-bold"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                    Menyimpan...
                                </>
                            ) : step === 4 ? (
                                <>
                                    Selesaikan Setup
                                    <ChevronRight className="w-5 h-5 ml-1" />
                                </>
                            ) : (
                                <>
                                    Lanjutkan
                                    <ChevronRight className="w-5 h-5 ml-1" />
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { User, Mail, Ruler, Weight, Calendar, Activity, Save, Loader2, CheckCircle2 } from "lucide-react";

export default function ProfilePage() {
    const { user, profile, updateProfile } = useAuth();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Form state
    const [fullName, setFullName] = useState("");
    const [height, setHeight] = useState("");
    const [weight, setWeight] = useState("");
    const [age, setAge] = useState("");
    const [gender, setGender] = useState("");
    const [activityLevel, setActivityLevel] = useState("");

    // Load existing profile data
    useEffect(() => {
        if (profile) {
            setFullName(profile.full_name || "");
            setHeight(profile.height?.toString() || "");
            setWeight(profile.weight?.toString() || "");
            setAge(profile.age?.toString() || "");
            setGender(profile.gender || "");
            setActivityLevel(profile.activity_level || "");
        }
    }, [profile]);

    const calculateBMR = (weight: number, height: number, age: number, gender: string) => {
        if (gender === "Pria") {
            return 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
        } else {
            return 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
        }
    };

    const calculateTDEE = (bmr: number, activityLevel: string) => {
        const multipliers: { [key: string]: number } = {
            "Sedentary": 1.2,
            "Light": 1.375,
            "Moderate": 1.55,
            "Active": 1.725,
            "Very Active": 1.9,
        };
        return bmr * (multipliers[activityLevel] || 1.2);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        const heightNum = parseFloat(height);
        const weightNum = parseFloat(weight);
        const ageNum = parseInt(age);

        if (!fullName.trim()) {
            setError("Nama lengkap harus diisi");
            setLoading(false);
            return;
        }

        let bmr = null;
        let tdee = null;

        // Calculate BMR and TDEE if all required fields are filled
        if (heightNum && weightNum && ageNum && gender && activityLevel) {
            bmr = calculateBMR(weightNum, heightNum, ageNum, gender);
            tdee = calculateTDEE(bmr, activityLevel);
        }

        const updateData: any = {
            full_name: fullName.trim(),
            height: heightNum || null,
            weight: weightNum || null,
            age: ageNum || null,
            gender: gender || null,
            activity_level: activityLevel || null,
            bmr: bmr,
            tdee: tdee,
        };

        const { error } = await updateProfile(updateData);

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            setSuccess(true);
            setLoading(false);
            setTimeout(() => setSuccess(false), 3000);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            {/* Header */}
            <div className="space-y-2">
                <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Profil Saya</h1>
                <p className="text-slate-500 text-lg">
                    Kelola informasi pribadi dan data fitness Anda
                </p>
            </div>

            {/* Account Info Card */}
            <Card className="p-8 bg-white/80 backdrop-blur-sm border-slate-200 shadow-lg">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-500 to-rose-500 flex items-center justify-center shadow-lg shadow-red-500/25">
                        <User className="w-8 h-8 text-white" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900">{profile?.full_name || "User"}</h2>
                        <p className="text-slate-500 flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            {user?.email}
                        </p>
                    </div>
                </div>

                {profile?.journey_start_date && (
                    <div className="p-4 rounded-xl bg-red-50 border border-red-100">
                        <p className="text-sm text-slate-600">
                            <span className="font-bold text-red-600">Perjalanan dimulai:</span>{" "}
                            {new Date(profile.journey_start_date).toLocaleDateString("id-ID", {
                                day: "numeric",
                                month: "long",
                                year: "numeric"
                            })}
                        </p>
                    </div>
                )}
            </Card>

            {/* Subscription & Role Info */}
            <Card className="p-8 bg-white/80 backdrop-blur-sm border-slate-200 shadow-lg">
                <h3 className="text-xl font-bold text-slate-900 mb-4">Status Akun</h3>
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                        <Label className="text-slate-500">Subscription Tier</Label>
                        <div className="flex items-center gap-2">
                            <div className={`px-3 py-1 rounded-full text-sm font-bold uppercase tracking-wider ${profile?.subscription_tier === 'pro' ? 'bg-purple-100 text-purple-600' :
                                    profile?.subscription_tier === 'yearly' ? 'bg-amber-100 text-amber-600' :
                                        'bg-slate-100 text-slate-600'
                                }`}>
                                {profile?.subscription_tier || 'FREE'}
                            </div>
                        </div>
                    </div>
                    <div className="space-y-1">
                        <Label className="text-slate-500">Role Access</Label>
                        <div className="flex items-center gap-2">
                            <div className={`px-3 py-1 rounded-full text-sm font-bold uppercase tracking-wider ${profile?.is_admin ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                                }`}>
                                {profile?.is_admin ? 'ADMINISTRATOR' : 'MEMBER'}
                            </div>
                        </div>
                    </div>
                </div>
                {!profile?.is_admin && (
                    <div className="mt-4 pt-4 border-t border-slate-100">
                        <p className="text-xs text-slate-400">
                            Ingin menjadi admin? Pastikan Anda telah menjalankan script migration di Supabase dan mengupdate kolom <code>is_admin</code> menjadi <code>true</code> di tabel profiles.
                        </p>
                    </div>
                )}
            </Card>

            {/* Personal Data Form */}
            <Card className="p-8 bg-white/80 backdrop-blur-sm border-slate-200 shadow-lg">
                <h3 className="text-2xl font-bold text-slate-900 mb-6">Data Pribadi</h3>

                {success && (
                    <div className="mb-6 p-4 rounded-xl bg-green-50 border border-green-200 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                        <span className="text-green-700 font-semibold">Profil berhasil diperbarui!</span>
                    </div>
                )}

                {error && (
                    <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                        <span className="text-red-700 font-semibold">{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Full Name */}
                    <div className="space-y-2">
                        <Label htmlFor="fullName" className="text-slate-700 font-bold">
                            Nama Lengkap <span className="text-red-500">*</span>
                        </Label>
                        <div className="relative group">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-red-500 transition-colors">
                                <User className="w-5 h-5" />
                            </div>
                            <Input
                                id="fullName"
                                type="text"
                                placeholder="Masukkan nama lengkap"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                className="h-14 pl-12 rounded-xl border-slate-200 focus:border-red-500 focus:ring-red-500/20"
                                required
                            />
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Height */}
                        <div className="space-y-2">
                            <Label htmlFor="height" className="text-slate-700 font-bold">
                                Tinggi Badan (cm)
                            </Label>
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-red-500 transition-colors">
                                    <Ruler className="w-5 h-5" />
                                </div>
                                <Input
                                    id="height"
                                    type="number"
                                    placeholder="170"
                                    value={height}
                                    onChange={(e) => setHeight(e.target.value)}
                                    className="h-14 pl-12 rounded-xl border-slate-200 focus:border-red-500 focus:ring-red-500/20"
                                />
                            </div>
                        </div>

                        {/* Weight */}
                        <div className="space-y-2">
                            <Label htmlFor="weight" className="text-slate-700 font-bold">
                                Berat Badan (kg)
                            </Label>
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-red-500 transition-colors">
                                    <Weight className="w-5 h-5" />
                                </div>
                                <Input
                                    id="weight"
                                    type="number"
                                    placeholder="70"
                                    value={weight}
                                    onChange={(e) => setWeight(e.target.value)}
                                    className="h-14 pl-12 rounded-xl border-slate-200 focus:border-red-500 focus:ring-red-500/20"
                                />
                            </div>
                        </div>

                        {/* Age */}
                        <div className="space-y-2">
                            <Label htmlFor="age" className="text-slate-700 font-bold">
                                Umur (tahun)
                            </Label>
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-red-500 transition-colors">
                                    <Calendar className="w-5 h-5" />
                                </div>
                                <Input
                                    id="age"
                                    type="number"
                                    placeholder="25"
                                    value={age}
                                    onChange={(e) => setAge(e.target.value)}
                                    className="h-14 pl-12 rounded-xl border-slate-200 focus:border-red-500 focus:ring-red-500/20"
                                />
                            </div>
                        </div>

                        {/* Gender */}
                        <div className="space-y-2">
                            <Label htmlFor="gender" className="text-slate-700 font-bold">
                                Jenis Kelamin
                            </Label>
                            <select
                                id="gender"
                                value={gender}
                                onChange={(e) => setGender(e.target.value)}
                                className="h-14 w-full px-4 rounded-xl border border-slate-200 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all bg-white text-slate-900 font-medium"
                            >
                                <option value="">Pilih jenis kelamin</option>
                                <option value="Pria">Pria</option>
                                <option value="Wanita">Wanita</option>
                            </select>
                        </div>
                    </div>

                    {/* Activity Level */}
                    <div className="space-y-2">
                        <Label htmlFor="activityLevel" className="text-slate-700 font-bold">
                            Tingkat Aktivitas
                        </Label>
                        <div className="relative group">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-red-500 transition-colors">
                                <Activity className="w-5 h-5" />
                            </div>
                            <select
                                id="activityLevel"
                                value={activityLevel}
                                onChange={(e) => setActivityLevel(e.target.value)}
                                className="h-14 w-full pl-12 pr-4 rounded-xl border border-slate-200 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all bg-white text-slate-900 font-medium"
                            >
                                <option value="">Pilih tingkat aktivitas</option>
                                <option value="Sedentary">Sedentary (Jarang olahraga)</option>
                                <option value="Light">Light (1-3 hari/minggu)</option>
                                <option value="Moderate">Moderate (3-5 hari/minggu)</option>
                                <option value="Active">Active (6-7 hari/minggu)</option>
                                <option value="Very Active">Very Active (Atlet/2x sehari)</option>
                            </select>
                        </div>
                    </div>

                    {/* BMR & TDEE Display */}
                    {profile?.bmr && profile?.tdee && (
                        <div className="grid md:grid-cols-2 gap-4 p-6 rounded-xl bg-gradient-to-br from-red-50 to-rose-50 border border-red-100">
                            <div>
                                <p className="text-sm text-slate-600 font-semibold mb-1">BMR (Basal Metabolic Rate)</p>
                                <p className="text-3xl font-bold text-red-600">{Math.round(profile.bmr)} <span className="text-sm text-slate-500">kkal/hari</span></p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-600 font-semibold mb-1">TDEE (Total Daily Energy)</p>
                                <p className="text-3xl font-bold text-red-600">{Math.round(profile.tdee)} <span className="text-sm text-slate-500">kkal/hari</span></p>
                            </div>
                        </div>
                    )}

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        className="w-full h-14 rounded-xl text-lg font-bold"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                Menyimpan...
                            </>
                        ) : (
                            <>
                                <Save className="w-5 h-5 mr-2" />
                                Simpan Perubahan
                            </>
                        )}
                    </Button>
                </form>
            </Card>

            {/* Info Box */}
            <Card className="p-6 bg-blue-50/50 border-blue-100">
                <p className="text-sm text-slate-600 leading-relaxed">
                    <span className="font-bold text-blue-600">💡 Tips:</span> Lengkapi data pribadi Anda untuk mendapatkan perhitungan kalori yang akurat. BMR dan TDEE akan dihitung otomatis berdasarkan data yang Anda masukkan.
                </p>
            </Card>
        </div>
    );
}

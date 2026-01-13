"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Dumbbell, Mail, Lock, Eye, EyeOff, Loader2, User, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";

export default function RegisterPage() {
    const router = useRouter();
    const { signUp } = useAuth();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const translateError = (msg: string) => {
        if (msg.toLowerCase().includes("invalid")) return "Format email tidak valid atau domain tidak diizinkan.";
        if (msg.toLowerCase().includes("already registered")) return "Email ini sudah terdaftar. Silakan masuk.";
        if (msg.toLowerCase().includes("rate limit")) return "Terlalu banyak percobaan. Silakan tunggu sebentar.";
        return msg;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const cleanEmail = email.trim().toLowerCase();
        const cleanPassword = password.trim();

        if (cleanPassword !== confirmPassword.trim()) {
            setError("Password tidak cocok");
            setLoading(false);
            return;
        }

        if (cleanPassword.length < 6) {
            setError("Password minimal harus 6 karakter");
            setLoading(false);
            return;
        }

        const { data, error } = await signUp(cleanEmail, cleanPassword, name.trim());

        if (error) {
            setError(translateError(error.message));
            setLoading(false);
        } else if (data && !data.session) {
            setSuccess(true);
            setError("Pendaftaran berhasil! Silakan cek email Anda untuk verifikasi, atau matikan 'Confirm Email' di dashboard Supabase agar bisa langsung masuk.");
            setLoading(false);
        } else {
            setSuccess(true);
            setTimeout(() => {
                router.push("/dashboard");
            }, 1000);
        }
    };

    return (
        <div className="min-h-screen grid-bg flex items-center justify-center px-4 py-20">
            {/* Glow Spots */}
            <div className="glow-spot top-[-100px] left-[-100px] bg-red-500/10" />
            <div className="glow-spot bottom-[-100px] right-[-100px] bg-red-400/5" />

            <div className="relative w-full max-w-[480px]">
                {/* Logo Link */}
                <Link href="/" className="flex items-center justify-center gap-3 mb-10 group">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-500 to-rose-500 flex items-center justify-center shadow-lg shadow-red-500/25 transition-transform group-hover:scale-105">
                        <Dumbbell className="w-7 h-7 text-white" />
                    </div>
                    <span className="font-bold text-3xl text-slate-900 tracking-tight">Work365</span>
                </Link>

                <div className="mager-card bg-white/80 backdrop-blur-xl border-slate-200/50 shadow-2xl shadow-slate-200/50 p-8 md:p-12">
                    <div className="text-center mb-10">
                        <h1 className="text-3xl font-bold text-slate-900 mb-3 tracking-tight">Buat Akun Baru</h1>
                        <p className="text-slate-500">
                            Mulai transformasi 365 harimu sekarang.
                        </p>
                    </div>

                    {success ? (
                        <div className="text-center py-8 animate-in fade-in zoom-in duration-500">
                            <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-6 shadow-inner">
                                <CheckCircle2 className="w-10 h-10 text-red-500" />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-2">Berhasil Terdaftar!</h3>
                            <p className="text-slate-500 font-medium tracking-wide">Mengarahkan ke dashboard...</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && (
                                <div className="p-4 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-sm font-semibold flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                                    {error}
                                </div>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-slate-700 font-bold ml-1">Nama Lengkap</Label>
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-red-500 transition-colors">
                                        <User className="w-5 h-5" />
                                    </div>
                                    <Input
                                        id="name"
                                        type="text"
                                        placeholder="Masukkan nama lengkap"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="h-14 pl-12 rounded-2xl border-slate-200 focus:border-red-500 focus:ring-red-500/20 transition-all font-medium"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-slate-700 font-bold ml-1">Email</Label>
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-red-500 transition-colors">
                                        <Mail className="w-5 h-5" />
                                    </div>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="nama@email.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="h-14 pl-12 rounded-2xl border-slate-200 focus:border-red-500 focus:ring-red-500/20 transition-all font-medium"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-slate-700 font-bold ml-1">Password</Label>
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-red-500 transition-colors">
                                        <Lock className="w-5 h-5" />
                                    </div>
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Minimal 6 karakter"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="h-14 pl-12 pr-12 rounded-2xl border-slate-200 focus:border-red-500 focus:ring-red-500/20 transition-all font-medium"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword" className="text-slate-700 font-bold ml-1">Konfirmasi Password</Label>
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-red-500 transition-colors">
                                        <Lock className="w-5 h-5" />
                                    </div>
                                    <Input
                                        id="confirmPassword"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Ulangi password Anda"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="h-14 pl-12 rounded-2xl border-slate-200 focus:border-red-500 focus:ring-red-500/20 transition-all font-medium"
                                        required
                                    />
                                </div>
                            </div>

                            <Button type="submit" className="w-full h-14 rounded-2xl text-lg font-bold" disabled={loading}>
                                {loading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                        Mendaftarkan...
                                    </>
                                ) : (
                                    "Buat Akun Sekarang"
                                )}
                            </Button>

                            <p className="text-xs text-slate-400 text-center leading-relaxed">
                                Dengan mendaftar, Anda menyetujui{" "}
                                <a href="#" className="text-red-500 hover:text-red-600 font-bold transition-colors">Syarat & Ketentuan</a> dan{" "}
                                <a href="#" className="text-red-500 hover:text-red-600 font-bold transition-colors">Kebijakan Privasi</a> kami.
                            </p>
                        </form>
                    )}

                    <div className="mt-10 pt-10 border-t border-slate-100 text-center">
                        <p className="text-slate-500 font-medium">
                            Sudah punya akun?{" "}
                            <Link href="/login" className="text-red-600 hover:text-red-700 font-bold transition-colors">
                                Masuk di sini
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

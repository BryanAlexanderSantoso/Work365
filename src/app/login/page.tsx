"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Dumbbell, Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";

export default function LoginPage() {
    const router = useRouter();
    const { signIn } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const cleanEmail = email.trim().toLowerCase();
        const cleanPassword = password.trim();

        try {
            const { error } = await signIn(cleanEmail, cleanPassword);

            if (error) {
                setError(error.message);
                setLoading(false);
            } else {
                // Force redirect after successful login
                // Use a timeout to ensure redirect happens even if state update is slow
                setTimeout(() => {
                    router.push("/dashboard");
                }, 500);
            }
        } catch (err) {
            console.error("Login error:", err);
            setError("Terjadi kesalahan saat login. Silakan coba lagi.");
            setLoading(false);
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
                        <h1 className="text-3xl font-bold text-slate-900 mb-3 tracking-tight">Selamat Datang</h1>
                        <p className="text-slate-500">
                            Masuk untuk melanjutkan perjalanan fitnessmu.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="p-4 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-sm font-semibold flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                                {error}
                            </div>
                        )}

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
                            <div className="flex items-center justify-between ml-1">
                                <Label htmlFor="password" className="text-slate-700 font-bold">Password</Label>
                                <a href="#" className="text-sm text-red-500 hover:text-red-600 font-bold transition-colors">
                                    Lupa password?
                                </a>
                            </div>
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-red-500 transition-colors">
                                    <Lock className="w-5 h-5" />
                                </div>
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
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

                        <Button type="submit" className="w-full h-14 rounded-2xl text-lg font-bold" disabled={loading}>
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                    Masuk...
                                </>
                            ) : (
                                "Masuk Sekarang"
                            )}
                        </Button>

                        <div className="relative py-4">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-slate-100" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-white px-4 text-slate-400 font-bold">Atau</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <Button type="button" variant="secondary" className="h-14 rounded-2xl border-slate-200 bg-white hover:bg-slate-50 text-slate-600" disabled>
                                Google
                            </Button>
                            <Button type="button" variant="secondary" className="h-14 rounded-2xl border-slate-200 bg-white hover:bg-slate-50 text-slate-600" disabled>
                                GitHub
                            </Button>
                        </div>
                    </form>

                    <div className="mt-10 pt-10 border-t border-slate-100 text-center">
                        <p className="text-slate-500 font-medium">
                            Belum punya akun?{" "}
                            <Link href="/register" className="text-red-600 hover:text-red-700 font-bold transition-colors">
                                Daftar di sini
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

"use client";

import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RefreshCw, Copy } from "lucide-react";

export default function AdminDebugPage() {
    const { user, profile, refreshProfile, loading } = useAuth();

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        alert("Copied to clipboard!");
    };

    return (
        <div className="p-8 max-w-4xl mx-auto space-y-8">
            <h1 className="text-3xl font-bold">Admin Debug Tool</h1>
            <p className="text-slate-500">Gunakan halaman ini untuk memverifikasi status akun Anda.</p>

            <Card className="p-6 space-y-4">
                <h3 className="text-xl font-bold">Current Session Info</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-50 rounded-lg">
                        <p className="text-xs text-slate-400 font-bold uppercase">Auth User ID</p>
                        <p className="font-mono text-sm break-all">{user?.id || "Not logged in"}</p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-lg">
                        <p className="text-xs text-slate-400 font-bold uppercase">Email</p>
                        <p className="font-mono text-sm">{user?.email || "Not logged in"}</p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-lg">
                        <p className="text-xs text-slate-400 font-bold uppercase">Is Admin (Profile)</p>
                        <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 rounded text-xs font-bold ${profile?.is_admin ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                                }`}>
                                {profile?.is_admin ? "TRUE (ADMIN)" : "FALSE (MEMBER)"}
                            </span>
                        </div>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-lg">
                        <p className="text-xs text-slate-400 font-bold uppercase">Subscription Tier</p>
                        <p className="font-mono text-sm uppercase">{profile?.subscription_tier || "N/A"}</p>
                    </div>
                </div>

                <div className="pt-4 flex gap-4">
                    <Button onClick={() => refreshProfile()} disabled={loading}>
                        <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                        Refresh Profile Data
                    </Button>
                </div>
            </Card>

            {!profile?.is_admin && user && (
                <Card className="p-6 space-y-4 border-amber-200 bg-amber-50">
                    <h3 className="text-lg font-bold text-amber-800">FIX: Set Diri Anda Sebagai Admin</h3>
                    <p className="text-sm text-amber-900">
                        Sepertinya akun Anda belum terdaftar sebagai admin di database. Silakan jalankan perintah SQL berikut di <strong>Supabase SQL Editor</strong>:
                    </p>

                    <div className="relative">
                        <pre className="p-4 bg-slate-900 text-slate-50 rounded-lg text-xs overflow-x-auto font-mono">
                            {`-- Update user ini menjadi admin
UPDATE profiles 
SET is_admin = true 
WHERE id = '${user.id}';`}
                        </pre>
                        <Button
                            size="sm"
                            variant="secondary"
                            className="absolute top-2 right-2 h-8 text-xs"
                            onClick={() => copyToClipboard(`UPDATE profiles SET is_admin = true WHERE id = '${user.id}';`)}
                        >
                            <Copy className="w-3 h-3 mr-1" /> Copy SQL
                        </Button>
                    </div>
                    <p className="text-xs text-amber-800 mt-2">
                        Setelah menjalankan perintah di atas, kembali ke sini dan klik tombol <strong>Refresh Profile Data</strong>.
                    </p>
                </Card>
            )}
        </div>
    );
}

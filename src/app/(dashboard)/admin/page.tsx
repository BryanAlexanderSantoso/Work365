"use client";

import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Check, X } from "lucide-react";

interface UpgradeRequest {
    id: string;
    user_id: string;
    plan_type: 'pro' | 'yearly';
    amount: number;
    payment_proof: string | null;
    status: 'pending' | 'approved' | 'rejected';
    created_at: string;
    profile?: {
        full_name: string | null;
        email: string;
    };
}

export default function AdminPage() {
    const { profile, loading } = useAuth();
    const [requests, setRequests] = useState<UpgradeRequest[]>([]);
    const [isLoadingRequests, setIsLoadingRequests] = useState(true);

    useEffect(() => {
        if (!loading && profile?.is_admin) {
            fetchRequests();
        }
    }, [loading, profile]);

    const fetchRequests = async () => {
        try {
            const { data: requestsData, error: requestsError } = await supabase
                .from("upgrade_requests")
                .select("*")
                .eq("status", "pending")
                .order("created_at", { ascending: false });

            if (requestsError) throw requestsError;

            // Fetch profiles for these requests manually since we don't have easy join setup in client types
            const requestsWithProfiles = await Promise.all(
                (requestsData || []).map(async (req) => {
                    const { data: profileData } = await supabase
                        .from("profiles")
                        .select("full_name, email")
                        .eq("id", req.user_id)
                        .single();

                    return {
                        ...req,
                        profile: profileData,
                    };
                })
            );

            setRequests(requestsWithProfiles as UpgradeRequest[]);
        } catch (error) {
            console.error("Error fetching requests:", error);
            alert("Gagal mengambil data request.");
        } finally {
            setIsLoadingRequests(false);
        }
    };

    const handleApprove = async (req: UpgradeRequest) => {
        if (!confirm(`Setujui upgrade ke ${req.plan_type} untuk user ini?`)) return;

        try {
            // 1. Update request status
            const { error: updateError } = await supabase
                .from("upgrade_requests")
                .update({ status: "approved" })
                .eq("id", req.id);

            if (updateError) throw updateError;

            // 2. Update user profile
            const now = new Date();
            const endDate = new Date();
            if (req.plan_type === 'yearly') {
                endDate.setFullYear(endDate.getFullYear() + 1);
            } else {
                endDate.setMonth(endDate.getMonth() + 1);
            }

            const { error: profileError } = await supabase
                .from("profiles")
                .update({
                    subscription_tier: req.plan_type,
                    subscription_start_date: now.toISOString(),
                    subscription_end_date: endDate.toISOString(),
                })
                .eq("id", req.user_id);

            if (profileError) throw profileError;

            alert("Berhasil disetujui!");
            fetchRequests(); // Refresh list
        } catch (error: any) {
            console.error("Error approving:", error);
            alert("Error: " + error.message);
        }
    };

    const handleReject = async (req: UpgradeRequest) => {
        if (!confirm("Tolak request ini?")) return;

        try {
            const { error } = await supabase
                .from("upgrade_requests")
                .update({ status: "rejected" })
                .eq("id", req.id);

            if (error) throw error;
            fetchRequests();
        } catch (error: any) {
            console.error("Error rejecting:", error);
            alert("Error: " + error.message);
        }
    };

    if (loading) return <div className="p-8"><Loader2 className="animate-spin" /></div>;

    if (!profile?.is_admin) {
        return (
            <div className="p-8 text-center">
                <h1 className="text-2xl font-bold text-red-500">Akses Ditolak</h1>
                <p>Halaman ini khusus untuk administrator.</p>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-6xl mx-auto space-y-6">
            <h1 className="text-3xl font-bold">Admin Dashboard - Approval Upgrade</h1>

            {isLoadingRequests ? (
                <div className="flex justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>
            ) : requests.length === 0 ? (
                <p className="text-muted-foreground text-center py-10">Tidak ada permintaan pending saat ini.</p>
            ) : (
                <div className="grid gap-4">
                    {requests.map((req) => (
                        <Card key={req.id}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-lg font-medium">
                                    {req.profile?.full_name || "Unknown User"}
                                </CardTitle>
                                <div className="text-sm text-muted-foreground">
                                    {new Date(req.created_at).toLocaleDateString()}
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <p className="text-sm text-muted-foreground">Email: {req.profile?.email}</p>
                                        <p className="text-sm font-semibold text-primary">Request: {req.plan_type.toUpperCase()} Packet</p>
                                        <p className="text-sm">Nominal: Rp {req.amount.toLocaleString()}</p>
                                    </div>
                                    <div className="space-y-1 border p-2 rounded bg-muted/50">
                                        <p className="text-xs text-muted-foreground">Bukti Pembayaran / Notes:</p>
                                        <p className="text-sm font-mono break-all">{req.payment_proof || "-"}</p>
                                    </div>
                                </div>
                                <div className="flex justify-end gap-2 mt-4">
                                    <Button variant="destructive" size="sm" onClick={() => handleReject(req)}>
                                        <X className="mr-2 h-4 w-4" /> Tolak
                                    </Button>
                                    <Button variant="default" size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => handleApprove(req)}>
                                        <Check className="mr-2 h-4 w-4" /> Setujui
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}

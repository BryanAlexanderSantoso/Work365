"use client";

import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { useState } from "react";
import { Check, Star, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const tiers = [
    {
        name: "Gratis",
        price: "Rp 0",
        period: "selamanya",
        description: "Mulai perjalanan kebugaran Anda tanpa biaya.",
        features: [
            "3 Workout / Minggu",
            "Basic Tracking",
            "Nutrition Database",
            "Community Access",
        ],
        cta: "Saat Ini",
        current: true, // Logic to determining current plan needs to be improved
        value: "free",
        popular: false,
    },
    {
        name: "Pro",
        price: "Rp 49.000",
        period: "per bulan",
        description: "Tingkatkan performa Anda dengan fitur canggih.",
        features: [
            "Unlimited Workouts",
            "Advanced Metrics",
            "Personal Plan",
            "AI Insights",
            "Priority Support",
        ],
        cta: "Upgrade Pro",
        value: "pro",
        popular: true,
    },
    {
        name: "Yearly",
        price: "Rp 399.000",
        period: "per tahun",
        description: "Komitmen jangka panjang untuk hasil maksimal.",
        features: [
            "Semua Fitur Pro",
            "1-on-1 Coaching",
            "Early Access",
            "PDF Reports",
            "Lifetime Badge",
            "Hemat 30%",
        ],
        cta: "Hemat 30%",
        value: "yearly",
        popular: false,
    },
];

export default function UpgradePage() {
    const { user, profile, refreshProfile } = useAuth();
    const [selectedTier, setSelectedTier] = useState<any>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [transactionId, setTransactionId] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleUpgradeClick = (tier: any) => {
        if (tier.value === "free") return;
        setSelectedTier(tier);
        setIsDialogOpen(true);
    };

    const handleSubmit = async () => {
        if (!transactionId || !user || !selectedTier) return;
        setIsLoading(true);

        try {
            const { error } = await supabase.from("upgrade_requests").insert({
                user_id: user.id,
                plan_type: selectedTier.value,
                amount: selectedTier.value === "pro" ? 49000 : 399000,
                payment_proof: transactionId,
                status: "pending",
            });

            if (error) throw error;

            alert("Permintaan upgrade berhasil dikirim! Admin akan memverifikasi pembayaran Anda segera.");
            setIsDialogOpen(false);
            setTransactionId("");
        } catch (error: any) {
            console.error("Error submitting upgrade request:", error);
            alert("Gagal mengirim permintaan: " + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-8 p-8 max-w-7xl mx-auto">
            <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold tracking-tight">Pilih Paket Anda</h1>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                    Investasikan pada kesehatan Anda dengan paket yang sesuai dengan kebutuhan dan target kebugaran Anda.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8">
                {tiers.map((tier) => {
                    const isCurrent = profile?.subscription_tier === tier.value;
                    return (
                        <Card
                            key={tier.name}
                            className={`flex flex-col relative ${tier.popular ? "border-primary shadow-lg scale-105" : ""}`}
                        >
                            {tier.popular && (
                                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 rotate-12 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full shadow-md">
                                    POPULER
                                </div>
                            )}
                            <CardHeader>
                                <CardTitle className="flex items-baseline gap-2">
                                    <span className="text-3xl font-bold">{tier.price}</span>
                                    {tier.price !== "Rp 0" && <span className="text-sm text-muted-foreground">{tier.period}</span>}
                                </CardTitle>
                                <h3 className="text-xl font-semibold mt-2">{tier.name}</h3>
                                <CardDescription>{tier.description}</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-1">
                                <ul className="space-y-3">
                                    {tier.features.map((feature) => (
                                        <li key={feature} className="flex items-center gap-2">
                                            <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                                            <span className="text-sm">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                            <CardFooter>
                                <Button
                                    className="w-full"
                                    variant={isCurrent ? "outline" : tier.popular ? "default" : "secondary"}
                                    disabled={isCurrent || tier.value === "free"}
                                    onClick={() => handleUpgradeClick(tier)}
                                >
                                    {isCurrent ? "Paket Saat Ini" : tier.cta}
                                </Button>
                            </CardFooter>
                        </Card>
                    );
                })}
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Upgrade ke {selectedTier?.name}</DialogTitle>
                        <DialogDescription>
                            Selesaikan pembayaran untuk mengaktifkan fitur premium.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <div className="bg-muted p-4 rounded-lg space-y-2 text-sm">
                            <p className="font-semibold">Instruksi Pembayaran:</p>
                            <p>Silakan transfer ke:</p>
                            <div className="font-mono bg-background p-2 rounded border">
                                083822813341 (Gopay/Dana)
                                <br />
                                a/n Bryan
                            </div>
                            <p className="text-xs text-muted-foreground mt-2">
                                *Harap konfirmasi dengan mengirimkan ID Transaksi atau catatan pembayaran di bawah ini.
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="transactionId">ID Transaksi / Bukti Pembayaran</Label>
                            <Input
                                id="transactionId"
                                placeholder="Contoh: GOPAY12345678"
                                value={transactionId}
                                onChange={(e) => setTransactionId(e.target.value)}
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isLoading}>
                            Batal
                        </Button>
                        <Button onClick={handleSubmit} disabled={isLoading || !transactionId}>
                            {isLoading ? "Mengirim..." : "Konfirmasi Pembayaran"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

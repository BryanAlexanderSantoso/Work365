"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Dumbbell,
  Timer,
  Footprints,
  Apple,
  Target,
  TrendingUp,
  Zap,
  ArrowRight,
  Star,
  Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { LandingNav } from "@/components/layout/LandingNav";
import { IphoneMockup, ScreenType } from "@/components/landing/IphoneMockup";

export default function HomePage() {
  const [activeScreen, setActiveScreen] = useState<ScreenType>("hero");

  return (
    <div className="min-h-screen bg-white">
      <LandingNav />

      {/* Main Wrapper: 2-Column Grid Layout */}
      <div className="max-w-7xl mx-auto lg:grid lg:grid-cols-2 relative mb-20">

        {/* LEFT COLUMN: Scrollable Content */}
        <div className="relative z-20 pt-20">

          {/* HERO SECTION */}
          <motion.section
            className="px-6 py-20 min-h-[90vh] flex flex-col justify-center"
            onViewportEnter={() => setActiveScreen("hero")}
            viewport={{ amount: 0.6 }}
          >
            <div className="max-w-xl">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 text-red-600 text-xs font-bold mb-8">
                <div className="w-2 h-2 rounded-full bg-red-600" />
                #1 Fitness App 2026
              </div>

              {/* Headline */}
              <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-6 tracking-tight leading-tight">
                Transformasi Total<br />
                <span className="bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent">365 Hari</span>
              </h1>

              {/* Subheadline */}
              <p className="text-xl text-slate-600 max-w-lg mb-10 leading-relaxed">
                Bukan sekadar aplikasi workout. Ini adalah partner digital personal untuk melacak setiap detik perjuangan Anda menuju versi terbaik diri sendiri.
              </p>

              {/* CTA */}
              <div className="flex flex-col sm:flex-row items-center gap-4 mb-12">
                <Link href="/register">
                  <Button size="lg" className="px-8 h-14 text-lg font-bold rounded-xl shadow-xl shadow-red-600/20 hover:shadow-red-600/40 transition-all hover:-translate-y-1">
                    Mulai Gratis
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Link href="#features">
                  <Button variant="ghost" size="lg" className="px-8 h-14 text-lg font-bold">
                    Lihat Fitur
                  </Button>
                </Link>
              </div>

              {/* Mobile Phone Mockup (Visible only on mobile) */}
              <div className="lg:hidden flex justify-center mb-12 relative">
                <IphoneMockup screen="hero" />
              </div>

              <div className="flex items-center gap-4 text-sm text-slate-500 font-medium">
                <div className="flex -space-x-3">
                  {[
                    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRTNLQ5ABENoVl16Inl_Zj86oCAGIZ41IETLg&s",
                    "https://i.pravatar.cc/100?img=12",
                    "https://i.pravatar.cc/100?img=13",
                    "https://i.pravatar.cc/100?img=14"
                  ].map((src, i) => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 bg-cover bg-center" style={{ backgroundImage: `url(${src})` }} />
                  ))}
                </div>
                <div className="flex flex-col">
                  <div className="flex text-yellow-500">
                    {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-yellow-500" />)}
                  </div>
                  <span>Bergabung dengan 1,000+ Pengguna</span>
                </div>
              </div>
            </div>
          </motion.section>

          {/* FEATURES SECTION - SCROLLYTELLING */}
          {/* Each feature takes up significant vertical space to allow for smooth transitions */}
          <div className="px-6 space-y-20 pb-20">

            {/* Timer Feature */}
            <motion.div
              className="min-h-[80vh] flex flex-col justify-center max-w-lg"
              onViewportEnter={() => setActiveScreen("timer")}
              viewport={{ amount: 0.6 }}
            >
              <div className="w-16 h-16 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mb-6">
                <Timer className="w-8 h-8" />
              </div>
              <h2 className="text-4xl font-black text-slate-900 mb-6">HIIT Timer Cerdas</h2>
              <p className="text-xl text-slate-600 leading-relaxed mb-8">
                Lupakan stopwatch manual. Timer kami dirancang khusus untuk interval training (HIIT) dengan panduan suara, persiapan set, dan tracking istirahat otomatis.
              </p>
              <ul className="space-y-4">
                <li className="flex items-center gap-3 font-semibold text-slate-700">
                  <Check className="w-5 h-5 text-green-500" /> Kustomisasi Interval Tanpa Batas
                </li>
                <li className="flex items-center gap-3 font-semibold text-slate-700">
                  <Check className="w-5 h-5 text-green-500" /> Audio Cue & Voice Guide
                </li>
                <li className="flex items-center gap-3 font-semibold text-slate-700">
                  <Check className="w-5 h-5 text-green-500" /> Simpan Preset Latihan
                </li>
              </ul>
            </motion.div>

            {/* Run Tracker Feature */}
            <motion.div
              className="min-h-[80vh] flex flex-col justify-center max-w-lg"
              onViewportEnter={() => setActiveScreen("run")}
              viewport={{ amount: 0.6 }}
            >
              <div className="w-16 h-16 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mb-6">
                <Footprints className="w-8 h-8" />
              </div>
              <h2 className="text-4xl font-black text-slate-900 mb-6">GPS Run Tracker</h2>
              <p className="text-xl text-slate-600 leading-relaxed mb-8">
                Rekam setiap langkah lari Anda dengan presisi GPS tinggi. Analisis pace per kilometer, elevasi, dan kalori yang terbakar secara real-time.
              </p>
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 shadow-inner">
                <div className="flex items-end gap-2 mb-2">
                  <span className="text-4xl font-black text-slate-900">5.42</span>
                  <span className="text-sm font-bold text-slate-500 mb-1">KM AVG DISTANCE</span>
                </div>
                <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-blue-500"
                    initial={{ width: 0 }}
                    whileInView={{ width: "70%" }}
                    transition={{ duration: 1.5 }}
                  />
                </div>
              </div>
            </motion.div>

            {/* Nutrition Feature */}
            <motion.div
              className="min-h-[80vh] flex flex-col justify-center max-w-lg"
              onViewportEnter={() => setActiveScreen("nutrition")}
              viewport={{ amount: 0.6 }}
            >
              <div className="w-16 h-16 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center mb-6">
                <Apple className="w-8 h-8" />
              </div>
              <h2 className="text-4xl font-black text-slate-900 mb-6">Jurnal Nutrisi Harian</h2>
              <p className="text-xl text-slate-600 leading-relaxed mb-8">
                Target badan ideal dimulai dari dapur. Catat asupan makanan harian Anda, pantau makronutrisi (Protein, Karbo, Lemak), dan pastikan Anda tetap dalam target kalori.
              </p>
            </motion.div>

            {/* Goals Feature */}
            <motion.div
              className="min-h-[80vh] flex flex-col justify-center max-w-lg"
              onViewportEnter={() => setActiveScreen("goals")}
              viewport={{ amount: 0.6 }}
            >
              <div className="w-16 h-16 rounded-2xl bg-green-100 text-green-600 flex items-center justify-center mb-6">
                <Target className="w-8 h-8" />
              </div>
              <h2 className="text-4xl font-black text-slate-900 mb-6">Goal Setting & Analytics</h2>
              <p className="text-xl text-slate-600 leading-relaxed">
                Tetapkan target jangka pendek dan panjang. Visualisasikan kemajuan Anda melalui grafik yang mudah dipahami dan rayakan setiap pencapaian kecil.
              </p>
            </motion.div>

          </div>
        </div>

        {/* RIGHT COLUMN: Desktop Sticky Phone Container */}
        {/* Uses pure CSS sticky positioning within the Grid Column */}
        {/* Sticky keeps it in view, while grid column height allows it to travel down with content */}
        <div className="hidden lg:block relative min-h-screen h-full">
          <div className="sticky top-32 h-[80vh] flex items-center justify-center">
            <div className="relative z-10">
              <IphoneMockup screen={activeScreen} />
            </div>

            {/* Decorative Blobs behind phone */}
            <div className="absolute top-1/4 right-[10%] w-96 h-96 bg-red-400/20 rounded-full blur-[100px] -z-0"></div>
            <div className="absolute bottom-1/4 right-[20%] w-80 h-80 bg-blue-400/20 rounded-full blur-[100px] -z-0"></div>
          </div>
        </div>

      </div>

      {/* Pricing Section (Full Width, moves under the grid) */}
      <section id="pricing" className="relative z-40 py-32 px-4 bg-slate-900 text-white rounded-t-[3rem] -mt-10 pt-32">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black mb-6">
              Investasi Kesehatan Terbaik
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Biaya kurang dari segelas kopi sehari untuk transformasi seumur hidup.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Pricing Cards implementation... */}
            {/* Free */}
            <div className="p-8 rounded-3xl bg-slate-800 border border-slate-700">
              <p className="text-slate-400 font-bold mb-4">BASIC</p>
              <p className="text-4xl font-black mb-6">Rp 0</p>
              <ul className="space-y-4 mb-8 text-slate-300">
                <li className="flex gap-3"><Check className="text-green-500" /> 3 Workouts/Week</li>
                <li className="flex gap-3"><Check className="text-green-500" /> Basic Timer</li>
                <li className="flex gap-3"><Check className="text-green-500" /> Community Access</li>
              </ul>
              <Button className="w-full h-12 rounded-xl bg-slate-700 hover:bg-slate-600 font-bold">Mulai Sekarang</Button>
            </div>

            {/* Pro */}
            <div className="p-8 rounded-3xl bg-gradient-to-b from-red-600 to-rose-700 border border-red-500 transform lg:-translate-y-6 shadow-2xl shadow-red-900/50">
              <div className="flex justify-between items-start mb-4">
                <p className="text-red-100 font-bold">PRO MEMBER</p>
                <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-bold text-white">POPULAR</span>
              </div>
              <p className="text-5xl font-black mb-2 text-white">49rb <span className="text-lg font-medium opacity-80">/bln</span></p>
              <p className="text-sm text-red-100 mb-8 opacity-80">Tagihan bulanan, batalkan kapan saja</p>

              <ul className="space-y-4 mb-8 text-white">
                <li className="flex gap-3"><Check className="text-white bg-white/20 rounded-full p-0.5" /> Unlimited Workouts</li>
                <li className="flex gap-3"><Check className="text-white bg-white/20 rounded-full p-0.5" /> Advanced Analytics</li>
                <li className="flex gap-3"><Check className="text-white bg-white/20 rounded-full p-0.5" /> Smart Nutrition Log</li>
                <li className="flex gap-3"><Check className="text-white bg-white/20 rounded-full p-0.5" /> Priority Support</li>
              </ul>
              <Link href="/register">
                <Button className="w-full h-14 rounded-xl bg-white text-red-600 hover:bg-red-50 font-black text-lg">Daftar Pro</Button>
              </Link>
            </div>

            {/* Yearly */}
            <div className="p-8 rounded-3xl bg-slate-800 border border-slate-700">
              <p className="text-amber-400 font-bold mb-4">YEARLY SAVER</p>
              <p className="text-4xl font-black mb-6">399rb <span className="text-lg font-medium text-slate-500">/thn</span></p>
              <ul className="space-y-4 mb-8 text-slate-300">
                <li className="flex gap-3"><Check className="text-green-500" /> All Pro Features</li>
                <li className="flex gap-3"><Check className="text-green-500" /> Hemat 30%</li>
                <li className="flex gap-3"><Check className="text-green-500" /> Exclusive Badge</li>
              </ul>
              <Button className="w-full h-12 rounded-xl bg-slate-700 hover:bg-slate-600 font-bold">Pilih Tahunan</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-slate-950 text-slate-400 border-t border-slate-900 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-red-600/20 flex items-center justify-center">
              <Dumbbell className="w-4 h-4 text-red-600" />
            </div>
            <span className="font-bold text-white">Work365</span>
          </div>
          <p className="text-sm">© 2026 Developed with Passion.</p>
        </div>
      </footer>
    </div>
  );
}


function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-red-200 hover:shadow-lg transition-all">
      <div className="w-14 h-14 rounded-xl bg-slate-50 flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-600">{description}</p>
    </div>
  );
}

function PricingCard({
  name,
  price,
  features,
  cta,
  href,
  popular = false
}: {
  name: string;
  price: string;
  features: string[];
  cta: string;
  href: string;
  popular?: boolean;
}) {
  return (
    <div className={`p-8 rounded-2xl border-2 ${popular ? 'border-red-600 bg-red-50' : 'border-slate-200 bg-white'} relative`}>
      {popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-red-600 text-white text-xs font-bold">
          POPULER
        </div>
      )}

      <div className="mb-6">
        <p className="text-sm font-bold text-slate-500 mb-2">{name}</p>
        <p className="text-4xl font-black text-slate-900">{price}</p>
      </div>

      <ul className="space-y-3 mb-8">
        {features.map((feature, i) => (
          <li key={i} className="flex items-center gap-2 text-slate-700">
            <Check className="w-5 h-5 text-green-600 shrink-0" />
            <span className="text-sm font-medium">{feature}</span>
          </li>
        ))}
      </ul>

      <Link href={href}>
        <Button
          className={`w-full h-12 rounded-xl font-bold ${popular ? '' : 'bg-slate-900 hover:bg-slate-800'}`}
          variant={popular ? 'default' : 'secondary'}
        >
          {cta}
        </Button>
      </Link>
    </div>
  );
}

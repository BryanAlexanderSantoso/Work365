"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { GoogleMap, LoadScript, Polyline, Marker } from "@react-google-maps/api";
import {
    Play,
    Pause,
    Square,
    MapPin,
    Timer,
    Zap,
    Navigation,
    ChevronLeft,
    Signal,
    SignalHigh,
    SignalMedium,
    SignalLow
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatTime, formatPace } from "@/lib/utils";
import { getDistance } from "geolib";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";

// Initial center (Jakarta Monas default)
const DEFAULT_CENTER = { lat: -6.175392, lng: 106.827153 };

export default function LiveRunPage() {
    const router = useRouter();
    const { user } = useAuth();

    // State
    const [isRunning, setIsRunning] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [duration, setDuration] = useState(0); // seconds
    const [distance, setDistance] = useState(0); // meters
    const [path, setPath] = useState<{ lat: number; lng: number }[]>([]);
    const [currentPos, setCurrentPos] = useState<{ lat: number; lng: number } | null>(null);
    const [gpsAccuracy, setGpsAccuracy] = useState<number | null>(null);
    const [calories, setCalories] = useState(0);

    // Refs
    const watchId = useRef<number | null>(null);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const mapRef = useRef<google.maps.Map | null>(null);

    // API Key Handling
    const [apiKey] = useState("AIzaSyBdU-dvACwOj-6fsSE2Ptv5Fv2oKPY96zI");

    // Timer Logic
    useEffect(() => {
        if (isRunning && !isPaused) {
            timerRef.current = setInterval(() => {
                setDuration(prev => prev + 1);
            }, 1000);
        } else {
            if (timerRef.current) clearInterval(timerRef.current);
        }
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [isRunning, isPaused]);

    // Calculate Calories (Rough estimate: 0.063 x weight x duration_mins + distance related)
    // Simplified: ~60 kcal per km for average runner
    useEffect(() => {
        setCalories(Math.floor(distance / 1000 * 60));
    }, [distance]);

    // Cleanup GPS on unmount
    useEffect(() => {
        return () => {
            if (watchId.current !== null) navigator.geolocation.clearWatch(watchId.current);
        };
    }, []);

    const startRun = () => {
        setIsRunning(true);
        setIsPaused(false);

        if ("geolocation" in navigator) {
            watchId.current = navigator.geolocation.watchPosition(
                (position) => {
                    const { latitude, longitude, accuracy } = position.coords;
                    const newPos = { lat: latitude, lng: longitude };

                    setGpsAccuracy(accuracy);
                    setCurrentPos(newPos);

                    // Only add to path if running and accuracy is decent (< 30m)
                    if (!isPaused && accuracy < 50) {
                        setPath(prev => {
                            const lastPos = prev[prev.length - 1];
                            if (lastPos) {
                                const dist = getDistance(lastPos, newPos);
                                // Filter jitter: only add if moved > 5 meters
                                if (dist > 5) {
                                    setDistance(d => d + dist);
                                    return [...prev, newPos];
                                }
                                return prev;
                            } else {
                                return [newPos];
                            }
                        });
                    }
                },
                (error) => console.error("GPS Error", error),
                { enableHighAccuracy: true }
            );
        } else {
            alert("Geolocation is not supported by your browser");
        }
    };

    const pauseRun = () => {
        setIsPaused(true);
        if (watchId.current !== null) navigator.geolocation.clearWatch(watchId.current);
    };

    const resumeRun = () => {
        setIsPaused(false);
        startRun(); // Re-init GPS watch
    };

    const finishRun = async () => {
        setIsRunning(false);
        setIsPaused(true);
        if (watchId.current !== null) navigator.geolocation.clearWatch(watchId.current);
        if (timerRef.current) clearInterval(timerRef.current);

        if (!user) return;

        // Save to Supabase
        try {
            const paceValue = duration / 60 / (distance / 1000 || 1); // min/km

            const { error } = await supabase.from("runs").insert({
                user_id: user.id,
                distance: distance / 1000,
                duration: duration,
                pace: paceValue,
                completed_at: new Date().toISOString(),
                notes: "Live GPS Run"
            });

            if (error) throw error;
            router.push("/run");
        } catch (error) {
            console.error("Error saving run:", error);
            alert("Gagal menyimpan lari. Cek koneksi internet.");
        }
    };

    const pace = distance > 0 ? (duration / 60) / (distance / 1000) : 0;

    return (
        <div className="flex flex-col h-[calc(100vh-4rem)] md:h-[calc(100vh-2rem)] bg-white relative overflow-hidden">



            {/* Top Bar */}
            <div className="absolute top-0 left-0 right-0 z-20 p-4 bg-gradient-to-b from-white/90 to-transparent pt-8 flex justify-between items-start">
                <Button variant="ghost" size="icon" className="rounded-full bg-white/80 backdrop-blur" onClick={() => router.back()}>
                    <ChevronLeft className="w-6 h-6 text-slate-900" />
                </Button>

                <div className="bg-slate-900/80 backdrop-blur text-white px-4 py-1.5 rounded-full flex items-center gap-2 text-xs font-bold uppercase tracking-widest shadow-lg">
                    {isRunning ? (
                        <>
                            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                            Live Tracking
                        </>
                    ) : (
                        "Ready to Run"
                    )}
                </div>

                <div className="bg-white/80 backdrop-blur p-2 rounded-full shadow-sm">
                    {gpsAccuracy && gpsAccuracy < 20 ? <SignalHigh className="w-5 h-5 text-green-500" /> :
                        gpsAccuracy && gpsAccuracy < 50 ? <SignalMedium className="w-5 h-5 text-yellow-500" /> :
                            <SignalLow className="w-5 h-5 text-slate-400" />}
                </div>
            </div>

            {/* MAP AREA */}
            <div className="flex-1 bg-slate-100 relative">
                {apiKey ? (
                    <LoadScript googleMapsApiKey={apiKey}>
                        <GoogleMap
                            mapContainerStyle={{ width: '100%', height: '100%' }}
                            center={currentPos || DEFAULT_CENTER}
                            zoom={16}
                            options={{
                                disableDefaultUI: true,
                                zoomControl: false,
                                mapTypeControl: false,
                                styles: [
                                    { "featureType": "poi", "stylers": [{ "visibility": "off" }] } // Clean map
                                ]
                            }}
                            onLoad={map => { mapRef.current = map; }}
                        >
                            {/* Running Path */}
                            {path.length > 0 && (
                                <Polyline
                                    path={path}
                                    options={{ strokeColor: "#ef4444", strokeWeight: 6 }}
                                />
                            )}

                            {/* Current Position Marker */}
                            {currentPos && (
                                <Marker
                                    position={currentPos}
                                    icon={{
                                        path: google.maps.SymbolPath.CIRCLE,
                                        scale: 8,
                                        fillColor: "#3b82f6",
                                        fillOpacity: 1,
                                        strokeColor: "white",
                                        strokeWeight: 2,
                                    }}
                                />
                            )}
                        </GoogleMap>
                    </LoadScript>
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 bg-slate-50">
                        <Navigation className="w-16 h-16 mb-4 opacity-20" />
                        <p className="font-bold">Peta tidak tersedia (No API Key)</p>
                        <p className="text-xs">GPS Tracking tetap aktif</p>
                    </div>
                )}
            </div>

            {/* BOTTOM STATS PANEL */}
            <div className="bg-white rounded-t-[2.5rem] shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] p-8 relative z-30 pb-12">
                {/* Distance Big */}
                <div className="text-center mb-8">
                    <div className="text-7xl font-black text-slate-900 tracking-tighter tabular-nums leading-none">
                        {(distance / 1000).toFixed(2)}
                    </div>
                    <div className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mt-2">
                        KM Total Distance
                    </div>
                </div>

                {/* Grid Stats */}
                <div className="grid grid-cols-3 gap-2 mb-10">
                    <div className="flex flex-col items-center p-3 rounded-2xl bg-slate-50">
                        <Timer className="w-5 h-5 text-slate-400 mb-1" />
                        <span className="text-xl font-black text-slate-900 tabular-nums">{formatTime(duration)}</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Duration</span>
                    </div>
                    <div className="flex flex-col items-center p-3 rounded-2xl bg-slate-50">
                        <Zap className="w-5 h-5 text-orange-400 mb-1" />
                        <span className="text-xl font-black text-slate-900 tabular-nums">{formatPace(pace)}</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Pace /km</span>
                    </div>
                    <div className="flex flex-col items-center p-3 rounded-2xl bg-slate-50">
                        <Signal className="w-5 h-5 text-red-400 mb-1" />
                        <span className="text-xl font-black text-slate-900 tabular-nums">{calories}</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Kcal</span>
                    </div>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-center gap-6">
                    {!isRunning ? (
                        <Button
                            className="w-24 h-24 rounded-full bg-red-600 hover:bg-red-500 shadow-xl shadow-red-600/30 flex items-center justify-center transition-all hover:scale-110 active:scale-95"
                            onClick={startRun}
                        >
                            <Play className="w-10 h-10 text-white ml-2" />
                        </Button>
                    ) : (
                        <>
                            {!isPaused ? (
                                <Button
                                    className="w-20 h-20 rounded-full bg-slate-900 hover:bg-slate-800 shadow-xl flex items-center justify-center transition-all active:scale-95"
                                    onClick={pauseRun}
                                >
                                    <Pause className="w-8 h-8 text-white" />
                                </Button>
                            ) : (
                                <Button
                                    className="w-20 h-20 rounded-full bg-green-500 hover:bg-green-600 shadow-xl flex items-center justify-center transition-all active:scale-95"
                                    onClick={resumeRun}
                                >
                                    <Play className="w-8 h-8 text-white ml-1" />
                                </Button>
                            )}

                            {isPaused && (
                                <>
                                    <Button
                                        className="w-20 h-20 rounded-full bg-red-100 hover:bg-red-200 shadow-xl flex items-center justify-center transition-all active:scale-95"
                                        onDoubleClick={finishRun}
                                        onClick={finishRun}
                                    >
                                        <Square className="w-8 h-8 text-red-600 fill-red-600" />
                                    </Button>

                                    <Button
                                        variant="ghost"
                                        className="absolute -bottom-16 text-slate-400 hover:text-red-500 text-xs font-bold uppercase tracking-widest"
                                        onClick={() => {
                                            if (confirm("Yakin ingin membatalkan lari ini? Data tidak akan disimpan.")) {
                                                router.back();
                                            }
                                        }}
                                    >
                                        Batalkan
                                    </Button>
                                </>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

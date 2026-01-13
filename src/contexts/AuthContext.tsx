"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

interface Profile {
    id: string;
    email: string;
    full_name: string | null;
    height: number | null;
    weight: number | null;
    age: number | null;
    gender: string | null;
    activity_level: string | null;
    bmr: number | null;
    tdee: number | null;
    journey_start_date: string | null;
    subscription_tier: 'free' | 'pro' | 'yearly';
    subscription_start_date: string | null;
    subscription_end_date: string | null;
    is_admin: boolean;
}

interface AuthContextType {
    user: User | null;
    session: Session | null;
    profile: Profile | null;
    loading: boolean;
    signUp: (email: string, password: string, full_name: string) => Promise<{ data: any; error: Error | null }>;
    signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
    signOut: () => Promise<void>;
    updateProfile: (data: Partial<Profile>) => Promise<{ error: Error | null }>;
    refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const fetchProfile = async (userId: string) => {
        try {
            const { data, error } = await supabase
                .from("profiles")
                .select("*")
                .eq("id", userId)
                .single();

            if (error) {
                // If no row is found, it's not strictly an "error" we want to log to console
                // if the user is new and hasn't finished onboarding.
                if (error.code === "PGRST116") {
                    setProfile(null);
                    return;
                }
                throw error;
            }
            setProfile(data);
        } catch (error) {
            console.error("Error fetching profile:", error);
        }
    };

    const refreshProfile = async () => {
        if (user) {
            await fetchProfile(user.id);
        }
    };

    useEffect(() => {
        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);
            if (session?.user) {
                fetchProfile(session.user.id);
            }
            setLoading(false);
        });

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange(async (event, session) => {
            setSession(session);
            setUser(session?.user ?? null);

            if (session?.user) {
                await fetchProfile(session.user.id);
            } else {
                setProfile(null);
            }
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const signUp = async (email: string, password: string, full_name: string) => {
        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name,
                    },
                },
            });

            if (error) throw error;

            // Optimistically set the session and user if they were returned (means confirmEmail is off)
            if (data.session) {
                setSession(data.session);
                setUser(data.user);
                if (data.user) {
                    await fetchProfile(data.user.id);
                }
            }

            return { data, error: null };
        } catch (error) {
            console.error("Signup error:", error);
            return { data: null, error: error as Error };
        }
    };

    const signIn = async (email: string, password: string) => {
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;

            // Immediately update state with the session data
            if (data.session) {
                setSession(data.session);
                setUser(data.user);
                if (data.user) {
                    await fetchProfile(data.user.id);
                }
            }

            return { error: null };
        } catch (error) {
            console.error("Sign in error:", error);
            return { error: error as Error };
        }
    };

    const signOut = async () => {
        await supabase.auth.signOut();
        setUser(null);
        setSession(null);
        setProfile(null);
        router.push("/login");
    };

    const updateProfile = async (data: Partial<Profile>) => {
        let currentUser = user;

        // Try standard getUser() if context user is missing
        if (!currentUser) {
            const { data: { user: authUser } } = await supabase.auth.getUser();
            currentUser = authUser;
        }

        // Try getSession() as a second fallback
        if (!currentUser) {
            const { data: { session: activeSession } } = await supabase.auth.getSession();
            currentUser = activeSession?.user ?? null;
            if (currentUser) {
                setSession(activeSession);
                setUser(currentUser);
            }
        }

        if (!currentUser) {
            return {
                error: new Error(
                    "Sesi mendaftar Anda tidak terbaca di halaman ini. Silakan coba tekan 'Selesaikan Setup' sekali lagi, atau masuk ulang dari halaman Login."
                )
            };
        }

        try {
            const { error } = await supabase
                .from("profiles")
                .update(data)
                .eq("id", currentUser.id);

            if (error) throw error;
            await fetchProfile(currentUser.id);
            return { error: null };
        } catch (error: any) {
            console.error("Profile update error:", error);
            alert(`Gagal update profil: ${error.message || "Error tidak diketahui"}. Code: ${error.code || "N/A"}`);
            return { error: error as Error };
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                session,
                profile,
                loading,
                signUp,
                signIn,
                signOut,
                updateProfile,
                refreshProfile,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}

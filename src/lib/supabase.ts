import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
    public: {
        Tables: {
            profiles: {
                Row: {
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
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id: string;
                    email: string;
                    full_name?: string | null;
                    height?: number | null;
                    weight?: number | null;
                    age?: number | null;
                    gender?: string | null;
                    activity_level?: string | null;
                    bmr?: number | null;
                    tdee?: number | null;
                    journey_start_date?: string | null;
                    subscription_tier?: 'free' | 'pro' | 'yearly';
                    subscription_start_date?: string | null;
                    subscription_end_date?: string | null;
                    is_admin?: boolean;
                };
                Update: {
                    full_name?: string | null;
                    height?: number | null;
                    weight?: number | null;
                    age?: number | null;
                    gender?: string | null;
                    activity_level?: string | null;
                    bmr?: number | null;
                    tdee?: number | null;
                    journey_start_date?: string | null;
                    subscription_tier?: 'free' | 'pro' | 'yearly';
                    subscription_start_date?: string | null;
                    subscription_end_date?: string | null;
                    is_admin?: boolean;
                };
            };
            workouts: {
                Row: {
                    id: string;
                    user_id: string;
                    workout_type: string;
                    duration: number;
                    calories_burned: number | null;
                    notes: string | null;
                    completed_at: string;
                    created_at: string;
                };
                Insert: {
                    user_id: string;
                    workout_type: string;
                    duration: number;
                    calories_burned?: number | null;
                    notes?: string | null;
                    completed_at?: string;
                };
                Update: {
                    workout_type?: string;
                    duration?: number;
                    calories_burned?: number | null;
                    notes?: string | null;
                };
            };
            runs: {
                Row: {
                    id: string;
                    user_id: string;
                    distance: number;
                    duration: number;
                    pace: number;
                    unit: string;
                    notes: string | null;
                    completed_at: string;
                    created_at: string;
                };
                Insert: {
                    user_id: string;
                    distance: number;
                    duration: number;
                    pace: number;
                    unit?: string;
                    notes?: string | null;
                    completed_at?: string;
                };
                Update: {
                    distance?: number;
                    duration?: number;
                    pace?: number;
                    unit?: string;
                    notes?: string | null;
                };
            };
            nutrition_logs: {
                Row: {
                    id: string;
                    user_id: string;
                    meal_type: string;
                    food_name: string;
                    calories: number;
                    protein: number;
                    carbs: number;
                    fats: number;
                    logged_at: string;
                    created_at: string;
                };
                Insert: {
                    user_id: string;
                    meal_type: string;
                    food_name: string;
                    calories: number;
                    protein?: number;
                    carbs?: number;
                    fats?: number;
                    logged_at?: string;
                };
                Update: {
                    meal_type?: string;
                    food_name?: string;
                    calories?: number;
                    protein?: number;
                    carbs?: number;
                    fats?: number;
                };
            };
            badges: {
                Row: {
                    id: string;
                    user_id: string;
                    badge_type: string;
                    earned_at: string;
                    created_at: string;
                };
                Insert: {
                    user_id: string;
                    badge_type: string;
                    earned_at?: string;
                };
                Update: {
                    badge_type?: string;
                };
            };
            upgrade_requests: {
                Row: {
                    id: string;
                    user_id: string;
                    plan_type: 'pro' | 'yearly';
                    amount: number;
                    payment_proof: string | null;
                    status: 'pending' | 'approved' | 'rejected';
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    user_id: string;
                    plan_type: 'pro' | 'yearly';
                    amount: number;
                    payment_proof?: string | null;
                    status?: 'pending' | 'approved' | 'rejected';
                };
                Update: {
                    status?: 'pending' | 'approved' | 'rejected';
                    updated_at?: string;
                };
            };
        };
    };
};

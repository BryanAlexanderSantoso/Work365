"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type IntervalType = "warmup" | "high" | "low" | "cooldown" | "rest";

export interface IntervalConfig {
    type: IntervalType;
    duration: number; // in seconds
    label: string;
}

export interface WorkoutConfig {
    name: string;
    rounds: number;
    sets: number;
    intervals: IntervalConfig[];
}

interface TimerState {
    // Workout configuration
    workoutConfig: WorkoutConfig | null;

    // Timer state
    isRunning: boolean;
    isPaused: boolean;
    currentRound: number;
    currentSet: number;
    currentIntervalIndex: number;
    timeRemaining: number;
    totalTimeElapsed: number;

    // Preset workouts
    presets: WorkoutConfig[];

    // Actions
    setWorkoutConfig: (config: WorkoutConfig) => void;
    startTimer: () => void;
    pauseTimer: () => void;
    resumeTimer: () => void;
    resetTimer: () => void;
    tick: () => void;
    nextInterval: () => void;
    skipToNextSet: () => void;
    addPreset: (preset: WorkoutConfig) => void;
    removePreset: (name: string) => void;
}

const defaultPresets: WorkoutConfig[] = [
    {
        name: "Classic HIIT",
        rounds: 4,
        sets: 4,
        intervals: [
            { type: "warmup", duration: 60, label: "Warm Up" },
            { type: "high", duration: 40, label: "High Intensity" },
            { type: "low", duration: 20, label: "Rest" },
            { type: "cooldown", duration: 60, label: "Cool Down" },
        ],
    },
    {
        name: "Tabata",
        rounds: 8,
        sets: 1,
        intervals: [
            { type: "warmup", duration: 120, label: "Warm Up" },
            { type: "high", duration: 20, label: "Work" },
            { type: "low", duration: 10, label: "Rest" },
            { type: "cooldown", duration: 120, label: "Cool Down" },
        ],
    },
    {
        name: "Endurance Builder",
        rounds: 3,
        sets: 5,
        intervals: [
            { type: "warmup", duration: 180, label: "Warm Up" },
            { type: "high", duration: 60, label: "Push" },
            { type: "low", duration: 30, label: "Recover" },
            { type: "cooldown", duration: 180, label: "Cool Down" },
        ],
    },
    {
        name: "Sprint Intervals",
        rounds: 10,
        sets: 1,
        intervals: [
            { type: "warmup", duration: 300, label: "Warm Up" },
            { type: "high", duration: 30, label: "Sprint" },
            { type: "low", duration: 90, label: "Walk/Jog" },
            { type: "cooldown", duration: 300, label: "Cool Down" },
        ],
    },
];

export const useTimerStore = create<TimerState>()(
    persist(
        (set, get) => ({
            workoutConfig: null,
            isRunning: false,
            isPaused: false,
            currentRound: 1,
            currentSet: 1,
            currentIntervalIndex: 0,
            timeRemaining: 0,
            totalTimeElapsed: 0,
            presets: defaultPresets,

            setWorkoutConfig: (config) => {
                const firstInterval = config.intervals[0];
                set({
                    workoutConfig: config,
                    currentRound: 1,
                    currentSet: 1,
                    currentIntervalIndex: 0,
                    timeRemaining: firstInterval?.duration || 0,
                    totalTimeElapsed: 0,
                    isRunning: false,
                    isPaused: false,
                });
            },

            startTimer: () => set({ isRunning: true, isPaused: false }),
            pauseTimer: () => set({ isPaused: true }),
            resumeTimer: () => set({ isPaused: false }),

            resetTimer: () => {
                const { workoutConfig } = get();
                if (workoutConfig) {
                    const firstInterval = workoutConfig.intervals[0];
                    set({
                        currentRound: 1,
                        currentSet: 1,
                        currentIntervalIndex: 0,
                        timeRemaining: firstInterval?.duration || 0,
                        totalTimeElapsed: 0,
                        isRunning: false,
                        isPaused: false,
                    });
                }
            },

            tick: () => {
                const state = get();
                if (!state.isRunning || state.isPaused || !state.workoutConfig) return;

                if (state.timeRemaining > 0) {
                    set({
                        timeRemaining: state.timeRemaining - 1,
                        totalTimeElapsed: state.totalTimeElapsed + 1,
                    });
                } else {
                    state.nextInterval();
                }
            },

            nextInterval: () => {
                const state = get();
                if (!state.workoutConfig) return;

                const { intervals } = state.workoutConfig;
                const isWarmup = state.currentIntervalIndex === 0;
                const isCooldown = state.currentIntervalIndex === intervals.length - 1;
                const isWorkInterval = !isWarmup && !isCooldown;

                // Handle warmup phase
                if (isWarmup) {
                    set({
                        currentIntervalIndex: 1,
                        timeRemaining: intervals[1]?.duration || 0,
                    });
                    return;
                }

                // Handle cooldown (workout complete)
                if (isCooldown) {
                    set({
                        isRunning: false,
                        isPaused: false,
                        currentIntervalIndex: intervals.length - 1,
                        timeRemaining: 0,
                    });
                    return;
                }

                // Handle work intervals (alternating between high and low)
                if (isWorkInterval) {
                    const nextIndex = state.currentIntervalIndex + 1;

                    // If we've done all work intervals in this round
                    if (nextIndex >= intervals.length - 1) {
                        // Check if we need more rounds
                        if (state.currentRound < state.workoutConfig.rounds) {
                            // Start next round
                            set({
                                currentRound: state.currentRound + 1,
                                currentIntervalIndex: 1, // Back to first work interval
                                timeRemaining: intervals[1]?.duration || 0,
                            });
                        } else {
                            // Check if we need more sets
                            if (state.currentSet < state.workoutConfig.sets) {
                                // Start next set
                                set({
                                    currentSet: state.currentSet + 1,
                                    currentRound: 1,
                                    currentIntervalIndex: 1,
                                    timeRemaining: intervals[1]?.duration || 0,
                                });
                            } else {
                                // Move to cooldown
                                set({
                                    currentIntervalIndex: intervals.length - 1,
                                    timeRemaining: intervals[intervals.length - 1]?.duration || 0,
                                });
                            }
                        }
                    } else {
                        // Continue to next interval (high to low or low to high)
                        set({
                            currentIntervalIndex: nextIndex,
                            timeRemaining: intervals[nextIndex]?.duration || 0,
                        });
                    }
                }
            },

            skipToNextSet: () => {
                const state = get();
                if (!state.workoutConfig) return;

                if (state.currentSet < state.workoutConfig.sets) {
                    set({
                        currentSet: state.currentSet + 1,
                        currentRound: 1,
                        currentIntervalIndex: 1,
                        timeRemaining: state.workoutConfig.intervals[1]?.duration || 0,
                    });
                }
            },

            addPreset: (preset) => {
                set((state) => ({
                    presets: [...state.presets, preset],
                }));
            },

            removePreset: (name) => {
                set((state) => ({
                    presets: state.presets.filter((p) => p.name !== name),
                }));
            },
        }),
        {
            name: "work365-timer-storage",
            partialize: (state) => ({
                presets: state.presets,
                workoutConfig: state.workoutConfig,
                isRunning: state.isRunning,
                isPaused: state.isPaused,
                currentRound: state.currentRound,
                currentSet: state.currentSet,
                currentIntervalIndex: state.currentIntervalIndex,
                timeRemaining: state.timeRemaining,
                totalTimeElapsed: state.totalTimeElapsed,
            }),
        }
    )
);

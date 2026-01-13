"use client";

import { useState, useEffect, useMemo } from "react";
import {
    Plus,
    Trash2,
    CheckCircle2,
    Circle,
    Calendar,
    Tag,
    Clock,
    AlertCircle,
    ChevronRight,
    Search,
    Target
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";

interface Todo {
    id: string;
    user_id: string;
    title: string;
    is_completed: boolean;
    category: string;
    due_date: string | null;
    created_at: string;
}

const categories = [
    { label: "Umum", value: "General", color: "bg-slate-500" },
    { label: "Latihan", value: "Workout", color: "bg-red-500" },
    { label: "Nutrisi", value: "Nutrition", color: "bg-orange-500" },
    { label: "Kesehatan", value: "Health", color: "bg-blue-500" },
];

export default function TodosPage() {
    const { user } = useAuth();
    const [todos, setTodos] = useState<Todo[]>([]);
    const [loading, setLoading] = useState(true);
    const [newTodo, setNewTodo] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("General");
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        if (user) {
            fetchTodos();
        }
    }, [user]);

    const fetchTodos = async () => {
        try {
            const { data, error } = await supabase
                .from("todos")
                .select("*")
                .eq("user_id", user?.id)
                .order("created_at", { ascending: false });

            if (error) throw error;
            setTodos(data || []);
        } catch (error) {
            console.error("Error fetching todos:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddTodo = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTodo.trim() || !user) return;

        try {
            const { data, error } = await supabase
                .from("todos")
                .insert({
                    user_id: user.id,
                    title: newTodo.trim(),
                    category: selectedCategory,
                    is_completed: false,
                })
                .select();

            if (error) throw error;
            if (data && data.length > 0) {
                setTodos(prev => [data[0], ...prev]);
                setNewTodo("");
            }
        } catch (error: any) {
            console.error("Error adding todo:", error);
        }
    };

    const toggleTodo = async (id: string, currentStatus: boolean) => {
        try {
            const { error } = await supabase
                .from("todos")
                .update({ is_completed: !currentStatus })
                .eq("id", id);

            if (error) throw error;
            setTodos(prev => prev.map(t => t.id === id ? { ...t, is_completed: !currentStatus } : t));
        } catch (error) {
            console.error("Error toggling todo:", error);
        }
    };

    const deleteTodo = async (id: string) => {
        try {
            const { error } = await supabase
                .from("todos")
                .delete()
                .eq("id", id);
            if (error) throw error;
            setTodos(prev => prev.filter(t => t.id !== id));
        } catch (error) {
            console.error("Error deleting todo:", error);
        }
    };

    const filteredTodos = todos.filter(t =>
        t.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const completedCount = todos.filter(t => t.is_completed).length;

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Jadwal Harian</h1>
                    <p className="text-lg text-slate-500 font-medium font-medium">Atur to-do list dan target harianmu di sini.</p>
                </div>
                <div className="flex items-center gap-4 bg-white px-6 py-4 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50">
                    <div className="w-10 h-10 rounded-2xl bg-red-50 flex items-center justify-center">
                        <CheckCircle2 className="w-6 h-6 text-red-500" />
                    </div>
                    <div>
                        <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-black text-slate-900">{completedCount}</span>
                            <span className="text-sm font-bold text-slate-400">/ {todos.length}</span>
                        </div>
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tugas Selesai</div>
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-10">
                {/* Left Column: Input and Statistics */}
                <div className="space-y-8">
                    <div className="mager-card bg-white border-slate-100 p-8 shadow-xl shadow-slate-200/50">
                        <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-8">Tambah Tugas</h3>
                        <form onSubmit={handleAddTodo} className="space-y-6">
                            <div className="space-y-2">
                                <Label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Deskripsi Tugas</Label>
                                <Input
                                    placeholder="Apa yang ingin kamu capai?"
                                    value={newTodo}
                                    onChange={(e) => setNewTodo(e.target.value)}
                                    className="h-14 rounded-2xl border-slate-100 bg-slate-50 focus:bg-white font-bold"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Kategori</Label>
                                <div className="grid grid-cols-2 gap-3">
                                    {categories.map((cat) => (
                                        <button
                                            key={cat.value}
                                            type="button"
                                            onClick={() => setSelectedCategory(cat.value)}
                                            className={cn(
                                                "h-12 rounded-xl text-xs font-black uppercase tracking-widest transition-all border-2",
                                                selectedCategory === cat.value
                                                    ? "border-red-500 bg-red-50 text-red-600 shadow-lg shadow-red-500/10"
                                                    : "border-slate-50 bg-slate-50 text-slate-400 hover:border-slate-100 hover:text-slate-600"
                                            )}
                                        >
                                            {cat.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <Button type="submit" className="w-full h-14 rounded-2xl text-lg font-bold gap-2">
                                <Plus className="w-5 h-5" />
                                Tambah Jadwal
                            </Button>
                        </form>
                    </div>

                    {/* Stats */}
                    <div className="mager-card bg-slate-900 border-0 p-8 text-white relative overflow-hidden">
                        <div className="glow-spot top-[-50px] left-[-50px] bg-red-500/20" />
                        <div className="relative z-10">
                            <h4 className="text-lg font-black tracking-tight mb-6">Progress Hari Ini</h4>
                            <div className="flex items-center gap-6 mb-8">
                                <div className="text-5xl font-black">{todos.length > 0 ? Math.round((completedCount / todos.length) * 100) : 0}%</div>
                                <div className="h-12 w-[1px] bg-white/20" />
                                <div className="text-slate-400 text-xs font-bold leading-relaxed">
                                    {completedCount} dari {todos.length} tugas telah kamu selesaikan. Teruskan!
                                </div>
                            </div>
                            <div className="h-2.5 bg-white/10 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-red-500 to-rose-500 rounded-full transition-all duration-1000"
                                    style={{ width: `${todos.length > 0 ? (completedCount / todos.length) * 100 : 0}%` }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Todo List */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="mager-card bg-white border-slate-100 p-8 shadow-xl shadow-slate-200/50">
                        {/* Search and Filters */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                            <h3 className="text-2xl font-black text-slate-900 tracking-tight">Daftar Jadwal</h3>
                            <div className="relative group w-full md:w-80">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-red-500 transition-colors">
                                    <Search className="w-5 h-5" />
                                </div>
                                <Input
                                    placeholder="Cari tugas..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="h-12 pl-12 rounded-2xl border-slate-100 bg-slate-50 focus:bg-white font-bold text-sm"
                                />
                            </div>
                        </div>

                        {/* List */}
                        <div className="space-y-4">
                            {loading ? (
                                <div className="text-center py-20">
                                    <div className="w-10 h-10 border-4 border-red-500/20 border-t-red-500 rounded-full animate-spin mx-auto mb-4" />
                                    <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Memuat jadwal...</p>
                                </div>
                            ) : filteredTodos.length > 0 ? (
                                filteredTodos.map((todo) => {
                                    const catInfo = categories.find(c => c.value === todo.category) || categories[0];
                                    return (
                                        <div
                                            key={todo.id}
                                            className={cn(
                                                "group flex items-center gap-6 p-6 rounded-3xl border-2 transition-all",
                                                todo.is_completed
                                                    ? "bg-slate-50/50 border-transparent opacity-60"
                                                    : "bg-white border-slate-50 hover:border-red-500/20 hover:shadow-xl hover:shadow-slate-200/50"
                                            )}
                                        >
                                            <button
                                                onClick={() => toggleTodo(todo.id, todo.is_completed)}
                                                className={cn(
                                                    "shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all",
                                                    todo.is_completed
                                                        ? "bg-red-500 text-white shadow-lg shadow-red-500/20"
                                                        : "border-2 border-slate-100 text-slate-200 hover:border-red-200 hover:text-red-200"
                                                )}
                                            >
                                                {todo.is_completed ? (
                                                    <CheckCircle2 className="w-6 h-6" />
                                                ) : (
                                                    <Circle className="w-6 h-6" />
                                                )}
                                            </button>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-3 mb-1">
                                                    <span className={cn(
                                                        "px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-white",
                                                        catInfo.color
                                                    )}>
                                                        {catInfo.label}
                                                    </span>
                                                    <span className="text-[10px] font-bold text-slate-300 flex items-center gap-1">
                                                        <Clock className="w-3 h-3" />
                                                        {new Date(todo.created_at).toLocaleDateString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </div>
                                                <h4 className={cn(
                                                    "text-lg font-black tracking-tight truncate",
                                                    todo.is_completed ? "text-slate-400 line-through" : "text-slate-900"
                                                )}>
                                                    {todo.title}
                                                </h4>
                                            </div>

                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => deleteTodo(todo.id)}
                                                className="h-10 w-10 text-slate-200 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </Button>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="text-center py-20 bg-slate-50/50 rounded-[40px] border-4 border-slate-100 border-dashed">
                                    <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-slate-200/50">
                                        <Target className="w-10 h-10 text-slate-200" />
                                    </div>
                                    <h5 className="text-xl font-black text-slate-900 tracking-tight mb-2">Tidak Ada Tugas</h5>
                                    <p className="text-slate-400 font-bold max-w-xs mx-auto">
                                        Belum ada jadwal yang dicatat. Mulai harimu dengan menambah tugas baru!
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

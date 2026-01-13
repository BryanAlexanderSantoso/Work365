import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
    extends React.InputHTMLAttributes<HTMLInputElement> { }

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, ...props }, ref) => {
        return (
            <input
                type={type}
                className={cn(
                    "flex h-12 w-full rounded-2xl border-2 border-slate-100 bg-slate-50/50 px-4 py-3 text-base text-slate-900 ring-offset-background transition-all duration-300",
                    "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-slate-500",
                    "placeholder:text-slate-400 font-medium",
                    "focus-visible:outline-none focus-visible:border-red-500/30 focus-visible:bg-white focus-visible:ring-4 focus-visible:ring-red-500/5",
                    "disabled:cursor-not-allowed disabled:opacity-50",
                    className
                )}
                ref={ref}
                {...props}
            />
        );
    }
);
Input.displayName = "Input";

export { Input };

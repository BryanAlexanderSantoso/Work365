import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
    "inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-semibold ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95",
    {
        variants: {
            variant: {
                default:
                    "bg-gradient-to-r from-red-600 to-rose-500 text-white hover:from-red-700 hover:to-rose-600 shadow-xl shadow-red-500/20 hover:shadow-red-500/30",
                destructive:
                    "bg-gradient-to-r from-red-600 to-rose-600 text-white hover:from-red-700 hover:to-rose-700 shadow-lg shadow-red-600/25",
                outline:
                    "border-2 border-slate-100 bg-white text-slate-900 hover:bg-slate-50 hover:border-slate-200",
                secondary:
                    "bg-slate-50 text-slate-900 hover:bg-slate-100 border border-slate-100",
                ghost:
                    "text-slate-600 hover:text-red-600 hover:bg-red-50",
                link:
                    "text-red-600 underline-offset-4 hover:underline",
                premium:
                    "bg-gradient-to-r from-red-600 to-rose-500 text-white shadow-xl shadow-red-500/20 hover:shadow-red-500/30",
            },
            size: {
                default: "h-12 px-8 py-2",
                sm: "h-10 px-6",
                lg: "h-14 px-12 text-base",
                icon: "h-12 w-12",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
);

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : "button";
        return (
            <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        );
    }
);
Button.displayName = "Button";

export { Button, buttonVariants };

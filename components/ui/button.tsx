"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { motion, HTMLMotionProps } from "framer-motion";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "bg-[#34629f] text-white hover:bg-[#2e68a8] shadow-sm shadow-[#34629f]/10",
        destructive: "bg-red-600 text-white hover:bg-red-700 shadow-sm shadow-red-600/10 focus-visible:ring-red-600/20",
        outline: "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-[#34629f] hover:text-[#34629f]",
        secondary: "bg-[#34629f]/10 text-[#34629f] hover:bg-[#34629f]/15",
        ghost: "hover:bg-slate-100 hover:text-slate-700 text-slate-500",
        link: "text-[#34629f] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
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
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, isLoading = false, leftIcon, rightIcon, children, disabled, ...props }, ref) => {
    if (asChild) {
      const Comp = Slot;
      return (
        <Comp
          className={cn(buttonVariants({ variant, size, className }))}
          ref={ref as any}
          disabled={disabled}
          {...(props as any)}
        >
          {children}
        </Comp>
      );
    }

    return (
      <motion.button
        ref={ref}
        whileHover={!disabled && !isLoading ? { scale: 1.01 } : {}}
        whileTap={!disabled && !isLoading ? { scale: 0.99 } : {}}
        disabled={disabled || isLoading}
        className={cn(buttonVariants({ variant, size, className }))}
        {...(props as any)}
      >
        {isLoading && <Loader2 className="w-4 h-4 animate-spin shrink-0" />}
        {!isLoading && leftIcon && <span className="shrink-0">{leftIcon}</span>}
        {children}
        {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </motion.button>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };

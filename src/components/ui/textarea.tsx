import * as React from "react";

import { cn } from "@/lib/utils";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  variant?: "default" | "echo";
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, variant = "default", ...props }, ref) => {
    const variantStyles = {
      default: "border-input bg-background",
      echo: "bg-muted/50 border-border focus:border-primary/50 focus:shadow-[0_0_20px_hsl(var(--primary)/0.1)]",
    };

    return (
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-md border px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300 md:text-sm resize-none",
          variantStyles[variant],
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };

import * as React from "react";
import { AlertCircle, X } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Button } from "./button";

const errorBannerVariants = cva(
  "p-4 flex items-center gap-3 rounded-md border-l-4 backdrop-blur-sm transition-all duration-200",
  {
    variants: {
      variant: {
        warning: "border-l-secondary bg-secondary/10 border-secondary/30",
        destructive: "border-l-destructive bg-destructive/10 border-destructive/30",
        info: "border-l-primary bg-primary/10 border-primary/30",
        default: "border-l-muted-foreground bg-muted/10 border-muted-foreground/30",
      },
    },
    defaultVariants: {
      variant: "warning",
    },
  }
);

const errorBannerIconVariants = cva("w-5 h-5 flex-shrink-0", {
  variants: {
    variant: {
      warning: "text-secondary drop-shadow-[0_0_4px_currentColor]",
      destructive: "text-destructive drop-shadow-[0_0_4px_currentColor]",
      info: "text-primary drop-shadow-[0_0_4px_currentColor]",
      default: "text-muted-foreground",
    },
  },
  defaultVariants: {
    variant: "warning",
  },
});

const errorBannerTextVariants = cva("font-mono text-sm flex-1 font-medium", {
  variants: {
    variant: {
      warning: "text-secondary/90",
      destructive: "text-destructive/90",
      info: "text-primary/90",
      default: "text-muted-foreground",
    },
  },
  defaultVariants: {
    variant: "warning",
  },
});

export interface ErrorBannerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof errorBannerVariants> {
  message: string;
  onRetry?: () => void;
  onDismiss?: () => void;
  showIcon?: boolean;
}

export function ErrorBanner({
  message,
  onRetry,
  onDismiss,
  variant = "warning",
  showIcon = true,
  className,
  ...props
}: ErrorBannerProps) {
  return (
    <div
      className={cn(errorBannerVariants({ variant }), className)}
      {...props}
    >
      {showIcon && (
        <AlertCircle className={cn(errorBannerIconVariants({ variant }))} />
      )}
      <p className={cn(errorBannerTextVariants({ variant }))}>{message}</p>
      <div className="flex items-center gap-2 ml-auto">
        {onRetry && (
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "h-7 px-3 text-xs font-mono uppercase tracking-wider border border-transparent transition-all",
              variant === "warning" && "hover:bg-secondary/20 hover:border-secondary/40 text-secondary",
              variant === "destructive" && "hover:bg-destructive/20 hover:border-destructive/40 text-destructive",
              variant === "info" && "hover:bg-primary/20 hover:border-primary/40 text-primary",
              variant === "default" && "hover:bg-muted/20 hover:border-muted/40"
            )}
            onClick={onRetry}
          >
            Retry
          </Button>
        )}
        {onDismiss && (
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0 hover:bg-muted/20 text-muted-foreground hover:text-foreground transition-all"
            onClick={onDismiss}
          >
            <X className="w-3.5 h-3.5" />
          </Button>
        )}
      </div>
    </div>
  );
}


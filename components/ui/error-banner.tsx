import * as React from "react";
import { AlertCircle, X } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Button } from "./button";

const errorBannerVariants = cva(
  "cyber-card p-4 flex items-center gap-3",
  {
    variants: {
      variant: {
        warning: "border-secondary/50 bg-secondary/5",
        destructive: "border-destructive/50 bg-destructive/5",
        info: "border-primary/50 bg-primary/5",
        default: "border-muted-foreground/50 bg-muted/5",
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
      warning: "text-secondary",
      destructive: "text-destructive",
      info: "text-primary",
      default: "text-muted-foreground",
    },
  },
  defaultVariants: {
    variant: "warning",
  },
});

const errorBannerTextVariants = cva("font-mono text-sm flex-1", {
  variants: {
    variant: {
      warning: "text-secondary",
      destructive: "text-destructive",
      info: "text-primary",
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
      <div className="flex items-center gap-2">
        {onRetry && (
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "h-8 px-3 text-xs font-mono uppercase tracking-wider",
              variant === "warning" && "hover:bg-secondary/10",
              variant === "destructive" && "hover:bg-destructive/10",
              variant === "info" && "hover:bg-primary/10",
              variant === "default" && "hover:bg-muted/10"
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
            className="h-8 w-8 p-0 hover:bg-muted/10"
            onClick={onDismiss}
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
}


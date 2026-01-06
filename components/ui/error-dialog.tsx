"use client";

import * as React from "react";
import { AlertCircle, X } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "./dialog";

const errorDialogVariants = cva("", {
  variants: {
    variant: {
      warning: "",
      destructive: "",
      info: "",
      default: "",
    },
  },
  defaultVariants: {
    variant: "warning",
  },
});

export interface ErrorDialogProps
  extends VariantProps<typeof errorDialogVariants> {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  message: string;
  onRetry?: () => void;
  variant?: "warning" | "destructive" | "info" | "default";
}

export function ErrorDialog({
  open,
  onOpenChange,
  title,
  message,
  onRetry,
  variant = "warning",
}: ErrorDialogProps) {
  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    }
    onOpenChange(false);
  };

  const variantStyles = {
    warning: {
      icon: "text-secondary",
      title: "text-secondary",
      border: "border-secondary/50",
      bg: "bg-secondary/5",
    },
    destructive: {
      icon: "text-destructive",
      title: "text-destructive",
      border: "border-destructive/50",
      bg: "bg-destructive/5",
    },
    info: {
      icon: "text-primary",
      title: "text-primary",
      border: "border-primary/50",
      bg: "bg-primary/5",
    },
    default: {
      icon: "text-muted-foreground",
      title: "text-muted-foreground",
      border: "border-muted-foreground/50",
      bg: "bg-muted/5",
    },
  };

  const styles = variantStyles[variant];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "border-l-4 max-w-md shadow-[0_0_30px_rgba(0,255,255,0.3)]",
          styles.border,
          styles.bg
        )}
        showCloseButton={false}
      >
        <DialogHeader>
          <div className="flex items-center gap-3">
            <AlertCircle
              className={cn("w-6 h-6 flex-shrink-0", styles.icon)}
            />
            <DialogTitle className={cn("font-mono text-lg", styles.title)}>
              {title || "Error"}
            </DialogTitle>
          </div>
        </DialogHeader>
        <DialogDescription className="font-mono text-sm text-foreground/90 pt-2">
          {message}
        </DialogDescription>
        <DialogFooter className="flex-row gap-2 sm:gap-2">
          {onRetry && (
            <Button
              variant="default"
              size="sm"
              className={cn(
                "font-mono text-xs uppercase tracking-wider",
                variant === "warning" && "bg-secondary/20 hover:bg-secondary/30 text-secondary border-secondary/40",
                variant === "destructive" && "bg-destructive/20 hover:bg-destructive/30 text-destructive border-destructive/40",
                variant === "info" && "bg-primary/20 hover:bg-primary/30 text-primary border-primary/40",
                variant === "default" && "bg-muted/20 hover:bg-muted/30"
              )}
              onClick={handleRetry}
            >
              Retry
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            className="font-mono text-xs uppercase tracking-wider"
            onClick={() => onOpenChange(false)}
          >
            Dismiss
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


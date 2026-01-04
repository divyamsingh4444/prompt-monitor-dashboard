import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: "active" | "inactive" | "warning" | "error" | "compliance";
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const configs = {
    active: {
      label: "ONLINE",
      color: "text-green-600 border-muted-foreground/30 bg-muted/40",
      glow: "",
    },
    inactive: {
      label: "OFFLINE",
      color:
        "text-muted-foreground border-muted-foreground/50 bg-muted-foreground/10",
      glow: "",
    },
    warning: {
      label: "WARNING",
      color: "text-yellow-400 border-yellow-400/50 bg-yellow-400/10",
      glow: "shadow-[0_0_8px_rgba(250,204,21,0.4)]",
    },
    error: {
      label: "CRITICAL",
      color: "text-destructive border-destructive/50 bg-destructive/10",
      glow: "shadow-[0_0_8px_rgba(239,68,68,0.4)]",
    },
    compliance: {
      label: "COMPLIANT",
      color: "text-primary border-primary/50 bg-primary/10",
      glow: "shadow-[0_0_8px_rgba(0,255,255,0.4)]",
    },
  };

  const config = configs[status] || configs.inactive;

  return (
    <div
      className={cn(
        "px-2.5 py-1 text-[10px] font-mono border rounded-sm flex items-center gap-1.5 transition-all duration-300",
        config.color,
        config.glow,
        className
      )}
    >
      <span
        className={cn(
          "w-1.5 h-1.5 rounded-full animate-pulse shadow-sm",
          status === "active"
            ? "bg-green-600"
            : status === "inactive"
            ? "bg-muted-foreground"
            : status === "warning"
            ? "bg-yellow-400 shadow-[0_0_6px_rgba(250,204,21,0.8)]"
            : status === "compliance"
            ? "bg-primary shadow-[0_0_6px_rgba(0,255,255,0.8)]"
            : "bg-destructive shadow-[0_0_6px_rgba(239,68,68,0.8)]"
        )}
      />
      {config.label}
    </div>
  );
}

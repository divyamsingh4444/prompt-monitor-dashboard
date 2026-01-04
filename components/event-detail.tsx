"use client";

import { type ReactNode } from "react";
import { type LucideIcon, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui";
import { formatTimestamp } from "@/lib/utils/time";
import { type AuditTrailItem } from "@/types";

export interface EventDetailProps {
  id: string;
  timestamp: number;
  icon: LucideIcon;
  title: string;
  content: string;
  onExpand?: () => void;
  expandLabel?: string;

  // Color scheme props
  variant?: "event" | "prompt" | "warning" | "blocked";

  // Optional badges and metadata
  badges?: Array<{
    label: string;
    variant?: "default" | "secondary" | "destructive" | "warning";
  }>;

  // Optional additional content
  metadata?: ReactNode;
  contentBox?: boolean;
  contentItalic?: boolean;
}

const variantStyles = {
  event: {
    iconBg: "bg-primary/10",
    iconBorder: "border-primary/50",
    iconHoverBg: "group-hover:bg-primary/20",
    iconHoverBorder: "group-hover:border-primary/70",
    iconColor: "text-primary",
    iconGlow: "drop-shadow-[0_0_8px_rgba(0,255,255,0.6)]",
    cardBorder: "border-primary/30",
    cardHoverBorder: "hover:border-primary/50",
    cardHoverShadow: "",
    cardBarClass: "event-detail-event",
    titleColor: "text-foreground",
    titleGlow: "",
    contentColor: "text-primary/90",
    contentHoverColor: "group-hover:text-primary",
  },
  prompt: {
    iconBg: "bg-green-800/20",
    iconBorder: "border-green-800/70",
    iconHoverBg: "group-hover:bg-green-800/30",
    iconHoverBorder: "group-hover:border-green-800/90",
    iconColor: "text-green-600",
    iconGlow: "drop-shadow-[0_0_8px_rgba(22,163,74,0.8)]",
    cardBorder: "border-green-800/40",
    cardHoverBorder: "hover:border-green-800/60",
    cardHoverShadow: "",
    cardBarClass: "event-detail-prompt",
    titleColor: "text-green-600",
    titleGlow: "",
    contentColor: "text-primary/90",
    contentHoverColor: "group-hover:text-primary",
  },
  warning: {
    iconBg: "bg-yellow-500/10",
    iconBorder: "border-yellow-500/50",
    iconHoverBg: "group-hover:bg-yellow-500/20",
    iconHoverBorder: "group-hover:border-yellow-500/70",
    iconColor: "text-yellow-500",
    iconGlow: "drop-shadow-[0_0_8px_rgba(250,204,21,0.6)]",
    cardBorder: "border-yellow-500/40",
    cardHoverBorder: "hover:border-yellow-500/60",
    cardHoverShadow: "hover:shadow-[0_0_20px_rgba(250,204,21,0.2)]",
    cardBarClass: "event-detail-warning",
    titleColor: "text-yellow-500",
    titleGlow: "",
    contentColor: "text-primary/90",
    contentHoverColor: "group-hover:text-primary",
  },
  blocked: {
    iconBg: "bg-destructive/10",
    iconBorder: "border-destructive/50",
    iconHoverBg: "group-hover:bg-destructive/20",
    iconHoverBorder: "group-hover:border-destructive/70",
    iconColor: "text-destructive",
    iconGlow: "drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]",
    cardBorder: "border-destructive/40",
    cardHoverBorder: "hover:border-destructive/60",
    cardHoverShadow: "hover:shadow-[0_0_20px_rgba(239,68,68,0.2)]",
    cardBarClass: "event-detail-blocked",
    titleColor: "text-destructive",
    titleGlow: "",
    contentColor: "text-primary/90",
    contentHoverColor: "group-hover:text-primary",
  },
};

const badgeStyles = {
  default: "text-secondary border-secondary/50 bg-secondary/10",
  secondary: "text-secondary border-secondary/50 bg-secondary/10",
  destructive:
    "text-destructive border-destructive bg-destructive/10 shadow-[0_0_8px_rgba(239,68,68,0.4)]",
  warning:
    "text-yellow-500 border-yellow-500 bg-yellow-500/10 shadow-[0_0_8px_rgba(250,204,21,0.4)]",
};

export function EventDetail({
  id,
  timestamp,
  icon: Icon,
  title,
  content,
  onExpand,
  expandLabel = "EXPAND_RAW",
  variant = "event",
  badges = [],
  metadata,
  contentBox = false,
  contentItalic = false,
}: EventDetailProps) {
  const styles = variantStyles[variant];

  return (
    <div
      className={`cyber-card ${styles.cardBarClass} p-5 group transition-all duration-300 ${styles.cardBorder} ${styles.cardHoverBorder} ${styles.cardHoverShadow}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex gap-4 flex-1">
          <div
            className={`p-2.5 rounded-sm border transition-all duration-300 group-hover:scale-110 ${styles.iconBg} ${styles.iconBorder} ${styles.iconHoverBg} ${styles.iconHoverBorder}`}
          >
            <Icon
              className={`w-4 h-4 ${styles.iconColor} ${styles.iconGlow}`}
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <span
                className={`text-xs font-mono font-bold uppercase tracking-wider ${
                  styles.titleColor
                } ${styles.titleGlow || ""}`}
              >
                {title}
              </span>
              <span className="text-[10px] text-muted-foreground font-mono opacity-80">
                {formatTimestamp(timestamp)}
              </span>
              {badges.map((badge, index) => (
                <span
                  key={index}
                  className={`text-[10px] font-mono font-bold border px-2 py-0.5 rounded-sm transition-all ${
                    badgeStyles[badge.variant || "default"]
                  }`}
                >
                  {badge.label}
                </span>
              ))}
            </div>
            {contentBox ? (
              <div className="bg-black/30 p-4 rounded border border-green-800/30 group-hover:border-green-800/50 group-hover:bg-black/40 transition-all">
                <p
                  className={`text-sm font-mono ${
                    contentItalic ? "italic" : ""
                  } ${styles.contentColor} leading-relaxed line-clamp-3 ${
                    styles.contentHoverColor
                  } transition-colors`}
                >
                  {content}
                </p>
              </div>
            ) : (
              <p
                className={`text-sm font-mono ${
                  contentItalic ? "italic" : ""
                } ${styles.contentColor} leading-relaxed ${
                  styles.contentHoverColor
                } transition-colors`}
              >
                {content}
              </p>
            )}
            {metadata && <div className="mt-4">{metadata}</div>}
          </div>
        </div>
        {onExpand && (
          <Button
            variant="ghost"
            size="sm"
            className="font-mono text-[10px] text-primary/50 hover:text-primary hover:bg-primary/10 transition-all duration-300 shrink-0"
            onClick={onExpand}
          >
            {expandLabel} <ExternalLink className="w-3 h-3 ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
}

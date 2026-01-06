"use client";

import { type ReactNode } from "react";
import { type LucideIcon, Clock, Hash } from "lucide-react";
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
      onClick={onExpand}
      className={`cyber-card ${
        styles.cardBarClass
      } p-6 group transition-all duration-300 ${styles.cardBorder} ${
        styles.cardHoverBorder
      } ${styles.cardHoverShadow} hover:shadow-lg ${
        onExpand ? "cursor-pointer active:scale-[0.98]" : ""
      }`}
    >
      <div className="flex flex-col gap-4">
        {/* Header Row */}
        <div className="flex items-start gap-6">
          <div className="flex gap-5 flex-1 min-w-0">
            {/* Icon Container - Enhanced */}
            <div className="flex-shrink-0">
              <div
                className={`p-3 rounded-md border-2 transition-all duration-300 group-hover:scale-110 ${styles.iconBg} ${styles.iconBorder} ${styles.iconHoverBg} ${styles.iconHoverBorder} relative overflow-hidden`}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <Icon
                  className={`w-5 h-5 ${styles.iconColor} ${styles.iconGlow} relative z-10`}
                />
              </div>
            </div>

            {/* Header Section */}
            <div className="flex-1 min-w-0 space-y-2">
              <div className="flex items-center gap-3 flex-wrap">
                <span
                  className={`text-sm font-mono font-bold uppercase tracking-wider ${
                    styles.titleColor
                  } ${
                    styles.titleGlow || ""
                  } group-hover:scale-105 transition-transform duration-300`}
                >
                  {title}
                </span>
                {badges.map((badge, index) => (
                  <span
                    key={index}
                    className={`text-[10px] font-mono font-bold border px-2.5 py-1 rounded-md transition-all hover:scale-105 ${
                      badgeStyles[badge.variant || "default"]
                    }`}
                  >
                    {badge.label}
                  </span>
                ))}
              </div>

              {/* Timestamp and ID Row */}
              <div className="flex items-center gap-4 flex-wrap text-[10px] font-mono text-muted-foreground/90">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3 h-3 opacity-70" />
                  <span className="opacity-90">
                    {formatTimestamp(timestamp)}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 opacity-60">
                  <Hash className="w-3 h-3" />
                  <span className="font-mono break-all">{id}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section - Full Width for Prompts */}
        {contentBox ? (
          <div
            className={`w-full bg-black/40 p-4 rounded-md border-2 ${
              variant === "prompt" ? "border-green-800/40" : "border-primary/20"
            } group-hover:border-primary/40 group-hover:bg-black/50 transition-all duration-300 shadow-inner`}
          >
            <p
              className={`text-sm font-mono ${contentItalic ? "italic" : ""} ${
                styles.contentColor
              } leading-relaxed ${
                styles.contentHoverColor
              } transition-colors break-words`}
            >
              {content}
            </p>
          </div>
        ) : (
          <div className="relative">
            <p
              className={`text-sm font-mono ${contentItalic ? "italic" : ""} ${
                styles.contentColor
              } leading-relaxed ${
                styles.contentHoverColor
              } transition-colors break-words`}
            >
              {content}
            </p>
          </div>
        )}

        {/* Metadata Section */}
        {metadata && (
          <div className="pt-2 border-t border-primary/10">{metadata}</div>
        )}
      </div>
    </div>
  );
}

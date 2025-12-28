"use client";

import { RefreshCw, Search, LayoutGrid, List } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import type { DashboardStats } from "@/types";

interface DashboardHeaderProps {
  stats: DashboardStats;
  onRefresh: () => void;
  isRefreshing: boolean;
  searchQuery: string;
  onSearchChange: (val: string) => void;
}

export function DashboardHeader({
  stats,
  onRefresh,
  isRefreshing,
  searchQuery,
  onSearchChange,
}: DashboardHeaderProps) {
  return (
    <header className="space-y-6 mb-8 lg:mb-10">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-1 h-10 bg-primary shadow-[0_0_15px_rgba(0,255,255,0.9)] pulse-glow" />
            <h1 className="text-3xl lg:text-5xl font-mono font-bold tracking-tighter text-primary neon-text">
              PROMPT MONITOR_
            </h1>
          </div>
          <p className="text-xs text-muted-foreground font-mono uppercase tracking-[0.2em] pl-4 opacity-80">
            Central Compliance & Monitoring Interface
          </p>
        </div>

        <div className="flex flex-wrap gap-3 lg:gap-4">
          <StatCard
            label="Total Devices"
            value={stats.total_devices}
            highlight={stats.total_devices > 0}
          />
          <StatCard
            label="Active"
            value={stats.active_devices}
            color="text-accent"
            highlight={stats.active_devices > 0}
          />
          <StatCard
            label="Inactive"
            value={stats.inactive_devices}
            color="text-muted-foreground"
          />
          <StatCard
            label="Prompts Today"
            value={stats.prompts_today}
            color="text-secondary"
            highlight={stats.prompts_today > 0}
          />

          <Button
            variant="outline"
            size="icon"
            className="neon-border h-[52px] w-[52px] shrink-0 bg-transparent hover:bg-primary/10 hover:border-primary/70 transition-all duration-300 hover:scale-105"
            onClick={onRefresh}
            disabled={isRefreshing}
            title="Refresh data"
          >
            <RefreshCw
              className={`w-5 h-5 transition-transform ${
                isRefreshing ? "animate-spin" : ""
              }`}
            />
          </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
        <div className="relative flex-1 w-full group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/50 group-focus-within:text-primary transition-colors pointer-events-none z-10" />
          <Input
            placeholder="SEARCH HOSTNAME / DEVICE ID / IP..."
            className="pl-10 font-mono text-xs tracking-widest bg-card/60 border-primary/30 h-11 uppercase focus:border-primary focus:ring-2 focus:ring-primary/30 focus:bg-card/80 transition-all backdrop-blur-sm"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        <div className="flex gap-2 shrink-0">
          <Button
            variant="outline"
            size="icon"
            className="h-11 w-11 border-primary/30 bg-primary/10 hover:bg-primary/20 hover:border-primary/50 transition-all duration-300 hover:scale-105"
            title="Grid view"
          >
            <LayoutGrid className="w-4 h-4 text-primary" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-11 w-11 border-primary/30 bg-transparent hover:bg-primary/10 hover:border-primary/50 transition-all duration-300 hover:scale-105"
            title="List view"
          >
            <List className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
          </Button>
        </div>
      </div>
    </header>
  );
}

function StatCard({
  label,
  value,
  color = "text-primary",
  highlight = false,
}: {
  label: string;
  value: number;
  color?: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`cyber-card p-4 px-5 flex flex-col items-center justify-center min-w-[120px] transition-all duration-300 ${
        highlight
          ? "border-primary/60 shadow-[0_0_20px_rgba(0,255,255,0.25)] hover:shadow-[0_0_25px_rgba(0,255,255,0.35)]"
          : "hover:border-primary/40"
      }`}
    >
      <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider mb-2 opacity-90">
        {label}
      </span>
      <span
        className={`text-3xl font-mono font-bold ${color} transition-all duration-300 ${
          highlight ? "neon-text" : ""
        }`}
      >
        {value.toLocaleString()}
      </span>
    </div>
  );
}

"use client"

import { RefreshCw, Search, LayoutGrid, List } from "lucide-react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import type { DashboardStats } from "../lib/api/types"

interface DashboardHeaderProps {
  stats: DashboardStats
  onRefresh: () => void
  isRefreshing: boolean
  searchQuery: string
  onSearchChange: (val: string) => void
}

export function DashboardHeader({ stats, onRefresh, isRefreshing, searchQuery, onSearchChange }: DashboardHeaderProps) {
  return (
    <header className="space-y-6 mb-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-mono font-bold tracking-tighter text-primary neon-text mb-1">PROMPT MONITOR_</h1>
          <p className="text-xs text-muted-foreground font-mono uppercase tracking-[0.2em]">
            Central Compliance & Monitoring Interface
          </p>
        </div>

        <div className="flex flex-wrap gap-4">
          <StatCard label="Total Devices" value={stats.total_devices} />
          <StatCard label="Active" value={stats.active_devices} color="text-accent" />
          <StatCard label="Inactive" value={stats.inactive_devices} color="text-muted-foreground" />
          <StatCard label="Prompts Today" value={stats.prompts_today} color="text-secondary" />

          <Button
            variant="outline"
            size="icon"
            className="neon-border h-[52px] w-[52px] shrink-0 bg-transparent"
            onClick={onRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={isRefreshing ? "animate-spin" : ""} />
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/50" />
          <Input
            placeholder="SEARCH HOSTNAME / DEVICE ID / IP..."
            className="pl-10 font-mono text-xs tracking-widest bg-card/50 border-primary/30 h-10 uppercase"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" className="h-10 w-10 border-primary/30 bg-primary/10">
            <LayoutGrid className="w-4 h-4 text-primary" />
          </Button>
          <Button variant="outline" size="icon" className="h-10 w-10 border-primary/30 bg-transparent">
            <List className="w-4 h-4 text-muted-foreground" />
          </Button>
        </div>
      </div>
    </header>
  )
}

function StatCard({ label, value, color = "text-primary" }: { label: string; value: number; color?: string }) {
  return (
    <div className="cyber-card p-2 px-4 flex flex-col items-center justify-center min-w-[100px]">
      <span className="text-[10px] font-mono text-muted-foreground uppercase">{label}</span>
      <span className={`text-xl font-mono font-bold ${color}`}>{value}</span>
    </div>
  )
}

import Link from "next/link";
import { Monitor, Cpu, Globe, Clock, MessageSquare } from "lucide-react";
import type { Device } from "@/types";
import { StatusBadge } from "./status-badge";
import { formatTimeAgo } from "@/lib/utils/time";

interface DeviceCardProps {
  device: Device;
}

export function DeviceCard({ device }: DeviceCardProps) {
  return (
    <Link href={`/device/${device.id}`}>
      <div className="cyber-card p-6 h-full cursor-pointer transition-all duration-300 group relative overflow-hidden">
        {/* Hover glow effect */}
        <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors duration-300 pointer-events-none" />

        {/* Animated corner accent on hover */}
        <div className="absolute top-0 right-0 w-16 h-16 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div className="absolute top-0 right-0 w-full h-[2px] bg-primary shadow-[0_0_8px_rgba(0,255,255,0.8)]" />
          <div className="absolute top-0 right-0 w-[2px] h-full bg-primary shadow-[0_0_8px_rgba(0,255,255,0.8)]" />
        </div>

        <div className="relative z-10">
          <div className="flex justify-between items-start mb-6">
            <div className="flex gap-3 flex-1 min-w-0">
              <div className="p-3 bg-primary/10 border border-primary/20 rounded-sm shrink-0 group-hover:bg-primary/20 group-hover:border-primary/40 transition-all duration-300 group-hover:scale-110">
                <Monitor className="w-5 h-5 text-primary group-hover:drop-shadow-[0_0_8px_rgba(0,255,255,0.8)] transition-all" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-mono text-base font-bold tracking-wider group-hover:text-primary transition-colors truncate mb-1">
                  {device.hostname}
                </h3>
                <p className="text-[10px] text-muted-foreground font-mono truncate opacity-80">
                  {device.id}
                </p>
              </div>
            </div>
            <div className="shrink-0 ml-2">
              <StatusBadge status={device.status} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-3.5 mb-6">
            <div className="flex items-center gap-2.5 text-[11px] text-muted-foreground group-hover:text-foreground/80 transition-colors">
              <Cpu className="w-4 h-4 shrink-0 text-primary/60 group-hover:text-primary transition-colors" />
              <span className="truncate font-mono">{device.os}</span>
            </div>
            <div className="flex items-center gap-2.5 text-[11px] text-muted-foreground group-hover:text-foreground/80 transition-colors">
              <Globe className="w-4 h-4 shrink-0 text-primary/60 group-hover:text-primary transition-colors" />
              <span className="truncate font-mono">{device.ip_address}</span>
            </div>
            <div className="flex items-center gap-2.5 text-[11px] text-muted-foreground group-hover:text-foreground/80 transition-colors">
              <Clock className="w-4 h-4 shrink-0 text-primary/60 group-hover:text-primary transition-colors" />
              <span className="truncate font-mono">
                {formatTimeAgo(device.last_seen)}
              </span>
            </div>
            <div className="flex items-center gap-2.5 text-[11px] text-muted-foreground group-hover:text-foreground/80 transition-colors">
              <MessageSquare className="w-4 h-4 shrink-0 text-primary/60 group-hover:text-primary transition-colors" />
              <span className="font-mono">{device.browser_count}</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-6 border-t border-primary/20 group-hover:border-primary/40 transition-colors gap-4">
            <div className="text-center flex-1">
              <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-wider mb-2 opacity-80">
                Today
              </p>
              <p
                className={`text-2xl font-mono font-bold transition-all duration-300 ${
                  device.prompts_today > 0
                    ? "text-accent neon-text group-hover:scale-110 inline-block"
                    : "text-muted-foreground"
                }`}
              >
                {device.prompts_today}
              </p>
            </div>
            <div className="w-px h-14 bg-primary/20 group-hover:bg-primary/40 transition-colors" />
            <div className="text-center flex-1">
              <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-wider mb-2 opacity-80">
                Total
              </p>
              <p
                className={`text-2xl font-mono font-bold transition-all duration-300 ${
                  device.total_prompts > 0
                    ? "text-primary neon-text group-hover:scale-110 inline-block"
                    : "text-muted-foreground"
                }`}
              >
                {device.total_prompts}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

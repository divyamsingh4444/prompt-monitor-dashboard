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
      <div className="cyber-card p-5 h-full cursor-pointer hover:border-primary/60 hover:shadow-[0_0_20px_rgba(0,255,255,0.15)] transition-all duration-300 group relative overflow-hidden">
        {/* Hover glow effect */}
        <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors duration-300 pointer-events-none" />

        <div className="relative z-10">
          <div className="flex justify-between items-start mb-5">
            <div className="flex gap-3 flex-1 min-w-0">
              <div className="p-2.5 bg-primary/10 border border-primary/20 rounded-sm shrink-0 group-hover:bg-primary/20 transition-colors">
                <Monitor className="w-5 h-5 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-mono text-sm font-bold tracking-wider group-hover:text-primary transition-colors truncate">
                  {device.hostname}
                </h3>
                <p className="text-[10px] text-muted-foreground font-mono truncate mt-0.5">
                  {device.id}
                </p>
              </div>
            </div>
            <div className="shrink-0 ml-2">
              <StatusBadge status={device.status} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-3 mb-6">
            <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
              <Cpu className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{device.os}</span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
              <Globe className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{device.ip_address}</span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
              <Clock className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">
                {formatTimeAgo(device.last_seen)}
              </span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
              <MessageSquare className="w-3.5 h-3.5 shrink-0" />
              <span>{device.browser_count}</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-5 border-t border-primary/10 gap-4">
            <div className="text-center flex-1">
              <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-wider mb-1">
                Today
              </p>
              <p
                className={`text-xl font-mono font-bold ${
                  device.prompts_today > 0
                    ? "text-accent neon-text"
                    : "text-muted-foreground"
                }`}
              >
                {device.prompts_today}
              </p>
            </div>
            <div className="w-px h-12 bg-primary/20" />
            <div className="text-center flex-1">
              <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-wider mb-1">
                Total
              </p>
              <p
                className={`text-xl font-mono font-bold ${
                  device.total_prompts > 0
                    ? "text-primary neon-text"
                    : "text-muted-foreground"
                }`}
              >
                {device.total_prompts}
              </p>
            </div>
          </div>
        </div>

        {/* Corner accent */}
        <div className="absolute bottom-0 right-0 w-12 h-12 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
          <div className="absolute bottom-0 right-0 w-full h-[1px] bg-primary" />
          <div className="absolute bottom-0 right-0 w-[1px] h-full bg-primary" />
        </div>
      </div>
    </Link>
  );
}

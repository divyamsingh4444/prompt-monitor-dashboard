import Link from "next/link"
import { Monitor, Cpu, Globe, Clock, MessageSquare } from "lucide-react"
import type { Device } from "../app/api/types"
import { CyberStatusBadge } from "./cyber-status-badge"
import { formatTimeAgo } from "../lib/utils/time"

interface DeviceCardProps {
  device: Device
}

export function DeviceCard({ device }: DeviceCardProps) {
  return (
    <Link href={`/device/${device.id}`}>
      <div className="cyber-card p-4 h-full cursor-pointer hover:border-primary transition-colors group">
        <div className="flex justify-between items-start mb-4">
          <div className="flex gap-3">
            <div className="p-2 bg-primary/10 border border-primary/20 rounded-sm">
              <Monitor className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-mono text-sm font-bold tracking-wider group-hover:text-primary transition-colors">
                {device.hostname}
              </h3>
              <p className="text-[10px] text-muted-foreground font-mono">ID: {device.id}</p>
            </div>
          </div>
          <CyberStatusBadge status={device.status} />
        </div>

        <div className="grid grid-cols-2 gap-y-3 mb-6">
          <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
            <Cpu className="w-3.5 h-3.5" />
            <span>{device.os}</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
            <Globe className="w-3.5 h-3.5" />
            <span>{device.ip_address}</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
            <Clock className="w-3.5 h-3.5" />
            <span>Last seen: {formatTimeAgo(device.last_seen)}</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Browsers: {device.browser_count}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-primary/10">
          <div className="text-center">
            <p className="text-[10px] text-muted-foreground font-mono uppercase">Prompts Today</p>
            <p className="text-lg font-mono font-bold text-accent">{device.prompts_today}</p>
          </div>
          <div className="text-center">
            <p className="text-[10px] text-muted-foreground font-mono uppercase">Total Prompts</p>
            <p className="text-lg font-mono font-bold text-primary">{device.total_prompts}</p>
          </div>
        </div>

        {/* Subtle decorative elements */}
        <div className="absolute bottom-0 right-0 w-8 h-8 opacity-10 pointer-events-none">
          <div className="absolute bottom-0 right-0 w-full h-[1px] bg-primary"></div>
          <div className="absolute bottom-0 right-0 w-[1px] h-full bg-primary"></div>
        </div>
      </div>
    </Link>
  )
}

"use client"

import { use, useState, useEffect } from "react"
import { api } from "../../../lib/utils/api"
import { useAutoRefresh } from "../../../lib/hooks/use-auto-refresh"
import {
  ChevronLeft,
  Monitor,
  Activity,
  MessageSquare,
  AlertTriangle,
  ShieldAlert,
  ExternalLink,
  Loader2,
} from "lucide-react"
import Link from "next/link"
import { Button } from "../../../components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs"
import { StatusBadge } from "../../../components/status-badge"
import { DetailModal } from "../../../components/detail-modal"
import { formatTimeAgo, formatTimestamp } from "../../../lib/utils/time"
import type { Device, DeviceEvent, Prompt, Alert } from "../../api/types"

export default function DeviceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [device, setDevice] = useState<Device | null>(null)
  const [events, setEvents] = useState<DeviceEvent[]>([])
  const [prompts, setPrompts] = useState<Prompt[]>([])
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [loading, setLoading] = useState(true)

  const [modalData, setModalData] = useState<{ open: boolean; title: string; data: any }>({
    open: false,
    title: "",
    data: null,
  })

  const fetchDeviceData = async () => {
    try {
      // Get events first (used for both events and alerts)
      const [deviceData, eventsResponse, promptsData] = await Promise.all([
        api<Device>(`/api/devices/${id}`),
        api<{ events: DeviceEvent[]; stats: object }>(`/api/devices/${id}/events`),
        api<Prompt[]>(`/api/devices/${id}/prompts`),
      ])
      
      const eventsData = eventsResponse.events || []
      
      // Filter events to get alerts
      const alertsData: Alert[] = eventsData
        .filter((event) => event.severity === "warning" || event.severity === "critical")
        .map((event) => ({
          id: event.id,
          device_id: event.device_id,
          alert_type: event.event_type,
          severity: event.severity as "warning" | "critical",
          matched_pattern: event.description,
          timestamp: event.timestamp,
        }))
      
      setDevice(deviceData)
      setEvents(eventsData)
      setPrompts(promptsData)
      setAlerts(alertsData)
    } catch (error) {
      console.error("[v0] Device detail fetch failed:", error)
    } finally {
      setLoading(false)
    }
  }

  const { refresh, isRefreshing } = useAutoRefresh({
    onRefresh: fetchDeviceData,
    interval: 60000,
  })

  useEffect(() => {
    fetchDeviceData()
  }, [id])

  if (loading || !device) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <p className="font-mono text-primary animate-pulse tracking-widest text-xs">CONNECTING TO TERMINAL {id}...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Detail Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div className="space-y-4">
          <Link href="/">
            <Button
              variant="ghost"
              size="sm"
              className="font-mono text-[10px] text-primary/70 hover:text-primary p-0 h-auto uppercase tracking-widest mb-4"
            >
              <ChevronLeft className="w-3 h-3 mr-1" /> RETURN_TO_DASHBOARD
            </Button>
          </Link>
          <div className="flex items-start gap-4">
            <div className="p-3 cyber-card bg-primary/10">
              <Monitor className="w-8 h-8 text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl font-mono font-bold text-primary neon-text uppercase">{device.hostname}</h1>
                <StatusBadge status={device.status} />
              </div>
              <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
                ID: {device.id} • {device.os} • {device.ip_address}
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="cyber-card p-3 px-6 flex flex-col items-center border-accent/30">
            <span className="text-[10px] font-mono text-muted-foreground uppercase">LAST_SEEN</span>
            <span className="text-sm font-mono font-bold text-accent">{formatTimeAgo(device.last_seen)}</span>
          </div>
          <Button
            variant="outline"
            className="neon-border h-[52px] bg-transparent font-mono text-xs uppercase tracking-widest"
            onClick={refresh}
            disabled={isRefreshing}
          >
            {isRefreshing ? <Loader2 className="animate-spin mr-2 w-4 h-4" /> : "REFRESH_STREAM"}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="timeline" className="space-y-6">
        <TabsList className="bg-transparent border-b border-primary/20 w-full justify-start rounded-none h-auto p-0 gap-4">
          <TabsTrigger value="timeline" className="cyber-tab">
            TIMELINE
          </TabsTrigger>
          <TabsTrigger value="prompts" className="cyber-tab">
            PROMPTS
          </TabsTrigger>
          <TabsTrigger value="alerts" className="cyber-tab">
            ALERTS
          </TabsTrigger>
          <TabsTrigger value="blocked" className="cyber-tab">
            BLOCKED
          </TabsTrigger>
        </TabsList>

        <TabsContent value="timeline" className="space-y-4">
          {events.map((event) => (
            <div key={event.id} className="cyber-card p-4 group">
              <div className="flex items-start justify-between gap-4">
                <div className="flex gap-4">
                  <div
                    className={`p-2 rounded-sm border ${
                      event.severity === "critical"
                        ? "bg-destructive/10 border-destructive/50"
                        : event.severity === "warning"
                          ? "bg-yellow-500/10 border-yellow-500/50"
                          : "bg-primary/10 border-primary/50"
                    }`}
                  >
                    <Activity
                      className={`w-4 h-4 ${
                        event.severity === "critical"
                          ? "text-destructive"
                          : event.severity === "warning"
                            ? "text-yellow-500"
                            : "text-primary"
                      }`}
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono font-bold uppercase tracking-wider">{event.event_type}</span>
                      <span className="text-[10px] text-muted-foreground font-mono">
                        {formatTimestamp(event.timestamp)}
                      </span>
                    </div>
                    <p className="text-sm font-mono text-primary/80 leading-relaxed">{event.description}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="font-mono text-[10px] text-primary/50 hover:text-primary"
                  onClick={() => setModalData({ open: true, title: `EVENT_${event.id}`, data: event })}
                >
                  EXPAND_RAW <ExternalLink className="w-3 h-3 ml-2" />
                </Button>
              </div>
            </div>
          ))}
          {events.length === 0 && <EmptyState message="NO_EVENTS_FOUND_IN_LOGS" />}
        </TabsContent>

        <TabsContent value="prompts" className="space-y-4">
          {prompts.map((prompt) => (
            <div key={prompt.id} className="cyber-card p-4">
              <div className="flex justify-between items-start mb-4">
                <div className="flex gap-3 items-center">
                  <div className="bg-primary/10 p-1.5 border border-primary/30 rounded-sm">
                    <MessageSquare className="w-4 h-4 text-primary" />
                  </div>
                  <div className="px-2 py-0.5 border border-secondary/50 bg-secondary/10 rounded-sm">
                    <span className="text-[10px] font-mono font-bold text-secondary uppercase">{prompt.site}</span>
                  </div>
                  <span className="text-[10px] text-muted-foreground font-mono">
                    {formatTimestamp(prompt.timestamp)}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="font-mono text-[10px] text-primary/50 hover:text-primary h-auto p-0"
                  onClick={() => setModalData({ open: true, title: `PROMPT_${prompt.id}`, data: prompt })}
                >
                  VIEW_DETAILS
                </Button>
              </div>
              <div className="bg-black/20 p-3 rounded border border-primary/10">
                <p className="text-xs font-mono text-primary/90 italic leading-relaxed line-clamp-3">
                  "{prompt.prompt_text}"
                </p>
              </div>
              <div className="mt-3 flex gap-4 text-[9px] font-mono text-muted-foreground uppercase">
                <span>BROWSER: {prompt.browser}</span>
                {prompt.is_flagged && <span className="text-destructive font-bold">FLAGGED</span>}
              </div>
            </div>
          ))}
          {prompts.length === 0 && <EmptyState message="NO_PROMPT_CAPTURE_DATA" />}
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          {alerts.map((alert) => (
            <div key={alert.id} className="cyber-card p-4 border-destructive/30">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-destructive/10 border border-destructive/50 rounded-sm">
                  <ShieldAlert className="w-5 h-5 text-destructive" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex gap-2 items-center">
                      <span className="text-xs font-mono font-bold text-destructive uppercase tracking-widest">
                        {alert.alert_type} DETECTED
                      </span>
                      <span className="text-[10px] text-muted-foreground font-mono">
                        {formatTimestamp(alert.timestamp)}
                      </span>
                    </div>
                    <span
                      className={`text-[9px] font-mono font-bold border px-1.5 py-0.5 rounded-sm ${
                        alert.severity === "critical"
                          ? "text-destructive border-destructive bg-destructive/10"
                          : "text-yellow-500 border-yellow-500 bg-yellow-500/10"
                      }`}
                    >
                      {alert.severity.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-xs font-mono text-primary/80 mb-3">
                    Sensitive pattern match: <span className="text-secondary">{alert.matched_pattern}</span>
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-primary/20 bg-primary/5 text-[10px] font-mono h-7"
                    onClick={() => setModalData({ open: true, title: `ALERT_${alert.id}`, data: alert })}
                  >
                    INVESTIGATE_EVENT
                  </Button>
                </div>
              </div>
            </div>
          ))}
          {alerts.length === 0 && <EmptyState message="NO_SECURITY_ALERTS_DETECTED" />}
        </TabsContent>

        <TabsContent value="blocked">
          <EmptyState
            message="BLOCKED_EVENT_SUBSYSTEM_OFFLINE"
            description="Scaffolding ready for future implementation"
          />
        </TabsContent>
      </Tabs>

      <DetailModal
        isOpen={modalData.open}
        onClose={() => setModalData({ ...modalData, open: false })}
        title={modalData.title}
        data={modalData.data}
      />
    </div>
  )
}

function EmptyState({ message, description }: { message: string; description?: string }) {
  return (
    <div className="py-20 text-center cyber-card border-dashed flex flex-col items-center justify-center opacity-60">
      <AlertTriangle className="w-8 h-8 text-muted-foreground mb-4" />
      <p className="font-mono text-muted-foreground font-bold tracking-[0.2em] uppercase text-xs mb-1">{message}</p>
      {description && <p className="font-mono text-[10px] text-muted-foreground/70 uppercase">{description}</p>}
    </div>
  )
}

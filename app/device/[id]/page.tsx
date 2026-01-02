"use client";

import { use, useState, useEffect, useCallback } from "react";
import { api } from "@/lib/utils/api";
import { useAutoRefresh } from "@/lib/hooks/use-auto-refresh";
import {
  ChevronLeft,
  Monitor,
  Activity,
  MessageSquare,
  AlertTriangle,
  ShieldAlert,
  ExternalLink,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatusBadge } from "@/components/status-badge";
import { DetailModal } from "@/components/detail-modal";
import { formatTimeAgo, formatTimestamp } from "@/lib/utils/time";
import type { Device, DeviceEvent, Prompt, Alert, Json } from "@/types";

export default function DeviceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [device, setDevice] = useState<Device | null>(null);
  const [events, setEvents] = useState<DeviceEvent[]>([]);
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);

  const [modalData, setModalData] = useState<{
    open: boolean;
    title: string;
    data: Json | null;
  }>({
    open: false,
    title: "",
    data: null,
  });

  const fetchDeviceData = useCallback(async () => {
    try {
      // Get events first (used for both events and alerts)
      const [deviceData, eventsResponse, promptsData] = await Promise.all([
        api<Device>(`/api/devices/${id}`),
        api<{ events: DeviceEvent[]; stats: object }>(
          `/api/devices/${id}/events`
        ),
        api<Prompt[]>(`/api/devices/${id}/prompts`),
      ]);

      const eventsData = eventsResponse.events || [];

      // Filter events to get alerts
      const alertsData: Alert[] = eventsData
        .filter(
          (event) =>
            event.severity === "warning" || event.severity === "critical"
        )
        .map((event) => {
          // Type guard for severity
          const severity: "warning" | "critical" =
            event.severity === "warning" || event.severity === "critical"
              ? event.severity
              : "warning"; // Fallback, but filter ensures it's warning or critical

          return {
            id: event.id,
            device_id: event.device_id ?? null,
            alert_type: event.event_type,
            severity,
            matched_pattern: event.description,
            timestamp: event.timestamp,
          };
        });

      setDevice(deviceData);
      setEvents(eventsData);
      setPrompts(promptsData);
      setAlerts(alertsData);
    } catch (error) {
      console.error("[v0] Device detail fetch failed:", error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  const { refresh, isRefreshing } = useAutoRefresh({
    onRefresh: fetchDeviceData,
    interval: 60000,
  });

  useEffect(() => {
    fetchDeviceData();
  }, [fetchDeviceData]);

  if (loading || !device) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <p className="font-mono text-primary animate-pulse tracking-widest text-xs">
          CONNECTING TO TERMINAL {id}...
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Detail Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div className="space-y-4">
          <Link href="/">
            <Button
              variant="ghost"
              size="sm"
              className="font-mono text-[10px] text-primary/70 hover:text-primary p-0 h-auto uppercase tracking-widest mb-4 transition-all duration-300 hover:bg-primary/10"
            >
              <ChevronLeft className="w-3 h-3 mr-1" /> RETURN_TO_DASHBOARD
            </Button>
          </Link>
          <div className="flex items-start gap-5">
            <div className="p-4 cyber-card bg-primary/10 border-primary/40 hover:border-primary/60 transition-all duration-300 hover:scale-105">
              <Monitor className="w-8 h-8 text-primary drop-shadow-[0_0_12px_rgba(0,255,255,0.8)]" />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <h1 className="text-3xl lg:text-4xl font-mono font-bold text-primary neon-text uppercase">
                  {device.hostname}
                </h1>
                <StatusBadge status={device.status} />
              </div>
              <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest opacity-90">
                ID: {device.id} • {device.os} • {device.ip_address}
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="cyber-card p-4 px-6 flex flex-col items-center border-accent/40 hover:border-accent/60 transition-all duration-300">
            <span className="text-[10px] font-mono text-muted-foreground uppercase mb-2 opacity-80">
              LAST_SEEN
            </span>
            <span className="text-base font-mono font-bold text-accent neon-text">
              {formatTimeAgo(device.last_seen)}
            </span>
          </div>
          <Button
            variant="outline"
            className="neon-border h-[52px] bg-transparent font-mono text-xs uppercase tracking-widest hover:bg-primary/10 hover:border-primary/70 transition-all duration-300 hover:scale-105"
            onClick={refresh}
            disabled={isRefreshing}
          >
            {isRefreshing ? (
              <Loader2 className="animate-spin mr-2 w-4 h-4" />
            ) : (
              "REFRESH_STREAM"
            )}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="timeline" className="space-y-6">
        <TabsList className="bg-transparent border-b-2 border-primary/20 w-full justify-start rounded-none h-auto p-0 gap-6 mb-2">
          <TabsTrigger
            value="timeline"
            className="cyber-tab text-xs lg:text-sm"
          >
            TIMELINE
          </TabsTrigger>
          <TabsTrigger value="prompts" className="cyber-tab text-xs lg:text-sm">
            PROMPTS
          </TabsTrigger>
          <TabsTrigger value="alerts" className="cyber-tab text-xs lg:text-sm">
            ALERTS
          </TabsTrigger>
          <TabsTrigger value="blocked" className="cyber-tab text-xs lg:text-sm">
            BLOCKED
          </TabsTrigger>
        </TabsList>

        <TabsContent value="timeline" className="space-y-4">
          {events.map((event) => (
            <div
              key={event.id}
              className="cyber-card p-5 group hover:border-primary/50 transition-all duration-300"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex gap-4 flex-1">
                  <div
                    className={`p-2.5 rounded-sm border transition-all duration-300 group-hover:scale-110 ${
                      event.severity === "critical"
                        ? "bg-destructive/10 border-destructive/50 group-hover:bg-destructive/20 group-hover:border-destructive/70"
                        : event.severity === "warning"
                        ? "bg-yellow-500/10 border-yellow-500/50 group-hover:bg-yellow-500/20 group-hover:border-yellow-500/70"
                        : "bg-primary/10 border-primary/50 group-hover:bg-primary/20 group-hover:border-primary/70"
                    }`}
                  >
                    <Activity
                      className={`w-4 h-4 transition-all ${
                        event.severity === "critical"
                          ? "text-destructive drop-shadow-[0_0_8px_rgba(239,68,68,0.6)]"
                          : event.severity === "warning"
                          ? "text-yellow-500 drop-shadow-[0_0_8px_rgba(250,204,21,0.6)]"
                          : "text-primary drop-shadow-[0_0_8px_rgba(0,255,255,0.6)]"
                      }`}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <span className="text-xs font-mono font-bold uppercase tracking-wider text-foreground">
                        {event.event_type}
                      </span>
                      <span className="text-[10px] text-muted-foreground font-mono opacity-80">
                        {formatTimestamp(event.timestamp)}
                      </span>
                    </div>
                    <p className="text-sm font-mono text-primary/90 leading-relaxed group-hover:text-primary transition-colors">
                      {event.description}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="font-mono text-[10px] text-primary/50 hover:text-primary hover:bg-primary/10 transition-all duration-300 shrink-0"
                  onClick={() =>
                    setModalData({
                      open: true,
                      title: `EVENT_${event.id}`,
                      data: event,
                    })
                  }
                >
                  EXPAND_RAW <ExternalLink className="w-3 h-3 ml-2" />
                </Button>
              </div>
            </div>
          ))}
          {events.length === 0 && (
            <EmptyState message="NO_EVENTS_FOUND_IN_LOGS" />
          )}
        </TabsContent>

        <TabsContent value="prompts" className="space-y-4">
          {prompts.map((prompt) => (
            <div
              key={prompt.id}
              className="cyber-card p-5 group hover:border-primary/50 transition-all duration-300"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex gap-3 items-center flex-wrap">
                  <div className="bg-primary/10 p-2 border border-primary/30 rounded-sm group-hover:bg-primary/20 group-hover:border-primary/50 transition-all duration-300 group-hover:scale-110">
                    <MessageSquare className="w-4 h-4 text-primary drop-shadow-[0_0_6px_rgba(0,255,255,0.6)]" />
                  </div>
                  <div className="px-3 py-1 border border-secondary/50 bg-secondary/10 rounded-sm group-hover:border-secondary/70 group-hover:bg-secondary/20 transition-all">
                    <span className="text-[10px] font-mono font-bold text-secondary uppercase">
                      {prompt.site}
                    </span>
                  </div>
                  <span className="text-[10px] text-muted-foreground font-mono opacity-80">
                    {formatTimestamp(prompt.timestamp)}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="font-mono text-[10px] text-primary/50 hover:text-primary hover:bg-primary/10 transition-all duration-300 h-auto p-0 shrink-0"
                  onClick={() =>
                    setModalData({
                      open: true,
                      title: `PROMPT_${prompt.id}`,
                      data: prompt,
                    })
                  }
                >
                  VIEW_DETAILS
                </Button>
              </div>
              <div className="bg-black/30 p-4 rounded border border-primary/20 group-hover:border-primary/40 group-hover:bg-black/40 transition-all">
                <p className="text-sm font-mono text-primary/95 italic leading-relaxed line-clamp-3">
                  "{prompt.prompt_text}"
                </p>
              </div>
              <div className="mt-4 flex gap-4 text-[10px] font-mono text-muted-foreground uppercase flex-wrap">
                <span className="opacity-80">BROWSER: {prompt.browser}</span>
                {prompt.is_flagged && (
                  <span className="text-destructive font-bold neon-text">
                    FLAGGED
                  </span>
                )}
              </div>
            </div>
          ))}
          {prompts.length === 0 && (
            <EmptyState message="NO_PROMPT_CAPTURE_DATA" />
          )}
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className="cyber-card p-5 border-destructive/40 group hover:border-destructive/60 hover:shadow-[0_0_20px_rgba(239,68,68,0.2)] transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-destructive/10 border border-destructive/50 rounded-sm group-hover:bg-destructive/20 group-hover:border-destructive/70 group-hover:scale-110 transition-all duration-300">
                  <ShieldAlert className="w-5 h-5 text-destructive drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-3 flex-wrap gap-2">
                    <div className="flex gap-3 items-center flex-wrap">
                      <span className="text-xs font-mono font-bold text-destructive uppercase tracking-widest neon-text">
                        {alert.alert_type} DETECTED
                      </span>
                      <span className="text-[10px] text-muted-foreground font-mono opacity-80">
                        {formatTimestamp(alert.timestamp)}
                      </span>
                    </div>
                    <span
                      className={`text-[10px] font-mono font-bold border px-2 py-1 rounded-sm transition-all ${
                        alert.severity === "critical"
                          ? "text-destructive border-destructive bg-destructive/10 shadow-[0_0_8px_rgba(239,68,68,0.4)]"
                          : "text-yellow-500 border-yellow-500 bg-yellow-500/10 shadow-[0_0_8px_rgba(250,204,21,0.4)]"
                      }`}
                    >
                      {alert.severity.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm font-mono text-primary/90 mb-4 leading-relaxed">
                    Sensitive pattern match:{" "}
                    <span className="text-secondary font-bold">
                      {alert.matched_pattern}
                    </span>
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-primary/30 bg-primary/5 hover:bg-primary/10 hover:border-primary/50 text-[10px] font-mono h-8 transition-all duration-300"
                    onClick={() =>
                      setModalData({
                        open: true,
                        title: `ALERT_${alert.id}`,
                        data: alert,
                      })
                    }
                  >
                    INVESTIGATE_EVENT
                  </Button>
                </div>
              </div>
            </div>
          ))}
          {alerts.length === 0 && (
            <EmptyState message="NO_SECURITY_ALERTS_DETECTED" />
          )}
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
  );
}

function EmptyState({
  message,
  description,
}: {
  message: string;
  description?: string;
}) {
  return (
    <div className="py-24 text-center cyber-card border-dashed border-primary/20 flex flex-col items-center justify-center opacity-70 hover:opacity-90 transition-opacity duration-300">
      <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center border border-primary/30 mb-6">
        <AlertTriangle className="w-8 h-8 text-muted-foreground" />
      </div>
      <p className="font-mono text-muted-foreground font-bold tracking-[0.2em] uppercase text-sm mb-2">
        {message}
      </p>
      {description && (
        <p className="font-mono text-[10px] text-muted-foreground/70 uppercase max-w-md">
          {description}
        </p>
      )}
    </div>
  );
}

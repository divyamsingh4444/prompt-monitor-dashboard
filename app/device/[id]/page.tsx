"use client";

import { use, useState, useEffect, useCallback, useMemo } from "react";
import { apiClient, ApiError } from "@/lib/api-client";
import { type Device, type Json, AuditTrailItem, Alert } from "@/types";
import { useAutoRefresh } from "@/lib/hooks/use-auto-refresh";
import {
  ChevronLeft,
  Monitor,
  Activity,
  MessageSquare,
  AlertTriangle,
  ShieldAlert,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import {
  Button,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui";
import { StatusBadge } from "@/components/status-badge";
import { DetailModal } from "@/components/detail-modal";
import { EventDetail } from "@/components/event-detail";
import { formatTimeAgo, formatTimestamp } from "@/lib/utils/time";

export default function DeviceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [device, setDevice] = useState<Device | null>(null);
  const [auditTrail, setAuditTrail] = useState<AuditTrailItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

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
      setError(null);
      // Get device and unified audit trail
      const [deviceData, auditTrailData] = await Promise.all([
        apiClient.getDevice(id),
        apiClient.getDeviceAuditTrail(id),
      ]);

      setDevice(deviceData);
      setAuditTrail(auditTrailData);
      setLoading(false);
    } catch (error: unknown) {
      setLoading(false);
      // Log error for debugging
      if (error instanceof ApiError) {
        console.error(`API Error ${error.status}:`, error.message);
        setError(error);
      } else if (error instanceof Error) {
        console.error("[v0] Device detail fetch failed:", error);
        setError(error);
      } else {
        console.error("[v0] Device detail fetch failed:", error);
        setError(new Error("Failed to fetch device data"));
      }
    }
  }, [id]);

  // Filter audit trail for each tab
  const auditTrailItems = useMemo(() => auditTrail, [auditTrail]);

  const prompts = useMemo(
    () => auditTrail.filter((item) => item.type === AuditTrailItem.type.PROMPT),
    [auditTrail]
  );

  const alerts = useMemo(() => {
    return auditTrail
      .filter(
        (item) =>
          item.severity === AuditTrailItem.severity.WARNING ||
          item.severity === AuditTrailItem.severity.CRITICAL
      )
      .map((item) => {
        const severity =
          item.severity === AuditTrailItem.severity.CRITICAL
            ? Alert.severity.CRITICAL
            : Alert.severity.WARNING;

        return {
          id: item.id,
          device_id: item.device_id ?? null,
          alert_type: item.event_type,
          severity,
          matched_pattern:
            item.description || item.reason || item.prompt || "Alert",
          timestamp: item.timestamp,
        };
      });
  }, [auditTrail]);

  const blocked = useMemo(
    () =>
      auditTrail.filter(
        (item) =>
          item.type === AuditTrailItem.type.COMPLIANCE_EVENT &&
          item.event_type === "blocked"
      ),
    [auditTrail]
  );

  const { refresh, isRefreshing } = useAutoRefresh({
    onRefresh: fetchDeviceData,
    interval: 60000,
  });

  useEffect(() => {
    fetchDeviceData();
  }, [fetchDeviceData]);

  // Show error UI if error occurred (for async errors)
  if (error) {
    throw error; // This will trigger the error boundary
  }

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
            <span className="text-base font-mono font-bold text-accent">
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

      <Tabs defaultValue="audit-trail" className="space-y-6">
        <TabsList className="bg-transparent border-b-2 border-primary/20 w-full justify-start rounded-none h-auto p-0 gap-6 mb-2">
          <TabsTrigger
            value="audit-trail"
            className="cyber-tab text-xs lg:text-sm"
          >
            AUDIT TRAIL
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

        <TabsContent value="audit-trail" className="space-y-4">
          {auditTrailItems.map((item) => {
            let variant: "event" | "prompt" | "warning" | "blocked" = "event";
            let Icon = Activity;

            if (item.severity === AuditTrailItem.severity.CRITICAL) {
              variant = "blocked";
            } else if (item.severity === AuditTrailItem.severity.WARNING) {
              variant = "warning";
            } else if (item.type === AuditTrailItem.type.PROMPT) {
              variant = "prompt";
              Icon = MessageSquare;
            }

            const title =
              item.type === AuditTrailItem.type.PROMPT
                ? "PROMPT"
                : item.event_type.toUpperCase();

            const content =
              item.type === AuditTrailItem.type.PROMPT
                ? `"${item.prompt_text || item.prompt}"`
                : item.description || item.reason || item.event_type;

            const badges =
              item.type === AuditTrailItem.type.PROMPT && item.site
                ? [{ label: item.site, variant: "secondary" as const }]
                : [];

            return (
              <EventDetail
                key={item.id}
                id={item.id}
                timestamp={item.timestamp}
                icon={Icon}
                title={title}
                content={content}
                variant={variant}
                badges={badges}
                contentBox={item.type === AuditTrailItem.type.PROMPT}
                contentItalic={item.type === AuditTrailItem.type.PROMPT}
                onExpand={() =>
                  setModalData({
                    open: true,
                    title: `${item.type.toUpperCase()}_${item.id}`,
                    data: item,
                  })
                }
              />
            );
          })}
          {auditTrailItems.length === 0 && (
            <EmptyState message="NO_EVENTS_FOUND_IN_LOGS" />
          )}
        </TabsContent>

        <TabsContent value="prompts" className="space-y-4">
          {prompts.map((item) => {
            const metadata = (
              <div className="flex gap-4 text-[10px] font-mono text-muted-foreground uppercase flex-wrap">
                {item.browser_name && (
                  <span className="opacity-80">
                    BROWSER: {item.browser_name}
                  </span>
                )}
                {item.is_flagged && (
                  <span className="text-destructive font-bold neon-text">
                    FLAGGED
                  </span>
                )}
              </div>
            );

            return (
              <EventDetail
                key={item.id}
                id={item.id}
                timestamp={item.timestamp}
                icon={MessageSquare}
                title="PROMPT"
                content={`"${item.prompt_text || item.prompt}"`}
                variant="prompt"
                badges={
                  item.site
                    ? [{ label: item.site || "Unknown", variant: "secondary" }]
                    : []
                }
                contentBox={true}
                contentItalic={true}
                metadata={metadata}
                expandLabel="VIEW_DETAILS"
                onExpand={() =>
                  setModalData({
                    open: true,
                    title: `PROMPT_${item.id}`,
                    data: item,
                  })
                }
              />
            );
          })}
          {prompts.length === 0 && (
            <EmptyState message="NO_PROMPT_CAPTURE_DATA" />
          )}
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          {alerts.map((alert) => (
            <EventDetail
              key={alert.id}
              id={alert.id}
              timestamp={alert.timestamp}
              icon={ShieldAlert}
              title={`${alert.alert_type} DETECTED`}
              content={`Sensitive pattern match: ${alert.matched_pattern}`}
              variant="warning"
              badges={[
                {
                  label: alert.severity.toUpperCase(),
                  variant: (alert.severity === "critical"
                    ? "destructive"
                    : "warning") as "destructive" | "warning",
                },
              ]}
              expandLabel="INVESTIGATE_EVENT"
              onExpand={() =>
                setModalData({
                  open: true,
                  title: `ALERT_${alert.id}`,
                  data: alert,
                })
              }
            />
          ))}
          {alerts.length === 0 && (
            <EmptyState message="NO_SECURITY_ALERTS_DETECTED" />
          )}
        </TabsContent>

        <TabsContent value="blocked" className="space-y-4">
          {blocked.map((item) => {
            const badges: Array<{
              label: string;
              variant?: "default" | "secondary" | "destructive" | "warning";
            }> = [];
            if (item.site) {
              badges.push({ label: item.site, variant: "secondary" });
            }
            if (item.severity) {
              badges.push({
                label: item.severity.toUpperCase(),
                variant:
                  item.severity === AuditTrailItem.severity.CRITICAL
                    ? ("destructive" as const)
                    : ("warning" as const),
              });
            }

            return (
              <EventDetail
                key={item.id}
                id={item.id}
                timestamp={item.timestamp}
                icon={ShieldAlert}
                title="BLOCKED"
                content={`Reason: ${
                  item.reason || item.description || "Blocked prompt"
                }`}
                variant="blocked"
                badges={badges}
                expandLabel="VIEW_DETAILS"
                onExpand={() =>
                  setModalData({
                    open: true,
                    title: `BLOCKED_${item.id}`,
                    data: item,
                  })
                }
              />
            );
          })}
          {blocked.length === 0 && <EmptyState message="NO_BLOCKED_PROMPTS" />}
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

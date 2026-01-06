"use client";

import { useState, useEffect, useMemo } from "react";
import { apiClient, ApiError } from "@/lib/api-client";
import { DeviceStatus, type Device, type StatsResponse } from "@/types";
import { DashboardHeader } from "@/components/dashboard-header";
import { DeviceCard } from "@/components/device-card";
import { useAutoRefresh } from "@/lib/hooks/use-auto-refresh";
import { Loader2, Filter, X, AlertCircle } from "lucide-react";
import { Button, ErrorDialog } from "@/components/ui";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [stats, setStats] = useState<StatsResponse>({
    total_devices: 0,
    active_devices: 0,
    inactive_devices: 0,
    prompts_today: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<DeviceStatus | null>(null);
  const [statsError, setStatsError] = useState<string | null>(null);
  const [devicesError, setDevicesError] = useState<string | null>(null);

  const fetchData = async () => {
    setStatsError(null);
    setDevicesError(null);

    try {
      // Fetch devices and stats separately to handle errors independently
      const [devicesResult, statsResult] = await Promise.allSettled([
        apiClient.getDevices({
          search: searchQuery || undefined,
          status: statusFilter || undefined,
        }),
        apiClient.getStats(),
      ]);

      // Handle devices result
      if (devicesResult.status === "fulfilled") {
        setDevices(devicesResult.value);
        setDevicesError(null);
      } else {
        const error = devicesResult.reason;
        if (error instanceof ApiError) {
          setDevicesError(`Failed to load devices (${error.status})`);
        } else {
          setDevicesError("Failed to load devices");
        }
      }

      // Handle stats result
      if (statsResult.status === "fulfilled") {
        setStats(statsResult.value);
        setStatsError(null);
      } else {
        const error = statsResult.reason;
        if (error instanceof ApiError) {
          setStatsError("Unable to load dashboard statistics");
        } else {
          setStatsError("Unable to load dashboard statistics");
        }
      }
    } catch (error) {
      // Fallback error handling
      setDevicesError("Failed to load devices");
      setStatsError("Unable to load dashboard statistics");
    } finally {
      setLoading(false);
    }
  };

  const { refresh, isRefreshing } = useAutoRefresh({
    onRefresh: fetchData,
    interval: 60000,
  });

  useEffect(() => {
    fetchData();
  }, [searchQuery, statusFilter]);

  const filteredDevices = useMemo(() => {
    return devices.filter((d) => {
      const matchesSearch =
        d.hostname.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.ip_address.includes(searchQuery);

      const matchesStatus = !statusFilter || d.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [devices, searchQuery, statusFilter]);

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    devices.forEach((d) => {
      counts[d.status] = (counts[d.status] || 0) + 1;
    });
    return counts;
  }, [devices]);

  // Show error dialog only for stats errors (devices errors show in empty state)
  const [statsErrorDialogOpen, setStatsErrorDialogOpen] = useState(false);
  const [statsErrorShown, setStatsErrorShown] = useState(false);

  // Show dialog when stats error appears (only once per error)
  useEffect(() => {
    if (statsError && !loading && !statsErrorShown) {
      setStatsErrorDialogOpen(true);
      setStatsErrorShown(true);
    }
    // Reset errorShown when error clears
    if (!statsError) {
      setStatsErrorShown(false);
    }
  }, [statsError, loading, statsErrorShown]);

  const handleStatsErrorRetry = () => {
    setStatsErrorShown(false);
    setStatsError(null);
    fetchData();
  };

  const handleStatsErrorDismiss = () => {
    setStatsErrorDialogOpen(false);
  };

  const handleDevicesErrorRetry = () => {
    setDevicesError(null);
    fetchData();
  };

  const handleDevicesErrorDismiss = () => {
    setDevicesError(null);
  };

  return (
    <div className="container mx-auto px-4 py-6 lg:py-8">
      {/* Error Dialog - Only for stats errors */}
      {statsError && (
        <ErrorDialog
          open={statsErrorDialogOpen}
          onOpenChange={(open) => {
            setStatsErrorDialogOpen(open);
            if (!open) {
              handleStatsErrorDismiss();
            }
          }}
          message={statsError}
          variant="warning"
          title="Warning"
          onRetry={handleStatsErrorRetry}
        />
      )}

      <DashboardHeader
        stats={stats}
        onRefresh={refresh}
        isRefreshing={isRefreshing}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Status Filters */}
      {!loading && devices.length > 0 && (
        <div className="flex flex-wrap items-center gap-3 mb-8">
          <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground uppercase tracking-wider opacity-80">
            <Filter className="w-3.5 h-3.5 text-primary/60" />
            <span>Filter:</span>
          </div>
          <Button
            variant={statusFilter === null ? "default" : "outline"}
            size="sm"
            className="h-8 px-4 text-xs font-mono uppercase tracking-wider transition-all duration-300 hover:scale-105"
            onClick={() => setStatusFilter(null)}
          >
            All ({devices.length})
          </Button>
          {Object.values(DeviceStatus).map((status) => {
            const count = statusCounts[status] || 0;
            if (count === 0) return null;
            return (
              <Button
                key={status}
                variant={statusFilter === status ? "default" : "outline"}
                size="sm"
                className="h-8 px-4 text-xs font-mono uppercase tracking-wider transition-all duration-300 hover:scale-105"
                onClick={() =>
                  setStatusFilter(statusFilter === status ? null : status)
                }
              >
                {status} ({count})
              </Button>
            );
          })}
          {statusFilter && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-xs hover:bg-primary/10 transition-all duration-300"
              onClick={() => setStatusFilter(null)}
            >
              <X className="w-3.5 h-3.5" />
            </Button>
          )}
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-8">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/30 blur-2xl rounded-full animate-pulse pulse-glow" />
            <Loader2 className="relative w-20 h-20 text-primary animate-spin drop-shadow-[0_0_20px_rgba(0,255,255,0.8)]" />
          </div>
          <div className="text-center space-y-3">
            <p className="font-mono text-primary animate-pulse tracking-widest text-base neon-text">
              INITIALIZING SYSTEM...
            </p>
            <p className="font-mono text-muted-foreground text-xs tracking-wider opacity-80">
              Scanning network terminals...
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Results Count */}
          {filteredDevices.length > 0 && (
            <div className="mb-4">
              <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
                Showing {filteredDevices.length} of {devices.length} device
                {devices.length !== 1 ? "s" : ""}
              </p>
            </div>
          )}

          {/* Device Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
            {filteredDevices.map((device, index) => (
              <div
                key={device.id}
                className="animate-in fade-in slide-in-from-bottom-4"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <DeviceCard device={device} />
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredDevices.length === 0 && !loading && (
            <div className="flex flex-col items-center justify-center min-h-[50vh] py-24">
              <div
                className={cn(
                  "cyber-card border-dashed p-14 max-w-lg w-full text-center space-y-6 transition-all duration-300",
                  devicesError
                    ? "border-destructive/30 hover:border-destructive/50"
                    : "border-primary/30 hover:border-primary/50"
                )}
              >
                <div
                  className={cn(
                    "w-20 h-20 mx-auto rounded-full flex items-center justify-center border transition-all duration-300",
                    devicesError
                      ? "bg-destructive/10 border-destructive/30 hover:bg-destructive/20 hover:border-destructive/50"
                      : "bg-primary/10 border-primary/30 hover:bg-primary/20 hover:border-primary/50"
                  )}
                >
                  {devicesError ? (
                    <AlertCircle className="w-10 h-10 text-destructive/60 drop-shadow-[0_0_8px_rgba(239,68,68,0.4)]" />
                  ) : (
                    <Filter className="w-10 h-10 text-primary/60 drop-shadow-[0_0_8px_rgba(0,255,255,0.4)]" />
                  )}
                </div>
                <div className="space-y-3">
                  <p
                    className={cn(
                      "font-mono font-bold tracking-widest text-base uppercase neon-text",
                      devicesError ? "text-destructive" : "text-primary"
                    )}
                  >
                    No Devices Found
                  </p>
                  <p className="font-mono text-muted-foreground text-sm leading-relaxed opacity-90 max-w-md mx-auto">
                    {devicesError
                      ? devicesError
                      : searchQuery || statusFilter
                      ? "Try adjusting your search or filter criteria"
                      : "No terminals detected in network scan"}
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
                  {devicesError ? (
                    <>
                      <Button
                        variant="default"
                        size="sm"
                        className="font-mono text-xs uppercase tracking-wider bg-destructive/20 hover:bg-destructive/30 text-destructive border-destructive/40"
                        onClick={handleDevicesErrorRetry}
                      >
                        Retry
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="font-mono text-xs uppercase tracking-wider border-destructive/40 hover:border-destructive/70 hover:bg-destructive/10"
                        onClick={handleDevicesErrorDismiss}
                      >
                        Dismiss
                      </Button>
                    </>
                  ) : searchQuery || statusFilter ? (
                    <Button
                      variant="outline"
                      size="sm"
                      className="font-mono text-xs uppercase tracking-wider border-primary/40 hover:border-primary/70 hover:bg-primary/10 transition-all duration-300"
                      onClick={() => {
                        setSearchQuery("");
                        setStatusFilter(null);
                      }}
                    >
                      Clear Filters
                    </Button>
                  ) : null}
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Footer / CRT Decoration */}
      <footer className="mt-20 lg:mt-24 border-t border-primary/30 pt-8 flex flex-col sm:flex-row justify-between items-center gap-6 opacity-60 hover:opacity-80 transition-opacity duration-300">
        <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
          SYS_LOG: NETWORK_MONITOR_v1.4.2
        </div>
        <div className="text-[10px] font-mono uppercase tracking-widest flex flex-wrap gap-4 justify-center text-muted-foreground">
          <span>ENCRYPTION: AES-256</span>
          <span>STATUS: STABLE</span>
          <span className="text-accent neon-text">
            ACTIVE: {stats.active_devices}
          </span>
        </div>
      </footer>
    </div>
  );
}

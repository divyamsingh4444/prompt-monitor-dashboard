"use client";

import { useState, useEffect, useMemo } from "react";
import { api } from "@/lib/utils/api";
import type { Device, DashboardStats } from "@/types";
import { DashboardHeader } from "@/components/dashboard-header";
import { DeviceCard } from "@/components/device-card";
import { useAutoRefresh } from "@/lib/hooks/use-auto-refresh";
import { Loader2, Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    total_devices: 0,
    active_devices: 0,
    inactive_devices: 0,
    prompts_today: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const [devicesData, statsData] = await Promise.all([
        api<Device[]>("/api/devices"),
        api<DashboardStats>("/api/stats"),
      ]);
      setDevices(devicesData);
      setStats(statsData);
    } catch (error) {
      console.error("[v0] Dashboard fetch failed:", error);
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
  }, []);

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

  return (
    <div className="container mx-auto px-4 py-6 lg:py-8">
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
          {Object.entries(statusCounts).map(([status, count]) => (
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
          ))}
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
              <div className="cyber-card border-dashed border-primary/30 p-14 max-w-lg w-full text-center space-y-6 hover:border-primary/50 transition-all duration-300">
                <div className="w-20 h-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center border border-primary/30 hover:bg-primary/20 hover:border-primary/50 transition-all duration-300">
                  <Filter className="w-10 h-10 text-primary/60 drop-shadow-[0_0_8px_rgba(0,255,255,0.4)]" />
                </div>
                <div className="space-y-3">
                  <p className="font-mono text-primary font-bold tracking-widest text-base uppercase neon-text">
                    No Devices Found
                  </p>
                  <p className="font-mono text-muted-foreground text-sm leading-relaxed opacity-90 max-w-md mx-auto">
                    {searchQuery || statusFilter
                      ? "Try adjusting your search or filter criteria"
                      : "No terminals detected in network scan"}
                  </p>
                </div>
                {(searchQuery || statusFilter) && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-6 font-mono text-xs uppercase tracking-wider border-primary/40 hover:border-primary/70 hover:bg-primary/10 transition-all duration-300"
                    onClick={() => {
                      setSearchQuery("");
                      setStatusFilter(null);
                    }}
                  >
                    Clear Filters
                  </Button>
                )}
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

"use client"

import { useState, useEffect } from "react"
import { api } from "../lib/utils/api"
import type { Device, DashboardStats } from "./api/types"
import { DashboardHeader } from "../components/dashboard-header"
import { DeviceCard } from "../components/device-card"
import { useAutoRefresh } from "../lib/hooks/use-auto-refresh"
import { Loader2 } from "lucide-react"

export default function DashboardPage() {
  const [devices, setDevices] = useState<Device[]>([])
  const [stats, setStats] = useState<DashboardStats>({
    total_devices: 0,
    active_devices: 0,
    inactive_devices: 0,
    prompts_today: 0,
  })
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  const fetchData = async () => {
    try {
      const [devicesData, statsData] = await Promise.all([
        api<Device[]>("/api/devices"),
        api<DashboardStats>("/api/stats"),
      ])
      setDevices(devicesData)
      setStats(statsData)
    } catch (error) {
      console.error("[v0] Dashboard fetch failed:", error)
    } finally {
      setLoading(false)
    }
  }

  const { refresh, isRefreshing } = useAutoRefresh({
    onRefresh: fetchData,
    interval: 60000,
  })

  useEffect(() => {
    fetchData()
  }, [])

  const filteredDevices = devices.filter(
    (d) =>
      d.hostname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.ip_address.includes(searchQuery),
  )

  return (
    <div className="container mx-auto px-4 py-8">
      <DashboardHeader
        stats={stats}
        onRefresh={refresh}
        isRefreshing={isRefreshing}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {loading ? (
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
          <p className="font-mono text-primary animate-pulse tracking-widest text-xs">INITIALIZING SYSTEM...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredDevices.map((device) => (
            <DeviceCard key={device.id} device={device} />
          ))}

          {filteredDevices.length === 0 && (
            <div className="col-span-full py-20 text-center cyber-card border-dashed">
              <p className="font-mono text-muted-foreground italic uppercase">
                No matching terminals found in network scan
              </p>
            </div>
          )}
        </div>
      )}

      {/* Footer / CRT Decoration */}
      <footer className="mt-20 border-t border-primary/20 pt-4 flex justify-between items-center opacity-50">
        <div className="text-[10px] font-mono uppercase tracking-widest">SYS_LOG: NETWORK_MONITOR_v1.4.2</div>
        <div className="text-[10px] font-mono uppercase tracking-widest flex gap-4">
          <span>ENCRYPTION: AES-256</span>
          <span>STATUS: STABLE</span>
        </div>
      </footer>
    </div>
  )
}

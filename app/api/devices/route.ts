import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'
import type { Device } from '@/app/api/types'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const search = searchParams.get('search')
    const status = searchParams.get('status')

    // Get all devices
    const { data: devicesData, error: devicesError } = await supabaseAdmin
      .from('devices')
      .select('*')

    if (devicesError) throw devicesError

    // Get prompts counts for today and total for each device
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const todayTimestamp = today.getTime()

    const { data: promptsData, error: promptsError } = await supabaseAdmin
      .from('prompts')
      .select('device_id, timestamp')

    if (promptsError) throw promptsError

    // Calculate prompts counts per device
    const promptsCounts = new Map<string, { today: number; total: number }>()
    promptsData?.forEach((p: any) => {
      if (!p.device_id) return
      const counts = promptsCounts.get(p.device_id) || { today: 0, total: 0 }
      counts.total++
      // Convert timestamp to number if it's a string (Supabase bigint can come as string)
      const timestamp = typeof p.timestamp === 'string' ? parseInt(p.timestamp, 10) : p.timestamp
      if (timestamp && timestamp >= todayTimestamp) {
        counts.today++
      }
      promptsCounts.set(p.device_id, counts)
    })

    // Transform database devices to frontend Device type
    let devices: Device[] = (devicesData || []).map((d: any) => {
      // Determine status based on last_heartbeat (active if within last 5 minutes)
      const fiveMinutesAgo = new Date()
      fiveMinutesAgo.setMinutes(fiveMinutesAgo.getMinutes() - 5)
      const lastHeartbeat = d.last_heartbeat ? new Date(d.last_heartbeat) : null
      const isActive = lastHeartbeat && lastHeartbeat >= fiveMinutesAgo
      const deviceStatus = isActive ? 'active' : 'inactive'

      // Extract IP from JSONB array
      const ipAddress = Array.isArray(d.ips) && d.ips.length > 0 ? d.ips[0] : 'N/A'
      
      // Count browsers from JSONB array
      const browserCount = Array.isArray(d.browsers) ? d.browsers.length : 0

      // Get prompts counts
      const counts = promptsCounts.get(d.device_id) || { today: 0, total: 0 }

      return {
        id: d.device_id,
        hostname: d.hostname || 'Unknown',
        status: deviceStatus,
        os: d.os || 'Unknown',
        ip_address: ipAddress,
        last_seen: d.last_heartbeat || new Date().toISOString(),
        browser_count: browserCount,
        prompts_today: counts.today,
        total_prompts: counts.total,
      }
    })

    // Apply status filter if provided
    if (status) {
      devices = devices.filter((d) => d.status === status)
    }

    // Apply search filter if provided
    if (search) {
      const searchLower = search.toLowerCase()
      devices = devices.filter(
        (d) =>
          d.hostname.toLowerCase().includes(searchLower) ||
          d.id.toLowerCase().includes(searchLower) ||
          d.ip_address.includes(search)
      )
    }

    return NextResponse.json(devices)
  } catch (error) {
    console.error('Error fetching devices:', error)
    return NextResponse.json(
      { error: 'Failed to fetch devices' },
      { status: 500 }
    )
  }
}


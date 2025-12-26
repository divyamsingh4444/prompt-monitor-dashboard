"use client"

import { useState, useEffect, useCallback, useRef } from "react"

interface UseAutoRefreshProps {
  onRefresh: () => Promise<void>
  interval?: number
}

export function useAutoRefresh({ onRefresh, interval = 60000 }: UseAutoRefreshProps) {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const refresh = useCallback(async () => {
    setIsRefreshing(true)
    try {
      await onRefresh()
    } finally {
      setIsRefreshing(false)
    }
  }, [onRefresh])

  useEffect(() => {
    timerRef.current = setInterval(refresh, interval)
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [refresh, interval])

  return { refresh, isRefreshing }
}

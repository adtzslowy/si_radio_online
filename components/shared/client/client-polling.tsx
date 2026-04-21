"use client"
import { useEffect, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"

type ClientPollingProps = {
  query?: string
  intervalMs?: number
}

export function ClientPolling({ query, intervalMs = 10000 }: ClientPollingProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const routerRef = useRef(router)

  useEffect(() => { routerRef.current = router }, [router])

  useEffect(() => {
    // Stop polling kalau q sudah tidak ada di URL
    const currentQuery = searchParams.get("q")?.trim() ?? ""

    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }

    if (!currentQuery) return // berhenti kalau query kosong

    intervalRef.current = setInterval(() => {
      routerRef.current.refresh()
    }, intervalMs)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [searchParams, intervalMs]) // pakai searchParams bukan query prop

  return null
}
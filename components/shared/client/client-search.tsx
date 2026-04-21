"use client"
import { useEffect, useRef, useState } from "react"
import { Search, X } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"

export function ClientSearch() {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()
  const [value, setValue] = useState(searchParams.get("q") ?? "")
  const isMounted = useRef(false)

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true
      return
    }

    const timeout = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) {
        params.set("q", value)
      } else {
        params.delete("q")
      }
      params.set("page", "1")
      router.replace(`${pathname}?${params.toString()}`)
    }, 400)

    return () => clearTimeout(timeout)
  }, [value, pathname, router, searchParams])

  return (
    <div className="relative w-full md:max-w-sm">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Cari perusahaan, PIC, atau no. HP..."
        className="pl-9 pr-9"
      />
      {value && (
        <button
          onClick={() => setValue("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}
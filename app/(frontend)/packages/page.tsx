import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

function formatRupiah(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value)
}

export default async function FrontendPackagesPage() {
  const supabase = await createClient()

  const { data: packages, error } = await supabase
    .from("ad_packages")
    .select(`
      id,
      name,
      price,
      duration_days,
      slot_count,
      description,
      is_active
    `)
    .eq("is_active", true)
    .order("price", { ascending: true })

  if (error) {
    throw new Error(error.message)
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-10">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Pilih Paket Iklan</h1>
        <p className="text-muted-foreground">
          Pilih paket yang sesuai untuk promosi bisnis kamu di radio kami.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {(packages ?? []).map((pkg) => (
          <Card key={pkg.id} className="shadow-sm">
            <CardHeader>
              <CardTitle>{pkg.name}</CardTitle>
              <CardDescription>{pkg.description || "Paket iklan radio"}</CardDescription>
            </CardHeader>

            <CardContent className="space-y-3">
              <p className="text-3xl font-bold">{formatRupiah(pkg.price)}</p>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p>{pkg.duration_days} hari</p>
                <p>{pkg.slot_count} slot per hari</p>
              </div>
            </CardContent>

            <CardFooter>
              <Button asChild className="w-full">
                <Link href={`/checkout/${pkg.id}`}>Pilih Paket</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
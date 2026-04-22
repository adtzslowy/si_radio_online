import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MidtransSnapScript } from "@/components/payments/snap-payment-midtrans"
import { PaySubscriptionButton } from "@/components/payments/pay-subscription-button"

function formatRupiah(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value)
}

export default async function CheckoutPackagePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: pkg, error } = await supabase
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
    .eq("id", id)
    .eq("is_active", true)
    .single()

  if (error || !pkg) {
    notFound()
  }

  // sementara: nanti pakai subscriptionId nyata dari flow create subscription
  const fakeSubscriptionId = "cb107a06-2d8d-438c-8300-ad703310784a"

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-10">
      <MidtransSnapScript />

      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Checkout Paket</h1>
        <p className="text-muted-foreground">
          Review detail paket sebelum melanjutkan pembayaran.
        </p>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>{pkg.name}</CardTitle>
          <CardDescription>{pkg.description || "Paket iklan radio"}</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <span className="text-muted-foreground">Harga</span>
            <span className="font-semibold">{formatRupiah(pkg.price)}</span>
          </div>

          <div className="flex items-center justify-between border-b pb-3">
            <span className="text-muted-foreground">Durasi</span>
            <span className="font-semibold">{pkg.duration_days} hari</span>
          </div>

          <div className="flex items-center justify-between pb-1">
            <span className="text-muted-foreground">Slot per hari</span>
            <span className="font-semibold">{pkg.slot_count} slot</span>
          </div>

          <div className="pt-4">
            <PaySubscriptionButton subscriptionId={fakeSubscriptionId} />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
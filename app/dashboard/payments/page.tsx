import { createClient } from "@/lib/supabase/server"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

function formatRupiah(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value)
}

export default async function PaymentsPage() {
  const supabase = await createClient()

  const { data: payments, error } = await supabase
    .from("payments")
    .select(`
      id,
      amount,
      due_date,
      paid_at,
      status,
      gateway,
      order_id,
      subscription_id
    `)
    .order("due_date", { ascending: false })

  if (error) {
    throw new Error(error.message)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Pembayaran</h1>
        <p className="text-sm text-muted-foreground">
          Pantau semua transaksi pembayaran iklan.
        </p>
      </div>

      <Card className="shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Gateway</TableHead>
                <TableHead>Nominal</TableHead>
                <TableHead>Jatuh Tempo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Dibayar</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {(payments ?? []).length > 0 ? (
                payments!.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell className="font-medium">{payment.order_id || "-"}</TableCell>
                    <TableCell className="uppercase">{payment.gateway || "-"}</TableCell>
                    <TableCell>{formatRupiah(Number(payment.amount))}</TableCell>
                    <TableCell>{payment.due_date || "-"}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          payment.status === "paid"
                            ? "default"
                            : payment.status === "expired"
                            ? "secondary"
                            : "outline"
                        }
                      >
                        {payment.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{payment.paid_at || "-"}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    Belum ada data pembayaran.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
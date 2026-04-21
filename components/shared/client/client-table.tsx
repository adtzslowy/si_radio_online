import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

type ClientItem = {
  id: string
  company_name: string
  address: string | null
  pic_name: string | null
  pic_phone: string | null
  status: "active" | "inactive"
  created_at: string
}

type ClientTableProps = {
  data: ClientItem[]
}

function formatDate(dateStr: string) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(dateStr))
}

function getInitials(name: string | null) {
  if (!name) return "?"
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase()
}

function StatusBadge({ status }: { status: "active" | "inactive" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium",
        status === "active"
          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
          : "bg-muted text-muted-foreground"
      )}
    >
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          status === "active" ? "bg-emerald-500" : "bg-muted-foreground/50"
        )}
      />
      {status === "active" ? "Aktif" : "Nonaktif"}
    </span>
  )
}

function Avatar({ name }: { name: string | null }) {
  return (
    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-50 text-[10px] font-semibold text-blue-600 dark:bg-blue-950 dark:text-blue-400">
      {getInitials(name)}
    </div>
  )
}

export function ClientTable({ data }: ClientTableProps) {
  if (data.length === 0) {
    return (
      <Card className="border-border/60 shadow-sm">
        <CardContent className="flex h-64 items-center justify-center p-6">
          <div className="text-center">
            <p className="text-sm font-medium text-foreground">
              Belum ada client yang terdaftar.
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Tambahkan client pertama untuk mulai mengelola iklan.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      {/* Mobile: card list */}
      <div className="flex flex-col gap-3 md:hidden">
        {data.map((client, index) => (
          <Card key={client.id} className="border-border/60 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">#{index + 1}</span>
                    <p className="truncate font-medium">{client.company_name}</p>
                  </div>
                  {client.address && (
                    <p className="mt-0.5 truncate text-xs text-muted-foreground">
                      {client.address}
                    </p>
                  )}
                </div>
                <StatusBadge status={client.status} />
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground">PIC</p>
                  <div className="mt-1 flex items-center gap-1.5">
                    <Avatar name={client.pic_name} />
                    <p className="font-medium">{client.pic_name || "-"}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">No. HP</p>
                  <p className="mt-1 font-medium tabular-nums">{client.pic_phone || "-"}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-muted-foreground">Tanggal Dibuat</p>
                  <p className="mt-1 font-medium">{formatDate(client.created_at)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Desktop: table */}
      <Card className="hidden border-border/60 shadow-sm md:block">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40">
                <TableHead className="w-12 text-center text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  No
                </TableHead>
                <TableHead className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Perusahaan
                </TableHead>
                <TableHead className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  PIC
                </TableHead>
                <TableHead className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  No. HP
                </TableHead>
                <TableHead className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Status
                </TableHead>
                <TableHead className="text-right text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Tanggal Dibuat
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((client, index) => (
                <TableRow key={client.id} className="hover:bg-muted/30">
                  <TableCell className="text-center text-sm text-muted-foreground">
                    {index + 1}
                  </TableCell>
                  <TableCell>
                    <p className="font-medium leading-snug">{client.company_name}</p>
                    {client.address && (
                      <p className="mt-0.5 text-xs text-muted-foreground">{client.address}</p>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar name={client.pic_name} />
                      <span className="text-sm">{client.pic_name || "-"}</span>
                    </div>
                  </TableCell>
                  <TableCell className="tabular-nums text-sm text-muted-foreground">
                    {client.pic_phone || "-"}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={client.status} />
                  </TableCell>
                  <TableCell className="text-right text-sm text-muted-foreground">
                    {formatDate(client.created_at)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  )
}
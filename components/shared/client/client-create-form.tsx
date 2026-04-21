"use client"

import { useFormStatus } from "react-dom"
import { createClientUser } from "@/app/dashboard/clients/actions"
import Link from "next/link"
import { ArrowLeft, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending} className="min-w-[130px]">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Menyimpan...
        </>
      ) : (
        "Simpan Client"
      )}
    </Button>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
      {children}
    </p>
  )
}

export function ClientCreateForm() {
  return (
    <Card className="mx-auto w-full max-w-7xl border-border/60 shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">Tambah Client</CardTitle>
        <CardDescription>
          Masukkan data client untuk layanan periklanan radio.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form action={createClientUser} className="space-y-8">

          {/* Section: Informasi Perusahaan */}
          <div className="space-y-4">
            <SectionLabel>Informasi Perusahaan</SectionLabel>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="companyName">
                  Nama Perusahaan <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="companyName"
                  name="companyName"
                  placeholder="PT Maju Jaya"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="address">Alamat</Label>
                <Input
                  id="address"
                  name="address"
                  placeholder="Jl. Sudirman No. 1"
                />
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-border/60" />

          {/* Section: PIC */}
          <div className="space-y-4">
            <SectionLabel>Person in Charge (PIC)</SectionLabel>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="fullName">
                  Nama PIC <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="fullName"
                  name="fullName"
                  placeholder="Budi Santoso"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="phone">No. HP</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="08123456789"
                />
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-border/60" />

          {/* Section: Akun */}
          <div className="space-y-4">
            <SectionLabel>Akun Login</SectionLabel>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="email">
                  Email <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="client@perusahaan.com"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="password">
                  Password Awal <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Min. 6 karakter"
                  required
                />
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Password dapat diubah oleh client setelah login pertama.
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between border-t border-border/60 pt-6">
            <Button asChild variant="ghost" size="sm">
              <Link href="/dashboard/clients">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Kembali
              </Link>
            </Button>
            <SubmitButton />
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
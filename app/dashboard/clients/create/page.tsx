import { ClientCreateForm } from "@/components/shared/client/client-create-form"

export default function CreateClientPage() {
  return (
    <div className="space-y-6">
      <div className="mx-auto w-full max-w-7xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Tambah Client
            </h1>
            <p className="text-sm text-muted-foreground">
              Tambahkan client baru ke sistem.
            </p>
          </div>
        </div>
      </div>

      <ClientCreateForm />
    </div>
  )
}
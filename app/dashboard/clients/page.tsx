import Link from "next/link";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ClientTable } from "@/components/shared/client/client-table";
import { ClientPagination } from "@/components/shared/client/client-pagination";
import { ClientPolling } from "@/components/shared/client/client-polling";
import { ClientSearch } from "@/components/shared/client/client-search";
import { createClient } from "@/lib/supabase/server";

type ClientsPageProps = {
  searchParams: Promise<{
    page?: string;
    q?: string;
  }>;
};

export default async function ClientsPage({ searchParams }: ClientsPageProps) {
  const supabase = await createClient();
  const params = await searchParams;

  const query = params.q?.trim() ?? "";
  const currentPage = Number(params.page ?? "1");
  const page = Number.isNaN(currentPage) || currentPage < 1 ? 1 : currentPage;
  const pageSize = 5;

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  console.log("SERVER query:", query); // tambah ini
  console.log("SERVER params:", params);

  let queryBuilder = supabase
    .from("clients")
    .select(
      `
        id,
        company_name,
        address,
        pic_name,
        pic_phone,
        status,
        created_at
      `,
      { count: "exact" },
    )
    .order("created_at", { ascending: false });

  if (query) {
    queryBuilder = queryBuilder.or(
      `company_name.ilike.%${query}%,pic_name.ilike.%${query}%,pic_phone.ilike.%${query}%`,
    );
  }

  const { data: clients, error, count } = await queryBuilder.range(from, to);

  if (error) {
    throw new Error(error.message);
  }

  const totalItems = count ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  return (
    <div className="space-y-4 px-4 py-4 md:space-y-6 md:px-0">
      <ClientPolling intervalMs={10000} />

      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight md:text-2xl">
            Client
          </h1>
          <p className="text-xs text-muted-foreground md:text-sm">
            Kelola data client yang berlangganan layanan iklan.
          </p>
        </div>
        <Button asChild size="sm" className="shrink-0 p-4 md:p-5">
          <Link href="/dashboard/clients/create">
            <Plus className="h-4 w-4 md:mr-2" />
            <span className="hidden md:inline">Tambah Client</span>
          </Link>
        </Button>
      </div>

      {/* Search + Total */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <ClientSearch />
        <p className="text-xs text-muted-foreground md:text-sm">
          Total {totalItems} client
        </p>
      </div>

      <ClientTable data={clients ?? []} />

      <ClientPagination
        currentPage={page}
        totalPages={totalPages}
        query={query}
      />
    </div>
  );
}

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

type ClientPaginationProps = {
  currentPage: number
  totalPages: number
  query?: string
}

function createPageUrl(page: number, query?: string) {
  const params = new URLSearchParams()
  if (query) params.set("q", query)
  params.set("page", String(page))
  return `/dashboard/clients?${params.toString()}`
}

export function ClientPagination({
  currentPage,
  totalPages,
  query,
}: ClientPaginationProps) {
  if (totalPages <= 1) return null

  const pages: (number | "ellipsis")[] = []

  if (totalPages <= 5) {
    for (let i = 1; i <= totalPages; i++) pages.push(i)
  } else {
    if (currentPage <= 3) {
      pages.push(1, 2, 3, 4, "ellipsis", totalPages)
    } else if (currentPage >= totalPages - 2) {
      pages.push(1, "ellipsis", totalPages - 3, totalPages - 2, totalPages - 1, totalPages)
    } else {
      pages.push(1, "ellipsis", currentPage - 1, currentPage, currentPage + 1, "ellipsis", totalPages)
    }
  }

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border/60 bg-background px-4 py-3 shadow-sm md:flex-row md:items-center md:justify-between">
      <p className="whitespace-nowrap text-sm text-muted-foreground">
        Halaman{" "}
        <span className="font-medium text-foreground">{currentPage}</span>{" "}
        dari{" "}
        <span className="font-medium text-foreground">{totalPages}</span>
      </p>

      <Pagination className="md:justify-end">
        <PaginationContent className="gap-1">
          <PaginationItem>
            <PaginationPrevious
              href={currentPage > 1 ? createPageUrl(currentPage - 1, query) : "#"}
              aria-disabled={currentPage <= 1}
              className={currentPage <= 1 ? "pointer-events-none opacity-40" : ""}
            />
          </PaginationItem>

          {pages.map((page, index) =>
            page === "ellipsis" ? (
              <PaginationItem key={`ellipsis-${index}`} className="hidden sm:flex">
                <PaginationEllipsis />
              </PaginationItem>
            ) : (
              <PaginationItem
                key={page}
                className={page !== currentPage ? "hidden sm:flex" : ""}
              >
                <PaginationLink
                  href={createPageUrl(page, query)}
                  isActive={page === currentPage}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            )
          )}

          <PaginationItem>
            <PaginationNext
              href={currentPage < totalPages ? createPageUrl(currentPage + 1, query) : "#"}
              aria-disabled={currentPage >= totalPages}
              className={currentPage >= totalPages ? "pointer-events-none opacity-40" : ""}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}
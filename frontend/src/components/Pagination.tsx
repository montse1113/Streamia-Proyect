interface PaginationProps {
    page: number
    totalPages: number
    onPageChange: (page: number) => void
}

// Same look for both buttons; disabled: styles the first and last page
const buttonClass = 'rounded-lg border border-slate-400 px-4 py-2 hover:bg-slate-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent'

export function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
    if (totalPages <= 1) return null

    return (
        <nav className="mt-8 flex items-center justify-center gap-4" aria-label="Catalog pages">
            <button type="button" onClick={() => onPageChange(page - 1)} disabled={page <= 1} className={buttonClass}>
                Previous
            </button>
            <span className="text-sm">
                Page {page} of {totalPages}
            </span>
            <button type="button" onClick={() => onPageChange(page + 1)} disabled={page >= totalPages} className={buttonClass}>
                Next
            </button>
        </nav>
    )
}
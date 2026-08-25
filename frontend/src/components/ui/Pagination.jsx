import {
    ChevronLeft,
    ChevronRight
} from 'lucide-react';

export default function Pagination({
    page,
    totalPages,
    total,
    disabled = false,
    onPageChange
}) {
    if (
        totalPages <= 1
    ) {
        return (
            <div
                className="
          text-sm
          text-muted
        "
            >
                Total {total} data
            </div>
        );
    }

    const previousDisabled =
        disabled ||
        page <= 1;

    const nextDisabled =
        disabled ||
        page >= totalPages;

    return (
        <div
            className="
        flex
        flex-col
        gap-3
        sm:flex-row
        sm:items-center
        sm:justify-between
      "
        >
            <p
                className="
          text-sm
          text-muted
        "
            >
                Halaman
                {' '}
                <strong
                    className="text-text"
                >
                    {page}
                </strong>
                {' '}
                dari
                {' '}
                <strong
                    className="text-text"
                >
                    {totalPages}
                </strong>

                {' • '}

                {total} data
            </p>

            <div
                className="
          flex
          items-center
          gap-2
        "
            >
                <button
                    type="button"
                    disabled={
                        previousDisabled
                    }
                    onClick={() =>
                        onPageChange(
                            page - 1
                        )
                    }
                    className="
            inline-flex
            min-h-10
            items-center
            gap-1.5
            rounded-xl
            border
            border-border
            bg-surface
            px-3
            text-sm
            font-semibold
            text-text
            transition
            hover:bg-background
            disabled:pointer-events-none
            disabled:opacity-50
          "
                >
                    <ChevronLeft
                        size={17}
                    />

                    Sebelumnya
                </button>

                <button
                    type="button"
                    disabled={
                        nextDisabled
                    }
                    onClick={() =>
                        onPageChange(
                            page + 1
                        )
                    }
                    className="
            inline-flex
            min-h-10
            items-center
            gap-1.5
            rounded-xl
            bg-primary
            px-3
            text-sm
            font-semibold
            text-white
            transition
            hover:bg-primary-dark
            disabled:pointer-events-none
            disabled:opacity-50
          "
                >
                    Selanjutnya

                    <ChevronRight
                        size={17}
                    />
                </button>
            </div>
        </div>
    );
}
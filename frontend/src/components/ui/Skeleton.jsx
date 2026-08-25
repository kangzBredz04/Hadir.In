export function Skeleton({
    className = ''
}) {
    return (
        <div
            className={`
        animate-pulse
        rounded-lg
        bg-slate-200
        ${className}
      `}
            aria-hidden="true"
        />
    );
}

export function CardSkeleton() {
    return (
        <div
            className="
        rounded-2xl
        border
        border-border
        bg-surface
        p-5
      "
        >
            <div
                className="
          flex
          items-start
          justify-between
          gap-4
        "
            >
                <div className="flex-1">
                    <Skeleton
                        className="
              h-4
              w-28
            "
                    />

                    <Skeleton
                        className="
              mt-4
              h-8
              w-20
            "
                    />

                    <Skeleton
                        className="
              mt-3
              h-3
              w-36
            "
                    />
                </div>

                <Skeleton
                    className="
            h-11
            w-11
            rounded-xl
          "
                />
            </div>
        </div>
    );
}

export function TableSkeleton({
    rows = 5,
    columns = 5
}) {
    return (
        <div
            className="
        w-full
        overflow-hidden
      "
            role="status"
            aria-label="Memuat data"
        >
            {Array.from({
                length: rows
            }).map((_, rowIndex) => (
                <div
                    key={rowIndex}
                    className="
            grid
            gap-4
            border-b
            border-border
            px-5
            py-4
            last:border-b-0
          "
                    style={{
                        gridTemplateColumns:
                            `repeat(${columns}, minmax(0, 1fr))`
                    }}
                >
                    {Array.from({
                        length: columns
                    }).map(
                        (_, columnIndex) => (
                            <Skeleton
                                key={columnIndex}
                                className="h-4"
                            />
                        )
                    )}
                </div>
            ))}

            <span className="sr-only">
                Memuat data...
            </span>
        </div>
    );
}
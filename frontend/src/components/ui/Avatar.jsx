function getInitials(
    name = ''
) {
    return name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map(
            word =>
                word
                    .charAt(0)
                    .toUpperCase()
        )
        .join('');
}

export default function Avatar({
    name,
    size = 'md'
}) {
    const sizes = {
        sm:
            'h-9 w-9 text-xs',

        md:
            'h-11 w-11 text-sm',

        lg:
            'h-16 w-16 text-lg'
    };

    return (
        <div
            className={`
        flex
        shrink-0
        items-center
        justify-center
        rounded-full
        bg-primary-light
        font-bold
        text-primary-dark
        ${sizes[size] ?? sizes.md}
      `}
            aria-label={
                `Avatar ${name ?? ''}`
            }
        >
            {getInitials(name) ||
                'U'}
        </div>
    );
}
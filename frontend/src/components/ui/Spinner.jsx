export default function Spinner({ size = 'md', className = '' }) {
  const sizes = {
    sm: 'size-4 border-2',
    md: 'size-6 border-[3px]',
    lg: 'size-9 border-4',
  };

  return (
    <span
      aria-hidden="true"
      className={`inline-block animate-spin rounded-full border-current border-r-transparent ${sizes[size]} ${className}`}
    />
  );
}

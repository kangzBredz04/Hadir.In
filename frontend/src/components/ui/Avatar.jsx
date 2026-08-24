function getInitials(name) {
  return String(name || 'User')
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
}

export default function Avatar({ name, imageUrl, size = 'md', className = '' }) {
  const sizes = {
    sm: 'size-9 text-xs',
    md: 'size-11 text-sm',
    lg: 'size-16 text-lg',
    xl: 'size-24 text-2xl',
  };

  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={`Foto profil ${name || 'pengguna'}`}
        className={`shrink-0 rounded-2xl object-cover ${sizes[size]} ${className}`}
      />
    );
  }

  return (
    <span
      aria-label={`Avatar ${name || 'pengguna'}`}
      className={`grid shrink-0 place-items-center rounded-2xl bg-primary-light font-bold text-primary-dark ${sizes[size]} ${className}`}
    >
      {getInitials(name)}
    </span>
  );
}

import { Inbox } from 'lucide-react';

export default function EmptyState({
  title = 'Belum ada data',
  message = 'Data akan ditampilkan ketika sudah tersedia.',
  icon: Icon = Inbox,
}) {
  return (
    <div className="rounded-card border border-dashed border-border bg-white p-8 text-center sm:p-12">
      <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-primary-light text-primary">
        <Icon aria-hidden="true" size={26} />
      </span>
      <h3 className="mt-5 font-bold text-primary-dark">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-ink-muted">{message}</p>
    </div>
  );
}

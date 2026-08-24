import { CheckCircle2, Clock3, XCircle } from 'lucide-react';

const variants = {
  success: { className: 'bg-success-light text-success', Icon: CheckCircle2 },
  warning: { className: 'bg-warning-light text-warning', Icon: Clock3 },
  danger: { className: 'bg-danger-light text-danger', Icon: XCircle },
};

export default function Badge({ children, variant = 'success' }) {
  const { className, Icon } = variants[variant];

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${className}`}>
      <Icon aria-hidden="true" size={15} strokeWidth={2.25} />
      {children}
    </span>
  );
}

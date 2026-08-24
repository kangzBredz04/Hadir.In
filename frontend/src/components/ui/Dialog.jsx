import { AlertTriangle } from 'lucide-react';
import Button from './Button.jsx';
import Modal from './Modal.jsx';

export default function Dialog({ open, onClose, onConfirm, title, message, confirmLabel = 'Konfirmasi', loading = false }) {
  return (
    <Modal open={open} onClose={onClose} title={title} size="sm">
      <div className="flex gap-4">
        <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-warning-light text-warning"><AlertTriangle aria-hidden="true" size={22} /></span>
        <p className="pt-1 text-sm leading-6 text-ink-muted">{message}</p>
      </div>
      <div className="mt-6 flex justify-end gap-2">
        <Button variant="secondary" onClick={onClose} disabled={loading}>Batal</Button>
        <Button onClick={onConfirm} disabled={loading} className="bg-danger hover:bg-red-700 focus-visible:ring-danger/30">
          {loading ? 'Memproses...' : confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}

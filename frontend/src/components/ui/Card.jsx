export default function Card({ children, className = '' }) {
  return (
    <section className={`rounded-card border border-border bg-surface shadow-card ${className}`}>
      {children}
    </section>
  );
}

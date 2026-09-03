interface StepListProps {
  title?: string;
  steps: readonly string[];
}

export function StepList({ title, steps }: StepListProps) {
  return (
    <section>
      {title ? <h2>{title}</h2> : null}
      <div className="step-grid">
        {steps.map((step, index) => (
          <article key={step} className="card step-card">
            <p className="step-index">{String(index + 1).padStart(2, "0")}</p>
            <p>{step}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

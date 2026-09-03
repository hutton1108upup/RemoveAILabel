interface QuickAnswerCardProps {
  title?: string;
  answer: string;
}

export function QuickAnswerCard({
  title = "Quick Answer",
  answer,
}: QuickAnswerCardProps) {
  return (
    <section className="card card-accent">
      <p className="eyebrow">{title}</p>
      <p className="body-large">{answer}</p>
    </section>
  );
}

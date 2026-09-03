interface EvidenceNoteProps {
  text: string;
}

export function EvidenceNote({ text }: EvidenceNoteProps) {
  return <p className="evidence-note">{text}</p>;
}

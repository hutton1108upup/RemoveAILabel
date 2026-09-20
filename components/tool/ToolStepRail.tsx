const steps = [
  "Add final file",
  "Clean supported fields",
  "Verify copy",
  "Download",
] as const;

export function ToolStepRail() {
  return (
    <ol className="tool-step-rail" aria-label="Completed cleanup steps">
      {steps.map((step, index) => (
        <li key={step}>
          <span className="tool-step-number" aria-hidden="true">
            {index + 1}
          </span>
          <span>{step}</span>
        </li>
      ))}
    </ol>
  );
}

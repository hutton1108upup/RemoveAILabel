export function containsConfirmedAiXmp(xml: string): boolean {
  if (/(?:<|\s|:)(?:prompt|negative[_-]?prompt|workflow|comfyui)(?:\s|=|>|:)/i.test(xml)) {
    return true;
  }
  if (
    /(?:xmlns:[\w.-]+\s*=\s*["'][^"']*(?:comfyui|stable[-_ ]?diffusion|automatic1111|invokeai|fooocus|generative(?:ai)?)|<(?:comfyui|stable[-_.]?diffusion|automatic1111|invokeai|fooocus|generative(?:ai)?):)/i.test(xml)
  ) {
    return true;
  }
  const fields = new Set<string>();
  const fieldPattern = /(?:<\/?(?:[\w.-]+:)?|\s(?:[\w.-]+:)?|\b)(model|seed|sampler|steps|lora)(?=\s|=|>|\/|:)/gi;
  for (const match of xml.matchAll(fieldPattern)) fields.add(match[1].toLowerCase());
  return fields.has("model") && ["seed", "sampler", "steps", "lora"].some((field) => fields.has(field));
}

export function extendedXmpGuid(xml: string): string | undefined {
  return /(?:xmpNote:)?HasExtendedXMP\s*=\s*["']([A-Fa-f0-9]{32})["']/.exec(xml)?.[1]?.toUpperCase();
}

/**
 * Minimal, safe markdown for chat bubbles: escapes HTML first, then supports
 * **bold** and line breaks. Anything fancier stays plain text on purpose.
 */
export function mdLite(text: string): string {
  const escaped = text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
  return escaped
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\n/g, "<br/>");
}

type Attrs = Record<string, string | boolean | undefined>;
type Child = Node | string | null | undefined | false;

/** Small element builder. Text goes in as text nodes, never as HTML. */
export function el<K extends keyof HTMLElementTagNameMap>(tag: K, attrs: Attrs = {}, children: Child[] = []): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  for (const [name, value] of Object.entries(attrs)) {
    if (value === false || value === undefined) continue;
    node.setAttribute(name, value === true ? '' : value);
  }
  for (const child of children) {
    if (child === null || child === undefined || child === false) continue;
    node.append(child);
  }
  return node;
}

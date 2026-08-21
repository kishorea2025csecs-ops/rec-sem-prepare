import { useCallback, useRef, useState } from "react";
import { Languages, Loader2 } from "lucide-react";
import { translateToTamil } from "@/lib/i18n.functions";

const SKIP_TAGS = new Set(["SCRIPT", "STYLE", "NOSCRIPT", "CODE", "PRE", "SVG", "CANVAS"]);

function collectTextNodes(): Text[] {
  const nodes: Text[] = [];
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const text = node.nodeValue?.trim() ?? "";
      if (text.length < 2 || text.length > 600) return NodeFilter.FILTER_REJECT;
      if (!/[a-zA-Z]/.test(text)) return NodeFilter.FILTER_REJECT;
      const parent = (node as Text).parentElement;
      if (!parent || SKIP_TAGS.has(parent.tagName)) return NodeFilter.FILTER_REJECT;
      if (parent.closest("[data-no-translate]")) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    },
  });
  let current = walker.nextNode();
  while (current) {
    nodes.push(current as Text);
    current = walker.nextNode();
  }
  return nodes;
}

export const TranslateToggle = ({ compact = false }: { compact?: boolean }) => {
  const [tamil, setTamil] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const originals = useRef<Map<Text, string>>(new Map());

  const restore = useCallback(() => {
    originals.current.forEach((value, node) => {
      if (node.isConnected) node.nodeValue = value;
    });
    originals.current.clear();
    setTamil(false);
  }, []);

  const translate = useCallback(async () => {
    setBusy(true);
    setError(null);
    try {
      const nodes = collectTextNodes();
      const unique = new Map<string, Text[]>();
      for (const node of nodes) {
        const key = (node.nodeValue ?? "").trim();
        const list = unique.get(key);
        if (list) list.push(node);
        else unique.set(key, [node]);
      }
      const keys = [...unique.keys()];
      const dictionary = new Map<string, string>();
      const CHUNK = 60;
      for (let i = 0; i < keys.length; i += CHUNK) {
        const chunk = keys.slice(i, i + CHUNK);
        const res = await translateToTamil({ data: { texts: chunk } });
        chunk.forEach((k, idx) => dictionary.set(k, res.items[idx] ?? k));
      }
      for (const [key, list] of unique) {
        const translated = dictionary.get(key);
        if (!translated || translated === key) continue;
        for (const node of list) {
          if (!originals.current.has(node)) originals.current.set(node, node.nodeValue ?? "");
          node.nodeValue = (node.nodeValue ?? "").replace(key, translated);
        }
      }
      setTamil(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Translation failed");
    } finally {
      setBusy(false);
    }
  }, []);

  return (
    <div className="flex items-center gap-2" data-no-translate>
      <button
        type="button"
        onClick={() => (tamil ? restore() : translate())}
        disabled={busy}
        title={tamil ? "Switch back to English" : "Translate this page to Tamil"}
        className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-[10px] font-black uppercase tracking-[0.15em] backdrop-blur-md transition-all disabled:opacity-60 ${
          tamil
            ? "border-cyan-400/40 bg-cyan-500/15 text-cyan-300"
            : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
        }`}
      >
        {busy ? <Loader2 className="size-3.5 animate-spin" /> : <Languages className="size-3.5" />}
        <span className={compact ? "hidden sm:inline" : ""}>{tamil ? "English" : "தமிழ்"}</span>
      </button>
      {error && <span className="text-[10px] text-red-400">{error}</span>}
    </div>
  );
};

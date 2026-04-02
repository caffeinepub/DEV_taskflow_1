import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface TagInputProps {
  tags: string[];
  allTags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
}

export function TagInput({
  tags,
  allTags,
  onChange,
  placeholder = "Add tag…",
}: TagInputProps) {
  const [input, setInput] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const suggestions = input.trim()
    ? allTags
        .filter(
          (t) =>
            t.toLowerCase().includes(input.toLowerCase()) && !tags.includes(t),
        )
        .slice(0, 6)
    : [];

  // Reset active index when suggestion list changes size
  const prevSugLen = useRef(suggestions.length);
  if (prevSugLen.current !== suggestions.length) {
    prevSugLen.current = suggestions.length;
    setActiveIdx(0);
  }

  const addTag = (raw: string) => {
    const tag = raw.trim().toLowerCase().replace(/,/g, "").replace(/\s+/g, "-");
    if (!tag || tags.includes(tag)) {
      setInput("");
      setShowSuggestions(false);
      return;
    }
    onChange([...tags, tag]);
    setInput("");
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const removeTag = (tag: string) => {
    onChange(tags.filter((t) => t !== tag));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      if (showSuggestions && suggestions[activeIdx]) {
        addTag(suggestions[activeIdx]);
      } else {
        addTag(input);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, 0));
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
    } else if (e.key === "Backspace" && !input && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    }
  };

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative"
      data-ocid="tag-input-container"
    >
      <div className="flex flex-wrap gap-1.5 min-h-7 px-2 py-1 rounded-md bg-secondary border border-transparent focus-within:border-input transition-colors-fast">
        {tags.map((tag) => (
          <Badge
            key={tag}
            variant="secondary"
            className="h-5 px-2 text-[11px] font-mono gap-1 bg-accent/15 text-primary border border-primary/20 shrink-0"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="hover:text-destructive transition-colors-fast"
              aria-label={`Remove tag ${tag}`}
              data-ocid={`tag-remove-${tag}`}
            >
              <X className="w-2.5 h-2.5" />
            </button>
          </Badge>
        ))}
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setShowSuggestions(true);
          }}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowSuggestions(true)}
          placeholder={tags.length === 0 ? placeholder : ""}
          className="flex-1 min-w-20 bg-transparent outline-none text-xs text-foreground placeholder:text-muted-foreground py-0.5"
          data-ocid="tag-input"
          aria-label="Add tag"
          aria-autocomplete="list"
          aria-expanded={showSuggestions && suggestions.length > 0}
        />
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-md shadow-elevated z-50 overflow-hidden animate-slide-up">
          {suggestions.map((sug, i) => (
            <button
              key={sug}
              type="button"
              className={`w-full text-left px-3 py-1.5 text-xs font-mono transition-colors-fast ${
                i === activeIdx
                  ? "bg-accent/20 text-primary"
                  : "text-foreground hover:bg-secondary"
              }`}
              onMouseDown={(e) => {
                e.preventDefault();
                addTag(sug);
              }}
              onMouseEnter={() => setActiveIdx(i)}
              data-ocid={`tag-suggestion-${sug}`}
            >
              {sug}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

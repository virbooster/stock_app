"use client";

import { useTheme } from "./ThemeProvider";
import { Palette, Check } from "lucide-react";

export function ThemeSelector() {
  const { theme, setTheme } = useTheme();

  const themes = [
    { id: "modern", name: "Modern SaaS", desc: "Indigo & Clean" },
    { id: "minimalist", name: "Minimalist", desc: "B&W Mono" },
    { id: "corporate", name: "Corporate Steel", desc: "Navy & Slate" },
  ] as const;

  return (
    <div className="mt-8 pt-8 border-t border-[var(--border)] px-2">
      <div className="flex items-center gap-2 mb-4 px-2 text-[var(--text-muted)] text-xs font-semibold uppercase tracking-wider">
        <Palette size={14} /> Style Presets
      </div>
      <div className="space-y-1">
        {themes.map((t) => (
          <button
            key={t.id}
            onClick={() => setTheme(t.id)}
            className={`w-full text-left p-2 rounded-md transition-all group ${
              theme === t.id 
                ? "bg-[var(--primary)] text-white shadow-sm" 
                : "hover:bg-[var(--bg-app)] text-[var(--text-muted)] hover:text-[var(--text-main)]"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{t.name}</span>
              {theme === t.id && <Check size={14} />}
            </div>
            <div className={`text-[10px] mt-0.5 ${theme === t.id ? "text-white/80" : "text-[var(--text-muted)]"}`}>
              {t.desc}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

import { Check } from "lucide-react";

import { StyleMosaicIcon } from "./style-mosaic-icon";

const perks = ["No sign up", "No limits", "Just creativity!"];

export function TotallyFreeBanner() {
  return (
    <div
      className="flex items-center justify-between gap-3 rounded-2xl p-4 text-white shadow-[0_18px_40px_rgba(30,202,216,0.24)]"
      style={{ background: "var(--free-gradient)" }}
    >
      <div>
        <p className="text-sm font-bold">Totally Free</p>
        <ul className="mt-1.5 space-y-1">
          {perks.map((perk) => (
            <li key={perk} className="flex items-center gap-1.5 text-xs text-white/90">
              <Check size={11} strokeWidth={3} />
              {perk}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/20">
        <StyleMosaicIcon primary="#16c2a3" secondary="#7c5cfc" className="h-9 w-9" />
      </div>
    </div>
  );
}

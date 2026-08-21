import { useState } from "react";
import { useGame } from "@/game/store";
import { Btn } from "./ui";
import { cn } from "@/lib/utils";

const MEDALS = ["🥇", "🥈", "🥉"];

export function Scoreboard({
  editable = true,
  compact = false,
}: {
  editable?: boolean;
  compact?: boolean;
}) {
  const { rankedBySection, adjustScore, lastChangedPlayer } = useGame();
  const [customValue, setCustomValue] = useState("");
  const [target, setTarget] = useState<string>("");
  const [open, setOpen] = useState(true);

  return (
    <aside className="card-surface p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-extrabold">لوحة النقاط</h3>
        <button
          onClick={() => setOpen((v) => !v)}
          className="text-sm text-muted-foreground md:hidden"
        >
          {open ? "إخفاء" : "إظهار"}
        </button>
      </div>

      <div className={cn("mt-3 space-y-2", !open && "hidden md:block")}>
        {rankedBySection.map((p, i) => (
          <div
            key={p.id}
            className={cn(
              "flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border/60 bg-secondary/40 px-3 py-2 transition-colors",
              lastChangedPlayer === p.id && "border-primary bg-primary/10",
            )}
          >
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="w-6 text-center text-sm">{MEDALS[i] ?? i + 1}</span>
                <span className="font-bold">{p.name}</span>
              </div>
              <span className="text-xs text-muted-foreground mt-0.5 ms-8 font-bold">
                🏆 {p.sectionsWon} جولات
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "min-w-10 text-center text-lg font-extrabold text-primary",
                  lastChangedPlayer === p.id && "animate-score-bump",
                )}
              >
                {p.currentSectionScore}
              </span>
              {editable && !compact ? (
                <div className="flex gap-1">
                  {[-2, -1, 1, 2].map((d) => (
                    <button
                      key={d}
                      onClick={() => adjustScore(p.id, d)}
                      className="h-7 w-8 rounded-md border border-border text-xs font-bold transition-colors hover:border-primary hover:text-primary"
                    >
                      {d > 0 ? `+${d}` : d}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        ))}

        {editable && !compact ? (
          <div className="mt-3 rounded-lg border border-dashed border-border p-3">
            <p className="mb-2 text-xs text-muted-foreground">تعديل مخصص</p>
            <div className="flex flex-wrap gap-2">
              <select
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                className="flex-1 rounded-md border border-input bg-background px-2 py-1.5 text-sm"
              >
                <option value="">اختر لاعب</option>
                {rankedBySection.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
              <input
                value={customValue}
                onChange={(e) => setCustomValue(e.target.value)}
                inputMode="numeric"
                placeholder="±"
                className="w-20 rounded-md border border-input bg-background px-2 py-1.5 text-sm"
              />
              <Btn
                size="sm"
                disabled={!target || !customValue || Number.isNaN(Number(customValue))}
                onClick={() => {
                  adjustScore(target, Number(customValue));
                  setCustomValue("");
                }}
              >
                تطبيق
              </Btn>
            </div>
          </div>
        ) : null}
      </div>
    </aside>
  );
}

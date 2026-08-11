import { useState } from "react";
import { useGame, type SectionId } from "@/game/store";
import { Btn, Confirm } from "@/components/game/ui";
import { Scoreboard } from "@/components/game/Scoreboard";

export const SECTIONS: { id: SectionId; icon: string; name: string; desc: string }[] = [
  {
    id: "trivia",
    icon: "🧠",
    name: "إنت بتقول إيه؟",
    desc: "اختيارات + مؤقت + قدرات خاصة",
  },
  { id: "closest", icon: "🎯", name: "نشّنت يا فالح", desc: "أسئلة رقمية والأقرب يكسب" },
  { id: "different", icon: "🎬", name: "اعمل الصح", desc: "إجابات مختلفة والحكم يدير النتيجة" },
  { id: "top10", icon: "🔢", name: "الواحد ربك هو الواحد", desc: "قوائم Top 10 واكتشف العناصر" },
];

export function SectionSelectScreen() {
  const { playedSections, openSection, setScreen } = useGame();
  const [replay, setReplay] = useState<SectionId | null>(null);
  const [endOpen, setEndOpen] = useState(false);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-4xl font-extrabold">اختر الفقرة</h2>
          <p className="text-muted-foreground">الحكم بيختار الفقرة الجاية.</p>
        </div>
        <Btn variant="ghost" onClick={() => setEndOpen(true)}>
          إنهاء اللعبة
        </Btn>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="grid gap-4 sm:grid-cols-2">
          {SECTIONS.map((s) => {
            const played = playedSections.includes(s.id);
            return (
              <button
                key={s.id}
                onClick={() => (played ? setReplay(s.id) : openSection(s.id))}
                className="card-surface group text-right transition-all duration-200 hover:-translate-y-1 hover:border-primary hover:shadow-[var(--shadow-glow)]"
              >
                <div className="p-5">
                  <div className="text-4xl">{s.icon}</div>
                  <h3 className="mt-3 text-2xl font-extrabold">{s.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{s.desc}</p>
                  <span
                    className={
                      played
                        ? "mt-4 inline-block rounded-full bg-success/15 px-3 py-1 text-xs font-bold text-success"
                        : "mt-4 inline-block rounded-full bg-primary/15 px-3 py-1 text-xs font-bold text-primary"
                    }
                  >
                    {played ? "✓ تم لعبها" : "متاحة"}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
        <Scoreboard />
      </div>

      <Confirm
        open={replay !== null}
        title="الفقرة دي اتلعبت قبل كده"
        description="عايز تلعبها تاني؟ الأسئلة هتتغير."
        confirmLabel="آه، إعادة"
        onConfirm={() => {
          const id = replay!;
          setReplay(null);
          openSection(id);
        }}
        onCancel={() => setReplay(null)}
      />

      <Confirm
        open={endOpen}
        title="إنهاء اللعبة؟"
        description="هننتقل للنتيجة النهائية."
        confirmLabel="إنهاء"
        onConfirm={() => {
          setEndOpen(false);
          setScreen("final");
        }}
        onCancel={() => setEndOpen(false)}
      />
    </div>
  );
}

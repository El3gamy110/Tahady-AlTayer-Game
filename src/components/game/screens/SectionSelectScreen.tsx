import { useState } from "react";
import { useGame, type SectionId } from "@/game/store";
import { Btn, Confirm } from "@/components/game/ui";
import { Scoreboard } from "@/components/game/Scoreboard";

import nashentImg from "@/assets/nashent_ya_fale7.jpg";
import e3m3lImg from "@/assets/e3m3l_elsa7.jpg";
import entaImg from "@/assets/enta_bt2ol_eh.jpg";
import top10Img from "@/assets/top10_game.jpg";

export const SECTIONS: {
  id: SectionId;
  icon: string;
  name: string;
  desc: string;
  gradient: string;
  image: string;
}[] = [
  {
    id: "trivia",
    icon: "🧠",
    name: "إنت بتقول إيه؟",
    desc: "اختيارات + مؤقت + قدرات خاصة",
    gradient: "var(--gradient-blue)",
    image: entaImg,
  },
  { id: "closest", icon: "🎯", name: "نشّنت يا فالح", desc: "أسئلة رقمية والأقرب يكسب", gradient: "var(--gradient-red)", image: nashentImg },
  { id: "different", icon: "🎬", name: "اعمل الصح", desc: "إجابات مختلفة والحكم يدير النتيجة", gradient: "var(--gradient-purple)", image: e3m3lImg },
  { id: "top10", icon: "🔢", name: "الواحد ربك هو الواحد", desc: "قوائم Top 10 واكتشف العناصر", gradient: "var(--gradient-green)", image: top10Img },
];

export function SectionSelectScreen() {
  const { playedSections, openSection, setScreen } = useGame();
  const [replay, setReplay] = useState<SectionId | null>(null);
  const [endOpen, setEndOpen] = useState(false);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-gold-gradient text-4xl font-extrabold">اختر الفقرة</h2>
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
                className="card-pop group relative overflow-hidden text-right transition-all duration-150 hover:border-primary active:translate-y-1"
              >
                <div
                  className="absolute inset-0 z-0 bg-[length:100%_100%] bg-no-repeat bg-center opacity-30 blur-[2px] transition-all group-hover:opacity-40 group-hover:scale-105"
                  style={{ backgroundImage: `url(${s.image})` }}
                />
                <div className="relative z-10 flex h-full flex-col bg-black/40">
                  <div
                    className="flex items-center gap-3 px-5 py-4"
                  >
                    <span className="text-4xl">{s.icon}</span>
                    <h3 className="text-stroke-dark text-2xl font-extrabold">{s.name}</h3>
                  </div>
                  <div className="p-5">
                    <p className="text-sm text-foreground/90 font-bold">{s.desc}</p>
                    <span
                      className={
                        played
                          ? "mt-4 inline-block rounded-full border-2 border-success/60 bg-success/30 px-3 py-1 text-xs font-extrabold text-white backdrop-blur-sm"
                          : "mt-4 inline-block rounded-full border-2 border-primary/60 bg-primary/30 px-3 py-1 text-xs font-extrabold text-white backdrop-blur-sm"
                      }
                    >
                      {played ? "✓ تم لعبها" : "متاحة"}
                    </span>
                  </div>
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

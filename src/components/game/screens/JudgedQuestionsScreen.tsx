import { useState } from "react";
import { useGame } from "@/game/store";
import { Btn, Confirm, GameHeader } from "@/components/game/ui";
import { Scoreboard } from "@/components/game/Scoreboard";

export function JudgedQuestionsScreen({ mode }: { mode: "closest" | "different" }) {
  const { closest, different, nextClosest, nextDifferent, finishSection } = useGame();
  const state = mode === "closest" ? closest : different;
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);

  if (!state) return null;
  const total = state.questions.length;
  const current = state.questions[state.index] as
    | { question: string; answer?: string | number; unit?: string }
    | undefined;
  const isLast = state.index >= total - 1;

  const advance = () => {
    setShowAnswer(false);
    if (isLast) {
      finishSection();
      return;
    }
    if (mode === "closest") nextClosest();
    else nextDifferent();
  };

  const title = mode === "closest" ? "🎯 نشّنت يا فالح" : "🎬 اعمل الصح";
  const hint =
    mode === "closest"
      ? "الحكم بياخد التخمينات من اللاعبين، والأقرب يكسب."
      : "الحكم بيسمع الإجابات، واللي إجابته مختلفة يكسب.";

  const formatAnswer = (ans: string | number, unit?: string) => {
    if (!unit || unit === "year" || unit === "number") return ans;
    if (unit === "meters") return `${ans} متر`;
    if (unit === "km") return `${ans} كم`;
    if (unit === "km2") return `${ans} كم²`;
    return `${ans} ${unit}`;
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8">
      <GameHeader title={title} subtitle={`السؤال ${state.index + 1} من ${total}`} />

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div>
          <div className="mb-4 flex gap-1.5">
            {state.questions.map((_, i) => (
              <div
                key={i}
                className={
                  i <= state.index
                    ? "h-1.5 flex-1 rounded-full bg-primary"
                    : "h-1.5 flex-1 rounded-full bg-secondary"
                }
              />
            ))}
          </div>

          <div className="card-pop animate-pop-in p-8" key={state.index}>
            <p className="text-sm text-muted-foreground">{hint}</p>
            <h2 className="mt-6 text-2xl sm:text-4xl font-extrabold leading-snug">{current?.question}</h2>

            {mode === "closest" && current && "answer" in current ? (
              <div className="mt-8">
                {showAnswer ? (
                  <p className="btn-3d rounded-2xl bg-[image:var(--gradient-green)] px-6 py-4 text-2xl font-extrabold text-foreground shadow-[inset_0_2px_0_rgba(255,255,255,0.4),0_2px_0_rgba(0,0,0,0.35)]">
                    الإجابة: {formatAnswer(current.answer!, current.unit)}
                  </p>
                ) : (
                  <Btn variant="outline" onClick={() => setShowAnswer(true)}>
                    👁️ اكشف الإجابة
                  </Btn>
                )}
              </div>
            ) : null}

            <div className="mt-8 flex flex-wrap gap-3">
              <Btn size="lg" onClick={() => setConfirmOpen(true)}>
                {isLast ? "إنهاء الفقرة" : "السؤال التالي"}
              </Btn>
            </div>
          </div>
        </div>
        <Scoreboard />
      </div>

      <Confirm
        open={confirmOpen}
        title="هل يوجد تعديل على النتيجة؟"
        confirmLabel="لا، كمّل"
        cancelLabel="تعديل النتيجة"
        onConfirm={() => {
          setConfirmOpen(false);
          advance();
        }}
        onCancel={() => {
          setConfirmOpen(false);
          setEditOpen(true);
        }}
      />

      <Confirm
        open={editOpen}
        title="تعديل النقاط"
        confirmLabel={isLast ? "إنهاء الفقرة" : "السؤال التالي"}
        cancelLabel="رجوع"
        onConfirm={() => {
          setEditOpen(false);
          advance();
        }}
        onCancel={() => setEditOpen(false)}
      >
        <Scoreboard />
      </Confirm>
    </div>
  );
}

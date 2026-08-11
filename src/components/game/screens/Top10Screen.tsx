import { useState } from "react";
import { useGame } from "@/game/store";
import { Btn, Confirm, GameHeader } from "@/components/game/ui";
import { Scoreboard } from "@/components/game/Scoreboard";
import { normalizeAnswer } from "@/lib/gameData";
import { playSfx } from "@/game/sfx";
import { cn } from "@/lib/utils";

export function Top10Screen() {
  const {
    top10,
    startTop10Round,
    revealTop10,
    nextTop10List,
    adjustScore,
    orderedPlayers,
    settings,
    finishSection,
  } = useGame();

  const [guess, setGuess] = useState("");
  const [feedback, setFeedback] = useState<"wrong" | "duplicate" | null>(null);
  const [pendingIndex, setPendingIndex] = useState<number | null>(null);
  const [surrenderOpen, setSurrenderOpen] = useState(false);

  if (!top10) return null;
  const list = top10.lists[top10.listIndex]!;
  const remaining = top10.revealed.filter((r) => !r).length;
  const isLastList = top10.listIndex + 1 >= top10.lists.length;

  if (!top10.started) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h2 className="text-5xl font-extrabold">🔢 الواحد ربك هو الواحد</h2>
        <p className="mt-4 text-xl text-muted-foreground">
          الجولة {top10.listIndex + 1} / {top10.lists.length}
        </p>
        <Btn size="lg" className="mt-8" onClick={startTop10Round}>
          ابدأ الجولة
        </Btn>
      </div>
    );
  }

  const check = () => {
    const value = normalizeAnswer(guess);
    if (!value) return;
    const idx = list.items.findIndex((item) => normalizeAnswer(item.name) === value);
    if (idx === -1) {
      setFeedback("wrong");
      playSfx("wrong", settings.sound);
      return;
    }
    if (top10.revealed[idx]) {
      setFeedback("duplicate");
      playSfx("wrong", settings.sound);
      return;
    }
    setFeedback(null);
    setPendingIndex(idx);
    playSfx("reveal", settings.sound);
  };

  const goNextList = () => {
    const hasMore = nextTop10List();
    setGuess("");
    setFeedback(null);
    if (!hasMore) finishSection();
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8">
      <GameHeader
        title="🔢 الواحد ربك هو الواحد"
        subtitle={`الجولة ${top10.listIndex + 1} / ${top10.lists.length}`}
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="card-surface p-6">
          <h2 className="text-3xl font-extrabold">{list.title}</h2>

          <ol className="mt-6 space-y-2">
            {list.items.map((item, i) => (
              <li
                key={i}
                className={cn(
                  "flex items-center justify-between rounded-lg border px-4 py-3 text-lg transition-all duration-200",
                  top10.revealed[i]
                    ? "animate-pop-in border-success/50 bg-success/10"
                    : "border-border bg-secondary/30",
                )}
              >
                <span className="flex items-center gap-3">
                  <span className="w-6 font-extrabold text-primary">{i + 1}.</span>
                  <span className="font-bold">{top10.revealed[i] ? item.name : "؟؟؟؟"}</span>
                </span>
                <span className="text-sm font-bold text-muted-foreground">{i + 1} نقطة</span>
              </li>
            ))}
          </ol>

          <div className="mt-6 flex flex-wrap gap-2">
            <input
              value={guess}
              onChange={(e) => {
                setGuess(e.target.value);
                setFeedback(null);
              }}
              onKeyDown={(e) => e.key === "Enter" && check()}
              placeholder="اكتب الإجابة"
              className="flex-1 rounded-lg border border-input bg-background px-4 py-3 outline-none focus:border-primary"
            />
            <Btn onClick={check} disabled={!guess.trim()}>
              تحقق
            </Btn>
          </div>

          {feedback === "wrong" ? (
            <p className="animate-shake mt-3 font-bold text-destructive">❌ إجابة غلط — جرب تاني</p>
          ) : null}
          {feedback === "duplicate" ? (
            <p className="mt-3 font-bold text-primary">⚠️ الإجابة دي اتقالت قبل كده</p>
          ) : null}

          <div className="mt-6 flex flex-wrap gap-3 border-t border-border pt-4">
            {remaining > 0 ? (
              <Btn variant="outline" onClick={() => setSurrenderOpen(true)}>
                🏳️ استسلمنا... ورّينا الباقي
              </Btn>
            ) : (
              <Btn onClick={goNextList}>{isLastList ? "نتيجة الفقرة" : "القائمة التالية"}</Btn>
            )}
          </div>
        </div>

        <Scoreboard />
      </div>

      <Confirm
        open={pendingIndex !== null}
        title="مين اللي جاوب؟"
        description={
          pendingIndex !== null
            ? `${list.items[pendingIndex]?.name} — المركز ${pendingIndex + 1} (+${pendingIndex + 1})`
            : ""
        }
        cancelLabel="من غير نقاط"
        onCancel={() => {
          if (pendingIndex !== null) revealTop10(pendingIndex, false);
          setPendingIndex(null);
          setGuess("");
        }}
      >
        <div className="grid gap-2 sm:grid-cols-2">
          {orderedPlayers.map((p) => (
            <Btn
              key={p.id}
              variant="outline"
              onClick={() => {
                if (pendingIndex === null) return;
                adjustScore(p.id, pendingIndex + 1);
                revealTop10(pendingIndex, true);
                playSfx("correct", settings.sound);
                setPendingIndex(null);
                setGuess("");
              }}
            >
              {p.name}
            </Btn>
          ))}
        </div>
      </Confirm>

      <Confirm
        open={surrenderOpen}
        title="نكشف باقي الإجابات؟"
        description="الإجابات المكشوفة دلوقتي مش هتاخد نقاط."
        confirmLabel="اكشف الباقي"
        onConfirm={() => {
          top10.revealed.forEach((r, i) => {
            if (!r) revealTop10(i, false);
          });
          playSfx("reveal", settings.sound);
          setSurrenderOpen(false);
        }}
        onCancel={() => setSurrenderOpen(false)}
      />
    </div>
  );
}

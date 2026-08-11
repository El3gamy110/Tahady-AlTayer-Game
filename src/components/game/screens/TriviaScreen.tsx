import { useEffect, useMemo, useRef, useState } from "react";
import { useGame, type PowerUpId } from "@/game/store";
import { Btn, Confirm, GameHeader } from "@/components/game/ui";
import { Scoreboard } from "@/components/game/Scoreboard";
import { DIFFICULTY_ORDER, DIFFICULTY_POINTS, type Difficulty } from "@/lib/gameData";
import { playSfx } from "@/game/sfx";
import { cn } from "@/lib/utils";

const DIFF_LABEL: Record<Difficulty, string> = { easy: "سهل", medium: "متوسط", hard: "صعب" };

const POWER_UPS: { id: PowerUpId; icon: string; label: string }[] = [
  { id: "fiftyFifty", icon: "✂️", label: "حذف إجابتين" },
  { id: "extraTime", icon: "⏱️", label: "وقت إضافي" },
  { id: "doublePoints", icon: "✖️", label: "دبل نقاط" },
];

export function TriviaScreen() {
  const { trivia, orderedPlayers, markTriviaUsed, adjustScore, usePowerUp, settings, finishSection } =
    useGame();
  const [selected, setSelected] = useState<{ cat: number; diff: Difficulty } | null>(null);
  const [turnIndex, setTurnIndex] = useState(0);

  if (!trivia) return null;
  const totalCards = trivia.categories.length * 3;

  if (trivia.used.length >= totalCards && !selected) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h2 className="text-3xl font-extrabold">خلصت كل الكروت 🎉</h2>
        <Btn size="lg" className="mt-6" onClick={finishSection}>
          نتيجة الفقرة
        </Btn>
      </div>
    );
  }

  const activePlayer = orderedPlayers[turnIndex % Math.max(orderedPlayers.length, 1)];

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8">
      <GameHeader title="🧠 إنت بتقول إيه؟" subtitle={`الكروت المتبقية: ${totalCards - trivia.used.length}`} />

      {selected ? (
        <QuestionView
          catIndex={selected.cat}
          difficulty={selected.diff}
          onDone={() => {
            markTriviaUsed(`${selected.cat}-${selected.diff}`);
            setSelected(null);
            setTurnIndex((i) => i + 1);
          }}
          activePlayerId={activePlayer?.id ?? ""}
          adjustScore={adjustScore}
          usePowerUp={usePowerUp}
          sound={settings.sound}
        />
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <div>
            <p className="mb-4 rounded-lg border border-primary/40 bg-primary/10 px-4 py-2 text-center font-bold">
              الدور على: <span className="text-primary">{activePlayer?.name ?? "—"}</span>
            </p>
            <div className="grid gap-4 sm:grid-cols-3">
              {trivia.categories.map((cat, ci) => (
                <div key={cat.name} className="space-y-3">
                  <h3 className="rounded-lg bg-secondary/60 py-2 text-center font-extrabold">
                    {cat.name}
                  </h3>
                  {DIFFICULTY_ORDER.map((d) => {
                    const used = trivia.used.includes(`${ci}-${d}`);
                    return (
                      <button
                        key={d}
                        disabled={used}
                        onClick={() => {
                          playSfx("select", settings.sound);
                          setSelected({ cat: ci, diff: d });
                        }}
                        className={cn(
                          "card-surface w-full py-6 text-3xl font-extrabold transition-all duration-200",
                          used
                            ? "opacity-30"
                            : "text-primary hover:-translate-y-1 hover:border-primary hover:shadow-[var(--shadow-glow)]",
                        )}
                      >
                        {DIFFICULTY_POINTS[d]}
                        <span className="mt-1 block text-xs font-normal text-muted-foreground">
                          {DIFF_LABEL[d]}
                        </span>
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
          <Scoreboard />
        </div>
      )}
    </div>
  );
}

function QuestionView({
  catIndex,
  difficulty,
  onDone,
  activePlayerId,
  adjustScore,
  usePowerUp,
  sound,
}: {
  catIndex: number;
  difficulty: Difficulty;
  onDone: () => void;
  activePlayerId: string;
  adjustScore: (id: string, delta: number) => void;
  usePowerUp: (id: string, p: PowerUpId) => void;
  sound: boolean;
}) {
  const { trivia, players } = useGame();
  const category = trivia!.categories[catIndex]!;
  const q = category.questions[difficulty];
  const basePoints = DIFFICULTY_POINTS[difficulty];

  const [started, setStarted] = useState(false);
  const [seconds, setSeconds] = useState(45);
  const [removed, setRemoved] = useState<string[]>([]);
  const [doubled, setDoubled] = useState(false);
  const [picked, setPicked] = useState<string | null>(null);
  const [override, setOverride] = useState(false);
  const warnedRef = useRef(false);

  const player = players.find((p) => p.id === activePlayerId);
  const points = basePoints * (doubled ? 2 : 1);
  const finished = picked !== null || (started && seconds === 0);

  useEffect(() => {
    if (!started || finished) return;
    const t = window.setInterval(() => setSeconds((s) => Math.max(0, s - 1)), 1000);
    return () => window.clearInterval(t);
  }, [started, finished]);

  useEffect(() => {
    if (started && seconds <= 10 && seconds > 0 && !warnedRef.current) {
      warnedRef.current = true;
      playSfx("warning", sound);
    }
  }, [seconds, started, sound]);

  const choices = useMemo(() => q.choices, [q]);

  const pick = (choice: string) => {
    if (finished) return;
    setPicked(choice);
    const correct = choice === q.answer;
    playSfx(correct ? "correct" : "wrong", sound);
    if (correct && player) adjustScore(player.id, points);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="card-surface animate-pop-in p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="rounded-full bg-accent/15 px-3 py-1 text-sm font-bold text-accent">
            {category.name} · {DIFF_LABEL[difficulty]}
          </span>
          <span className="text-2xl font-extrabold text-primary">
            {points} نقطة {doubled ? "(×2)" : ""}
          </span>
        </div>

        <p className="mt-2 text-sm text-muted-foreground">
          الدور على: <span className="font-bold text-foreground">{player?.name ?? "—"}</span>
        </p>

        <h2 className="mt-6 text-3xl font-extrabold leading-snug">{q.question}</h2>

        <div className="mt-6 flex items-center gap-4">
          {!started ? (
            <Btn onClick={() => setStarted(true)}>▶ ابدأ المؤقت</Btn>
          ) : (
            <div
              className={cn(
                "text-4xl font-extrabold tabular-nums",
                seconds <= 10 ? "animate-warning text-destructive" : "text-accent",
              )}
            >
              {seconds}s
            </div>
          )}
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {choices.map((c) => {
            const isRemoved = removed.includes(c);
            const isCorrect = c === q.answer;
            const show = finished;
            return (
              <button
                key={c}
                disabled={!started || isRemoved || finished}
                onClick={() => pick(c)}
                className={cn(
                  "rounded-xl border border-border bg-secondary/40 px-4 py-4 text-lg font-bold transition-all duration-200",
                  isRemoved && "opacity-20 line-through",
                  !finished && started && !isRemoved && "hover:border-primary hover:text-primary",
                  show && isCorrect && "border-success bg-success/20 text-success",
                  show && !isCorrect && picked === c && "animate-shake border-destructive bg-destructive/20 text-destructive",
                )}
              >
                {c}
              </button>
            );
          })}
        </div>

        <div className="mt-6 border-t border-border pt-4">
          <p className="mb-2 text-sm text-muted-foreground">قدرات {player?.name}</p>
          <div className="flex flex-wrap gap-2">
            {POWER_UPS.map((pu) => {
              const available = player?.powerUps[pu.id];
              return (
                <Btn
                  key={pu.id}
                  size="sm"
                  variant={available ? "outline" : "ghost"}
                  disabled={!available || finished || (pu.id !== "doublePoints" && !started)}
                  onClick={() => {
                    if (!player) return;
                    usePowerUp(player.id, pu.id);
                    if (pu.id === "fiftyFifty") {
                      const wrong = choices.filter((c) => c !== q.answer);
                      setRemoved(wrong.slice(0, 2));
                    }
                    if (pu.id === "extraTime") setSeconds((s) => s + 15);
                    if (pu.id === "doublePoints") setDoubled(true);
                  }}
                >
                  {pu.icon} {pu.label}
                </Btn>
              );
            })}
          </div>
        </div>

        {finished ? (
          <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-border pt-4">
            <span className="font-bold">
              {picked === q.answer
                ? `✅ إجابة صح +${points}`
                : picked
                  ? "❌ إجابة غلط"
                  : "⏰ خلص الوقت"}
            </span>
            <Btn variant="outline" size="sm" onClick={() => setOverride(true)}>
              تعديل يدوي
            </Btn>
            <Btn onClick={onDone}>الكارت التالي</Btn>
          </div>
        ) : null}
      </div>

      <Scoreboard />

      <Confirm
        open={override}
        title="تعديل النقاط يدويًا"
        cancelLabel="خلاص"
        onCancel={() => setOverride(false)}
      >
        <Scoreboard />
      </Confirm>
    </div>
  );
}

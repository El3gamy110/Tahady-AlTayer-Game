import { useEffect, useState } from "react";
import { useGame } from "@/game/store";
import { Btn } from "@/components/game/ui";

export function SetupScreen() {
  const { setScreen, startGame, orderedPlayers, reshuffle, players } = useGame();
  const [count, setCount] = useState(4);
  const [names, setNames] = useState<string[]>(["", "", "", ""]);
  const [shuffled, setShuffled] = useState(false);

  useEffect(() => {
    setNames((prev) => {
      const next = [...prev];
      while (next.length < count) next.push("");
      return next.slice(0, count);
    });
    setShuffled(false);
  }, [count]);

  const trimmed = names.map((n) => n.trim());
  const missing = trimmed.some((n) => n.length === 0);
  const duplicates = new Set(trimmed.filter(Boolean)).size !== trimmed.filter(Boolean).length;
  const canShuffle = !missing && !duplicates;

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-10">
      <button
        onClick={() => setScreen("home")}
        className="mb-6 text-sm text-muted-foreground hover:text-foreground"
      >
        ← الرئيسية
      </button>
      <h2 className="text-4xl font-extrabold">إعداد اللعبة</h2>
      <p className="mt-2 text-muted-foreground">اكتب أسامي اللاعبين، والتطبيق هيرتب الأدوار.</p>

      <div className="card-surface mt-6 p-5">
        <h3 className="mb-3 font-bold">عدد اللاعبين</h3>
        <div className="flex items-center justify-center gap-6">
          <Btn
            variant="outline"
            onClick={() => setCount((c) => Math.max(2, c - 1))}
            disabled={count <= 2}
          >
            −
          </Btn>
          <span className="w-14 text-center text-4xl font-extrabold text-primary">{count}</span>
          <Btn
            variant="outline"
            onClick={() => setCount((c) => Math.min(8, c + 1))}
            disabled={count >= 8}
          >
            +
          </Btn>
        </div>
      </div>

      <div className="card-surface mt-4 p-5">
        <h3 className="mb-3 font-bold">أسماء اللاعبين</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          {names.map((name, i) => (
            <input
              key={i}
              value={name}
              onChange={(e) => {
                const next = [...names];
                next[i] = e.target.value;
                setNames(next);
                setShuffled(false);
              }}
              placeholder={`لاعب ${i + 1}`}
              className="rounded-lg border border-input bg-background px-3 py-2.5 outline-none transition-colors focus:border-primary"
            />
          ))}
        </div>
        {missing ? (
          <p className="mt-3 text-sm text-destructive">لازم تكتب كل الأسماء قبل ما تبدأ.</p>
        ) : null}
        {duplicates ? (
          <p className="mt-3 text-sm text-destructive">في اسم مكرر — غيّره.</p>
        ) : null}
      </div>

      {shuffled && players.length ? (
        <div className="card-surface animate-pop-in mt-4 p-5">
          <h3 className="mb-3 font-bold">🎲 ترتيب اللعب</h3>
          <ol className="space-y-2">
            {orderedPlayers.map((p, i) => (
              <li
                key={p.id}
                className="flex items-center gap-3 rounded-lg bg-secondary/50 px-3 py-2"
              >
                <span className="font-extrabold text-primary">{i + 1}.</span>
                <span className="font-bold">{p.name}</span>
              </li>
            ))}
          </ol>
          <Btn variant="outline" size="sm" className="mt-4" onClick={reshuffle}>
            إعادة الترتيب
          </Btn>
        </div>
      ) : null}

      <div className="mt-6 flex flex-wrap gap-3">
        <Btn
          variant="turquoise"
          disabled={!canShuffle}
          onClick={() => {
            startGame(trimmed);
            setShuffled(true);
          }}
        >
          🎲 ترتيب اللعب
        </Btn>
        <Btn size="lg" disabled={!shuffled} onClick={() => setScreen("sections")}>
          ابدأ التحدي
        </Btn>
      </div>
    </div>
  );
}

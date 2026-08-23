import { useEffect, useState } from "react";
import { useGame } from "@/game/store";
import { Btn, Confirm } from "@/components/game/ui";
import { playSfx } from "@/game/sfx";

const MEDALS = ["🥇", "🥈", "🥉"];

export function RoundResultScreen() {
  const { rankedBySection, setScreen, settings, playedSections } = useGame();
  const [endOpen, setEndOpen] = useState(false);
  const allPlayed = playedSections.length >= 4;

  useEffect(() => {
    playSfx("roundComplete", settings.sound);
  }, [settings.sound]);

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-16 text-center">
      <h2 className="text-4xl font-extrabold">🎉 الفقرة خلصت!</h2>

      <div className="card-pop animate-pop-in mt-8 p-6 text-right">
        {rankedBySection.map((p, i) => (
          <div
            key={p.id}
            className="flex items-center justify-between border-b border-border/60 py-3 last:border-0"
          >
            <span className="flex items-center gap-3 text-lg font-bold">
              <span className="w-6">{MEDALS[i] ?? i + 1}</span>
              {p.name}
            </span>
            <span className="text-2xl font-extrabold text-primary">{p.currentSectionScore}</span>
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        {!allPlayed ? (
          <Btn size="lg" onClick={() => setScreen("sections")}>
            فقرة أخرى
          </Btn>
        ) : null}
        <Btn variant="outline" size="lg" onClick={() => setEndOpen(true)}>
          إنهاء اللعبة
        </Btn>
      </div>

      <Confirm
        open={endOpen}
        title="متأكد إنك عايز تنهي اللعبة؟"
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

export function FinalResultScreen() {
  const { rankedByGlobal, playAgain, resetGame, settings } = useGame();
  const winner = rankedByGlobal[0];

  useEffect(() => {
    playSfx("winner", settings.sound);
  }, [settings.sound]);

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-16 text-center">
      <div className="animate-pop-in text-7xl">🏆</div>
      <p className="mt-4 text-lg text-muted-foreground">الفائز!</p>
      <h2 className="text-gold-gradient mt-2 text-6xl font-extrabold">{winner?.name ?? "—"}</h2>
      <p className="mt-2 text-3xl font-extrabold text-primary">{winner?.sectionsWon ?? 0} جولات</p>

      <div className="card-pop mt-10 p-6 text-right">
        {rankedByGlobal.map((p, i) => (
          <div
            key={p.id}
            className="flex items-center justify-between border-b border-border/60 py-3 last:border-0"
          >
            <span className="flex items-center gap-3 text-lg font-bold">
              <span className="w-6">{MEDALS[i] ?? i + 1}</span>
              {p.name}
            </span>
            <span className="text-xl font-extrabold text-primary">{p.sectionsWon} جولات</span>
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Btn size="lg" onClick={playAgain}>
          العب تاني
        </Btn>
        <Btn variant="outline" size="lg" onClick={resetGame}>
          الرئيسية
        </Btn>
      </div>
    </div>
  );
}

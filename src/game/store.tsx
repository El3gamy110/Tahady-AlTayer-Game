import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import {
  pickClosestQuestions,
  pickDifferentQuestions,
  pickTop10Lists,
  pickTriviaCategories,
  pickSingleTriviaCategory,
  pickSingleTop10List,
  shuffle,
  type ClosestQuestion,
  type DifferentQuestion,
  type Top10List,
  type TriviaCategory,
} from "@/lib/gameData";

export type SectionId = "trivia" | "closest" | "different" | "top10";

export type PowerUpId = "fiftyFifty" | "extraTime" | "doublePoints";

export type Player = {
  id: string;
  name: string;
  score: number;
  powerUps: Record<PowerUpId, boolean>; // true = still available
};

export type Screen =
  | "home"
  | "setup"
  | "sections"
  | "trivia"
  | "closest"
  | "different"
  | "top10"
  | "round"
  | "final";

export type Settings = { sound: boolean; effects: boolean };

export type TriviaState = {
  categories: TriviaCategory[];
  used: string[]; // `${catIndex}-${difficulty}`
  categoryChangesRemaining: number;
  categoryChangesLocked: boolean;
};

export type Top10State = {
  lists: Top10List[];
  listIndex: number;
  revealed: boolean[];
  scored: boolean[];
  started: boolean;
  top10ChangesRemaining: number;
  top10ChangesLocked: boolean;
  playedLists: string[];
};

type GameContextValue = {
  screen: Screen;
  setScreen: (s: Screen) => void;
  players: Player[];
  turnOrder: string[];
  settings: Settings;
  setSettings: (s: Settings) => void;
  playedSections: SectionId[];
  currentSection: SectionId | null;
  trivia: TriviaState | null;
  closest: { questions: ClosestQuestion[]; index: number } | null;
  different: { questions: DifferentQuestion[]; index: number } | null;
  top10: Top10State | null;
  lastChangedPlayer: string | null;
  startGame: (names: string[]) => void;
  reshuffle: () => void;
  adjustScore: (playerId: string, delta: number) => void;
  usePowerUp: (playerId: string, id: PowerUpId) => void;
  openSection: (id: SectionId) => void;
  markTriviaUsed: (key: string) => void;
  changeTriviaCategory: (index: number) => void;
  lockTriviaChanges: () => void;
  changeTop10List: () => void;
  lockTop10Changes: () => void;
  nextClosest: () => void;
  nextDifferent: () => void;
  revealTop10: (index: number, scored: boolean) => void;
  startTop10Round: () => void;
  nextTop10List: () => boolean;
  finishSection: () => void;
  resetGame: () => void;
  playAgain: () => void;
  orderedPlayers: Player[];
  ranked: Player[];
};

const GameContext = createContext<GameContextValue | null>(null);

const freshPowerUps = (): Record<PowerUpId, boolean> => ({
  fiftyFifty: true,
  extraTime: true,
  doublePoints: true,
});

export function GameProvider({ children }: { children: ReactNode }) {
  const [screen, setScreen] = useState<Screen>("home");
  const [players, setPlayers] = useState<Player[]>([]);
  const [turnOrder, setTurnOrder] = useState<string[]>([]);
  const [settings, setSettings] = useState<Settings>({ sound: true, effects: true });
  const [playedSections, setPlayedSections] = useState<SectionId[]>([]);
  const [currentSection, setCurrentSection] = useState<SectionId | null>(null);
  const [trivia, setTrivia] = useState<TriviaState | null>(null);
  const [closest, setClosest] = useState<{ questions: ClosestQuestion[]; index: number } | null>(
    null,
  );
  const [different, setDifferent] = useState<{
    questions: DifferentQuestion[];
    index: number;
  } | null>(null);
  const [top10, setTop10] = useState<Top10State | null>(null);
  const [lastChangedPlayer, setLastChangedPlayer] = useState<string | null>(null);

  const value = useMemo<GameContextValue>(() => {
    const startGame = (names: string[]) => {
      const next = names.map((name, i) => ({
        id: `p${i}-${Math.random().toString(36).slice(2, 7)}`,
        name: name.trim(),
        score: 0,
        powerUps: freshPowerUps(),
      }));
      setPlayers(next);
      setTurnOrder(shuffle(next.map((p) => p.id)));
      setPlayedSections([]);
      setCurrentSection(null);
    };

    const adjustScore = (playerId: string, delta: number) => {
      setPlayers((prev) =>
        prev.map((p) => (p.id === playerId ? { ...p, score: p.score + delta } : p)),
      );
      setLastChangedPlayer(playerId);
      window.setTimeout(() => setLastChangedPlayer(null), 600);
    };

    const openSection = (id: SectionId) => {
      setCurrentSection(id);
      setTurnOrder((prev) => shuffle(prev));
      if (id === "trivia")
        setTrivia({
          categories: pickTriviaCategories(3),
          used: [],
          categoryChangesRemaining: 3,
          categoryChangesLocked: false,
        });
      if (id === "closest") setClosest({ questions: pickClosestQuestions(5), index: 0 });
      if (id === "different") setDifferent({ questions: pickDifferentQuestions(5), index: 0 });
      if (id === "top10") {
        const initialLists = pickTop10Lists(2);
        setTop10({
          lists: initialLists,
          listIndex: 0,
          revealed: Array(10).fill(false),
          scored: Array(10).fill(false),
          started: false,
          top10ChangesRemaining: 3,
          top10ChangesLocked: false,
          playedLists: initialLists.map((l) => l.title),
        });
      }
      setScreen(id);
    };

    const finishSection = () => {
      if (currentSection && !playedSections.includes(currentSection)) {
        setPlayedSections((prev) => [...prev, currentSection]);
      }
      setScreen("round");
    };

    const resetGame = () => {
      setPlayers([]);
      setTurnOrder([]);
      setPlayedSections([]);
      setCurrentSection(null);
      setTrivia(null);
      setClosest(null);
      setDifferent(null);
      setTop10(null);
      setScreen("home");
    };

    const playAgain = () => {
      setPlayers((prev) => prev.map((p) => ({ ...p, score: 0, powerUps: freshPowerUps() })));
      setPlayedSections([]);
      setCurrentSection(null);
      setTrivia(null);
      setClosest(null);
      setDifferent(null);
      setTop10(null);
      setTurnOrder((prev) => shuffle(prev));
      setScreen("sections");
    };

    const byId = new Map(players.map((p) => [p.id, p]));
    const orderedPlayers = turnOrder
      .map((id) => byId.get(id))
      .filter((p): p is Player => Boolean(p));

    return {
      screen,
      setScreen,
      players,
      turnOrder,
      settings,
      setSettings,
      playedSections,
      currentSection,
      trivia,
      closest,
      different,
      top10,
      lastChangedPlayer,
      startGame,
      reshuffle: () => setTurnOrder((prev) => shuffle(prev)),
      adjustScore,
      usePowerUp: (playerId, id) =>
        setPlayers((prev) =>
          prev.map((p) =>
            p.id === playerId ? { ...p, powerUps: { ...p.powerUps, [id]: false } } : p,
          ),
        ),
      openSection,
      markTriviaUsed: (key) =>
        setTrivia((prev) => (prev ? { ...prev, used: [...prev.used, key] } : prev)),
      changeTriviaCategory: (index) =>
        setTrivia((prev) => {
          if (!prev || prev.categoryChangesRemaining <= 0 || prev.categoryChangesLocked)
            return prev;
          const replacement = pickSingleTriviaCategory(prev.categories.map((c) => c.name));
          if (!replacement) return prev;
          const newCats = [...prev.categories];
          newCats[index] = replacement;
          return {
            ...prev,
            categories: newCats,
            categoryChangesRemaining: prev.categoryChangesRemaining - 1,
          };
        }),
      lockTriviaChanges: () =>
        setTrivia((prev) => (prev ? { ...prev, categoryChangesLocked: true } : prev)),
      changeTop10List: () =>
        setTop10((prev) => {
          if (!prev || prev.top10ChangesRemaining <= 0 || prev.top10ChangesLocked) return prev;
          const replacement = pickSingleTop10List(prev.playedLists);
          if (!replacement) return prev;
          const newLists = [...prev.lists];
          newLists[prev.listIndex] = replacement;
          return {
            ...prev,
            lists: newLists,
            top10ChangesRemaining: prev.top10ChangesRemaining - 1,
            playedLists: [...prev.playedLists, replacement.title],
            revealed: Array(10).fill(false),
            scored: Array(10).fill(false),
            started: false,
          };
        }),
      lockTop10Changes: () =>
        setTop10((prev) => (prev ? { ...prev, top10ChangesLocked: true } : prev)),
      nextClosest: () => setClosest((prev) => (prev ? { ...prev, index: prev.index + 1 } : prev)),
      nextDifferent: () =>
        setDifferent((prev) => (prev ? { ...prev, index: prev.index + 1 } : prev)),
      startTop10Round: () => setTop10((prev) => (prev ? { ...prev, started: true } : prev)),
      revealTop10: (index, scored) =>
        setTop10((prev) => {
          if (!prev) return prev;
          const revealed = [...prev.revealed];
          const scoredArr = [...prev.scored];
          revealed[index] = true;
          scoredArr[index] = scored;
          return { ...prev, revealed, scored: scoredArr };
        }),
      nextTop10List: () => {
        if (!top10) return false;
        const hasMore = top10.listIndex + 1 < top10.lists.length;
        if (hasMore) {
          setTop10((prev) => {
            if (!prev) return prev;
            return {
              ...prev,
              listIndex: prev.listIndex + 1,
              revealed: Array(10).fill(false),
              scored: Array(10).fill(false),
              started: false,
              top10ChangesLocked: false,
            };
          });
        }
        return hasMore;
      },
      finishSection,
      resetGame,
      playAgain,
      orderedPlayers,
      ranked: [...players].sort((a, b) => b.score - a.score),
    };
  }, [
    screen,
    players,
    turnOrder,
    settings,
    playedSections,
    currentSection,
    trivia,
    closest,
    different,
    top10,
    lastChangedPlayer,
  ]);

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be used inside GameProvider");
  return ctx;
}

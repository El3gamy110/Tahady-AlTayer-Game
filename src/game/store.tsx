import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import {
  pickClosestQuestions,
  pickDifferentQuestions,
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
  currentSectionScore: number;
  sectionsWon: number;
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
};

export type Top10State = {
  lists: Top10List[];
  listIndex: number;
  revealed: boolean[];
  scored: boolean[];
  started: boolean;
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
  setTriviaCategories: (cats: TriviaCategory[]) => void;
  setTop10Lists: (lists: Top10List[]) => void;
  nextClosest: () => void;
  nextDifferent: () => void;
  revealTop10: (index: number, scored: boolean) => void;
  startTop10Round: () => void;
  nextTop10List: () => boolean;
  finishSection: () => void;
  resetGame: () => void;
  playAgain: () => void;
  orderedPlayers: Player[];
  rankedBySection: Player[];
  rankedByGlobal: Player[];
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
        currentSectionScore: 0,
        sectionsWon: 0,
        powerUps: freshPowerUps(),
      }));
      setPlayers(next);
      setTurnOrder(shuffle(next.map((p) => p.id)));
      setPlayedSections([]);
      setCurrentSection(null);
    };

    const adjustScore = (playerId: string, delta: number) => {
      setPlayers((prev) =>
        prev.map((p) => (p.id === playerId ? { ...p, currentSectionScore: p.currentSectionScore + delta } : p)),
      );
      setLastChangedPlayer(playerId);
      window.setTimeout(() => setLastChangedPlayer(null), 600);
    };

    const openSection = (id: SectionId) => {
      setCurrentSection(id);
      setTurnOrder((prev) => shuffle(prev));
      setPlayers((prev) => prev.map((p) => ({ ...p, currentSectionScore: 0 })));
      if (id === "trivia")
        setTrivia({
          categories: [],
          used: [],
        });
      if (id === "closest") setClosest({ questions: pickClosestQuestions(8), index: 0 });
      if (id === "different") setDifferent({ questions: pickDifferentQuestions(8), index: 0 });
      if (id === "top10") {
        setTop10({
          lists: [],
          listIndex: 0,
          revealed: Array(10).fill(false),
          scored: Array(10).fill(false),
          started: false,
        });
      }
      setScreen(id);
    };

    const finishSection = () => {
      if (currentSection && !playedSections.includes(currentSection)) {
        setPlayedSections((prev) => [...prev, currentSection]);
      }
      setPlayers((prev) => {
        const maxScore = Math.max(...prev.map((p) => p.currentSectionScore));
        return prev.map((p) => ({
          ...p,
          sectionsWon: p.currentSectionScore === maxScore && maxScore > 0 ? p.sectionsWon + 1 : p.sectionsWon,
        }));
      });
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
      setPlayers((prev) => prev.map((p) => ({ ...p, currentSectionScore: 0, sectionsWon: 0, powerUps: freshPowerUps() })));
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
      setTriviaCategories: (cats) =>
        setTrivia((prev) => (prev ? { ...prev, categories: cats } : prev)),
      setTop10Lists: (lists) =>
        setTop10((prev) => (prev ? { ...prev, lists } : prev)),
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
            };
          });
        }
        return hasMore;
      },
      finishSection,
      resetGame,
      playAgain,
      orderedPlayers,
      rankedBySection: [...players].sort((a, b) => b.currentSectionScore - a.currentSectionScore),
      rankedByGlobal: [...players].sort((a, b) => b.sectionsWon - a.sectionsWon),
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

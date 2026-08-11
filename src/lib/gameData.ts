import triviaRaw from "@/data/enta_bet2ol_eh.json";
import closestRaw from "@/data/nashnt_ya_fale7.json";
import differentRaw from "@/data/e3mel_elsa7.json";
import top10Raw from "@/data/elwa7ed_rabak_howa_elwa7ed.json";

export type Difficulty = "easy" | "medium" | "hard";

export type TriviaQuestion = {
  question: string;
  choices: string[];
  answer: string;
};

export type TriviaCategory = {
  name: string;
  questions: Record<Difficulty, TriviaQuestion>;
};

export type ClosestQuestion = { question: string; answer: string };
export type DifferentQuestion = { question: string };
export type Top10List = { title: string; items: string[] };

export const DIFFICULTY_POINTS: Record<Difficulty, number> = {
  easy: 10,
  medium: 20,
  hard: 30,
};

export const DIFFICULTY_ORDER: Difficulty[] = ["easy", "medium", "hard"];

export function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function pickTriviaCategories(count = 3): TriviaCategory[] {
  return shuffle(triviaRaw.categories as TriviaCategory[]).slice(0, count);
}

export function pickClosestQuestions(count = 5): ClosestQuestion[] {
  return shuffle(closestRaw.questions as ClosestQuestion[]).slice(0, count);
}

export function pickDifferentQuestions(count = 5): DifferentQuestion[] {
  return shuffle(differentRaw.questions as DifferentQuestion[]).slice(0, count);
}

export function pickTop10Lists(count = 2): Top10List[] {
  return shuffle(top10Raw.lists as Top10List[]).slice(0, count);
}

export function normalizeAnswer(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[\u064B-\u0652\u0640]/g, "")
    .replace(/[أإآ]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ة/g, "ه")
    .replace(/\s+/g, " ");
}

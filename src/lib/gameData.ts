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

export type ClosestQuestion = { question: string; answer: string | number; unit?: string };
export type DifferentQuestion = { id: string; question: string };
export type Top10Item = { rank: number; name: string; value: number; unit: string };
export type Top10List = { title: string; items: Top10Item[] };

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
    const tmp = copy[i] as T;
    copy[i] = copy[j] as T;
    copy[j] = tmp;
  }
  return copy;
}

export function getAllTriviaCategories(): TriviaCategory[] {
  return triviaRaw.categories.map((rawCat: any) => {
    const questions = rawCat.questions as any[];
    const easyQ = shuffle(questions.filter((q) => q.difficulty === "سهل"))[0];
    const mediumQ = shuffle(questions.filter((q) => q.difficulty === "متوسط"))[0];
    const hardQ = shuffle(questions.filter((q) => q.difficulty === "صعب"))[0];

    const formatQ = (q: any): TriviaQuestion => ({
      question: q.question,
      choices: shuffle(q.options),
      answer: q.options[q.answer],
    });

    return {
      name: rawCat.name,
      questions: {
        easy: formatQ(easyQ || questions[0]),
        medium: formatQ(mediumQ || questions[0]),
        hard: formatQ(hardQ || questions[0]),
      },
    };
  });
}

export function pickClosestQuestions(count = 8): ClosestQuestion[] {
  return shuffle(closestRaw.questions as ClosestQuestion[]).slice(0, count);
}

export function pickDifferentQuestions(count = 8): DifferentQuestion[] {
  return shuffle(differentRaw.questions as DifferentQuestion[]).slice(0, count);
}

export function getAllTop10Lists(): Top10List[] {
  return top10Raw.lists as Top10List[];
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

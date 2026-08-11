import { createFileRoute } from "@tanstack/react-router";
import { GameProvider, useGame } from "@/game/store";
import { HomeScreen } from "@/components/game/screens/HomeScreen";
import { SetupScreen } from "@/components/game/screens/SetupScreen";
import { SectionSelectScreen } from "@/components/game/screens/SectionSelectScreen";
import { TriviaScreen } from "@/components/game/screens/TriviaScreen";
import { JudgedQuestionsScreen } from "@/components/game/screens/JudgedQuestionsScreen";
import { Top10Screen } from "@/components/game/screens/Top10Screen";
import { RoundResultScreen, FinalResultScreen } from "@/components/game/screens/ResultScreens";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "تحدي عالطاير — لعبة مسابقات مصرية للسهرات" },
      {
        name: "description",
        content:
          "تحدي عالطاير: لعبة مسابقات عربية يديرها حكم واحد لـ ٢ إلى ٨ لاعبين، بأربع فقرات ونقاط فورية.",
      },
      { property: "og:title", content: "تحدي عالطاير — لعبة مسابقات مصرية" },
      {
        property: "og:description",
        content: "أربع فقرات، حكم واحد، ومن ٢ لـ ٨ لاعبين. العب دلوقتي من غير حسابات.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Screens() {
  const { screen } = useGame();
  switch (screen) {
    case "setup":
      return <SetupScreen />;
    case "sections":
      return <SectionSelectScreen />;
    case "trivia":
      return <TriviaScreen />;
    case "closest":
      return <JudgedQuestionsScreen mode="closest" />;
    case "different":
      return <JudgedQuestionsScreen mode="different" />;
    case "top10":
      return <Top10Screen />;
    case "round":
      return <RoundResultScreen />;
    case "final":
      return <FinalResultScreen />;
    default:
      return <HomeScreen />;
  }
}

function Index() {
  return (
    <GameProvider>
      <main dir="rtl" className="relative min-h-screen overflow-hidden">
        <Screens />
      </main>
    </GameProvider>
  );
}

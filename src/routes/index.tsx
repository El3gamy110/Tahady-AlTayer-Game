import { createFileRoute } from "@tanstack/react-router";
import { GameApp } from "@/components/game/GameApp";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "تحدي عالطاير" },
      {
        name: "description",
        content: "فكّر بسرعة... والعب عالطاير!",
      },
      { property: "og:title", content: "تحدي عالطاير" },
      {
        property: "og:description",
        content: "تحدي عالطاير:  حكم واحد، بأربع جولات ، كل جولة... تحدي جديد!",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return <GameApp />;
}

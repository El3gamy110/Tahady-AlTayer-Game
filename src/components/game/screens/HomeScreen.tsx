import { useState } from "react";
import { useGame } from "@/game/store";
import { Btn, Confirm } from "@/components/game/ui";
import logo from "@/assets/logo-tahady.webp.asset.json";

export function HomeScreen() {
  const { setScreen, settings, setSettings } = useGame();
  const [showSettings, setShowSettings] = useState(false);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12 text-center">
      <div className="stage-pattern absolute inset-0 -z-10 opacity-70" aria-hidden />

      <img
        src={logo.url}
        alt="شعار لعبة تحدي عالطاير"
        className="h-40 w-40 drop-shadow-[0_16px_24px_rgba(0,0,0,0.55)] sm:h-52 sm:w-52"
      />

      <h1 className="text-gold-gradient mt-6 text-5xl font-extrabold leading-tight sm:text-6xl">
        تحدي عالطاير
      </h1>
      <p className="text-stroke-dark mt-3 text-xl font-extrabold text-accent">
        فكّر بسرعة... والعب عالطاير!
      </p>
      <p className="mt-4 max-w-md text-base text-muted-foreground">
        حكم واحد، أربع جولات، وكل جولة تحدي جديد.
      </p>

      <div className="mt-10 flex flex-col items-center gap-3">
        <Btn variant="green" size="lg" onClick={() => setScreen("setup")}>
          ▶ ابدأ لعبة
        </Btn>
        <Btn variant="purple" onClick={() => setShowSettings(true)}>
          الإعدادات
        </Btn>
      </div>

      <Confirm
        open={showSettings}
        title="الإعدادات"
        cancelLabel="تمام"
        onCancel={() => setShowSettings(false)}
      >
        <div className="space-y-3">
          {(
            [
              ["sound", "الصوت"],
              ["effects", "المؤثرات البصرية"],
            ] as const
          ).map(([key, label]) => (
            <div
              key={key}
              className="flex items-center justify-between rounded-2xl border-[3px] border-border bg-secondary/50 px-4 py-3"
            >
              <span className="font-extrabold">{label}</span>
              <Btn
                size="sm"
                variant={settings[key] ? "green" : "outline"}
                onClick={() => setSettings({ ...settings, [key]: !settings[key] })}
              >
                {settings[key] ? "مفعّل" : "مقفول"}
              </Btn>
            </div>
          ))}
        </div>
      </Confirm>
    </div>
  );
}

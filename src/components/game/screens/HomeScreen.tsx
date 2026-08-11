import { useState } from "react";
import { useGame } from "@/game/store";
import { Btn, Confirm } from "@/components/game/ui";

export function HomeScreen() {
  const { setScreen, settings, setSettings } = useGame();
  const [showSettings, setShowSettings] = useState(false);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <div className="stage-pattern absolute inset-0 -z-10 opacity-60" aria-hidden />
      <p className="mb-4 rounded-full border border-primary/40 px-4 py-1 text-sm text-primary">
        لعبة مسابقات مصرية بيديرها حكم واحد
      </p>
      <h1 className="text-gold-gradient text-6xl font-extrabold leading-tight sm:text-7xl">
        تحدي عالطاير
      </h1>
      <p className="mt-4 max-w-md text-lg text-muted-foreground">
        أربع فقرات، من ٢ لـ ٨ لاعبين، وحكم واحد بيمسك اللعبة كلها.
      </p>

      <div className="mt-10 flex flex-col items-center gap-3">
        <Btn size="lg" onClick={() => setScreen("setup")}>
          ابدأ لعبة
        </Btn>
        <Btn variant="ghost" onClick={() => setShowSettings(true)}>
          ⚙️ الإعدادات
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
              className="flex items-center justify-between rounded-lg border border-border px-4 py-3"
            >
              <span className="font-bold">{label}</span>
              <Btn
                size="sm"
                variant={settings[key] ? "turquoise" : "outline"}
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

import { cn } from "@/lib/utils";
import { useGame } from "@/game/store";
import { playSfx, type SfxName } from "@/game/sfx";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type BtnProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "gold" | "outline" | "ghost" | "turquoise" | "danger";
  size?: "sm" | "md" | "lg";
  sfx?: SfxName;
};

export function Btn({
  variant = "gold",
  size = "md",
  className,
  sfx = "click",
  onClick,
  ...props
}: BtnProps) {
  const { settings } = useGame();
  return (
    <button
      {...props}
      onClick={(e) => {
        playSfx(sfx, settings.sound);
        onClick?.(e);
      }}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl font-bold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-40 active:scale-[0.97]",
        size === "sm" && "px-3 py-1.5 text-sm",
        size === "md" && "px-5 py-2.5 text-base",
        size === "lg" && "px-8 py-4 text-xl",
        variant === "gold" &&
          "bg-primary text-primary-foreground hover:brightness-110 shadow-[var(--shadow-glow)]",
        variant === "turquoise" && "bg-accent text-accent-foreground hover:brightness-110",
        variant === "outline" &&
          "border border-border bg-card text-foreground hover:border-primary hover:text-primary",
        variant === "ghost" && "text-muted-foreground hover:text-foreground",
        variant === "danger" &&
          "bg-destructive text-destructive-foreground hover:brightness-110",
        className,
      )}
    />
  );
}

export function Confirm({
  open,
  title,
  description,
  confirmLabel = "تأكيد",
  cancelLabel = "إلغاء",
  onConfirm,
  onCancel,
  children,
}: {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
  onCancel: () => void;
  children?: ReactNode;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm">
      <div className="card-surface animate-pop-in w-full max-w-lg p-6 text-center">
        <h3 className="text-2xl font-extrabold">{title}</h3>
        {description ? <p className="mt-2 text-muted-foreground">{description}</p> : null}
        {children ? <div className="mt-4 text-right">{children}</div> : null}
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {onConfirm ? (
            <Btn onClick={onConfirm}>{confirmLabel}</Btn>
          ) : null}
          <Btn variant="outline" onClick={onCancel}>
            {cancelLabel}
          </Btn>
        </div>
      </div>
    </div>
  );
}

export function GameHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  const { setScreen, finishSection } = useGame();
  return (
    <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">{title}</h1>
        {subtitle ? <p className="text-sm text-muted-foreground">{subtitle}</p> : null}
      </div>
      <div className="flex gap-2">
        <Btn variant="outline" size="sm" onClick={() => setScreen("sections")}>
          الفقرات
        </Btn>
        <Btn variant="ghost" size="sm" onClick={finishSection}>
          إنهاء الفقرة
        </Btn>
      </div>
    </header>
  );
}

export function EndGameButton() {
  return null;
}

import { cn } from "@/lib/utils";
import { useGame } from "@/game/store";
import { playSfx, type SfxName } from "@/game/sfx";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type BtnProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "gold" | "outline" | "ghost" | "turquoise" | "danger" | "blue" | "green" | "purple";
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
  const solid =
    "btn-3d text-primary-foreground hover:brightness-110 active:translate-y-1 active:shadow-[inset_0_2px_0_rgba(255,255,255,0.4),0_2px_0_rgba(0,0,0,0.35)]";
  return (
    <button
      {...props}
      onClick={(e) => {
        playSfx(sfx, settings.sound);
        onClick?.(e);
      }}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full font-extrabold transition-all duration-150 disabled:cursor-not-allowed disabled:opacity-40",
        size === "sm" && "px-4 py-1.5 text-sm",
        size === "md" && "px-6 py-2.5 text-base",
        size === "lg" && "px-10 py-4 text-2xl",
        variant === "gold" && cn(solid, "bg-[image:var(--gradient-gold)]"),
        variant === "turquoise" &&
          cn(solid, "bg-[image:var(--gradient-cyan)] text-accent-foreground"),
        variant === "blue" && cn(solid, "bg-[image:var(--gradient-blue)] text-foreground"),
        variant === "green" && cn(solid, "bg-[image:var(--gradient-green)] text-foreground"),
        variant === "purple" && cn(solid, "bg-[image:var(--gradient-purple)] text-foreground"),
        variant === "danger" && cn(solid, "bg-[image:var(--gradient-red)] text-foreground"),
        variant === "outline" &&
          "border-[3px] border-border bg-secondary/70 text-foreground hover:border-primary hover:text-primary active:translate-y-0.5",
        variant === "ghost" && "text-muted-foreground hover:text-primary",
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

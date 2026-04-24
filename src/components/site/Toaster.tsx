import { useEffect, useState } from "react";
import { CheckCircle2 } from "lucide-react";

type Toast = { id: number; message: string };

let pushToast: ((msg: string) => void) | null = null;

export function toast(message: string) {
  pushToast?.(message);
}

export function Toaster() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    pushToast = (message: string) => {
      const id = Date.now() + Math.random();
      setToasts((t) => [...t, { id, message }]);
      setTimeout(() => {
        setToasts((t) => t.filter((x) => x.id !== id));
      }, 2600);
    };
    return () => {
      pushToast = null;
    };
  }, []);

  return (
    <div className="pointer-events-none fixed bottom-6 left-1/2 z-[100] flex -translate-x-1/2 flex-col gap-3">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="pointer-events-auto flex items-center gap-3 rounded-full border border-primary/40 bg-card/95 px-5 py-3 text-sm shadow-glow backdrop-blur-xl animate-float-up"
        >
          <CheckCircle2 className="h-4 w-4 text-primary" />
          <span className="text-foreground">{t.message}</span>
        </div>
      ))}
    </div>
  );
}
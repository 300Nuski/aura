import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Copy, Check, Diamond } from "lucide-react";

const genCode = () => {
  const part = () => Math.random().toString(36).slice(2, 6).toUpperCase();
  return `AURA-${part()}-${part()}`;
};

const STEPS = [
  "Konto in 60 Sekunden eröffnen — Verifizierung per E-Mail.",
  "Erste Einzahlung tätigen (min. 20 €) — Code wird automatisch angewendet.",
  "100% Bonus bis 1.500 € + 150 Freispiele sofort im Privé Salon.",
];

const BonusModal = ({ open, onOpenChange }) => {
  const [code, setCode] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (open) {
      setCode(genCode());
      setCopied(false);
    }
  }, [open]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      toast.success("Bonus-Code kopiert.");
    } catch {
      toast.error("Kopieren nicht möglich.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="bg-aura-ivory border border-[rgba(201,168,106,0.4)] sm:max-w-md rounded-2xl"
        data-testid="bonus-claim-dialog"
      >
        <DialogHeader>
          <div className="w-11 h-11 rounded-full bg-aura-goldtint border border-[rgba(201,168,106,0.4)] flex items-center justify-center mb-3">
            <Diamond className="w-5 h-5 text-aura-goldhover" fill="currentColor" />
          </div>
          <DialogTitle className="font-serif text-2xl font-medium">Ihr Willkommensbonus</DialogTitle>
          <DialogDescription className="text-sm text-aura-secondary">
            100% bis 1.500 € + 150 Freispiele. So einfach geht's:
          </DialogDescription>
        </DialogHeader>

        <ol className="mt-2 space-y-3">
          {STEPS.map((s, i) => (
            <li key={i} className="flex gap-3 text-sm text-aura-secondary leading-relaxed">
              <span className="font-mono text-xs font-semibold text-aura-gold mt-0.5">0{i + 1}</span>
              {s}
            </li>
          ))}
        </ol>

        <div className="mt-5 rounded-xl border border-dashed border-aura-gold/60 bg-aura-goldtint px-5 py-4 flex items-center justify-between gap-3">
          <span className="font-mono text-base sm:text-lg font-semibold tracking-[0.14em] text-aura-ink" data-testid="bonus-voucher-code">
            {code}
          </span>
          <button
            onClick={copy}
            className="rounded-full bg-aura-noir text-aura-ivory p-2.5 hover:bg-aura-goldhover transition-colors duration-300"
            aria-label="Code kopieren"
            data-testid="bonus-copy-btn"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>

        <p className="mt-4 text-[11px] text-aura-muted leading-relaxed">
          Demo-Vorschau: Der Code ist ein Beispiel und dient der Veranschaulichung. 18+ · Es gelten die AGB ·
          Durchspielbedingungen 25x.
        </p>
      </DialogContent>
    </Dialog>
  );
};

export default BonusModal;

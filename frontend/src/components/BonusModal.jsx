import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Copy, Check, Gift } from "lucide-react";

const CODE = "AURA-2026-ROYALE";
const METHODS = ["BTC", "ETH", "USDT", "VISA", "APPLE PAY", "SOFORT"];

const STEPS = [
  "Konto in 60 Sekunden eröffnen — Verifizierung per E-Mail.",
  "Erste Einzahlung tätigen (min. 20 €) — Code wird automatisch angewendet.",
  "100% Bonus bis 1.500 € + 150 Freispiele sofort auf dem Konto.",
];

const BonusModal = ({ open, onOpenChange, onDeposit }) => {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(CODE);
      setCopied(true);
      toast.success("Bonus-Code kopiert.");
    } catch {
      toast.error("Kopieren nicht möglich.");
    }
  };

  const deposit = () => {
    onDeposit(1000);
    toast.success("Demo-Einzahlung erfolgreich: +1.000 € Bonus gutgeschrieben.");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="bg-night-card border border-night-border text-white sm:max-w-md rounded-2xl"
        data-testid="bonus-claim-dialog"
      >
        <DialogHeader>
          <div className="w-11 h-11 rounded-xl bg-mint/15 border border-mint/30 flex items-center justify-center mb-3">
            <Gift className="w-5 h-5 text-mint" />
          </div>
          <DialogTitle className="font-display text-2xl font-extrabold">Dein Willkommensbonus</DialogTitle>
          <DialogDescription className="text-sm text-slate-400">
            100% bis 1.500 € + 150 Freispiele. So einfach geht's:
          </DialogDescription>
        </DialogHeader>

        <ol className="mt-2 space-y-3">
          {STEPS.map((s, i) => (
            <li key={i} className="flex gap-3 text-sm text-slate-400 leading-relaxed">
              <span className="font-mono text-xs font-bold text-mint mt-0.5">0{i + 1}</span>
              {s}
            </li>
          ))}
        </ol>

        <div className="mt-5 rounded-xl border border-dashed border-mint/50 bg-mint/10 px-5 py-4 flex items-center justify-between gap-3">
          <span className="font-mono text-base sm:text-lg font-bold tracking-[0.12em] text-mint" data-testid="bonus-voucher-code">
            {CODE}
          </span>
          <button
            onClick={copy}
            className="rounded-full bg-night-elevated border border-night-border text-white p-2.5 hover:border-mint/60 transition-colors duration-300"
            aria-label="Code kopieren"
            data-testid="bonus-copy-btn"
          >
            {copied ? <Check className="w-4 h-4 text-mint" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {METHODS.map((m) => (
            <span key={m} className="rounded-md bg-night-elevated border border-night-border px-2.5 py-1 text-[10px] font-mono font-bold text-slate-300">
              {m}
            </span>
          ))}
        </div>

        <button
          onClick={deposit}
          className="mt-5 w-full rounded-full bg-mint text-black font-extrabold text-sm py-3.5 hover:bg-mint-hover transition-colors duration-300 shadow-[0_0_22px_rgba(0,229,117,0.35)]"
          data-testid="bonus-deposit-confirm-btn"
        >
          Jetzt einzahlen · +1.000 € (Demo)
        </button>

        <p className="mt-3 text-[11px] text-slate-600 leading-relaxed">
          Demo-Simulation: Es fließt kein echtes Geld. 18+ · Es gelten die AGB · Umsatz 25x.
        </p>
      </DialogContent>
    </Dialog>
  );
};

export default BonusModal;

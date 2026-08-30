const Footer = () => (
  <footer className="border-t border-night-bordersub pt-8 pb-4 mt-4" data-testid="footer">
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
      <div>
        <p className="font-display font-extrabold text-sm mb-1">
          AURA <span className="text-mint">ROYALE</span>
        </p>
        <p className="text-xs text-slate-500 max-w-md leading-relaxed">
          © 2026 Aura Royale. Demo-Plattform — alle Spiele, Gewinne und Chat-Nachrichten nutzen Spielgeld
          und simulierte Daten. Keine Echtgeld-Glücksspiele.
        </p>
      </div>
      <div className="flex items-center gap-4">
        <span className="w-10 h-10 rounded-full border-2 border-[#FF3838] text-[#FF3838] font-mono font-bold text-[11px] flex items-center justify-center" data-testid="footer-age-badge">
          18+
        </span>
        <p className="text-[11px] text-slate-500 max-w-[240px] leading-relaxed">
          Glücksspiel kann süchtig machen. Hilfe: BZgA 0800&nbsp;1&nbsp;37&nbsp;27&nbsp;00 (kostenlos &amp; anonym).
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;

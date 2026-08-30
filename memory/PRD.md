# PRD — AURA ROYALE Casino Landingpage

## Original Problem Statement (deutsch)
"Erstelle mir eine Casino Landingpage mit einzigartigem Design, schlichten hellen farben und viele Animationen!"

## User Choices
- Reine Landingpage + kleine spielbare Demo-Spiele (kein Echtgeld, kein Backend nötig)
- Fokus: Klassiker — Roulette, Blackjack, Poker
- Name: vom Agenten erfunden → **AURA ROYALE — Grand Casino & Privé Club**
- Hero mit konkretem Bonusangebot (100% bis 1.500 € + 150 Freispiele) inkl. Bonus-Counter + Countdown

## User Personas
- Casino-Interessierte, die die Marke risikofrei kennenlernen wollen
- Design-affinie Besucher, die eine hochwertige, helle Luxus-Ästhetik erwarten (Anti-Klischee: kein dunkles Neon)

## Architektur
- Frontend-only React App (kein Backend in Benutzung)
- framer-motion (Scroll-Reveals, Hero-Reveal, Spiel-Animationen), lenis (Smooth Scrolling), sonner (Toasts), shadcn/ui (Dialog, Accordion), lucide-react (Icons)
- Alle Inhalte auf Deutsch, Ivory/Champagner/Gold-Palette, Cormorant Garamond + Plus Jakarta Sans + JetBrains Mono

## Implementiert (Stand: Juli 2026)
- Kinetischer Hero: Masked Line-by-Line Reveal, 3D-Maus-Parallax (rotierendes Deko-Rouletterad + schwebende Karten), animierter Bonus-Counter 0→1.500 €, 24h-Countdown, Live-Spieler-Ticker
- Glass-Navbar mit Anchor-Navigation (lenis scrollTo), Mobile-Menü
- Editoriale Slow-Marquee-Leiste (pausiert bei Hover)
- Manifest-Kapitel 01/02/03 (Roulette, Blackjack, Poker) mit Bildern, RTP-Badges, alternierendem Layout
- Spielbare Demo-Arena: SVG-Rouletterad (37 Segmente, Einsätze Rot/Schwarz/Gerade/Ungerade/Zahl, Chips 10–500, Verlauf, Guthaben) + Blackjack (Hit/Stand/Reset, Dealer-Logik ab 17, Asse korrekt, Blackjack 3:2, Gewinnserie)
- VIP-Bento-Grid mit Champagner-Bildkachel + 4 Privilegien
- FAQ-Accordion (4 Fragen)
- Noir-Footer mit Newsletter-Formular (MOCKED, nur Toast), 18+-Hinweis, Riesen-Wasserzeichen
- Bonus-Claim-Dialog mit generiertem Voucher-Code + Kopier-Button

## Verifiziert
- Roulette-Spin: Ergebnis korrekt ausgewertet, Guthaben aktualisiert (+100 € bei Rot)
- Blackjack: Austeilen, Halten, Dealer-Auswertung korrekt
- Bonus-Modal öffnet mit Code, Newsletter-Toast, Countdown läuft

## Backlog / nächste Schritte
- P1: Poker-Demo-Spiel (3. Minispiel)
- P1: Sound-Effekte (AudioContext-Chimes bei Gewinn)
- P2: Echtes Newsletter-Backend (z. B. Resend)
- P2: Mehrsprachigkeit (EN/DE Toggle)
- P2: Turnier-Kalender-Sektion

# CLAUDE.md – BildungsTandems

Leitfaden für Claude Code in diesem Repository.

## Projekt

PWA für das Peer-Learning-Programm **BildungsTandems** der Zukunftsstiftung Bildung.
Ältere Schüler:innen (**Coachs**) begleiten Grundschulkinder; betreut durch
**Lehrkräfte/Koordination**, organisiert durch die **Stiftung (Admin)**.

Aktueller Stand: **klickbarer Prototyp** mit Mock-Daten. Die Datenschicht ist hinter
einem abstrakten Vertrag gekapselt, damit später **Supabase (EU/Frankfurt, DSGVO)**
ohne UI-Umbau andocken kann.

## Tech-Stack

- **Angular 21** – standalone components, Signals, neue Control-Flow-Syntax (`@if`/`@for`),
  **zoneless** Change Detection.
- **SCSS** mit CSS-Custom-Property-Tokens (`src/styles/_tokens.scss`).
- **PWA** (`@angular/pwa`): Service Worker, Manifest, installierbar.
- Mobile-first, als zentrierte „App" (max. 480px) auch auf Desktop.

## Befehle

```bash
npm start                              # Dev-Server (http://localhost:4200)
npm run build                          # Produktions-Build (inkl. Service Worker)
npx ng build --configuration development# schneller Dev-Build / Typecheck
npm test                               # Unit-Tests
```

## Architektur

- `src/app/core/models/models.ts` – alle Datenmodelle (Verträge zur UI).
- `src/app/core/data/` – **Datenschicht**:
  - `data.service.ts` – abstrakter Vertrag (DI-Token + Interface).
  - `mock-data.service.ts` – aktuelle In-Memory-Implementierung (Signals).
  - `mock-seed.ts` – Beispieldaten.
  - `data.providers.ts` – **einziger Ort**, an dem Mock↔Supabase getauscht wird.
- `src/app/core/auth/` – Mock-Auth (Rolle als Signal) + Route-Guards.
- `src/app/core/services/` – `selectors.service.ts` (abgeleitete Sichten),
  `notification.service.ts` (In-App-Feed + Browser-Notification-Demo).
- `src/app/layout/app-shell/` – Hülle mit Topbar + rollenabhängiger Bottom-Navigation.
- `src/app/features/{coach,teacher,admin,shared-pages,auth}/` – Seiten (lazy geladen).
- `src/app/shared/ui/` – wiederverwendbare Komponenten; `shared/pipes/` – `DatumPipe`.

## Konventionen

- Standalone-Komponenten, `inject()` statt Constructor-DI.
- Signals für State; `computed()` für Ableitungen; `input()`/`output()` statt Decorators.
- Dateinamen: `*.page.ts` für Routen-Seiten, `*.ts` für UI-Komponenten (kein `.component`).
- Deutschsprachige Bezeichner in Domänencode (Coach, Termin, Lernpfad …).
- UI spricht **nur** gegen `DataService` (abstrakt), nie gegen die Mock-Klasse.

## Datenschutz (wichtig)

Es geht um **minderjährige Kinder**. Im Prototyp nur fiktive Daten. Vor Echtbetrieb:
Supabase EU-Region, RLS-Policies, Einwilligungen/AVV, Datensparsamkeit (Coachees nur
mit Vornamen).

## Enthalten (Prototyp-Stand)

- Termine: sehen/vorschlagen, Detailseite mit Teilnahme, Vorbereitungs-Checkliste,
  Treffen dokumentieren (→ Status erledigt + Anwesenheit), Erinnerung testen.
- Automatische Erinnerungen (`reminder.service.ts`) für anstehende Treffen.
- Lernpfade (Stepper + Quiz), Vorlese-Funktion (`vorlesen.ts`, Web Speech API).
- Materialien mit Suche, Kategorie-Filter, „zuletzt geöffnet".
- Login per Demo-Profil **oder** Einladungscode (Demo-Code `BT-DEMO-2026`).
- Programm-Zeitstrahl (`programm.page.ts`) Auftakt→Abschlussfeier; Coach-Zertifikat
  (`coach-zertifikat.page.ts`, druckbar via neues Fenster + window.print).
- **Chat** (`chat.service.ts` + `shared-pages/chat-*.page.ts`): Kohorten-Kanal (Coaches
  je Schule), Kollegiums-Kanal (Lehrkräfte schulübergreifend), Lehrer↔Coach-Direkt.
  Rechte: Coach antwortet, startet keinen Lehrer-Chat; Lehrer↔Coach für Koordination
  einsehbar (read-only); Admin sieht/schreibt überall. Topbar-💬 mit Ungelesen-Badge.

## Nächste Schritte (noch offen)

- Supabase-Implementierung des `DataService` + EU-Region + RLS.
- Echtes Web-Push (VAPID + Supabase Edge Function) statt Browser-Notification-Demo.
- Echter Einladungs-/Onboarding-Flow mit sicherem Link statt Demo-Code.
- Reflexions-Auswertung (Trend), anonymisierter Evaluations-Export (TU Dortmund).

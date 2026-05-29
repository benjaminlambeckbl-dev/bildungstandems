# BildungsTandems 📲

Eine **Progressive Web App (PWA)** für das Peer-Learning-Programm
[BildungsTandems](https://zukunftsstiftung-bildung.de/peer-learning-programme/bildungstandems/uebersicht/)
der Zukunftsstiftung Bildung.

Ältere Schüler:innen (**Coachs**) begleiten Grundschulkinder über ein Schuljahr,
betreut von **Lehrkräften** und organisiert von der **Stiftung**.

## 🔗 Live-Demo

**https://benjaminlambeckbl-dev.github.io/bildungstandems/**

Einfach öffnen und ein **Demo-Profil** wählen (Coach / Koordination / Organisation) –
oder per Code anmelden (`BT-DEMO-2026`). Tipp: am Handy „Zum Startbildschirm hinzufügen".

> Aktualisieren der Demo nach Änderungen: `npm run deploy`

> **Status:** Klickbarer Prototyp mit Mock-Daten. Die Datenschicht ist so gekapselt,
> dass später **Supabase (EU-Region, DSGVO-konform)** ohne UI-Änderungen andockt.

## Funktionen

| Rolle | Kann … |
|------|--------|
| **Coach** (Schüler:in) | Termine sehen/vorschlagen + Erinnerungen, Materialien, Lernpfade durchlaufen, Infos der Lehrkraft empfangen, Reflexion schreiben |
| **Lehrkraft** | Coach-Zugänge gewähren, Termine bestätigen/absagen, Infos senden, eigene Lernstrecken & Material, Reflexionen einsehen |
| **Admin (GLS)** | Alle Schulen, Tandems und Termine im Überblick |

## Schnellstart

```bash
npm install
npm start          # http://localhost:4200
```

Auf dem Login-Screen ein Demo-Profil wählen (Coach / Koordination / Organisation).

## Build & PWA

```bash
npm run build      # Produktions-Build inkl. Service Worker
```

Die App ist installierbar („Zum Startbildschirm hinzufügen") und zeigt Erinnerungen
& Infos als Browser-Benachrichtigung (Demo; echtes Web-Push folgt mit Supabase).

## Tech

Angular 21 (standalone, Signals, zoneless) · SCSS · @angular/pwa · mobile-first.

Architektur & Konventionen: siehe [CLAUDE.md](CLAUDE.md).

## Datenschutz

Es geht um Daten **minderjähriger Kinder**. Der Prototyp nutzt ausschließlich fiktive
Daten. Vor einem Echtbetrieb sind EU-Hosting, RLS, Einwilligungen/AVV und
Datensparsamkeit umzusetzen.

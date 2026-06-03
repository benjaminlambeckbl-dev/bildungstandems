# Angebots-Grundlage – BildungsTandems / ZSB-Plattform

> Arbeitsdokument zur Vorbereitung des Angebots **nach dem Workshop**. Die
> Aufwände sind grobe Orientierung (T-Shirt-Größen). **Tagessatz/Preise** trägst du
> ein. Finaler Umfang hängt von den Workshop-Entscheidungen ab (siehe offene Punkte).

**Aufwands-Größen:** S ≈ 1–2 PT · M ≈ 3–6 PT · L ≈ 7–15 PT · XL ≈ >15 PT (PT = Personentage)

---

## Phase 0 – Bereits erbracht (Prototyp, im Festpreis/anteilig)

Klickbarer, installierbarer PWA-Prototyp (Angular 21) mit drei Rollen, kompletter
UI für Termine, Material, Lernpfade, FAQ, Chat, Feedback/Auswertung, Programm-Jahr,
Zertifikat, Formulare – mit **Mock-Daten** und **Supabase-ready** gekapselter
Datenschicht. Live + öffentlich deploybar.
→ *Dient als gemeinsame Diskussions- und Abnahmegrundlage.*

---

## Phase 1 – Tragfähiges Fundament (Voraussetzung für Echtbetrieb)

| AP | Leistung | Aufwand |
|---|---|---|
| 1.1 | **Supabase EU** aufsetzen (Postgres, Datenmodell-Migration aus den bestehenden Modellen) | M |
| 1.2 | **Auth & Login** (Supabase Auth) + sicherer **Einladungs-/Onboarding-Flow** statt Demo-Code | M |
| 1.3 | **Row-Level-Security & Rollenrechte** serverseitig spiegeln (inkl. Chat-/Auswertungs-Sichtbarkeit) | M–L |
| 1.4 | DataService-Implementierung gegen Supabase (UI bleibt unverändert) | M |
| 1.5 | Hosting/Deployment-Pipeline, Umgebungen (Test/Prod), Monitoring | S–M |

## Phase 2 – Benachrichtigungen & Kommunikation live

| AP | Leistung | Aufwand |
|---|---|---|
| 2.1 | **Echtes Web-Push** (VAPID + Supabase Edge Function, Service Worker) | M |
| 2.2 | **E-Mail-Benachrichtigungen** (Erinnerungen, Einladungen) | S–M |
| 2.3 | **Chat live** (Supabase Realtime) statt Mock | M |
| 2.4 | **Chat-Moderation/Meldefunktion + Wortfilter** (Kinderschutz) | M |

## Phase 3 – Inhalte & Schuljahres-Logik (CMS)

| AP | Leistung | Aufwand |
|---|---|---|
| 3.1 | **Material-/Inhalts-Pflege (CMS)** für ZSB: anlegen, kategorisieren, taggen | M–L |
| 3.2 | **Zeitgesteuerte Freischaltung** serverseitig + Phasen-Logik | S–M |
| 3.3 | **FAQ-Pflege** (Redaktion) | S |
| 3.4 | Datei-Upload/Storage (PDF, Bilder) inkl. Rechte | M |

## Phase 4 – Verwaltung & Organisation

| AP | Leistung | Aufwand |
|---|---|---|
| 4.1 | **Trainer-Rolle (ZSB)** inkl. Rechte/Ansichten *(falls im Workshop bestätigt)* | M |
| 4.2 | **Schulen anlegen, Trainer zuweisen** (Admin) | M |
| 4.3 | **Jahreswechsel-Logik** der Nutzer (Archiv/Übergang) | M–L |
| 4.4 | **Formulare**: echte Integration (z. B. JotForm) + Zuweisung + Status | S–M |
| 4.5 | **Feedback-Auswertung** ausbauen (Trends, Export) | M |

## Phase 5 – Datenschutz, Qualität, Betrieb

| AP | Leistung | Aufwand |
|---|---|---|
| 5.1 | **DSGVO-Paket**: AVV, Einwilligungen (Eltern/Minderjährige), Lösch-/Auskunfts-/Exportkonzept | M |
| 5.2 | **Evaluations-Export** (anonymisiert, TU Dortmund) | S–M |
| 5.3 | **Barrierefreiheit** & Performance (>1000 Nutzer:innen), Lasttest | M |
| 5.4 | **Tests** (Unit/E2E) + Abnahme + Doku/Schulung | M–L |

---

## Annahmen
- MVP-Umfang wird im Workshop festgelegt; nicht alle Phasen müssen sofort beauftragt werden.
- Inhalte (Texte, Materialien, FAQ) werden von der ZSB redaktionell geliefert.
- Designsystem orientiert sich an der ZSB-CI (bereits angelegt).

## Nicht enthalten (sofern nicht beauftragt)
- Native App-Store-Apps (PWA deckt Installation + Push ab).
- Inhaltliche Erstellung von Lernmaterialien/Trainings.
- Drittlizenzen (z. B. JotForm, Mail-Versand) – Betriebskosten beim Kunden.

## Empfohlenes Vorgehen
**Workshop → MVP-Festlegung → Angebot → Phase 1+2 zuerst** (Fundament + Live-Kommunikation),
danach iterativ Phase 3–5. So entsteht früh ein nutzbares System.

---

*Preise/Tagessatz/Zeitplan:* ____________________________

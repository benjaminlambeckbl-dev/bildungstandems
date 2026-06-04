# Angebot (Grundlage) – BildungsTandems / ZSB-Plattform

> Arbeitsdokument. **Tagessatz angenommen: 800 €/PT** (anpassbar). Preise = Orientierung,
> finaler Umfang nach Workshop. Budget Kunde: **20.000 €** → daraus ein klar
> abgegrenzter, **pilotfähiger** erster Schritt (Version 1) + Roadmap.

---

## Version 1 – „Pilot" (Festpreis 20.000 €)

Fokus: **Schüler:innen/Coaches + Koordination**, Kernflüsse **Termine, Material,
Lernpfade, Feedback** – der bestehende Prototyp wird „echt" gemacht (Backend, Login,
DSGVO-Basis), pilotierbar an 1–2 Schulen. Günstig, weil Oberfläche + Datenschicht stehen.

| Arbeitspaket | PT |
|---|---|
| Supabase EU aufsetzen + Datenmodell/Migration | 5 |
| Datenschicht real anbinden (UI bleibt 1:1) | 4 |
| Login + sicherer Einladungs-/Onboarding-Flow (Coach + Koordination) | 4 |
| Rollen-/Schulrechte serverseitig (RLS) | 3 |
| Erinnerungen **live** – eine Variante (Web-Push **oder** E-Mail) | 3 |
| DSGVO-Basics (EU, Einwilligungen, Datensparsamkeit, Lösch-Konzept) | 2 |
| Deployment/Betrieb + Abnahme + Übergabe/Doku | 3 |
| Projektleitung / Puffer | 1 |
| **Summe** | **25 PT → 20.000 €** |

*Der bereits erstellte **Prototyp** (≈ 8–15 PT) wird als Vorleistung eingebracht.*

---

## Funktionsübersicht – was ist wann enthalten?

Legende: ✅ enthalten · ◐ Basis enthalten, Ausbau später · ⏳ Folgebudget · — nicht

| Funktion | Prototyp (heute) | **V1 – Pilot (20k)** | Ausbau |
|---|:---:|:---:|:---:|
| **Login & Rollen** (Coach / Koordination / Admin) | Demo/Code | ✅ echtes Login + Einladung | |
| Trainer-Rolle (ZSB) | — | — | ⏳ |
| **Termine** sehen/vorschlagen/bestätigen | ✅ Mock | ✅ live | |
| Termin-Detail (Teilnahme, Checkliste, Doku) | ✅ | ✅ live | |
| **Kalenderansicht** | ✅ | ✅ | |
| **Erinnerungen** | Demo | ◐ 1 Variante (Push *oder* Mail) | ⏳ 2. Variante |
| **Materialien** (Suche, Filter, Tags, zuletzt) | ✅ | ✅ live | |
| Material-Upload / Datei-Storage | — | ◐ durch uns gepflegt | ⏳ Self-Service-Upload |
| **CMS-Pflegeoberfläche** (Inhalte selbst pflegen) | — | — | ⏳ |
| **Zeitgesteuerte Freischaltung** | ✅ | ✅ | |
| **Lernpfade** (Stepper, Quiz, Vorlesen) | ✅ | ✅ live (Fortschritt) | |
| **FAQ** (durchsuchbar) | ✅ | ✅ (Redaktion: ZSB) | |
| **Reflexion** nach Treffen | ✅ | ✅ | |
| **Tägliches Kurz-Feedback** | ✅ | ✅ | |
| **„Hilfe nötig?"**-Bedarfsmeldung | ✅ | ✅ | |
| **Auswertung / Diagramme** | ✅ | ◐ Basis | ⏳ Trends, Export |
| **Info-Kanal** Lehrkraft → Coach | ✅ | ✅ live | |
| **Gruppen-/Direkt-Chat** (Kohorte, Kollegium) | ✅ Mock | — | ⏳ inkl. Moderation |
| Chat-Moderation / Meldefunktion | — | — | ⏳ (Kinderschutz) |
| Wichtige Nachrichten anheften (Sticky) | ✅ | — | ⏳ (mit Chat) |
| **Programm-Zeitstrahl** | ✅ | ✅ | |
| **Coach-Zertifikat** (PDF) | ✅ | ✅ | |
| **Formulare** (Status) | ✅ Mock | — | ⏳ JotForm-Integration |
| **Verwaltung**: Schulen anlegen, Trainer zuweisen | — | — | ⏳ |
| Jahreswechsel-Logik | — | — | ⏳ |
| **Echtes Web-Push** (beide Plattformen) | Demo | ◐ | ⏳ |
| **DSGVO**: EU-Hosting, Datensparsamkeit, Einwilligungen | konzipiert | ✅ Basis | ⏳ AVV, Self-Service Auskunft/Löschung |
| **Evaluations-Export** (TU Dortmund) | — | — | ⏳ |
| **PWA** installierbar + Offline-Lesen | ✅ | ✅ | |

---

## Wartung & Support (Jahr 1) – jährlich

Empfohlen, da der Pilot über ein Schuljahr läuft. Enthält Betrieb (Monitoring),
Sicherheits-/Abhängigkeits-Updates und Fehlerbehebung.

| Paket | Leistung | Umfang/Monat | Preis/Monat | Jahr 1 |
|---|---|:---:|:---:|:---:|
| **Basis** | Betrieb, Security-/Dependency-Updates, kritische Bugfixes, E-Mail-Support | ~0,5 PT | 400 € | **4.800 €** |
| **Standard** *(empfohlen)* | Basis + kleine Anpassungen + Inhalts-Support + schnellere Reaktion | ~1 PT | 800 € | **9.600 €** |
| **Pilot-Begleitung** | Standard + Weiterentwicklungs-Kontingent (iterative Verbesserungen im Schuljahr) | ~2 PT | 1.500 € | **18.000 €** |

*Optional einmalig:* **Einführung/Schulung** der Koordinator:innen (½–1 Tag) ~400–800 €.

---

## Roadmap Ausbau (späteres Budget, z. B. RAG-Stiftung)

| Stufe | Inhalt | Aufwand | Orientierung |
|---|---|---|---|
| **B – MVP+** | Live-Gruppenchat + Moderation, CMS-Light, Auswertung-Ausbau, 2. Benachrichtigung | ~30–45 PT | ~24.000–36.000 € |
| **C – Vollausbau** | Trainer-Rolle, Verwaltung/Jahreswechsel, Formular-Integration, Storage/Upload, Evaluations-Export, Barrierefreiheit/Last, Tests | ~40–55 PT | ~32.000–44.000 € |

---

## Betriebskosten (laufend, beim Kunden)
- **Supabase EU**: Pilot meist kostenlos (Free-Tier), bei Bedarf ~25 €/Monat.
- **Mailversand**: gering (~0–20 €/Monat).
- **Domain/Hosting** der PWA: gering bzw. über bestehende Infrastruktur.

## Annahmen
- Inhalte (Materialien, FAQ-Texte, Lernpfade) liefert die ZSB redaktionell.
- Pilot an 1–2 Schulen; Datensparsamkeit (Coachees nur Vornamen) bleibt erhalten.
- Eltern-Einwilligungen werden organisatorisch durch die ZSB eingeholt.

## Nicht im Pilot enthalten (siehe Roadmap)
Gruppen-/Direkt-Chat inkl. Moderation, CMS-Selbstpflege, Trainer-Rolle, Verwaltung/
Jahreswechsel, Formular-Integration, Datei-Upload, Evaluations-Export, zweite
Benachrichtigungs-Variante.

## Preis-Zusammenfassung
- **Version 1 (Pilot), Festpreis:** **20.000 €**
- **Wartung & Support Jahr 1:** 4.800 € / **9.600 €** / 18.000 € (Paket wählbar)
- **Ausbau B/C:** später, ~24.000–44.000 € je Stufe
- Tagessatz Kalkulationsbasis: 800 €/PT

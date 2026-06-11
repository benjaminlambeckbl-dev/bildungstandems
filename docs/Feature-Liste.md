# Feature-Liste – BildungsTandems / ZSB (nach Bereichen)

Bündelt Prototyp + Lastenheft + **Workshop-Wünsche (11.06.2026)**.
**Status:** 🟢 V1 (im 20k-Piloten) · ◐ V1-Basis (Ausbau folgt) · ⏳ Ausbau (Folgebudget)
**Quelle:** P = im Prototyp da · L = Lastenheft · W = neu aus Workshop

---

## 1 · Materialverwaltung & Inhalte
| Feature | Status | Quelle |
|---|:--:|:--:|
| Materialien ansehen: Suche, Kategorien, **Tags**, „zuletzt geöffnet“ | 🟢 | P/L |
| Material **auf der Plattform ansehen** (nicht nur PDF-Download) | ◐ | W |
| Lernpfade (Stepper, Quiz, Vorlesen, Fortschritt) | 🟢 | P |
| FAQ (durchsuchbar, kategorisiert) | 🟢 | P/L |
| **Zeitgesteuerte Freischaltung** (Datum/Phase) | ◐ | P/L/W |
| …automatisch nach 1./2. Training freischalten | ⏳ | W |
| **CMS-Editor** (Material selbst anlegen: fett/kursiv/Überschriften) | ⏳ | W |
| Datei-Upload / Storage (PDF, Bilder) | ⏳ | L/W |
| **Nutzungs-Statistik** (wie oft Material geöffnet) | ⏳ | W |

## 2 · Kommunikation / Chat
| Feature | Status | Quelle |
|---|:--:|:--:|
| Info-Kanal Lehrkraft → Coach (einseitig) | 🟢 | P |
| Direktnachricht Lehrkraft ↔ **Schulkoordination Grundschule** | ◐ | W |
| **Gruppenchat** (Tandem/Coaches, Koordination kann Gruppe anschreiben) | ⏳ | L/W |
| Schul-/Partnerschulgruppen (auto) | ⏳ | L |
| Moderation / Meldefunktion (Kinderschutz) | ⏳ | L |
| Wichtige Nachricht „Sticky“ | ⏳ | L |

## 3 · Organisation – Termine & Kalender
| Feature | Status | Quelle |
|---|:--:|:--:|
| Termine sehen / vorschlagen / bestätigen + Detail + Doku | 🟢 | P/L |
| Kalenderansicht (Monatsgitter) | 🟢 | P/L |
| Erinnerungen (1 Kanal: Push **oder** E-Mail) | ◐ | P/L |
| **Termin-Hoheit klären**: wer stellt ein / bestätigt (Trainer/Lehrkraft/SuS) | 🟢* | W |
| Terminabstimmung (Poll) | ⏳ | L |
| **Trainings-Zeitplan + automatische Lücken-Erkennung** | ⏳ | W |

\* als Regel im Rollenkonzept zu definieren (kein großer Bau)

## 4 · Feedback & Monitoring
| Feature | Status | Quelle |
|---|:--:|:--:|
| Reflexion nach Treffen · tägliches Kurz-Feedback | 🟢 | P/L |
| „Hilfe nötig?“ (Coach) | 🟢 | P/L |
| „Hilfe nötig?“ **auch für Schulkoordination** | ◐ | W |
| Auswertung / Diagramme (je Schule/Zeitraum) | ◐ | P/L |
| **Ampel-Monitoring** (grün/gelb/rot je Schule) | ⏳ | W |
| Frühwarnung / gezielte Steuerung der Begleitung | ⏳ | L/W |

## 5 · Formulare
| Feature | Status | Quelle |
|---|:--:|:--:|
| Formulare zuweisen + Status (z. B. JotForm) | ⏳ | L/W |
| Hinweis: Fotoerlaubnis läuft **über Lehrkräfte**, nicht SuS | ⏳ | W |

## 6 · Benutzer-, Rollen- & Rechteverwaltung
| Feature | Status | Quelle |
|---|:--:|:--:|
| Login + Rollen (Coach / Lehrkraft / Admin) | 🟢 | P/L |
| **Rollen-/Rechtematrix serverseitig (RLS)** – Kernthema | 🟢 | L/W |
| **Trainer:in-Rolle** (sieht nur eigene Schulen, nicht ZSB-Meta) | ⏳ | W |
| Schulen anlegen · Nutzer einladen/zuweisen | ◐ | L/W |
| Trainer zuweisen | ⏳ | L/W |
| Jahreswechsel-Logik der Nutzer | ⏳ | L |
| Admin-Backend: Termine/Material für Schulen einstellen | ◐ | W |

## 7 · Datenmodell & Schulstruktur
| Feature | Status | Quelle |
|---|:--:|:--:|
| **Schul-Kooperation** Grundschule ↔ weiterführend (1 weiterf. → bis 3 Grundsch.) | 🟢 | W |
| Tandem = Coach + Coachees (Grundschulkinder **nur Vornamen, nicht in App**) | 🟢 | P/W |
| ZSB-Reiter **„Tandems“ raus** → unter der Schule aufhängen | 🟢 | W |
| **Änderungs-Verlauf/Historie** (Drop-outs sichtbar, 15→5) | ⏳ | W |

## 8 · Auswertung & Export
| Feature | Status | Quelle |
|---|:--:|:--:|
| Coach-Zertifikat (PDF) + Namenserfassung | 🟢 | P/W |
| **Excel-/Berichts-Export** (Trainings, Schülerzahlen, Stadtverteilung, Stimmung, Namen) | ⏳ | W |
| Stimmung je Schule exportierbar | ⏳ | W |

## 9 · Onboarding & Login
| Feature | Status | Quelle |
|---|:--:|:--:|
| Sicherer Einladungs-/Login-Flow | 🟢 | L/W |
| **QR-Code-Onboarding** (Schule → QR → SuS scannen → Schule zugeordnet) | ⏳ | W |
| **Schul-Filter/Suche** (Stadt, Schulform, Sozialindex; >100 Schulen) | ⏳ | W |

## 10 · Nicht-funktional / Design
| Feature | Status | Quelle |
|---|:--:|:--:|
| PWA installierbar + Offline | 🟢 | P |
| **Responsive Design** (Handy/Desktop) | 🟢 | P/W |
| Schüler-UI **minimalistischer**, weniger Emojis, weniger Scrollen | 🟢 | W |
| DSGVO-Basis: EU-Hosting, Datensparsamkeit, Einwilligungen | ◐ | L/W |
| Rollenbasierter Zugriff | 🟢 | L |
| Performance > 1000 Nutzer:innen / Lasttest | ⏳ | L |
| CI-/Oberflächen-Anpassbarkeit | ⏳ | W |

---

## V1-Fokus (Vorschlag für den 20k-Piloten)
Prototyp **echt machen** (Backend/Login/RLS, DSGVO-Basis) + günstige Must-haves:
Termine/Kalender, Material ansehen (inkl. zeitgest. Freischaltung-Basis), Lernpfade, FAQ,
Reflexion/Feedback/„Hilfe nötig?“ (inkl. Koordination), **Schul-Kooperations-Datenmodell**,
Auswertung-Basis, Zertifikat, responsives & schlankeres Schüler-UI.

## Klar Ausbau (Roadmap, Folgebudget)
CMS-Editor + Upload, Gruppenchat + Moderation, Ampel-Monitoring, Trainer-Rolle +
Verwaltung/Jahreswechsel, QR-Onboarding, Schul-Filter, Excel-Export, Trainings-Lücken-
Erkennung, Änderungs-Historie, Formular-Integration.

> Endgültige Zuordnung V1 ⇄ Ausbau im nächsten Schritt mit Sören (Rollen-/Datenmodell).

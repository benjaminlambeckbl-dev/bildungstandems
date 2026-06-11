# Berechtigungsmatrix – Rollen × Features (Lastenheft ZSB)

**Rollen (laut Lastenheft 2.1 / 4.6):**
Admin (ZSB) · Trainer:in (ZSB, Begleitung) · Koordination (Schule, primäre Zielgruppe) ·
Schüler:in (perspektivisch).

**Legende:**
✅ Verwalten (anlegen/bearbeiten/löschen, ggf. systemweit) ·
🟢 Nutzen/Schreiben (eigener Bereich) ·
👁️ Nur lesen/einsehen ·
— kein Zugriff ·
◐ perspektivisch/später (Schüler:innen)

> *Geltungsbereich:* Admin = systemweit · Trainer = nur **betreute Schulen** ·
> Koordination = nur **eigene Schule** · durchgesetzt über rollenbasierten Zugriff (RLS, DSGVO).

---

## 1 · Lernen & Inhalte (4.1)

| Feature | Admin | Trainer | Koordination | Schüler:in |
|---|:--:|:--:|:--:|:--:|
| Materialien ansehen / nutzen (Suche, Tags) | ✅ | 🟢 | 🟢 | ◐ |
| Inhalte/Materialien pflegen (CMS) | ✅ | 🟢 | 👁️ | — |
| Zeitgesteuerte Freischaltung steuern | ✅ | 🟢 | — | — |
| Schuljahres-Phasen/Struktur pflegen | ✅ | 🟢 | 👁️ | — |
| FAQ nutzen (Selbsthilfe) | 🟢 | 🟢 | 🟢 | ◐ |
| FAQ pflegen | ✅ | 🟢 | — | — |
| Onboarding durchlaufen | — | 🟢 | 🟢 | ◐ |

## 2 · Kommunikation / Chat (4.2)

| Feature | Admin | Trainer | Koordination | Schüler:in |
|---|:--:|:--:|:--:|:--:|
| Schulgruppen-Chat | ✅ | 🟢 | 🟢 | ◐ |
| Partnerschulgruppen-Chat | ✅ | 🟢 | 🟢 | ◐ |
| Frei definierbare Gruppen | ✅ | 🟢 | 👁️ | — |
| Direktnachrichten (Details s. u.) | ✅ | 🟢 | 🟢 | ◐ |
| Wichtige Nachricht „Sticky“ | ✅ | 🟢 | 🟢 | — |

### Direktchat – wer darf wen anschreiben? (4.2)

| Initiator ↓ \ Empfänger → | Admin | Trainer | Koordination | Schüler:in |
|---|:--:|:--:|:--:|:--:|
| **Admin** | – | ✅ | ✅ | ✅ |
| **Trainer** | ✅ | (✅) | ✅ | — |
| **Koordination** | ✅ | ✅ | ✅ | ✅ |
| **Schüler:in** | — | — | ↩︎ nur antworten | ◐ |

*↩︎ Schüler:innen starten keinen Chat mit Erwachsenen, dürfen aber auf eine von der
Koordination eröffnete Unterhaltung antworten. Lehrkraft↔Schüler-Chats sind für die
Koordination einsehbar (Kinderschutz).*

## 3 · Organisation – Termine & Kalender (4.3)

| Feature | Admin | Trainer | Koordination | Schüler:in |
|---|:--:|:--:|:--:|:--:|
| Termine ansehen | ✅ alle | 🟢 betreute | 🟢 Schule | ◐ eigene |
| Termine anlegen/verwalten | ✅ | 🟢 global/Training | 🟢 Schule | ◐ vorschlagen |
| Kalender (persönlich/schul/global) | ✅ | 🟢 | 🟢 | ◐ |
| Terminabstimmung | ✅ | 🟢 | 🟢 | ◐ |
| Erinnerungen erhalten (Push/E-Mail) | 🟢 | 🟢 | 🟢 | ◐ |

## 4 · Feedback & Monitoring (4.4)

| Feature | Admin | Trainer | Koordination | Schüler:in |
|---|:--:|:--:|:--:|:--:|
| Feedback geben („Wie lief es?“) | — | — | 🟢 | ◐ |
| Bedarfsmeldung („Hilfe nötig?“) | — | — | 🟢 | ◐ |
| Auswertung/Diagramme sehen | ✅ alle | 🟢 betreute | 🟢 Schule | — |

## 5 · Formulare (4.5)

| Feature | Admin | Trainer | Koordination | Schüler:in |
|---|:--:|:--:|:--:|:--:|
| Formulare ausfüllen | 🟢 | 🟢 | 🟢 | ◐ |
| Formulare zuweisen / Status verwalten | ✅ | 🟢 betreute | 🟢 Schule | — |

## 6 · Benutzer- & Rollenverwaltung (4.6)

| Feature | Admin | Trainer | Koordination | Schüler:in |
|---|:--:|:--:|:--:|:--:|
| Schulen anlegen | ✅ | — | — | — |
| Nutzer einladen/zuweisen | ✅ | 🟢 betreute | 🟢 eigene Schule | — |
| Trainer zuweisen | ✅ | — | — | — |
| Jahreswechsel-Logik | ✅ | — | — | — |
| Rollen-/Rechteverwaltung | ✅ | — | — | — |

---

## Hinweise / Mapping zum Prototyp
- **Schüler:in** ist im Lastenheft „perspektivisch" – im aktuellen Prototyp bereits als
  **Coach** umgesetzt (Termine, Material, Lernpfade, Feedback).
- **Koordination** ≈ im Prototyp **Lehrkraft/Koordination**.
- **Trainer:in (ZSB)** ist im Prototyp **noch nicht** abgebildet (dort bündelt **Admin**
  die ZSB-Rolle) → eigene Rolle = Roadmap/Ausbau.
- Querschnitt (alle Rollen): rollenbasierter Zugriff, EU-Hosting, Datensparsamkeit (DSGVO).
- Zellen mit Geltungsbereich („betreute/Schule/eigene") werden serverseitig per RLS erzwungen.

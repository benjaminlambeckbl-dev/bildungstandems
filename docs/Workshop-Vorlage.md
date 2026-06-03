# Workshop-Vorbereitung – BildungsTandems / ZSB-Schulbegleitungsplattform

**Ziel des Workshops:** gemeinsames, tieferes Verständnis schaffen und die offenen
Punkte klären, damit wir ein belastbares **Angebot** erstellen können.

**🔗 Live-Demo (vorab anschauen, klickbar am Handy):**
https://benjaminlambeckbl-dev.github.io/bildungstandems/
Demo-Profile: *Lea Sommer* (Coach), *Frau Vogel* (Koordination), *Stiftungs-Team*
(Organisation) – oder Tab „Mit Code": `BT-DEMO-2026`.

---

## 1. Was schon steht (klickbarer Prototyp)

Geordnet nach den **fünf Bausteinen** aus eurem Lastenheft:

| Baustein | Im Prototyp enthalten |
|---|---|
| **Lernen & Inhalte** | Materialien (Suche, Kategorie-Filter, Tags, „zuletzt geöffnet"), **Lernpfade** mit Quiz & Vorlesen, **FAQ** (durchsuchbar), **zeitgesteuerte Freischaltung** von Inhalten entlang des Schuljahres |
| **Kommunikation** | **Chat**: Kohorten-Kanal, Kollegiums-Kanal, Lehrkraft↔Coach (mit Rollenrechten, Koordinations-Einsicht), **wichtige Nachrichten anheften**; einseitiger Info-Kanal Lehrkraft→Coach |
| **Organisation** | Termine sehen/vorschlagen/bestätigen, **Detailseite** (Teilnahme, Checkliste, Treffen dokumentieren), **Kalenderansicht**, automatische **Erinnerungen** |
| **Reflexion / Feedback** | Reflexion nach Treffen, **tägliches Kurz-Feedback**, **„Hilfe nötig?"**, **Auswertung mit Diagrammen** (je Schule/Zeitraum) |
| **Verwaltung** | Drei Rollen mit rollenbasierter Navigation, Coach-Einladung (Code), Programm-Zeitstrahl, Coach-Zertifikat, **Formulare** mit Status |

> Hinweis: Prototyp mit **fiktiven Daten**, ohne Backend – Eingaben werden noch nicht
> dauerhaft gespeichert. Genau das stimmen wir jetzt ab.

---

## 2. Was wir nach eurem Termin ergänzt haben

Aus Sophies Kommentaren (Fokus **Schüler:innen** + „Terminverwaltung, Material,
Feedback, Lernpfade"): FAQ, Kalender, Auswertung/Diagramme, „Hilfe nötig?", tägliches
Feedback, zeitgesteuerte Freischaltung, Sticky-Chat, Tags, Formulare.

---

## 3. Offene Punkte – im Workshop zu klären

1. **Zielgruppen-Priorität fürs MVP:** Koordinator:innen (Lastenheft) **vs.**
   Schüler:innen/Coaches (euer Termin)? Wer ist Haupt-Nutzer:in zuerst?
2. **Rolle „Trainer:in ZSB":** eigene Rolle (Schulbegleitung) nötig? Heute haben wir
   nur Coach / Koordination / Admin.
3. **Schüler-Kommunikation:** einseitiger Info-Kanal **oder** Dialog? (aktuell beides
   angelegt; Coach darf antworten, startet aber keinen Lehrer-Chat).
4. **Produkt-Scope:** allgemeine **ZSB-Schulbegleitungsplattform** (BildungsTandems als
   ein Programm) oder spezifische **BildungsTandems-App**? → bestimmt die Architektur.
5. **„Feedback – zu definieren":** Welche Feedback-/Monitoring-Mechanik genau? (täglich,
   pro Treffen, Bedarfsmeldung, Auswertung – was ist verbindlich?)
6. **Datenschutz/Minderjährige:** Einwilligungen, Chat-Moderation/Meldefunktion,
   Datenstandort, Lösch-/Exportkonzept – Anforderungen & Verantwortlichkeiten.
7. **Datenmengen & Betrieb:** erwartete Nutzerzahl, Schulen, Jahreswechsel-Logik.
8. **Formulare:** eigenes Formularmodul oder Einbindung bestehender Tools (z. B. JotForm)?
9. **Evaluation TU Dortmund:** welche Daten, welches Export-/Anonymisierungsformat?

---

## 4. Agenda-Vorschlag (ca. 3 Std.)

| Zeit | Thema |
|---|---|
| 0:00–0:20 | Ankommen, Ziele, kurzer Demo-Walkthrough |
| 0:20–1:00 | Zielgruppen & Scope (Punkte 1, 2, 4) |
| 1:00–1:40 | Kernfunktionen verbindlich machen: Termine, Material/Lernpfade, Feedback (Punkte 3, 5) |
| 1:40–1:50 | Pause |
| 1:50–2:25 | Datenschutz, Rollen/Verwaltung, Betrieb (Punkte 6, 7) |
| 2:25–2:50 | Formulare & Evaluation (Punkte 8, 9) |
| 2:50–3:00 | Priorisierung MVP, nächste Schritte, Angebot |

---

## 5. Ergebnis & nächster Schritt

Aus den Antworten leiten wir den **MVP-Umfang** ab und erstellen das **Angebot**
(siehe `Angebot-Arbeitspakete.md` als Grundlage).

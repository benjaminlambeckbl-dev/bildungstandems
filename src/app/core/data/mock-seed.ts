// =============================================================
// BildungsTandems – Beispieldaten (Mock-Seed)
// Realistische, aber FIKTIVE Daten. Keine echten personenbezogenen
// Angaben. Datensparsam: Coachees nur mit Vornamen.
// =============================================================

import {
  Schule,
  Tandem,
  Termin,
  Material,
  Lernpfad,
  Nachricht,
  Reflexion,
  Nutzer,
  ProgrammPhase,
  ChatKanal,
  ChatNachricht,
  Formular,
  TagesCheck,
} from '../models/models';

// Hilfsfunktion: ISO-String für "in X Tagen, HH:MM"
function inTagen(tage: number, stunde = 14, minute = 0): string {
  const d = new Date();
  d.setDate(d.getDate() + tage);
  d.setHours(stunde, minute, 0, 0);
  return d.toISOString();
}

export const SCHULEN: Schule[] = [
  { id: 's1', name: 'Gesamtschule Bergmannsfeld', ort: 'Essen', typ: 'weiterführend' },
  { id: 's2', name: 'Albert-Schweitzer-Realschule', ort: 'Bochum', typ: 'weiterführend' },
  { id: 'g1', name: 'Grundschule Am Park', ort: 'Essen', typ: 'grundschule' },
  { id: 'g2', name: 'Astrid-Lindgren-Grundschule', ort: 'Bochum', typ: 'grundschule' },
];

export const NUTZER: Nutzer[] = [
  // Coachs (weiterführende Schule)
  { id: 'c1', vorname: 'Lea', nachname: 'Sommer', rolle: 'coach', schuleId: 's1', tandemId: 't1', avatarFarbe: '#1d6fb8' },
  { id: 'c2', vorname: 'Jonas', nachname: 'Keller', rolle: 'coach', schuleId: 's1', tandemId: 't2', avatarFarbe: '#2f9e6f' },
  { id: 'c3', vorname: 'Aylin', nachname: 'Demir', rolle: 'coach', schuleId: 's1', tandemId: 't3', avatarFarbe: '#f5a623' },
  { id: 'c4', vorname: 'Max', nachname: 'Brandt', rolle: 'coach', schuleId: 's2', tandemId: 't4', avatarFarbe: '#6b4db8' },

  // Lehrkräfte / Schulkoordination
  { id: 'l1', vorname: 'Frau', nachname: 'Vogel', rolle: 'lehrer', schuleId: 's1', avatarFarbe: '#2f9e6f' },
  { id: 'l2', vorname: 'Herr', nachname: 'Özdemir', rolle: 'lehrer', schuleId: 's2', avatarFarbe: '#2f9e6f' },

  // Admin / Stiftung
  { id: 'a1', vorname: 'Stiftungs', nachname: 'Team', rolle: 'admin', schuleId: 's1', avatarFarbe: '#6b4db8' },
];

export const TANDEMS: Tandem[] = [
  { id: 't1', name: 'Tandem Sonnenblume', schuleId: 's1', coachId: 'c1', coachees: ['Mia', 'Ben', 'Yusuf'], partnerGrundschule: 'Grundschule Am Park' },
  { id: 't2', name: 'Tandem Delfin', schuleId: 's1', coachId: 'c2', coachees: ['Emma', 'Noah', 'Lina', 'Tom'], partnerGrundschule: 'Grundschule Am Park' },
  { id: 't3', name: 'Tandem Komet', schuleId: 's1', coachId: 'c3', coachees: ['Sofia', 'Leon'], partnerGrundschule: 'Grundschule Am Park' },
  { id: 't4', name: 'Tandem Löwenzahn', schuleId: 's2', coachId: 'c4', coachees: ['Hannah', 'Elias', 'Mara'], partnerGrundschule: 'Astrid-Lindgren-Grundschule' },
];

export const TERMINE: Termin[] = [
  {
    id: 'tm1', titel: 'Tandem-Treffen: Kennenlernspiele', beschreibung: 'Erstes Treffen nach den Ferien – Namensspiele und Vertrauensübungen.',
    start: inTagen(1, 14, 0), dauerMin: 60, ort: 'Raum 102, GS Am Park', tandemId: 't1', schuleId: 's1', status: 'geplant', erinnerung: true,
    teilnahmeZugesagt: true,
    erinnerungVerschickt: true,
    checkliste: [
      { id: 'cl1', text: 'Namensschilder vorbereiten', erledigt: true },
      { id: 'cl2', text: '3 Kennenlernspiele aussuchen', erledigt: false },
      { id: 'cl3', text: 'Material mitbringen (Ball, Karten)', erledigt: false },
    ],
  },
  {
    id: 'tm2', titel: 'Reflexionstreffen mit Coachs', beschreibung: 'Austausch über die letzten Wochen mit Frau Vogel.',
    start: inTagen(3, 15, 30), dauerMin: 45, ort: 'Lehrerzimmer, Gesamtschule', tandemId: 't1', schuleId: 's1', status: 'geplant', erinnerung: true,
  },
  {
    id: 'tm3', titel: 'Tandem-Treffen: Lesepatenschaft', beschreibung: 'Gemeinsames Lesen und Vorlesen üben.',
    start: inTagen(2, 14, 0), dauerMin: 60, ort: 'Bücherei GS Am Park', tandemId: 't2', schuleId: 's1', status: 'geplant', erinnerung: false,
  },
  {
    id: 'tm4', titel: 'Tandem-Treffen: Pausenhof-Spiele', beschreibung: 'Bewegungsspiele für die große Pause vorbereiten.',
    start: inTagen(5, 13, 0), dauerMin: 60, ort: 'Schulhof', tandemId: 't3', schuleId: 's1', status: 'vorgeschlagen', erinnerung: false,
  },
  {
    id: 'tm5', titel: 'Tandem-Treffen: Bastelnachmittag', beschreibung: 'Wird wegen Krankheit verschoben.',
    start: inTagen(-2, 14, 0), dauerMin: 60, ort: 'Raum 8, Astrid-Lindgren-GS', tandemId: 't4', schuleId: 's2', status: 'abgesagt', erinnerung: false,
  },
  {
    id: 'tm6', titel: 'Auftakt-Training für Coachs', beschreibung: 'Moderationstechniken und Umgang mit Konflikten.',
    start: inTagen(7, 10, 0), dauerMin: 120, ort: 'Aula, Gesamtschule', tandemId: 't4', schuleId: 's2', status: 'geplant', erinnerung: true,
  },
  {
    id: 'tm7', titel: 'Tandem-Treffen: Rückblick', beschreibung: 'Erstes Halbjahr abgeschlossen.',
    start: inTagen(-10, 14, 0), dauerMin: 60, ort: 'Raum 102, GS Am Park', tandemId: 't1', schuleId: 's1', status: 'erledigt', erinnerung: false,
  },
];

export const MATERIALIEN: Material[] = [
  { id: 'm1', titel: 'Leitfaden: Mein erstes Tandem-Treffen', beschreibung: 'Schritt-für-Schritt-Anleitung für den Start.', typ: 'pdf', kategorie: 'Grundlagen', fuer: ['coach'], tags: ['Einstieg', 'Ablauf'] },
  { id: 'm2', titel: '20 Kennenlernspiele', beschreibung: 'Spielesammlung für die ersten Treffen.', typ: 'spiel', kategorie: 'Spiele & Methoden', fuer: ['coach', 'lehrer'], tags: ['Spiele', 'Einstieg'] },
  { id: 'm3', titel: 'Video: Gute Moderation', beschreibung: 'Kurzes Erklärvideo (4 Min) zur Gesprächsleitung.', typ: 'video', kategorie: 'Moderation', fuer: ['coach'], tags: ['Moderation', 'Video'] },
  { id: 'm4', titel: 'Vorlage: Reflexionsbogen', beschreibung: 'Zum Ausdrucken nach jedem Treffen.', typ: 'vorlage', kategorie: 'Reflexion', fuer: ['coach', 'lehrer'], tags: ['Reflexion', 'Vorlage'] },
  { id: 'm5', titel: 'Umgang mit Streit', beschreibung: 'Tipps zur Konfliktlösung in der Gruppe.', typ: 'pdf', kategorie: 'Konflikte', fuer: ['coach'], tags: ['Konflikte'] },
  { id: 'm6', titel: 'Koordinations-Handbuch', beschreibung: 'Organisation der Tandems an der Schule.', typ: 'pdf', kategorie: 'Organisation', fuer: ['lehrer'], tags: ['Organisation'] },
  { id: 'm7', titel: 'Elternbrief-Vorlage', beschreibung: 'Information für Eltern der Grundschulkinder.', typ: 'vorlage', kategorie: 'Organisation', fuer: ['lehrer'], tags: ['Organisation', 'Vorlage'] },
  { id: 'm8', titel: 'Programm-Übersicht Schuljahr', beschreibung: 'Der Ablauf von Auftakt bis Abschlussfeier.', typ: 'link', kategorie: 'Grundlagen', fuer: ['coach', 'lehrer'], tags: ['Ablauf'] },
  // Zeitgesteuerte Freischaltung: erst zur Abschlussphase verfügbar.
  { id: 'm9', titel: 'Abschlussfeier organisieren', beschreibung: 'Checkliste & Ideen für die Abschlussfeier.', typ: 'pdf', kategorie: 'Organisation', fuer: ['coach', 'lehrer'], tags: ['Abschluss'], freigabeAb: '2026-06-22T00:00:00Z' },
];

export const LERNPFADE: Lernpfad[] = [
  {
    id: 'lp1', titel: 'So läuft ein Tandem-Treffen ab', fuer: 'coach', symbol: '🤝',
    beschreibung: 'In 4 Schritten lernst du, wie du ein Treffen sicher leitest.',
    schritte: [
      { id: 'lp1s1', titel: 'Begrüßung & Ankommen', inhalt: 'Begrüße jedes Kind mit Namen. Starte mit einer kurzen Befindlichkeitsrunde: „Wie geht es dir heute?“ Das schafft Vertrauen und einen guten Einstieg.' },
      { id: 'lp1s2', titel: 'Das Thema einführen', inhalt: 'Erkläre kurz und in einfachen Worten, was ihr heute macht. Zeige, wenn möglich, ein Beispiel. Frage nach, ob alle verstanden haben.',
        quiz: { frage: 'Was hilft den Kindern am meisten beim Verstehen?', optionen: ['Schnell sprechen', 'Ein Beispiel zeigen', 'Viele Fachwörter benutzen'], richtigeOption: 1 } },
      { id: 'lp1s3', titel: 'Gemeinsame Aktivität', inhalt: 'Macht die geplante Aktivität zusammen. Achte darauf, dass alle mitmachen können und niemand ausgeschlossen wird. Lobe Einsatz, nicht nur Ergebnisse.' },
      { id: 'lp1s4', titel: 'Abschluss & Verabschiedung', inhalt: 'Beendet das Treffen mit einer kurzen Abschlussrunde: „Was hat dir heute gefallen?“ Verabschiede dich freundlich und kündige das nächste Treffen an.' },
    ],
  },
  {
    id: 'lp2', titel: 'Umgang mit Konflikten', fuer: 'coach', symbol: '🕊️',
    freigabeAb: '2026-06-15T00:00:00Z',
    beschreibung: 'Was tun, wenn es Streit gibt? Drei einfache Schritte.',
    schritte: [
      { id: 'lp2s1', titel: 'Ruhe bewahren', inhalt: 'Bleib ruhig und gehe dazwischen, ohne Partei zu ergreifen. Deine Ruhe überträgt sich auf die Kinder.' },
      { id: 'lp2s2', titel: 'Beide anhören', inhalt: 'Lass beide Seiten nacheinander erzählen, ohne Unterbrechung. Wiederhole, was du gehört hast.',
        quiz: { frage: 'Wie hörst du am fairsten zu?', optionen: ['Nur dem Lauteren', 'Beiden nacheinander', 'Niemandem'], richtigeOption: 1 } },
      { id: 'lp2s3', titel: 'Gemeinsam eine Lösung finden', inhalt: 'Fragt zusammen: „Wie können wir das lösen?“ Wenn es nicht klappt, hol deine Lehrkraft dazu – das ist kein Versagen, sondern klug.' },
    ],
  },
  {
    id: 'lp3', titel: 'Begleitung deiner Coachs', fuer: 'lehrer', symbol: '🧭',
    beschreibung: 'Wie du als Koordination deine Coachs gut unterstützt.',
    schritte: [
      { id: 'lp3s1', titel: 'Rollen klären', inhalt: 'Mache deinen Coachs klar: Sie sind Vorbild und Begleitung – nicht Lehrer:in und nicht für alles verantwortlich.' },
      { id: 'lp3s2', titel: 'Regelmäßige Reflexion', inhalt: 'Plane feste Reflexionstreffen ein. Frage offen nach Erfolgen und Sorgen. Höre mehr zu, als du redest.' },
      { id: 'lp3s3', titel: 'Eigenverantwortung zutrauen', inhalt: 'Gib den Jugendlichen Verantwortung und Vertrauen. Greife nur ein, wenn es wirklich nötig ist.' },
    ],
  },
];

export const NACHRICHTEN: Nachricht[] = [
  { id: 'n1', typ: 'absage', titel: 'Treffen am Freitag fällt aus', text: 'Liebe Lea, das Treffen am Freitag muss leider entfallen – die Bücherei ist gesperrt. Wir finden einen Ersatztermin.', zeit: inTagen(-1, 9, 15), vonName: 'Frau Vogel', anNutzerId: 'c1', gelesen: false, terminId: 'tm3' },
  { id: 'n2', typ: 'info', titel: 'Neues Material verfügbar', text: 'Schaut euch die neue Spielesammlung in den Materialien an – perfekt für die nächsten Treffen!', zeit: inTagen(-2, 12, 0), vonName: 'Frau Vogel', anNutzerId: 'c1', gelesen: false },
  { id: 'n3', typ: 'lob', titel: 'Stark gemacht!', text: 'Die Kinder haben mir erzählt, wie viel Spaß sie beim letzten Treffen hatten. Weiter so, Lea!', zeit: inTagen(-3, 16, 30), vonName: 'Frau Vogel', anNutzerId: 'c1', gelesen: true },
  { id: 'n4', typ: 'erinnerung', titel: 'Morgen Tandem-Treffen', text: 'Denk dran: morgen um 14:00 Uhr Kennenlernspiele in Raum 102.', zeit: inTagen(0, 8, 0), vonName: 'BildungsTandems', anNutzerId: 'c1', gelesen: false, terminId: 'tm1' },
  { id: 'n5', typ: 'info', titel: 'Auftakt-Training', text: 'Das Auftakt-Training findet nächste Woche statt. Bitte teilnehmen!', zeit: inTagen(-1, 10, 0), vonName: 'Herr Özdemir', anNutzerId: 'c4', gelesen: false, terminId: 'tm6' },
  // Bedarfsmeldung eines Coachs an die Koordination („Hilfe nötig?")
  { id: 'n6', typ: 'bedarf', titel: 'Hilfe nötig: Tandem Delfin', text: 'Jonas (Tandem Delfin) bittet um Unterstützung bei einem Treffen.', zeit: inTagen(-1, 13, 20), vonName: 'Jonas Keller', anNutzerId: 'l1', gelesen: false },
];

export const REFLEXIONEN: Reflexion[] = [
  { id: 'r1', nutzerId: 'c1', tandemId: 't1', terminId: 'tm7', datum: inTagen(-10, 15, 0), stimmung: 5, gelungen: 'Alle Kinder haben mitgemacht und viel gelacht.', herausforderung: 'Am Anfang waren zwei Kinder sehr schüchtern.' },
  { id: 'r2', nutzerId: 'c2', tandemId: 't2', datum: inTagen(-8, 15, 0), stimmung: 4, gelungen: 'Das Vorlesen hat super geklappt.', herausforderung: 'Es war etwas laut in der Gruppe.' },
];

// Programm-Schuljahr: Phasen von Auftakt bis Abschlussfeier.
export const PROGRAMM_PHASEN: ProgrammPhase[] = [
  { id: 'p1', titel: 'Auftakt & Coach-Training', symbol: '🚀', start: '2025-09-15T09:00:00', beschreibung: 'Die Coachs werden geschult: Moderation, Rolle als Vorbild, Umgang mit Vielfalt.' },
  { id: 'p2', titel: 'Eröffnung & Kennenlernen', symbol: '👋', start: '2025-10-06T09:00:00', beschreibung: 'Gemeinsame Eröffnungsveranstaltung – Coachs und Grundschulkinder lernen sich kennen.' },
  { id: 'p3', titel: 'Regelmäßige Tandem-Treffen', symbol: '🤝', start: '2025-11-01T09:00:00', beschreibung: 'Die Tandems treffen sich regelmäßig. Zusatztrainings nach Bedarf.' },
  { id: 'p4', titel: 'Reflexionstreffen', symbol: '🪞', start: '2026-02-01T09:00:00', beschreibung: 'Coachs und Koordination besprechen Erfahrungen und neue Ideen.' },
  { id: 'p5', titel: 'Abschlussfeier & Zertifikate', symbol: '🎓', start: '2026-06-22T09:00:00', beschreibung: 'Große Abschlussfeier mit allen Tandems und Übergabe der Zertifikate.' },
];

// Demo-Einladungscode → meldet als bestehender Coach an (für die Login-Demo).
export const EINLADUNGSCODES: Record<string, string> = {
  'BT-DEMO-2026': 'c2',
};

// Chat-Kanäle: Kohorte (Coaches je Schule), Kollegium (alle Lehrkräfte), Direkt-Threads.
export const CHAT_KANAELE: ChatKanal[] = [
  { id: 'k-koh-s1', typ: 'kohorte', name: 'Coach-Kohorte Bergmannsfeld', schuleId: 's1', mitglieder: ['c1', 'c2', 'c3'] },
  { id: 'k-koh-s2', typ: 'kohorte', name: 'Coach-Kohorte Albert-Schweitzer', schuleId: 's2', mitglieder: ['c4'] },
  { id: 'k-koll', typ: 'kollegium', name: 'Lehrkräfte-Austausch', mitglieder: ['l1', 'l2'] },
  { id: 'k-dir-l1c1', typ: 'direkt', name: 'Direkt', mitglieder: ['l1', 'c1'] },
];

export const CHAT_NACHRICHTEN: ChatNachricht[] = [
  { id: 'cm1', kanalId: 'k-koh-s1', vonId: 'c2', text: 'Hat jemand ein gutes Spiel für die erste Stunde?', zeit: inTagen(-1, 16, 10) },
  { id: 'cm2', kanalId: 'k-koh-s1', vonId: 'c1', text: 'Ja! „Namen-Ball" klappt super zum Aufwärmen 🙂', zeit: inTagen(-1, 16, 25) },
  { id: 'cm3', kanalId: 'k-koh-s1', vonId: 'c3', text: 'Danke, probiere ich aus!', zeit: inTagen(-1, 16, 40) },
  { id: 'cm4', kanalId: 'k-koll', vonId: 'l2', text: 'Wie organisiert ihr die Raumbuchung an eurer Schule?', zeit: inTagen(-2, 11, 0) },
  { id: 'cm5', kanalId: 'k-koll', vonId: 'l1', text: 'Wichtig: Nächster gemeinsamer Reflexionstermin am 15.06. um 15:00 Uhr.', zeit: inTagen(-2, 11, 20), angepinnt: true },
  { id: 'cm6', kanalId: 'k-dir-l1c1', vonId: 'l1', text: 'Hallo Lea, klappt der Termin am Montag bei dir?', zeit: inTagen(-1, 9, 30) },
  { id: 'cm7', kanalId: 'k-dir-l1c1', vonId: 'c1', text: 'Ja, passt! Ich bereite die Spiele vor. 👍', zeit: inTagen(-1, 9, 45) },
];

// Zugewiesene Formulare (Demo – im Echtbetrieb z. B. JotForm-Links).
export const FORMULARE: Formular[] = [
  { id: 'f1', titel: 'Einverständnis Fotonutzung', beschreibung: 'Zustimmung zur Nutzung von Fotos der Abschlussfeier.', url: 'https://example.com/form/foto', fuer: ['coach'], status: 'offen', faelligAm: inTagen(7, 0, 0) },
  { id: 'f2', titel: 'Zwischen-Feedback Halbjahr', beschreibung: 'Kurzer Fragebogen zur Halbzeit des Programms.', url: 'https://example.com/form/halbzeit', fuer: ['coach', 'lehrer'], status: 'erledigt' },
  { id: 'f3', titel: 'Schul-Stammdaten aktualisieren', beschreibung: 'Bitte Kontaktdaten der Schule prüfen.', url: 'https://example.com/form/stammdaten', fuer: ['lehrer'], status: 'offen' },
];

// Tägliches Kurz-Feedback (Wert 1=schwierig, 2=okay, 3=gut).
export const TAGES_CHECKS: TagesCheck[] = [
  { id: 'tc1', nutzerId: 'c1', schuleId: 's1', datum: inTagen(-2, 17, 0), wert: 3 },
  { id: 'tc2', nutzerId: 'c2', schuleId: 's1', datum: inTagen(-2, 17, 0), wert: 2 },
  { id: 'tc3', nutzerId: 'c3', schuleId: 's1', datum: inTagen(-1, 17, 0), wert: 3 },
  { id: 'tc4', nutzerId: 'c1', schuleId: 's1', datum: inTagen(-1, 17, 0), wert: 2 },
  { id: 'tc5', nutzerId: 'c4', schuleId: 's2', datum: inTagen(-1, 17, 0), wert: 1 },
];

// =============================================================
// BildungsTandems – Datenmodelle
// Diese Interfaces sind die Verträge zwischen UI und Datenschicht.
// Die Mock-Implementierung erfüllt sie heute, Supabase später.
// =============================================================

export type Rolle = 'coach' | 'lehrer' | 'admin';

export interface Nutzer {
  id: string;
  vorname: string;
  nachname: string;
  rolle: Rolle;
  schuleId: string;
  /** Nur für Coachs: zugehöriges Tandem */
  tandemId?: string;
  avatarFarbe?: string;
}

export interface Schule {
  id: string;
  name: string;
  ort: string;
  typ: 'weiterführend' | 'grundschule';
}

/** Ein Tandem = 1 Coach + mehrere Coachees (Grundschulkinder). */
export interface Tandem {
  id: string;
  name: string;
  schuleId: string;
  coachId: string;
  /** Vornamen der Grundschulkinder (datensparsam – keine Nachnamen). */
  coachees: string[];
  partnerGrundschule: string;
}

export type TerminStatus = 'geplant' | 'vorgeschlagen' | 'abgesagt' | 'erledigt';

/** Ein abhakbarer Vorbereitungspunkt für ein Treffen. */
export interface ChecklistenPunkt {
  id: string;
  text: string;
  erledigt: boolean;
}

/** Kurzprotokoll nach einem durchgeführten Treffen (auch Basis für die Evaluation). */
export interface TreffenProtokoll {
  durchgefuehrt: boolean;
  anwesendeKinder: number;
  notiz?: string;
}

export interface Termin {
  id: string;
  titel: string;
  beschreibung?: string;
  /** ISO-String (Datum + Uhrzeit Beginn) */
  start: string;
  /** Dauer in Minuten */
  dauerMin: number;
  ort: string;
  tandemId: string;
  schuleId: string;
  status: TerminStatus;
  /** Erinnerung aktiviert? */
  erinnerung: boolean;
  /** Coach hat Teilnahme zugesagt */
  teilnahmeZugesagt?: boolean;
  /** Vorbereitungs-Checkliste */
  checkliste?: ChecklistenPunkt[];
  /** Wurde bereits eine automatische Erinnerung verschickt? */
  erinnerungVerschickt?: boolean;
  /** Doku nach dem Treffen */
  protokoll?: TreffenProtokoll;
}

/** Phase im Programm-Schuljahr (Auftakt → Abschlussfeier). */
export interface ProgrammPhase {
  id: string;
  titel: string;
  beschreibung: string;
  symbol: string;
  /** ISO-Startdatum der Phase im Schuljahr */
  start: string;
}

export type MaterialTyp = 'pdf' | 'video' | 'link' | 'spiel' | 'vorlage';

export interface Material {
  id: string;
  titel: string;
  beschreibung: string;
  typ: MaterialTyp;
  kategorie: string;
  /** Für welche Rollen sichtbar */
  fuer: Rolle[];
  /** Schlagworte für Filter/Suche */
  tags?: string[];
  /** Zeitgesteuerte Freischaltung: erst ab diesem ISO-Datum verfügbar. */
  freigabeAb?: string;
}

export interface LernSchritt {
  id: string;
  titel: string;
  inhalt: string;
  /** Optionale kleine Verständnisfrage */
  quiz?: {
    frage: string;
    optionen: string[];
    richtigeOption: number;
  };
}

export interface Lernpfad {
  id: string;
  titel: string;
  beschreibung: string;
  /** Für welche Rolle gedacht */
  fuer: Rolle;
  symbol: string; // Emoji als leichtgewichtiges Icon
  schritte: LernSchritt[];
  /** Zeitgesteuerte Freischaltung: erst ab diesem ISO-Datum verfügbar. */
  freigabeAb?: string;
}

/** Fortschritt eines Nutzers in einem Lernpfad (Set der erledigten Schritt-IDs). */
export interface LernpfadFortschritt {
  pfadId: string;
  erledigteSchritte: string[];
}

export type NachrichtTyp = 'info' | 'absage' | 'erinnerung' | 'lob' | 'bedarf';

export interface Nachricht {
  id: string;
  typ: NachrichtTyp;
  titel: string;
  text: string;
  /** ISO-Zeitstempel */
  zeit: string;
  vonName: string;
  /** Empfänger-Nutzer-ID (für den Prototyp 1:1 oder Tandem) */
  anNutzerId: string;
  gelesen: boolean;
  /** optionaler Bezug auf einen Termin */
  terminId?: string;
}

// --- Chat ---
export type ChatKanalTyp = 'kohorte' | 'kollegium' | 'direkt';

export interface ChatKanal {
  id: string;
  typ: ChatKanalTyp;
  /** Anzeigename (bei 'direkt' wird stattdessen der/die Partner:in angezeigt). */
  name: string;
  /** Nutzer-IDs der Teilnehmer:innen. */
  mitglieder: string[];
  /** Bei 'kohorte': zugehörige Schule. */
  schuleId?: string;
}

export interface ChatNachricht {
  id: string;
  kanalId: string;
  vonId: string;
  text: string;
  /** ISO-Zeitstempel */
  zeit: string;
  /** Wichtige Nachricht angeheftet ("Sticky"). */
  angepinnt?: boolean;
}

export interface Reflexion {
  id: string;
  nutzerId: string;
  tandemId: string;
  terminId?: string;
  /** ISO-Datum */
  datum: string;
  /** Stimmung 1–5 */
  stimmung: number;
  /** Was lief gut */
  gelungen: string;
  /** Was war herausfordernd */
  herausforderung: string;
}

/** Häufige Frage (durchsuchbar, kategorisiert) für die Selbsthilfe. */
export interface Faq {
  id: string;
  frage: string;
  antwort: string;
  kategorie: string;
  /** Für welche Rollen sichtbar */
  fuer: Rolle[];
}

export type FormularStatus = 'offen' | 'erledigt';

/** Zugewiesenes Formular (z. B. JotForm-Link) mit Bearbeitungsstatus. */
export interface Formular {
  id: string;
  titel: string;
  beschreibung: string;
  /** Externer Link (im Prototyp Demo). */
  url: string;
  fuer: Rolle[];
  status: FormularStatus;
  /** optionale Frist (ISO) */
  faelligAm?: string;
}

/** Tägliches Kurz-Feedback („Wie lief es?"), Wert 1–3. */
export interface TagesCheck {
  id: string;
  nutzerId: string;
  schuleId: string;
  /** ISO-Datum */
  datum: string;
  /** 1 = schwierig, 2 = okay, 3 = gut */
  wert: number;
}

// =============================================================
// BildungsTandems – FAQ-Beispieldaten
// Durchsuchbare, kategorisierte Sammlung häufiger Fragen.
// =============================================================

import { Faq } from '../models/models';

export const FAQS: Faq[] = [
  // --- Erste Schritte ---
  {
    id: 'faq1', kategorie: 'Erste Schritte', fuer: ['coach'],
    frage: 'Wie läuft mein erstes Tandem-Treffen ab?',
    antwort: 'Starte mit einer kurzen Begrüßungsrunde, erkläre das Thema in einfachen Worten, macht eine gemeinsame Aktivität und schließt mit einer kurzen Feedbackrunde. Der Lernpfad „So läuft ein Tandem-Treffen ab" führt dich Schritt für Schritt durch.',
  },
  {
    id: 'faq2', kategorie: 'Erste Schritte', fuer: ['coach', 'lehrer'],
    frage: 'Was ist meine Rolle als Coach?',
    antwort: 'Du bist Vorbild und Begleitung – nicht Lehrkraft. Du musst nicht alles wissen oder lösen. Bei Schwierigkeiten holst du deine Koordination dazu.',
  },
  // --- Termine ---
  {
    id: 'faq3', kategorie: 'Termine', fuer: ['coach'],
    frage: 'Wie schlage ich einen neuen Termin vor?',
    antwort: 'Gehe in „Termine" → „+ Neu", trage Titel, Datum, Uhrzeit und Ort ein. Deine Lehrkraft bestätigt den Vorschlag anschließend.',
  },
  {
    id: 'faq4', kategorie: 'Termine', fuer: ['coach'],
    frage: 'Wie werde ich an Treffen erinnert?',
    antwort: 'Aktiviere die Erinnerung am Termin. Du bekommst dann eine Benachrichtigung, bevor das Treffen beginnt. Erlaube dafür einmalig Benachrichtigungen.',
  },
  // --- Technik ---
  {
    id: 'faq5', kategorie: 'Technik', fuer: ['coach', 'lehrer'],
    frage: 'Wie installiere ich die App auf dem Handy?',
    antwort: 'Öffne die Seite im Browser und wähle „Zum Startbildschirm hinzufügen". Danach startet BildungsTandems wie eine normale App.',
  },
  {
    id: 'faq6', kategorie: 'Technik', fuer: ['coach', 'lehrer'],
    frage: 'Bekomme ich Push-Benachrichtigungen?',
    antwort: 'Ja – sobald du Benachrichtigungen erlaubst. Auf dem iPhone funktioniert das, wenn die App vorher zum Startbildschirm hinzugefügt wurde.',
  },
  // --- Programm ---
  {
    id: 'faq7', kategorie: 'Programm', fuer: ['coach', 'lehrer'],
    frage: 'Wie ist das Programmjahr aufgebaut?',
    antwort: 'Von der Auftaktveranstaltung über regelmäßige Treffen und Reflexionstreffen bis zur Abschlussfeier. Den Überblick findest du unter „Programm-Jahr".',
  },
  {
    id: 'faq8', kategorie: 'Programm', fuer: ['coach'],
    frage: 'Bekomme ich am Ende ein Zertifikat?',
    antwort: 'Ja. Wenn du die Lernpfade abgeschlossen und Treffen dokumentiert hast, kannst du dein Coach-Zertifikat unter „Mein Zertifikat" als PDF speichern.',
  },
  // --- Konflikte ---
  {
    id: 'faq9', kategorie: 'Konflikte', fuer: ['coach'],
    frage: 'Was mache ich bei Streit in der Gruppe?',
    antwort: 'Ruhe bewahren, beide Seiten anhören, gemeinsam eine Lösung suchen. Klappt es nicht, hol deine Koordination dazu – das ist klug, kein Versagen. Siehe Lernpfad „Umgang mit Konflikten".',
  },
  // --- Datenschutz ---
  {
    id: 'faq10', kategorie: 'Datenschutz', fuer: ['coach', 'lehrer'],
    frage: 'Welche Daten der Kinder werden gespeichert?',
    antwort: 'So wenig wie möglich. Grundschulkinder werden nur mit Vornamen geführt. Es gelten DSGVO und EU-Datenspeicherung.',
  },
  // --- Koordination ---
  {
    id: 'faq11', kategorie: 'Koordination', fuer: ['lehrer'],
    frage: 'Wie gewähre ich einer Schüler:in Zugang als Coach?',
    antwort: 'Unter „Coachs" → „+ Zugang" legst du die Person und ihr Tandem an. Sie erhält einen Einladungscode zur Anmeldung.',
  },
  {
    id: 'faq12', kategorie: 'Koordination', fuer: ['lehrer'],
    frage: 'Wie sage ich ein Treffen ab und informiere den Coach?',
    antwort: 'Öffne den Termin und tippe „Treffen absagen". Der zuständige Coach wird automatisch benachrichtigt.',
  },
];

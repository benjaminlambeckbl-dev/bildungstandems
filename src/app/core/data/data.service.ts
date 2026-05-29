// =============================================================
// BildungsTandems – Datenschicht-Vertrag
// Abstrakte Klasse dient gleichzeitig als DI-Token UND als Interface.
// Heute erfüllt von MockDataService, später von einem SupabaseDataService.
// UI-Komponenten injizieren NUR diese Klasse – nie eine konkrete Impl.
// =============================================================

import { Signal } from '@angular/core';
import {
  Schule,
  Tandem,
  Termin,
  Material,
  Lernpfad,
  LernpfadFortschritt,
  Nachricht,
  Reflexion,
  Nutzer,
  TreffenProtokoll,
  ChatKanal,
  ChatNachricht,
} from '../models/models';

export abstract class DataService {
  // --- Reaktive Sammlungen (Signals) ---
  abstract readonly schulen: Signal<Schule[]>;
  abstract readonly nutzer: Signal<Nutzer[]>;
  abstract readonly tandems: Signal<Tandem[]>;
  abstract readonly termine: Signal<Termin[]>;
  abstract readonly materialien: Signal<Material[]>;
  abstract readonly lernpfade: Signal<Lernpfad[]>;
  abstract readonly fortschritte: Signal<LernpfadFortschritt[]>;
  abstract readonly nachrichten: Signal<Nachricht[]>;
  abstract readonly reflexionen: Signal<Reflexion[]>;
  abstract readonly chatKanaele: Signal<ChatKanal[]>;
  abstract readonly chatNachrichten: Signal<ChatNachricht[]>;

  // --- Aktionen ---
  /** Coach schlägt einen neuen Termin vor (Status 'vorgeschlagen'). */
  abstract terminVorschlagen(
    daten: Omit<Termin, 'id' | 'status' | 'erinnerung'> & { erinnerung?: boolean },
  ): Termin;
  abstract terminStatusSetzen(id: string, status: Termin['status']): void;
  abstract terminErinnerungUmschalten(id: string): void;
  /** Coach sagt Teilnahme zu / ab. */
  abstract terminTeilnahmeSetzen(id: string, zugesagt: boolean): void;
  /** Hakt einen Checklisten-Punkt eines Termins um. */
  abstract checklistePunktUmschalten(terminId: string, punktId: string): void;
  /** Dokumentiert ein durchgeführtes Treffen und setzt Status auf 'erledigt'. */
  abstract treffenDokumentieren(terminId: string, protokoll: TreffenProtokoll): void;
  /** Markiert, dass die automatische Erinnerung für einen Termin verschickt wurde. */
  abstract erinnerungMarkieren(id: string): void;

  /** Lehrkraft sendet eine Info/Absage an einen Coach. */
  abstract nachrichtSenden(
    daten: Omit<Nachricht, 'id' | 'zeit' | 'gelesen'>,
  ): Nachricht;
  abstract nachrichtAlsGelesen(id: string): void;

  abstract reflexionSpeichern(
    daten: Omit<Reflexion, 'id' | 'datum'> & { datum?: string },
  ): Reflexion;

  /** Markiert einen Lernpfad-Schritt für einen Nutzer als erledigt. */
  abstract schrittErledigen(pfadId: string, schrittId: string): void;
  abstract fortschrittFuer(pfadId: string): Signal<LernpfadFortschritt | undefined>;

  /** Lehrkraft gewährt einem neuen Coach Zugang (Prototyp: legt Nutzer + Tandem an). */
  abstract coachEinladen(daten: {
    vorname: string;
    nachname: string;
    schuleId: string;
    tandemName: string;
    partnerGrundschule: string;
  }): { nutzer: Nutzer; tandem: Tandem; code: string };

  /** Löst einen Einladungscode auf eine Nutzer-ID auf (oder null). */
  abstract codeAufloesen(code: string): string | null;

  // --- Chat ---
  abstract chatSenden(kanalId: string, vonId: string, text: string): ChatNachricht;
  /** Findet einen bestehenden Direkt-Kanal zwischen zwei Personen. */
  abstract direktKanalFinden(aId: string, bId: string): ChatKanal | undefined;
  /** Erstellt (oder liefert) einen Direkt-Kanal zwischen zwei Personen. */
  abstract direktKanalErstellen(aId: string, bId: string): ChatKanal;
}

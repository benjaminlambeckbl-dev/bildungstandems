// =============================================================
// BildungsTandems – Mock-Implementierung der Datenschicht
// Hält alle Daten im Speicher als Signals. Aktionen mutieren die
// Signals, sodass die UI reaktiv aktualisiert. Kein Backend nötig.
// =============================================================

import { Injectable, Signal, computed, signal } from '@angular/core';
import { DataService } from './data.service';
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
  Faq,
  Formular,
  FormularStatus,
  TagesCheck,
} from '../models/models';
import {
  SCHULEN,
  NUTZER,
  TANDEMS,
  TERMINE,
  MATERIALIEN,
  LERNPFADE,
  NACHRICHTEN,
  REFLEXIONEN,
  EINLADUNGSCODES,
  CHAT_KANAELE,
  CHAT_NACHRICHTEN,
  FORMULARE,
  TAGES_CHECKS,
} from './mock-seed';
import { FAQS } from './faq-seed';

let idZaehler = 1000;
function neueId(prefix: string): string {
  idZaehler += 1;
  return `${prefix}${idZaehler}`;
}

@Injectable()
export class MockDataService extends DataService {
  // interne, beschreibbare Signals
  private readonly _schulen = signal<Schule[]>(SCHULEN);
  private readonly _nutzer = signal<Nutzer[]>(NUTZER);
  private readonly _tandems = signal<Tandem[]>(TANDEMS);
  private readonly _termine = signal<Termin[]>(TERMINE);
  private readonly _materialien = signal<Material[]>(MATERIALIEN);
  private readonly _lernpfade = signal<Lernpfad[]>(LERNPFADE);
  private readonly _fortschritte = signal<LernpfadFortschritt[]>([]);
  private readonly _nachrichten = signal<Nachricht[]>(NACHRICHTEN);
  private readonly _reflexionen = signal<Reflexion[]>(REFLEXIONEN);
  private readonly _chatKanaele = signal<ChatKanal[]>(CHAT_KANAELE);
  private readonly _chatNachrichten = signal<ChatNachricht[]>(CHAT_NACHRICHTEN);
  private readonly _faqs = signal<Faq[]>(FAQS);
  private readonly _formulare = signal<Formular[]>(FORMULARE);
  private readonly _tagesChecks = signal<TagesCheck[]>(TAGES_CHECKS);

  // Einladungscodes (Code → Nutzer-ID), seed + zur Laufzeit erzeugte.
  private readonly _codes = new Map<string, string>(
    Object.entries(EINLADUNGSCODES).map(([code, id]) => [code.toUpperCase(), id]),
  );

  // öffentliche, schreibgeschützte Sicht
  readonly schulen = this._schulen.asReadonly();
  readonly nutzer = this._nutzer.asReadonly();
  readonly tandems = this._tandems.asReadonly();
  readonly termine = this._termine.asReadonly();
  readonly materialien = this._materialien.asReadonly();
  readonly lernpfade = this._lernpfade.asReadonly();
  readonly fortschritte = this._fortschritte.asReadonly();
  readonly nachrichten = this._nachrichten.asReadonly();
  readonly reflexionen = this._reflexionen.asReadonly();
  readonly chatKanaele = this._chatKanaele.asReadonly();
  readonly chatNachrichten = this._chatNachrichten.asReadonly();
  readonly faqs = this._faqs.asReadonly();
  readonly formulare = this._formulare.asReadonly();
  readonly tagesChecks = this._tagesChecks.asReadonly();

  terminVorschlagen(
    daten: Omit<Termin, 'id' | 'status' | 'erinnerung'> & { erinnerung?: boolean },
  ): Termin {
    const termin: Termin = {
      ...daten,
      id: neueId('tm'),
      status: 'vorgeschlagen',
      erinnerung: daten.erinnerung ?? true,
    };
    this._termine.update((list) => [...list, termin]);
    return termin;
  }

  terminStatusSetzen(id: string, status: Termin['status']): void {
    this._termine.update((list) =>
      list.map((t) => (t.id === id ? { ...t, status } : t)),
    );
  }

  terminErinnerungUmschalten(id: string): void {
    this._termine.update((list) =>
      list.map((t) => (t.id === id ? { ...t, erinnerung: !t.erinnerung } : t)),
    );
  }

  terminTeilnahmeSetzen(id: string, zugesagt: boolean): void {
    this._termine.update((list) =>
      list.map((t) => (t.id === id ? { ...t, teilnahmeZugesagt: zugesagt } : t)),
    );
  }

  checklistePunktUmschalten(terminId: string, punktId: string): void {
    this._termine.update((list) =>
      list.map((t) =>
        t.id === terminId && t.checkliste
          ? {
              ...t,
              checkliste: t.checkliste.map((p) =>
                p.id === punktId ? { ...p, erledigt: !p.erledigt } : p,
              ),
            }
          : t,
      ),
    );
  }

  treffenDokumentieren(terminId: string, protokoll: TreffenProtokoll): void {
    this._termine.update((list) =>
      list.map((t) =>
        t.id === terminId ? { ...t, protokoll, status: 'erledigt' } : t,
      ),
    );
  }

  erinnerungMarkieren(id: string): void {
    this._termine.update((list) =>
      list.map((t) => (t.id === id ? { ...t, erinnerungVerschickt: true } : t)),
    );
  }

  nachrichtSenden(daten: Omit<Nachricht, 'id' | 'zeit' | 'gelesen'>): Nachricht {
    const nachricht: Nachricht = {
      ...daten,
      id: neueId('n'),
      zeit: new Date().toISOString(),
      gelesen: false,
    };
    this._nachrichten.update((list) => [nachricht, ...list]);
    return nachricht;
  }

  nachrichtAlsGelesen(id: string): void {
    this._nachrichten.update((list) =>
      list.map((n) => (n.id === id ? { ...n, gelesen: true } : n)),
    );
  }

  reflexionSpeichern(
    daten: Omit<Reflexion, 'id' | 'datum'> & { datum?: string },
  ): Reflexion {
    const reflexion: Reflexion = {
      ...daten,
      id: neueId('r'),
      datum: daten.datum ?? new Date().toISOString(),
    };
    this._reflexionen.update((list) => [reflexion, ...list]);
    return reflexion;
  }

  schrittErledigen(pfadId: string, schrittId: string): void {
    this._fortschritte.update((list) => {
      const vorhanden = list.find((f) => f.pfadId === pfadId);
      if (!vorhanden) {
        return [...list, { pfadId, erledigteSchritte: [schrittId] }];
      }
      if (vorhanden.erledigteSchritte.includes(schrittId)) {
        return list;
      }
      return list.map((f) =>
        f.pfadId === pfadId
          ? { ...f, erledigteSchritte: [...f.erledigteSchritte, schrittId] }
          : f,
      );
    });
  }

  fortschrittFuer(pfadId: string): Signal<LernpfadFortschritt | undefined> {
    return computed(() => this._fortschritte().find((f) => f.pfadId === pfadId));
  }

  coachEinladen(daten: {
    vorname: string;
    nachname: string;
    schuleId: string;
    tandemName: string;
    partnerGrundschule: string;
  }): { nutzer: Nutzer; tandem: Tandem; code: string } {
    const tandemId = neueId('t');
    const nutzerId = neueId('c');
    const farben = ['#1d6fb8', '#2f9e6f', '#f5a623', '#6b4db8'];
    const nutzer: Nutzer = {
      id: nutzerId,
      vorname: daten.vorname,
      nachname: daten.nachname,
      rolle: 'coach',
      schuleId: daten.schuleId,
      tandemId,
      avatarFarbe: farben[this._nutzer().length % farben.length],
    };
    const tandem: Tandem = {
      id: tandemId,
      name: daten.tandemName,
      schuleId: daten.schuleId,
      coachId: nutzerId,
      coachees: [],
      partnerGrundschule: daten.partnerGrundschule,
    };
    this._nutzer.update((list) => [...list, nutzer]);
    this._tandems.update((list) => [...list, tandem]);
    // Einladungscode (im Prototyp nur Anzeige; später echter Magic-Link)
    const code = `BT-${nutzerId.toUpperCase()}-${(idZaehler % 9000) + 1000}`;
    this._codes.set(code.toUpperCase(), nutzerId);
    return { nutzer, tandem, code };
  }

  codeAufloesen(code: string): string | null {
    return this._codes.get(code.trim().toUpperCase()) ?? null;
  }

  chatSenden(kanalId: string, vonId: string, text: string): ChatNachricht {
    const nachricht: ChatNachricht = {
      id: neueId('cm'),
      kanalId,
      vonId,
      text,
      zeit: new Date().toISOString(),
    };
    this._chatNachrichten.update((list) => [...list, nachricht]);
    return nachricht;
  }

  direktKanalFinden(aId: string, bId: string): ChatKanal | undefined {
    return this._chatKanaele().find(
      (k) =>
        k.typ === 'direkt' &&
        k.mitglieder.includes(aId) &&
        k.mitglieder.includes(bId),
    );
  }

  direktKanalErstellen(aId: string, bId: string): ChatKanal {
    const vorhanden = this.direktKanalFinden(aId, bId);
    if (vorhanden) return vorhanden;
    const kanal: ChatKanal = {
      id: neueId('k-dir'),
      typ: 'direkt',
      name: 'Direkt',
      mitglieder: [aId, bId],
    };
    this._chatKanaele.update((list) => [...list, kanal]);
    return kanal;
  }

  chatNachrichtAnpinnen(id: string): void {
    this._chatNachrichten.update((list) =>
      list.map((n) => (n.id === id ? { ...n, angepinnt: !n.angepinnt } : n)),
    );
  }

  formularStatusSetzen(id: string, status: FormularStatus): void {
    this._formulare.update((list) =>
      list.map((f) => (f.id === id ? { ...f, status } : f)),
    );
  }

  tagesCheckSpeichern(
    daten: Omit<TagesCheck, 'id' | 'datum'> & { datum?: string },
  ): TagesCheck {
    const check: TagesCheck = {
      ...daten,
      id: neueId('tc'),
      datum: daten.datum ?? new Date().toISOString(),
    };
    this._tagesChecks.update((list) => [...list, check]);
    return check;
  }
}

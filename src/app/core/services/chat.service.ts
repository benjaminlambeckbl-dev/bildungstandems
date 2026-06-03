// =============================================================
// BildungsTandems – Chat (Berechtigungen + abgeleitete Sichten)
// Regeln:
//  - Coach: Kohorten-Kanal der eigenen Schule + Direkt-Threads, in denen er ist.
//           Darf antworten, aber KEINEN Lehrer-Chat selbst starten.
//  - Lehrkraft: Kollegiums-Kanal (schulübergreifend) + eigene Coach-Threads.
//           Darf Coaches der eigenen Schule anschreiben. Sieht (lesend) alle
//           Lehrer↔Coach-Threads der eigenen Schule (Koordinations-Einsicht).
//  - Admin: sieht & schreibt überall, kann jede:n anschreiben.
// Im Echtbetrieb: Supabase Realtime + Row-Level-Security spiegeln diese Regeln.
// =============================================================

import { Injectable, Signal, computed, inject, signal } from '@angular/core';
import { DataService } from '../data/data.service';
import { AuthService } from '../auth/auth.service';
import { ChatKanal, ChatNachricht, Nutzer } from '../models/models';

export interface KanalAnsicht {
  kanal: ChatKanal;
  titel: string;
  untertitel: string;
  icon: string;
  letzteNachricht?: ChatNachricht;
  ungelesen: number;
  nurLesend: boolean;
}

@Injectable({ providedIn: 'root' })
export class ChatService {
  private readonly data = inject(DataService);
  private readonly auth = inject(AuthService);

  /** IDs der in dieser Sitzung gelesenen Nachrichten. */
  private readonly gelesen = signal<Set<string>>(new Set());

  // ---------- Berechtigungen ----------
  kannSehen(k: ChatKanal): boolean {
    const u = this.auth.currentUser();
    if (!u) return false;
    if (u.rolle === 'admin') return true;
    switch (k.typ) {
      case 'kohorte':
        if (u.rolle === 'coach') return u.schuleId === k.schuleId && k.mitglieder.includes(u.id);
        if (u.rolle === 'lehrer') return u.schuleId === k.schuleId; // Koordination sieht eigene Kohorte
        return false;
      case 'kollegium':
        return u.rolle === 'lehrer';
      case 'direkt':
        if (k.mitglieder.includes(u.id)) return true;
        // Koordinations-Einsicht: Lehrkraft sieht Lehrer↔Coach-Threads der eigenen Schule
        if (u.rolle === 'lehrer') {
          const coach = this.coachMitglied(k);
          return !!coach && coach.schuleId === u.schuleId;
        }
        return false;
    }
  }

  darfSenden(k: ChatKanal): boolean {
    const u = this.auth.currentUser();
    if (!u || !this.kannSehen(k)) return false;
    if (u.rolle === 'admin') return true;
    switch (k.typ) {
      case 'kohorte':
        return k.mitglieder.includes(u.id) || u.rolle === 'lehrer';
      case 'kollegium':
        return u.rolle === 'lehrer';
      case 'direkt':
        // Mitglied darf schreiben (Coach darf so antworten); Einsicht-Lehrkraft nicht.
        return k.mitglieder.includes(u.id);
    }
  }

  nurLesend(k: ChatKanal): boolean {
    return this.kannSehen(k) && !this.darfSenden(k);
  }

  // ---------- Sichten ----------
  readonly sichtbareKanaele = computed<KanalAnsicht[]>(() => {
    const u = this.auth.currentUser();
    if (!u) return [];
    return this.data
      .chatKanaele()
      .filter((k) => this.kannSehen(k))
      .map((k) => this.ansicht(k))
      .sort(
        (a, b) =>
          (b.letzteNachricht ? +new Date(b.letzteNachricht.zeit) : 0) -
          (a.letzteNachricht ? +new Date(a.letzteNachricht.zeit) : 0),
      );
  });

  readonly ungelesenGesamt = computed(() =>
    this.sichtbareKanaele().reduce((s, k) => s + k.ungelesen, 0),
  );

  nachrichtenFuer(kanalId: string): Signal<ChatNachricht[]> {
    return computed(() =>
      this.data
        .chatNachrichten()
        .filter((n) => n.kanalId === kanalId)
        .sort((a, b) => +new Date(a.zeit) - +new Date(b.zeit)),
    );
  }

  kanal(kanalId: string): Signal<ChatKanal | undefined> {
    return computed(() => this.data.chatKanaele().find((k) => k.id === kanalId));
  }

  // ---------- Aktionen ----------
  senden(kanalId: string, text: string): void {
    const u = this.auth.currentUser();
    const k = this.data.chatKanaele().find((x) => x.id === kanalId);
    const sauber = text.trim();
    if (!u || !k || !sauber || !this.darfSenden(k)) return;
    this.data.chatSenden(kanalId, u.id, sauber);
    this.markGelesen(kanalId);
  }

  /** Wichtige Nachrichten anheften darf nur Lehrkraft/Admin (mit Zugriff auf den Kanal). */
  darfPinnen(k: ChatKanal): boolean {
    const u = this.auth.currentUser();
    if (!u || !this.kannSehen(k)) return false;
    return u.rolle === 'lehrer' || u.rolle === 'admin';
  }

  anpinnen(kanalId: string, nachrichtId: string): void {
    const k = this.data.chatKanaele().find((x) => x.id === kanalId);
    if (!k || !this.darfPinnen(k)) return;
    this.data.chatNachrichtAnpinnen(nachrichtId);
  }

  /** Angeheftete Nachrichten eines Kanals (neueste zuerst). */
  angepinnte(kanalId: string): Signal<ChatNachricht[]> {
    return computed(() =>
      this.data
        .chatNachrichten()
        .filter((n) => n.kanalId === kanalId && n.angepinnt)
        .sort((a, b) => +new Date(b.zeit) - +new Date(a.zeit)),
    );
  }

  markGelesen(kanalId: string): void {
    const ids = this.data
      .chatNachrichten()
      .filter((n) => n.kanalId === kanalId)
      .map((n) => n.id);
    this.gelesen.update((set) => {
      const next = new Set(set);
      ids.forEach((id) => next.add(id));
      return next;
    });
  }

  /** Mögliche Empfänger für einen neuen Direkt-Chat. */
  readonly moeglicheEmpfaenger = computed<Nutzer[]>(() => {
    const u = this.auth.currentUser();
    if (!u) return [];
    if (u.rolle === 'admin') return this.data.nutzer().filter((n) => n.id !== u.id);
    if (u.rolle === 'lehrer')
      return this.data.nutzer().filter((n) => n.rolle === 'coach' && n.schuleId === u.schuleId);
    return []; // Coaches starten keine Chats
  });

  readonly darfNeuStarten = computed(() => {
    const r = this.auth.rolle();
    return r === 'lehrer' || r === 'admin';
  });

  /** Startet (oder öffnet) einen Direkt-Chat und gibt die Kanal-ID zurück. */
  direktStarten(empfaengerId: string): string | null {
    const u = this.auth.currentUser();
    if (!u || !this.darfNeuStarten()) return null;
    return this.data.direktKanalErstellen(u.id, empfaengerId).id;
  }

  // ---------- Helfer ----------
  nutzerName(id: string): string {
    const n = this.data.nutzer().find((x) => x.id === id);
    return n ? `${n.vorname} ${n.nachname}` : 'Unbekannt';
  }

  istEigene(vonId: string): boolean {
    return vonId === this.auth.currentUser()?.id;
  }

  titel(k: ChatKanal): string {
    if (k.typ !== 'direkt') return k.name;
    const u = this.auth.currentUser();
    const namen = k.mitglieder.map((id) => this.nutzerName(id));
    if (u && k.mitglieder.includes(u.id)) {
      return k.mitglieder.filter((id) => id !== u.id).map((id) => this.nutzerName(id)).join(', ');
    }
    return namen.join(' ↔ '); // Koordinations-Einsicht: beide Namen
  }

  private ansicht(k: ChatKanal): KanalAnsicht {
    const nachr = this.data.chatNachrichten().filter((n) => n.kanalId === k.id);
    const letzte = nachr.sort((a, b) => +new Date(b.zeit) - +new Date(a.zeit))[0];
    const uid = this.auth.currentUser()?.id;
    const ungelesen = nachr.filter(
      (n) => n.vonId !== uid && !this.gelesen().has(n.id),
    ).length;
    return {
      kanal: k,
      titel: this.titel(k),
      untertitel: this.untertitel(k),
      icon: this.icon(k),
      letzteNachricht: letzte,
      ungelesen,
      nurLesend: this.nurLesend(k),
    };
  }

  private untertitel(k: ChatKanal): string {
    if (k.typ === 'kohorte') return 'Coach-Kohorte';
    if (k.typ === 'kollegium') return 'Lehrkräfte-Austausch';
    return this.nurLesend(k) ? 'Einsehbar (Koordination)' : 'Direktnachricht';
  }

  private icon(k: ChatKanal): string {
    if (k.typ === 'kohorte') return '👥';
    if (k.typ === 'kollegium') return '🏫';
    return '💬';
  }

  private coachMitglied(k: ChatKanal): Nutzer | undefined {
    return k.mitglieder
      .map((id) => this.data.nutzer().find((n) => n.id === id))
      .find((n) => n?.rolle === 'coach');
  }
}

// =============================================================
// BildungsTandems – abgeleitete Sichten (Selectors)
// Bündelt häufig gebrauchte Ableitungen aus DataService + AuthService,
// damit die Seiten-Komponenten schlank bleiben.
// =============================================================

import { Injectable, Signal, computed, inject } from '@angular/core';
import { DataService } from '../data/data.service';
import { AuthService } from '../auth/auth.service';
import { Nutzer, Tandem, Termin } from '../models/models';

@Injectable({ providedIn: 'root' })
export class SelectorsService {
  private readonly data = inject(DataService);
  private readonly auth = inject(AuthService);

  /** Tandem des aktuell angemeldeten Coachs. */
  readonly meinTandem = computed<Tandem | undefined>(() => {
    const user = this.auth.currentUser();
    if (!user?.tandemId) return undefined;
    return this.data.tandems().find((t) => t.id === user.tandemId);
  });

  /** Termine des eigenen Tandems (Coach), chronologisch. */
  readonly meineTermine = computed<Termin[]>(() => {
    const tandem = this.meinTandem();
    if (!tandem) return [];
    return this.sortiere(this.data.termine().filter((t) => t.tandemId === tandem.id));
  });

  /** Coachs, die zur Schule der aktuell angemeldeten Lehrkraft gehören. */
  readonly meineCoachs = computed<Nutzer[]>(() => {
    const user = this.auth.currentUser();
    if (!user) return [];
    return this.data
      .nutzer()
      .filter((n) => n.rolle === 'coach' && n.schuleId === user.schuleId);
  });

  /** Alle Termine an der Schule der Lehrkraft. */
  readonly termineMeinerSchule = computed<Termin[]>(() => {
    const user = this.auth.currentUser();
    if (!user) return [];
    return this.sortiere(this.data.termine().filter((t) => t.schuleId === user.schuleId));
  });

  /** Kommende Termine (Status geplant/vorgeschlagen) aus einer Liste. */
  kommende(termine: Termin[]): Termin[] {
    const jetzt = Date.now();
    return termine.filter(
      (t) => t.status !== 'abgesagt' && t.status !== 'erledigt' && +new Date(t.start) >= jetzt,
    );
  }

  schuleName(schuleId: string): Signal<string> {
    return computed(
      () => this.data.schulen().find((s) => s.id === schuleId)?.name ?? 'Unbekannt',
    );
  }

  tandemName(tandemId: string): string {
    return this.data.tandems().find((t) => t.id === tandemId)?.name ?? 'Tandem';
  }

  private sortiere(termine: Termin[]): Termin[] {
    return [...termine].sort((a, b) => +new Date(a.start) - +new Date(b.start));
  }
}

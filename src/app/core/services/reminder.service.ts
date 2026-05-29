// =============================================================
// BildungsTandems – automatische Termin-Erinnerungen
// Prüft regelmäßig die Termine des angemeldeten Coachs und schickt
// für anstehende Treffen (innerhalb des Erinnerungsfensters) eine
// Erinnerung: als Eintrag im Infos-Feed UND als Browser-Benachrichtigung.
// Im Echtbetrieb übernimmt das eine Supabase Edge Function + Web-Push.
// =============================================================

import { Injectable, inject } from '@angular/core';
import { DataService } from '../data/data.service';
import { AuthService } from '../auth/auth.service';
import { NotificationService } from './notification.service';
import { Termin } from '../models/models';

/** Erinnerung wird ausgelöst, wenn das Treffen innerhalb dieser Zeit beginnt. */
const FENSTER_STUNDEN = 36;
const INTERVALL_MS = 60_000;

@Injectable({ providedIn: 'root' })
export class ReminderService {
  private readonly data = inject(DataService);
  private readonly auth = inject(AuthService);
  private readonly notify = inject(NotificationService);

  private gestartet = false;

  /** Einmalig aus der App-Shell starten. */
  start(): void {
    if (this.gestartet) return;
    this.gestartet = true;
    this.pruefen();
    setInterval(() => this.pruefen(), INTERVALL_MS);
  }

  private pruefen(): void {
    const user = this.auth.currentUser();
    if (!user || user.rolle !== 'coach' || !user.tandemId) return;

    const jetzt = Date.now();
    const grenze = jetzt + FENSTER_STUNDEN * 3600_000;

    for (const t of this.data.termine()) {
      if (t.tandemId !== user.tandemId) continue;
      if (!t.erinnerung || t.erinnerungVerschickt || t.status !== 'geplant') continue;
      const start = +new Date(t.start);
      if (start <= jetzt || start > grenze) continue;
      this.ausloesen(t, user.id);
    }
  }

  private ausloesen(t: Termin, nutzerId: string): void {
    this.data.erinnerungMarkieren(t.id);
    this.data.nachrichtSenden({
      typ: 'erinnerung',
      titel: `Bald: ${t.titel}`,
      text: `Dein Treffen „${t.titel}" steht an. Denk an die Vorbereitung!`,
      vonName: 'BildungsTandems',
      anNutzerId: nutzerId,
      terminId: t.id,
    });
    void this.notify.zeigen(`Erinnerung: ${t.titel}`, 'Dein Tandem-Treffen steht bald an.');
  }

  /** Manuell auslösen (Demo-Button „Erinnerung testen"). */
  jetztErinnern(t: Termin): void {
    void this.notify.zeigen(
      `Erinnerung: ${t.titel}`,
      `Am ${new Date(t.start).toLocaleString('de-DE')} · ${t.ort}`,
    );
  }
}

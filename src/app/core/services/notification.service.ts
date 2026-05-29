// =============================================================
// BildungsTandems – Benachrichtigungen
// 1) In-App-Feed (Nachrichten an den aktuellen Nutzer)
// 2) Browser-Notification-API als Demo für echtes Push (kommt später
//    via Supabase Edge Function + Web-Push/VAPID).
// =============================================================

import { Injectable, computed, inject, signal } from '@angular/core';
import { DataService } from '../data/data.service';
import { AuthService } from '../auth/auth.service';
import { Nachricht } from '../models/models';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly data = inject(DataService);
  private readonly auth = inject(AuthService);

  /** Aktueller Erlaubnis-Status der Browser-Benachrichtigungen. */
  readonly erlaubnis = signal<NotificationPermission>(
    this.aktuellerStatus(),
  );

  /** Nachrichten an den aktuell angemeldeten Nutzer, neueste zuerst. */
  readonly meineNachrichten = computed<Nachricht[]>(() => {
    const user = this.auth.currentUser();
    if (!user) return [];
    return this.data
      .nachrichten()
      .filter((n) => n.anNutzerId === user.id)
      .sort((a, b) => +new Date(b.zeit) - +new Date(a.zeit));
  });

  readonly ungelesen = computed(
    () => this.meineNachrichten().filter((n) => !n.gelesen).length,
  );

  private aktuellerStatus(): NotificationPermission {
    if (typeof Notification === 'undefined') return 'denied';
    return Notification.permission;
  }

  /** Fordert die Erlaubnis für Browser-Benachrichtigungen an. */
  async erlaubnisAnfragen(): Promise<NotificationPermission> {
    if (typeof Notification === 'undefined') return 'denied';
    const status = await Notification.requestPermission();
    this.erlaubnis.set(status);
    return status;
  }

  /** Zeigt eine Browser-Benachrichtigung (Demo für Push). */
  async zeigen(titel: string, text: string): Promise<void> {
    let status = this.erlaubnis();
    if (status === 'default') {
      status = await this.erlaubnisAnfragen();
    }
    if (status !== 'granted' || typeof Notification === 'undefined') {
      // Fallback: nichts zu tun – der In-App-Feed zeigt die Info ohnehin.
      return;
    }
    try {
      new Notification(titel, {
        body: text,
        icon: 'icons/icon-192x192.png',
        badge: 'icons/icon-96x96.png',
      });
    } catch {
      // Auf manchen Plattformen nur über den Service Worker erlaubt – im
      // Prototyp ignorieren wir das.
    }
  }
}

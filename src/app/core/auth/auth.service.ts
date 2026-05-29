// =============================================================
// BildungsTandems – Auth (Prototyp)
// Mock-Login per Rollen-/Nutzerauswahl. Aktueller Nutzer als Signal.
// Persistiert die Auswahl in localStorage für angenehmes Durchklicken.
// Später ersetzbar durch Supabase Auth (gleiche öffentliche API).
// =============================================================

import { Injectable, computed, inject, signal } from '@angular/core';
import { DataService } from '../data/data.service';
import { Nutzer, Rolle } from '../models/models';

const STORAGE_KEY = 'bt.currentUserId';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly data = inject(DataService);

  private readonly _currentUserId = signal<string | null>(
    this.ausSpeicherLesen(),
  );

  readonly currentUser = computed<Nutzer | null>(() => {
    const id = this._currentUserId();
    if (!id) return null;
    return this.data.nutzer().find((n) => n.id === id) ?? null;
  });

  readonly istAngemeldet = computed(() => this.currentUser() !== null);
  readonly rolle = computed<Rolle | null>(() => this.currentUser()?.rolle ?? null);

  login(nutzerId: string): void {
    this._currentUserId.set(nutzerId);
    this.inSpeicherSchreiben(nutzerId);
  }

  /** Anmeldung per Einladungscode. Gibt die Rolle zurück oder null bei ungültigem Code. */
  loginMitCode(code: string): Rolle | null {
    const nutzerId = this.data.codeAufloesen(code);
    if (!nutzerId) return null;
    const nutzer = this.data.nutzer().find((n) => n.id === nutzerId);
    if (!nutzer) return null;
    this.login(nutzerId);
    return nutzer.rolle;
  }

  logout(): void {
    this._currentUserId.set(null);
    this.inSpeicherSchreiben(null);
  }

  /** Startroute je nach Rolle. */
  startRoute(rolle: Rolle): string {
    return `/${rolle}`;
  }

  private ausSpeicherLesen(): string | null {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch {
      return null;
    }
  }

  private inSpeicherSchreiben(id: string | null): void {
    try {
      if (id) localStorage.setItem(STORAGE_KEY, id);
      else localStorage.removeItem(STORAGE_KEY);
    } catch {
      // localStorage nicht verfügbar – ignorieren (Prototyp)
    }
  }
}

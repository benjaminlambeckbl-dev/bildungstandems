import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/auth/auth.service';
import { DataService } from '../../core/data/data.service';
import { AvatarComponent } from '../../shared/ui/avatar';
import { Nutzer, Rolle } from '../../core/models/models';

const ROLLEN_INFO: Record<Rolle, { label: string; icon: string; text: string }> = {
  coach: { label: 'Coach', icon: '🎓', text: 'Schüler:in, die ein Tandem begleitet' },
  lehrer: { label: 'Koordination', icon: '🧭', text: 'Lehrkraft / Schulkoordination' },
  admin: { label: 'Organisation', icon: '🏛️', text: 'Stiftungs-Team (GLS)' },
};

@Component({
  selector: 'bt-login',
  standalone: true,
  imports: [AvatarComponent, FormsModule],
  template: `
    <div class="login">
      <div class="hero">
        <div class="logo">BT</div>
        <h1>BildungsTandems</h1>
        <p class="claim">Gemeinsam lernen. Verantwortung übernehmen. Brücken bauen.</p>
      </div>

      <div class="panel">
        <div class="tabs">
          <button [class.an]="modus() === 'profil'" (click)="modus.set('profil')">Demo-Profil</button>
          <button [class.an]="modus() === 'code'" (click)="modus.set('code')">Mit Code</button>
        </div>

        @if (modus() === 'code') {
          <form class="code-form" (ngSubmit)="anmeldenMitCode()">
            <div class="bt-field">
              <label for="code">Einladungscode</label>
              <input id="code" name="code" [(ngModel)]="code" placeholder="BT-XXXX-0000" autocomplete="off" />
            </div>
            <button type="submit" class="bt-btn bt-btn--primary bt-btn--block bt-btn--lg" [disabled]="!code.trim()">
              Anmelden
            </button>
            @if (fehler()) {
              <p class="fehler">⚠️ {{ fehler() }}</p>
            }
            <p class="demo-code">Demo-Code zum Ausprobieren: <strong>BT-DEMO-2026</strong></p>
          </form>
        } @else {
        <p class="hint">Prototyp – wähle ein Demo-Profil, um die App auszuprobieren:</p>

        @for (gruppe of gruppen(); track gruppe.rolle) {
          <section class="gruppe">
            <header class="gruppe-kopf">
              <span class="g-icon">{{ gruppe.info.icon }}</span>
              <div>
                <strong>{{ gruppe.info.label }}</strong>
                <span class="g-text">{{ gruppe.info.text }}</span>
              </div>
            </header>

            <div class="profile">
              @for (n of gruppe.nutzer; track n.id) {
                <button class="profil" type="button" (click)="anmelden(n)">
                  <bt-avatar [vorname]="n.vorname" [nachname]="n.nachname" [farbe]="n.avatarFarbe ?? ''" />
                  <span class="name">{{ n.vorname }} {{ n.nachname }}</span>
                  <span class="pfeil">→</span>
                </button>
              }
            </div>
          </section>
        }
        }

        <p class="datenschutz">
          🔒 Demo mit fiktiven Daten. Im echten Betrieb: Anmeldung über die Schule,
          DSGVO-konform, Datenstandort EU.
        </p>
      </div>
    </div>
  `,
  styleUrl: './login.page.scss',
})
export class LoginPage {
  private readonly auth = inject(AuthService);
  private readonly data = inject(DataService);
  private readonly router = inject(Router);

  private readonly reihenfolge: Rolle[] = ['coach', 'lehrer', 'admin'];

  readonly modus = signal<'profil' | 'code'>('profil');
  readonly fehler = signal('');
  code = '';

  anmeldenMitCode(): void {
    const rolle = this.auth.loginMitCode(this.code);
    if (!rolle) {
      this.fehler.set('Code nicht erkannt. Bitte prüfe deine Eingabe.');
      return;
    }
    this.fehler.set('');
    this.router.navigateByUrl(this.auth.startRoute(rolle));
  }

  readonly gruppen = computed(() =>
    this.reihenfolge.map((rolle) => ({
      rolle,
      info: ROLLEN_INFO[rolle],
      nutzer: this.data.nutzer().filter((n) => n.rolle === rolle),
    })),
  );

  constructor() {
    // Bereits angemeldet? Direkt in den eigenen Bereich.
    const r = this.auth.rolle();
    if (r) this.router.navigateByUrl(this.auth.startRoute(r));
  }

  anmelden(n: Nutzer): void {
    this.auth.login(n.id);
    this.router.navigateByUrl(this.auth.startRoute(n.rolle));
  }
}

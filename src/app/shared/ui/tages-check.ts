import { Component, computed, inject, signal } from '@angular/core';
import { AuthService } from '../../core/auth/auth.service';
import { DataService } from '../../core/data/data.service';

const OPTIONEN = [
  { wert: 1, icon: '😟', label: 'schwierig' },
  { wert: 2, icon: '😐', label: 'okay' },
  { wert: 3, icon: '😄', label: 'gut' },
];

/** Tägliches Kurz-Feedback „Wie lief es heute?" (Schnell-Check mit Buttons). */
@Component({
  selector: 'bt-tages-check',
  standalone: true,
  template: `
    <div class="check">
      @if (!heuteErledigt()) {
        <p class="frage">Wie lief es heute?</p>
        <div class="opts">
          @for (o of optionen; track o.wert) {
            <button type="button" class="opt" (click)="waehlen(o.wert)" [attr.aria-label]="o.label">
              <span class="icon">{{ o.icon }}</span>
              <span class="lab">{{ o.label }}</span>
            </button>
          }
        </div>
      } @else {
        <p class="danke">✅ Danke für dein Feedback heute!</p>
      }
    </div>
  `,
  styles: [
    `
      .check { background: var(--bt-surface); border: 1px solid var(--bt-border);
        border-radius: var(--bt-radius); box-shadow: var(--bt-shadow-sm); padding: var(--bt-sp-4); }
      .frage { margin: 0 0 var(--bt-sp-3); font-weight: 800; }
      .opts { display: flex; gap: var(--bt-sp-3); }
      .opt { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 4px;
        min-height: 64px; padding: var(--bt-sp-2); border: 2px solid var(--bt-border); border-radius: var(--bt-radius);
        background: var(--bt-surface-alt); font-weight: 700; }
      .opt:active { transform: scale(0.97); }
      .icon { font-size: 1.6rem; }
      .lab { font-size: var(--bt-fs-xs); color: var(--bt-text-muted); }
      .danke { margin: 0; font-weight: 700; color: var(--bt-success); text-align: center; }
    `,
  ],
})
export class TagesCheckComponent {
  private readonly auth = inject(AuthService);
  private readonly data = inject(DataService);

  readonly optionen = OPTIONEN;
  private readonly gespeichert = signal(false);

  readonly heuteErledigt = computed(() => {
    if (this.gespeichert()) return true;
    const u = this.auth.currentUser();
    if (!u) return false;
    const heute = new Date().toLocaleDateString('de-DE');
    return this.data
      .tagesChecks()
      .some((c) => c.nutzerId === u.id && new Date(c.datum).toLocaleDateString('de-DE') === heute);
  });

  waehlen(wert: number): void {
    const u = this.auth.currentUser();
    if (!u) return;
    this.data.tagesCheckSpeichern({ nutzerId: u.id, schuleId: u.schuleId, wert });
    this.gespeichert.set(true);
  }
}

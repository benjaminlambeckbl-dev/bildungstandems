import { Component, computed, inject, signal } from '@angular/core';
import { AuthService } from '../../core/auth/auth.service';
import { DataService } from '../../core/data/data.service';
import { PageHeaderComponent } from '../../shared/ui/page-header';
import { BadgeComponent } from '../../shared/ui/badge';
import { EmptyStateComponent } from '../../shared/ui/empty-state';
import { DatumPipe } from '../../shared/pipes/datum.pipe';
import { Formular } from '../../core/models/models';

@Component({
  selector: 'bt-formulare',
  standalone: true,
  imports: [PageHeaderComponent, BadgeComponent, EmptyStateComponent, DatumPipe],
  template: `
    <bt-page-header titel="Formulare" untertitel="Zugewiesene Formulare & Status" />

    @if (formulare().length) {
      <div class="liste">
        @for (f of formulare(); track f.id) {
          <div class="form" [class.fertig]="f.status === 'erledigt'">
            <div class="kopf">
              <strong>{{ f.titel }}</strong>
              <bt-badge [ton]="f.status === 'erledigt' ? 'erfolg' : 'akzent'">
                {{ f.status === 'erledigt' ? 'Erledigt' : 'Offen' }}
              </bt-badge>
            </div>
            <p class="desc">{{ f.beschreibung }}</p>
            @if (f.faelligAm && f.status === 'offen') {
              <p class="frist">⏳ fällig {{ f.faelligAm | datum: 'tag' }}</p>
            }
            <div class="aktionen">
              <button class="bt-btn bt-btn--ghost" (click)="oeffnen(f)">Formular öffnen</button>
              @if (f.status === 'offen') {
                <button class="bt-btn bt-btn--primary" (click)="erledigt(f.id)">Als erledigt markieren</button>
              }
            </div>
          </div>
        }
      </div>
    } @else {
      <bt-empty symbol="🗂️" titel="Keine Formulare" text="Dir sind aktuell keine Formulare zugewiesen." />
    }

    @if (hinweis()) {
      <div class="toast">📝 „{{ hinweis() }}" – im Prototyp nur als Demo.</div>
    }
  `,
  styles: [
    `
      .liste { display: flex; flex-direction: column; gap: var(--bt-sp-3); }
      .form { background: var(--bt-surface); border: 1px solid var(--bt-border);
        border-left: 4px solid var(--bt-accent); border-radius: var(--bt-radius);
        box-shadow: var(--bt-shadow-sm); padding: var(--bt-sp-4); }
      .form.fertig { border-left-color: var(--bt-success); opacity: 0.8; }
      .kopf { display: flex; justify-content: space-between; align-items: flex-start; gap: var(--bt-sp-2); }
      .kopf strong { font-size: var(--bt-fs-md); }
      .desc { margin: var(--bt-sp-2) 0; font-size: var(--bt-fs-sm); color: var(--bt-text-muted); }
      .frist { margin: 0 0 var(--bt-sp-2); font-size: var(--bt-fs-xs); font-weight: 700; color: var(--bt-warning); }
      .aktionen { display: flex; gap: var(--bt-sp-2); flex-wrap: wrap; }
      .aktionen .bt-btn { flex: 1; font-size: var(--bt-fs-sm); }
      .toast { position: fixed; left: 50%; bottom: calc(var(--bt-nav-h) + 16px); transform: translateX(-50%);
        background: var(--bt-text); color: #fff; padding: 0.6rem 1rem; border-radius: var(--bt-radius-pill);
        font-size: var(--bt-fs-sm); font-weight: 600; box-shadow: var(--bt-shadow-lg); z-index: 50; max-width: 90%; }
    `,
  ],
})
export class FormularePage {
  private readonly auth = inject(AuthService);
  private readonly data = inject(DataService);

  readonly hinweis = signal('');

  readonly formulare = computed(() => {
    const rolle = this.auth.rolle();
    if (!rolle) return [];
    return this.data.formulare().filter((f) => f.fuer.includes(rolle));
  });

  oeffnen(f: Formular): void {
    this.hinweis.set(f.titel);
  }
  erledigt(id: string): void {
    this.data.formularStatusSetzen(id, 'erledigt');
  }
}

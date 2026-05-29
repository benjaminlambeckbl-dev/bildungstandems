import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { DataService } from '../../core/data/data.service';
import { PageHeaderComponent } from '../../shared/ui/page-header';
import { ProgressBarComponent } from '../../shared/ui/progress-bar';
import { EmptyStateComponent } from '../../shared/ui/empty-state';

@Component({
  selector: 'bt-lernpfade',
  standalone: true,
  imports: [RouterLink, PageHeaderComponent, ProgressBarComponent, EmptyStateComponent],
  template: `
    <bt-page-header titel="Lernpfade" untertitel="Schritt für Schritt sicher werden" />

    @if (pfade().length) {
      <div class="bt-stack">
        @for (lp of pfade(); track lp.id) {
          <a class="pfad" [routerLink]="[basis(), lp.id]">
            <span class="symbol">{{ lp.symbol }}</span>
            <div class="mitte">
              <strong>{{ lp.titel }}</strong>
              <span class="desc">{{ lp.beschreibung }}</span>
              <bt-progress [erledigt]="lp.erledigt" [gesamt]="lp.gesamt" />
            </div>
            @if (lp.erledigt === lp.gesamt) {
              <span class="fertig">✓</span>
            }
          </a>
        }
      </div>
    } @else {
      <bt-empty symbol="🎓" titel="Keine Lernpfade" />
    }
  `,
  styles: [
    `
      .pfad {
        display: flex;
        align-items: center;
        gap: var(--bt-sp-3);
        padding: var(--bt-sp-4);
        background: var(--bt-surface);
        border: 1px solid var(--bt-border);
        border-radius: var(--bt-radius);
        box-shadow: var(--bt-shadow-sm);
        text-decoration: none;
        color: var(--bt-text);
      }
      .symbol {
        font-size: 2rem;
      }
      .mitte {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 6px;
      }
      .mitte strong {
        font-size: var(--bt-fs-md);
      }
      .desc {
        font-size: var(--bt-fs-xs);
        color: var(--bt-text-muted);
      }
      .fertig {
        width: 28px;
        height: 28px;
        border-radius: 50%;
        background: var(--bt-success);
        color: #fff;
        display: grid;
        place-items: center;
        font-weight: 900;
      }
    `,
  ],
})
export class LernpfadePage {
  private readonly auth = inject(AuthService);
  private readonly data = inject(DataService);

  /** Routenbasis je nach Rolle (Coach: /coach/lernpfade, Lehrer: /lehrer/lernstrecken). */
  readonly basis = computed(() =>
    this.auth.rolle() === 'lehrer' ? '/lehrer/lernstrecken' : '/coach/lernpfade',
  );

  readonly pfade = computed(() => {
    const rolle = this.auth.rolle();
    return this.data
      .lernpfade()
      .filter((lp) => lp.fuer === rolle)
      .map((lp) => {
        const f = this.data.fortschritte().find((x) => x.pfadId === lp.id);
        return {
          ...lp,
          erledigt: f?.erledigteSchritte.length ?? 0,
          gesamt: lp.schritte.length,
        };
      });
  });
}

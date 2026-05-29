import { Component, computed, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { DataService } from '../../core/data/data.service';
import { SelectorsService } from '../../core/services/selectors.service';
import { NotificationService } from '../../core/services/notification.service';
import { CardComponent } from '../../shared/ui/card';
import { TerminItemComponent } from '../../shared/ui/termin-item';
import { ProgressBarComponent } from '../../shared/ui/progress-bar';
import { EmptyStateComponent } from '../../shared/ui/empty-state';

@Component({
  selector: 'bt-coach-dashboard',
  standalone: true,
  imports: [
    RouterLink,
    CardComponent,
    TerminItemComponent,
    ProgressBarComponent,
    EmptyStateComponent,
  ],
  template: `
    <div class="bt-stack">
      <header class="hallo">
        <p class="gruss">Hallo {{ user()?.vorname }} 👋</p>
        <h1>{{ tandem()?.name ?? 'Dein Tandem' }}</h1>
        @if (tandem()) {
          <p class="bt-muted">
            {{ tandem()!.coachees.length }} Kinder · {{ tandem()!.partnerGrundschule }}
          </p>
        }
      </header>

      <!-- Nächster Termin -->
      <section>
        <div class="zeile">
          <h2 class="bt-section-title">Nächstes Treffen</h2>
          <a routerLink="/coach/termine" class="mehr">alle →</a>
        </div>
        @if (naechster(); as t) {
          <bt-termin-item [termin]="t" [klickbar]="true" (oeffnen)="oeffne($event)" />
        } @else {
          <bt-card>
            <bt-empty symbol="📅" titel="Kein Treffen geplant" text="Schlage dein nächstes Treffen vor.">
              <a routerLink="/coach/termine/neu" class="bt-btn bt-btn--primary">Termin vorschlagen</a>
            </bt-empty>
          </bt-card>
        }
      </section>

      <!-- Schnellzugriff -->
      <section class="bt-grid-2">
        <a routerLink="/coach/reflexion" class="kachel">
          <span class="k-icon">📝</span>
          <span class="k-label">Reflexion schreiben</span>
        </a>
        <a routerLink="/coach/nachrichten" class="kachel">
          <span class="k-icon">🔔</span>
          <span class="k-label">Infos</span>
          @if (ungelesen() > 0) {
            <span class="k-dot">{{ ungelesen() }} neu</span>
          }
        </a>
        <a routerLink="/coach/programm" class="kachel">
          <span class="k-icon">🗺️</span>
          <span class="k-label">Programm-Jahr</span>
        </a>
        <a routerLink="/coach/zertifikat" class="kachel">
          <span class="k-icon">🎓</span>
          <span class="k-label">Mein Zertifikat</span>
        </a>
        <a routerLink="/coach/chat" class="kachel">
          <span class="k-icon">💬</span>
          <span class="k-label">Chat (Kohorte)</span>
        </a>
      </section>

      <!-- Lernfortschritt -->
      <section>
        <div class="zeile">
          <h2 class="bt-section-title">Deine Lernpfade</h2>
          <a routerLink="/coach/lernpfade" class="mehr">alle →</a>
        </div>
        @for (lp of lernpfadeMitFortschritt(); track lp.id) {
          <a class="lp-zeile" [routerLink]="['/coach/lernpfade', lp.id]">
            <span class="lp-symbol">{{ lp.symbol }}</span>
            <div class="lp-mitte">
              <strong>{{ lp.titel }}</strong>
              <bt-progress [erledigt]="lp.erledigt" [gesamt]="lp.gesamt" />
            </div>
          </a>
        }
      </section>
    </div>
  `,
  styles: [
    `
      .hallo h1 {
        margin: 2px 0;
        font-size: var(--bt-fs-2xl);
      }
      .gruss {
        margin: 0;
        color: var(--bt-text-muted);
        font-weight: 700;
      }
      .zeile {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .mehr {
        font-size: var(--bt-fs-sm);
        font-weight: 700;
      }
      .kachel {
        position: relative;
        display: flex;
        flex-direction: column;
        gap: var(--bt-sp-2);
        padding: var(--bt-sp-4);
        background: var(--bt-surface);
        border: 1px solid var(--bt-border);
        border-radius: var(--bt-radius);
        box-shadow: var(--bt-shadow-sm);
        text-decoration: none;
        color: var(--bt-text);
        font-weight: 700;
      }
      .k-icon {
        font-size: 1.6rem;
      }
      .k-label {
        font-size: var(--bt-fs-sm);
      }
      .k-dot {
        position: absolute;
        top: var(--bt-sp-3);
        right: var(--bt-sp-3);
        background: var(--bt-accent);
        color: #3a2a05;
        font-size: var(--bt-fs-xs);
        font-weight: 800;
        padding: 2px 8px;
        border-radius: var(--bt-radius-pill);
      }
      .lp-zeile {
        display: flex;
        align-items: center;
        gap: var(--bt-sp-3);
        padding: var(--bt-sp-3);
        background: var(--bt-surface);
        border: 1px solid var(--bt-border);
        border-radius: var(--bt-radius);
        margin-bottom: var(--bt-sp-2);
        text-decoration: none;
        color: var(--bt-text);
      }
      .lp-symbol {
        font-size: 1.7rem;
      }
      .lp-mitte {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 6px;
      }
      .lp-mitte strong {
        font-size: var(--bt-fs-sm);
      }
    `,
  ],
})
export class CoachDashboardPage {
  private readonly auth = inject(AuthService);
  private readonly data = inject(DataService);
  private readonly sel = inject(SelectorsService);
  private readonly notify = inject(NotificationService);
  private readonly router = inject(Router);

  oeffne(id: string): void {
    this.router.navigate(['/coach/termine', id]);
  }

  readonly user = this.auth.currentUser;
  readonly tandem = this.sel.meinTandem;
  readonly ungelesen = this.notify.ungelesen;

  readonly naechster = computed(() => this.sel.kommende(this.sel.meineTermine())[0]);

  readonly lernpfadeMitFortschritt = computed(() =>
    this.data
      .lernpfade()
      .filter((lp) => lp.fuer === 'coach')
      .map((lp) => {
        const f = this.data.fortschritte().find((x) => x.pfadId === lp.id);
        return {
          ...lp,
          erledigt: f?.erledigteSchritte.length ?? 0,
          gesamt: lp.schritte.length,
        };
      }),
  );
}

import { Component, computed, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { DataService } from '../../core/data/data.service';
import { SelectorsService } from '../../core/services/selectors.service';
import { CardComponent } from '../../shared/ui/card';
import { TerminItemComponent } from '../../shared/ui/termin-item';

@Component({
  selector: 'bt-teacher-dashboard',
  standalone: true,
  imports: [RouterLink, CardComponent, TerminItemComponent],
  template: `
    <div class="bt-stack">
      <header>
        <p class="gruss">Guten Tag, {{ user()?.vorname }} {{ user()?.nachname }} 👋</p>
        <h1>Koordination</h1>
        <p class="bt-muted">{{ schule() }}</p>
      </header>

      <!-- Kennzahlen -->
      <div class="bt-grid-2">
        <div class="kpi">
          <span class="zahl">{{ coachs().length }}</span>
          <span class="label">Coachs</span>
        </div>
        <div class="kpi">
          <span class="zahl">{{ kommende().length }}</span>
          <span class="label">kommende Termine</span>
        </div>
      </div>

      <!-- Schnellaktionen -->
      <div class="bt-grid-2">
        <a routerLink="/lehrer/nachricht" class="kachel">
          <span class="k-icon">✉️</span><span>Info senden</span>
        </a>
        <a routerLink="/lehrer/schueler/neu" class="kachel">
          <span class="k-icon">➕</span><span>Zugang gewähren</span>
        </a>
        <a routerLink="/lehrer/programm" class="kachel">
          <span class="k-icon">🗺️</span><span>Programm-Jahr</span>
        </a>
        <a routerLink="/lehrer/reflexionen" class="kachel">
          <span class="k-icon">📝</span><span>Reflexionen</span>
        </a>
        <a routerLink="/lehrer/chat" class="kachel">
          <span class="k-icon">💬</span><span>Chat</span>
        </a>
        <a routerLink="/lehrer/auswertung" class="kachel">
          <span class="k-icon">📊</span><span>Auswertung</span>
        </a>
        <a routerLink="/lehrer/formulare" class="kachel">
          <span class="k-icon">🗂️</span><span>Formulare</span>
        </a>
        <a routerLink="/lehrer/faq" class="kachel">
          <span class="k-icon">💡</span><span>FAQ</span>
        </a>
      </div>

      <!-- Hilfe-Anfragen der Coaches -->
      @if (hilfeAnfragen().length) {
        <section>
          <h2 class="bt-section-title">🆘 Hilfe-Anfragen</h2>
          @for (h of hilfeAnfragen(); track h.id) {
            <bt-card accent accentColor="var(--bt-warning)">
              <strong>{{ h.titel }}</strong>
              <p class="klein">{{ h.text }}</p>
            </bt-card>
          }
        </section>
      }

      <!-- Zu bestätigen -->
      @if (vorgeschlagen().length) {
        <section>
          <h2 class="bt-section-title">Vorschläge bestätigen</h2>
          @for (t of vorgeschlagen(); track t.id) {
            <bt-card accent accentColor="var(--bt-accent)">
              <strong>{{ t.titel }}</strong>
              <p class="bt-muted klein">von Coach vorgeschlagen</p>
              <div class="aktionen">
                <button class="bt-btn bt-btn--primary" (click)="bestaetigen(t.id)">✓ Bestätigen</button>
                <button class="bt-btn bt-btn--ghost" (click)="ablehnen(t.id)">Absagen</button>
              </div>
            </bt-card>
          }
        </section>
      }

      <!-- Nächste Termine -->
      <section>
        <div class="zeile">
          <h2 class="bt-section-title">Nächste Termine</h2>
          <a routerLink="/lehrer/termine" class="mehr">alle →</a>
        </div>
        @for (t of kommende().slice(0, 3); track t.id) {
          <bt-termin-item [termin]="t" [zusatz]="tandemName(t.tandemId)" [klickbar]="true" (oeffnen)="oeffne($event)" />
        }
      </section>

      <!-- Reflexionen -->
      <section>
        <div class="zeile">
          <h2 class="bt-section-title">Letzte Reflexionen</h2>
          <a routerLink="/lehrer/reflexionen" class="mehr">alle →</a>
        </div>
        @if (reflexionen().length) {
          @for (r of reflexionen().slice(0, 2); track r.id) {
            <bt-card>
              <strong>{{ tandemName(r.tandemId) }}</strong>
              <p class="klein">{{ r.gelungen }}</p>
            </bt-card>
          }
        } @else {
          <p class="bt-muted klein">Noch keine Reflexionen.</p>
        }
      </section>
    </div>
  `,
  styles: [
    `
      h1 {
        margin: 2px 0;
      }
      .gruss {
        margin: 0;
        color: var(--bt-text-muted);
        font-weight: 700;
      }
      .kpi {
        background: var(--bt-surface);
        border: 1px solid var(--bt-border);
        border-radius: var(--bt-radius);
        box-shadow: var(--bt-shadow-sm);
        padding: var(--bt-sp-4);
        text-align: center;
      }
      .zahl {
        display: block;
        font-size: var(--bt-fs-2xl);
        font-weight: 900;
        color: var(--bt-primary);
      }
      .label {
        font-size: var(--bt-fs-xs);
        color: var(--bt-text-muted);
        font-weight: 700;
      }
      .kachel {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: var(--bt-sp-2);
        padding: var(--bt-sp-4);
        background: var(--bt-surface);
        border: 1px solid var(--bt-border);
        border-radius: var(--bt-radius);
        box-shadow: var(--bt-shadow-sm);
        text-decoration: none;
        color: var(--bt-text);
        font-weight: 700;
        font-size: var(--bt-fs-sm);
      }
      .k-icon {
        font-size: 1.5rem;
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
      .aktionen {
        display: flex;
        gap: var(--bt-sp-2);
        margin-top: var(--bt-sp-3);
      }
      .klein {
        font-size: var(--bt-fs-sm);
        margin: 4px 0 0;
      }
    `,
  ],
})
export class TeacherDashboardPage {
  private readonly auth = inject(AuthService);
  private readonly data = inject(DataService);
  private readonly sel = inject(SelectorsService);

  readonly user = this.auth.currentUser;
  readonly coachs = this.sel.meineCoachs;

  readonly schule = computed(
    () => this.data.schulen().find((s) => s.id === this.user()?.schuleId)?.name ?? '',
  );

  readonly kommende = computed(() => this.sel.kommende(this.sel.termineMeinerSchule()));
  readonly vorgeschlagen = computed(() =>
    this.sel.termineMeinerSchule().filter((t) => t.status === 'vorgeschlagen'),
  );

  readonly reflexionen = computed(() => {
    const coachIds = new Set(this.coachs().map((c) => c.id));
    return this.data.reflexionen().filter((r) => coachIds.has(r.nutzerId));
  });

  /** „Hilfe nötig?"-Bedarfsmeldungen an diese Koordination. */
  readonly hilfeAnfragen = computed(() => {
    const id = this.user()?.id;
    return this.data
      .nachrichten()
      .filter((n) => n.typ === 'bedarf' && n.anNutzerId === id)
      .sort((a, b) => +new Date(b.zeit) - +new Date(a.zeit));
  });

  private readonly router = inject(Router);

  oeffne(id: string): void {
    this.router.navigate(['/lehrer/termine', id]);
  }
  tandemName(id: string): string {
    return this.sel.tandemName(id);
  }
  bestaetigen(id: string): void {
    this.data.terminStatusSetzen(id, 'geplant');
  }
  ablehnen(id: string): void {
    this.data.terminStatusSetzen(id, 'abgesagt');
  }
}

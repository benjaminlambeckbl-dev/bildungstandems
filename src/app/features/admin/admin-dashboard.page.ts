import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DataService } from '../../core/data/data.service';
import { CardComponent } from '../../shared/ui/card';

@Component({
  selector: 'bt-admin-dashboard',
  standalone: true,
  imports: [RouterLink, CardComponent],
  template: `
    <div class="bt-stack">
      <header>
        <p class="gruss">Organisation · GLS</p>
        <h1>Programm-Überblick</h1>
        <p class="bt-muted">BildungsTandems – alle Standorte</p>
      </header>

      <div class="kpis">
        <a routerLink="/admin/schulen" class="kpi">
          <span class="zahl">{{ anzahlSchulen() }}</span>
          <span class="label">Schulen</span>
        </a>
        <a routerLink="/admin/tandems" class="kpi">
          <span class="zahl">{{ tandems().length }}</span>
          <span class="label">Tandems</span>
        </a>
        <a routerLink="/admin/termine" class="kpi">
          <span class="zahl">{{ termine().length }}</span>
          <span class="label">Termine</span>
        </a>
        <div class="kpi">
          <span class="zahl">{{ kinder() }}</span>
          <span class="label">Kinder erreicht</span>
        </div>
      </div>

      <section>
        <h2 class="bt-section-title">Standorte</h2>
        @for (s of standorte(); track s.id) {
          <bt-card>
            <div class="standort">
              <div>
                <strong>{{ s.name }}</strong>
                <p class="bt-soft klein">{{ s.ort }}</p>
              </div>
              <div class="zahlen">
                <span>{{ s.tandems }} Tandems</span>
                <span>{{ s.termine }} Termine</span>
              </div>
            </div>
          </bt-card>
        }
      </section>

      <bt-card accent accentColor="var(--bt-role-admin)">
        <strong>📊 Wissenschaftliche Begleitung</strong>
        <p class="klein bt-muted">
          Daten für die Evaluation (TU Dortmund) werden später anonymisiert und
          DSGVO-konform exportiert.
        </p>
      </bt-card>
    </div>
  `,
  styles: [
    `
      h1 {
        margin: 2px 0;
      }
      .gruss {
        margin: 0;
        color: var(--bt-role-admin);
        font-weight: 800;
        font-size: var(--bt-fs-sm);
      }
      .kpis {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: var(--bt-sp-3);
      }
      .kpi {
        background: var(--bt-surface);
        border: 1px solid var(--bt-border);
        border-radius: var(--bt-radius);
        box-shadow: var(--bt-shadow-sm);
        padding: var(--bt-sp-4);
        text-align: center;
        text-decoration: none;
        color: var(--bt-text);
      }
      .zahl {
        display: block;
        font-size: var(--bt-fs-2xl);
        font-weight: 900;
        color: var(--bt-role-admin);
      }
      .label {
        font-size: var(--bt-fs-xs);
        color: var(--bt-text-muted);
        font-weight: 700;
      }
      .standort {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .standort strong {
        font-size: var(--bt-fs-sm);
      }
      .zahlen {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 2px;
        font-size: var(--bt-fs-xs);
        color: var(--bt-text-muted);
        font-weight: 700;
      }
      .klein {
        font-size: var(--bt-fs-sm);
        margin: 4px 0 0;
      }
    `,
  ],
})
export class AdminDashboardPage {
  private readonly data = inject(DataService);

  readonly tandems = this.data.tandems;
  readonly termine = this.data.termine;

  readonly anzahlSchulen = computed(
    () => this.data.schulen().filter((s) => s.typ === 'weiterführend').length,
  );

  readonly kinder = computed(() =>
    this.data.tandems().reduce((summe, t) => summe + t.coachees.length, 0),
  );

  readonly standorte = computed(() =>
    this.data
      .schulen()
      .filter((s) => s.typ === 'weiterführend')
      .map((s) => ({
        ...s,
        tandems: this.data.tandems().filter((t) => t.schuleId === s.id).length,
        termine: this.data.termine().filter((t) => t.schuleId === s.id).length,
      })),
  );
}

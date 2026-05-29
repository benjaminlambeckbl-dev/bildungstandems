import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/auth/auth.service';
import { DataService } from '../../core/data/data.service';
import { PageHeaderComponent } from '../../shared/ui/page-header';
import { EmptyStateComponent } from '../../shared/ui/empty-state';
import { Material, MaterialTyp } from '../../core/models/models';

const TYP_ICON: Record<MaterialTyp, string> = {
  pdf: '📄',
  video: '▶️',
  link: '🔗',
  spiel: '🎲',
  vorlage: '📋',
};
const TYP_LABEL: Record<MaterialTyp, string> = {
  pdf: 'PDF',
  video: 'Video',
  link: 'Link',
  spiel: 'Spiel',
  vorlage: 'Vorlage',
};

@Component({
  selector: 'bt-materialien',
  standalone: true,
  imports: [FormsModule, PageHeaderComponent, EmptyStateComponent],
  template: `
    <bt-page-header titel="Materialien" untertitel="Alles für deine Tandem-Arbeit" />

    <div class="suchzeile">
      <input type="search" [(ngModel)]="suche" placeholder="🔎 Material suchen …" />
    </div>

    <div class="chips">
      <button class="chip" [class.an]="kategorie() === ''" (click)="kategorie.set('')">Alle</button>
      @for (k of kategorien(); track k) {
        <button class="chip" [class.an]="kategorie() === k" (click)="kategorie.set(k)">{{ k }}</button>
      }
    </div>

    @if (zuletzt().length) {
      <section class="zuletzt">
        <h2 class="bt-section-title">Zuletzt geöffnet</h2>
        <div class="zuletzt-row">
          @for (m of zuletzt(); track m.id) {
            <button class="z-chip" type="button" (click)="oeffnen(m)">{{ icon(m.typ) }} {{ m.titel }}</button>
          }
        </div>
      </section>
    }

    @if (gruppen().length) {
      <div class="bt-stack">
        @for (g of gruppen(); track g.kategorie) {
          <section>
            <h2 class="bt-section-title">{{ g.kategorie }}</h2>
            <div class="liste">
              @for (m of g.eintraege; track m.id) {
                <button class="mat" type="button" (click)="oeffnen(m)">
                  <span class="m-icon">{{ icon(m.typ) }}</span>
                  <span class="m-body">
                    <strong>{{ m.titel }}</strong>
                    <span class="m-desc">{{ m.beschreibung }}</span>
                    <span class="m-typ">{{ label(m.typ) }}</span>
                  </span>
                  <span class="m-pfeil">↓</span>
                </button>
              }
            </div>
          </section>
        }
      </div>
    } @else {
      <bt-empty symbol="📚" titel="Keine Materialien" />
    }

    @if (hinweis()) {
      <div class="toast">📂 „{{ hinweis() }}" – im Prototyp nur als Demo.</div>
    }
  `,
  styles: [
    `
      .suchzeile input {
        width: 100%;
        padding: 0.7rem 0.9rem;
        border: 1.5px solid var(--bt-border);
        border-radius: var(--bt-radius-pill);
        background: var(--bt-surface);
        margin-bottom: var(--bt-sp-3);
      }
      .chips {
        display: flex;
        gap: var(--bt-sp-2);
        overflow-x: auto;
        padding-bottom: var(--bt-sp-2);
        margin-bottom: var(--bt-sp-3);
      }
      .chip {
        flex-shrink: 0;
        border: 1.5px solid var(--bt-border);
        background: var(--bt-surface);
        color: var(--bt-text-muted);
        border-radius: var(--bt-radius-pill);
        padding: 0.35rem 0.9rem;
        font-weight: 700;
        font-size: var(--bt-fs-sm);
      }
      .chip.an {
        background: var(--bt-primary);
        color: #fff;
        border-color: var(--bt-primary);
      }
      .zuletzt {
        margin-bottom: var(--bt-sp-4);
      }
      .zuletzt-row {
        display: flex;
        gap: var(--bt-sp-2);
        overflow-x: auto;
      }
      .z-chip {
        flex-shrink: 0;
        border: 1px solid var(--bt-border);
        background: var(--bt-accent-100);
        color: var(--bt-text);
        border-radius: var(--bt-radius);
        padding: 0.5rem 0.8rem;
        font-size: var(--bt-fs-xs);
        font-weight: 700;
        max-width: 200px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .liste {
        display: flex;
        flex-direction: column;
        gap: var(--bt-sp-2);
      }
      .mat {
        display: flex;
        align-items: center;
        gap: var(--bt-sp-3);
        padding: var(--bt-sp-3);
        background: var(--bt-surface);
        border: 1px solid var(--bt-border);
        border-radius: var(--bt-radius);
        box-shadow: var(--bt-shadow-sm);
        text-align: left;
      }
      .m-icon {
        font-size: 1.6rem;
      }
      .m-body {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 2px;
      }
      .m-body strong {
        font-size: var(--bt-fs-sm);
      }
      .m-desc {
        font-size: var(--bt-fs-xs);
        color: var(--bt-text-muted);
      }
      .m-typ {
        align-self: flex-start;
        margin-top: 4px;
        font-size: 0.65rem;
        font-weight: 800;
        color: var(--bt-primary);
        background: var(--bt-primary-100);
        padding: 1px 7px;
        border-radius: var(--bt-radius-pill);
      }
      .m-pfeil {
        color: var(--bt-text-soft);
        font-weight: 900;
      }
      .toast {
        position: fixed;
        left: 50%;
        bottom: calc(var(--bt-nav-h) + 16px);
        transform: translateX(-50%);
        background: var(--bt-text);
        color: #fff;
        padding: 0.6rem 1rem;
        border-radius: var(--bt-radius-pill);
        font-size: var(--bt-fs-sm);
        font-weight: 600;
        box-shadow: var(--bt-shadow-lg);
        z-index: 50;
        max-width: 90%;
      }
    `,
  ],
})
export class MaterialienPage {
  private readonly auth = inject(AuthService);
  private readonly data = inject(DataService);

  readonly hinweis = signal('');
  readonly suche = signal('');
  readonly kategorie = signal('');
  readonly zuletzt = signal<Material[]>([]);

  /** Für die aktuelle Rolle sichtbare Materialien. */
  private readonly sichtbar = computed(() => {
    const rolle = this.auth.rolle();
    return this.data.materialien().filter((m) => !rolle || m.fuer.includes(rolle));
  });

  readonly kategorien = computed(() => [...new Set(this.sichtbar().map((m) => m.kategorie))]);

  /** Nach Suche + Kategorie gefiltert, gruppiert. */
  readonly gruppen = computed(() => {
    const q = this.suche().trim().toLowerCase();
    const kat = this.kategorie();
    const gefiltert = this.sichtbar().filter((m) => {
      const passtKat = !kat || m.kategorie === kat;
      const passtSuche =
        !q ||
        m.titel.toLowerCase().includes(q) ||
        m.beschreibung.toLowerCase().includes(q);
      return passtKat && passtSuche;
    });
    const kategorien = [...new Set(gefiltert.map((m) => m.kategorie))];
    return kategorien.map((kategorie) => ({
      kategorie,
      eintraege: gefiltert.filter((m) => m.kategorie === kategorie),
    }));
  });

  icon(typ: MaterialTyp): string {
    return TYP_ICON[typ];
  }
  label(typ: MaterialTyp): string {
    return TYP_LABEL[typ];
  }
  oeffnen(m: Material): void {
    this.hinweis.set(m.titel);
    // „zuletzt geöffnet": vorne einfügen, Duplikate entfernen, max. 4.
    this.zuletzt.update((list) => [m, ...list.filter((x) => x.id !== m.id)].slice(0, 4));
  }
}

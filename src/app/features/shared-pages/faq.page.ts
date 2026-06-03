import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/auth/auth.service';
import { DataService } from '../../core/data/data.service';
import { PageHeaderComponent } from '../../shared/ui/page-header';
import { EmptyStateComponent } from '../../shared/ui/empty-state';

@Component({
  selector: 'bt-faq',
  standalone: true,
  imports: [FormsModule, PageHeaderComponent, EmptyStateComponent],
  template: `
    <bt-page-header titel="FAQ" untertitel="Häufige Fragen & schnelle Hilfe" />

    <div class="suchzeile">
      <input type="search" [(ngModel)]="suche" placeholder="🔎 Frage suchen …" />
    </div>

    <div class="chips">
      <button class="chip" [class.an]="kategorie() === ''" (click)="kategorie.set('')">Alle</button>
      @for (k of kategorien(); track k) {
        <button class="chip" [class.an]="kategorie() === k" (click)="kategorie.set(k)">{{ k }}</button>
      }
    </div>

    @if (treffer().length) {
      <div class="liste">
        @for (f of treffer(); track f.id) {
          <div class="item" [class.offen]="offen() === f.id">
            <button class="frage" type="button" (click)="umschalten(f.id)">
              <span>{{ f.frage }}</span>
              <span class="pf">{{ offen() === f.id ? '−' : '+' }}</span>
            </button>
            @if (offen() === f.id) {
              <p class="antwort">{{ f.antwort }}</p>
            }
          </div>
        }
      </div>
    } @else {
      <bt-empty symbol="❓" titel="Keine passende Frage" text="Versuch ein anderes Stichwort." />
    }
  `,
  styles: [
    `
      .suchzeile input { width: 100%; padding: 0.7rem 0.9rem; border: 1.5px solid var(--bt-border);
        border-radius: var(--bt-radius-pill); background: var(--bt-surface); margin-bottom: var(--bt-sp-3); }
      .chips { display: flex; gap: var(--bt-sp-2); overflow-x: auto; padding-bottom: var(--bt-sp-2); margin-bottom: var(--bt-sp-3); }
      .chip { flex-shrink: 0; border: 1.5px solid var(--bt-border); background: var(--bt-surface);
        color: var(--bt-text-muted); border-radius: var(--bt-radius-pill); padding: 0.35rem 0.9rem;
        font-weight: 700; font-size: var(--bt-fs-sm); }
      .chip.an { background: var(--bt-primary); color: #fff; border-color: var(--bt-primary); }
      .liste { display: flex; flex-direction: column; gap: var(--bt-sp-2); }
      .item { background: var(--bt-surface); border: 1px solid var(--bt-border);
        border-radius: var(--bt-radius); box-shadow: var(--bt-shadow-sm); overflow: hidden; }
      .frage { width: 100%; display: flex; align-items: center; justify-content: space-between; gap: var(--bt-sp-2);
        padding: var(--bt-sp-3) var(--bt-sp-4); background: transparent; border: none; text-align: left;
        font-weight: 700; font-size: var(--bt-fs-sm); }
      .pf { font-size: 1.3rem; color: var(--bt-primary); font-weight: 900; flex-shrink: 0; }
      .antwort { margin: 0; padding: 0 var(--bt-sp-4) var(--bt-sp-4); font-size: var(--bt-fs-sm);
        color: var(--bt-text-muted); line-height: 1.6; }
    `,
  ],
})
export class FaqPage {
  private readonly auth = inject(AuthService);
  private readonly data = inject(DataService);

  readonly suche = signal('');
  readonly kategorie = signal('');
  readonly offen = signal<string | null>(null);

  private readonly sichtbar = computed(() => {
    const rolle = this.auth.rolle();
    if (!rolle) return [];
    return this.data.faqs().filter((f) => f.fuer.includes(rolle));
  });

  readonly kategorien = computed(() => [...new Set(this.sichtbar().map((f) => f.kategorie))]);

  readonly treffer = computed(() => {
    const q = this.suche().trim().toLowerCase();
    const kat = this.kategorie();
    return this.sichtbar().filter((f) => {
      const passtKat = !kat || f.kategorie === kat;
      const passtSuche = !q || f.frage.toLowerCase().includes(q) || f.antwort.toLowerCase().includes(q);
      return passtKat && passtSuche;
    });
  });

  umschalten(id: string): void {
    this.offen.update((cur) => (cur === id ? null : id));
  }
}

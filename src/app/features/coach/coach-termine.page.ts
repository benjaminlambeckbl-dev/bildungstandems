import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { DataService } from '../../core/data/data.service';
import { SelectorsService } from '../../core/services/selectors.service';
import { PageHeaderComponent } from '../../shared/ui/page-header';
import { TerminItemComponent } from '../../shared/ui/termin-item';
import { EmptyStateComponent } from '../../shared/ui/empty-state';
import { MonatsKalenderComponent } from '../../shared/ui/monats-kalender';

@Component({
  selector: 'bt-coach-termine',
  standalone: true,
  imports: [RouterLink, PageHeaderComponent, TerminItemComponent, EmptyStateComponent, MonatsKalenderComponent],
  template: `
    <bt-page-header titel="Termine" untertitel="Deine Tandem-Treffen">
      <a aktion routerLink="/coach/termine/neu" class="bt-btn bt-btn--primary">+ Neu</a>
    </bt-page-header>

    <div class="ansicht-tabs">
      <button [class.an]="ansicht() === 'liste'" (click)="ansicht.set('liste')">Liste</button>
      <button [class.an]="ansicht() === 'kalender'" (click)="ansicht.set('kalender')">Kalender</button>
    </div>

    @if (ansicht() === 'kalender') {
      <bt-monats-kalender [termine]="alle()" (oeffnen)="oeffne($event)" />
    } @else {
    <div class="bt-stack">
      @if (kommende().length) {
        <h2 class="bt-section-title">Kommende</h2>
        @for (t of kommende(); track t.id) {
          <bt-termin-item
            [termin]="t"
            [zeigeErinnerung]="true"
            [klickbar]="true"
            (erinnerungUmschalten)="umschalten($event)"
            (oeffnen)="oeffne($event)"
          />
        }
      } @else {
        <bt-empty symbol="📅" titel="Keine kommenden Termine" text="Schlage dein nächstes Treffen vor.">
          <a routerLink="/coach/termine/neu" class="bt-btn bt-btn--primary">Termin vorschlagen</a>
        </bt-empty>
      }

      @if (vergangene().length) {
        <h2 class="bt-section-title">Vergangene</h2>
        @for (t of vergangene(); track t.id) {
          <bt-termin-item [termin]="t" [klickbar]="true" (oeffnen)="oeffne($event)" />
        }
      }
    </div>
    }
  `,
  styles: [
    `
      .ansicht-tabs { display: flex; gap: var(--bt-sp-2); margin-bottom: var(--bt-sp-3); }
      .ansicht-tabs button { flex: 1; border: 1.5px solid var(--bt-border); background: var(--bt-surface);
        color: var(--bt-text-muted); border-radius: var(--bt-radius-pill); padding: 0.45rem; font-weight: 800; }
      .ansicht-tabs button.an { background: var(--bt-primary); color: #fff; border-color: var(--bt-primary); }
    `,
  ],
})
export class CoachTerminePage {
  private readonly data = inject(DataService);
  private readonly sel = inject(SelectorsService);
  private readonly router = inject(Router);

  readonly ansicht = signal<'liste' | 'kalender'>('liste');
  readonly alle = computed(() => this.sel.meineTermine());
  readonly kommende = computed(() => this.sel.kommende(this.sel.meineTermine()));
  readonly vergangene = computed(() => {
    const k = new Set(this.kommende().map((t) => t.id));
    return this.sel.meineTermine().filter((t) => !k.has(t.id)).reverse();
  });

  umschalten(id: string): void {
    this.data.terminErinnerungUmschalten(id);
  }

  oeffne(id: string): void {
    this.router.navigate(['/coach/termine', id]);
  }
}

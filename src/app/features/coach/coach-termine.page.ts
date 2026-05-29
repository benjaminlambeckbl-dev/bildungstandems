import { Component, computed, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { DataService } from '../../core/data/data.service';
import { SelectorsService } from '../../core/services/selectors.service';
import { PageHeaderComponent } from '../../shared/ui/page-header';
import { TerminItemComponent } from '../../shared/ui/termin-item';
import { EmptyStateComponent } from '../../shared/ui/empty-state';

@Component({
  selector: 'bt-coach-termine',
  standalone: true,
  imports: [RouterLink, PageHeaderComponent, TerminItemComponent, EmptyStateComponent],
  template: `
    <bt-page-header titel="Termine" untertitel="Deine Tandem-Treffen">
      <a aktion routerLink="/coach/termine/neu" class="bt-btn bt-btn--primary">+ Neu</a>
    </bt-page-header>

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
  `,
})
export class CoachTerminePage {
  private readonly data = inject(DataService);
  private readonly sel = inject(SelectorsService);
  private readonly router = inject(Router);

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

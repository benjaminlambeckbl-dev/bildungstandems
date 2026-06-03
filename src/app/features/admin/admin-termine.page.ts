import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../../core/data/data.service';
import { SelectorsService } from '../../core/services/selectors.service';
import { PageHeaderComponent } from '../../shared/ui/page-header';
import { TerminItemComponent } from '../../shared/ui/termin-item';
import { MonatsKalenderComponent } from '../../shared/ui/monats-kalender';

@Component({
  selector: 'bt-admin-termine',
  standalone: true,
  imports: [PageHeaderComponent, TerminItemComponent, MonatsKalenderComponent],
  template: `
    <bt-page-header titel="Alle Termine" untertitel="Schulübergreifend" />

    <div class="ansicht-tabs">
      <button [class.an]="ansicht() === 'liste'" (click)="ansicht.set('liste')">Liste</button>
      <button [class.an]="ansicht() === 'kalender'" (click)="ansicht.set('kalender')">Kalender</button>
    </div>

    @if (ansicht() === 'kalender') {
      <bt-monats-kalender [termine]="termine()" (oeffnen)="oeffne($event)" />
    } @else {
      <div class="bt-stack">
        @for (t of termine(); track t.id) {
          <bt-termin-item [termin]="t" [zusatz]="zusatz(t.schuleId, t.tandemId)" [klickbar]="true" (oeffnen)="oeffne($event)" />
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
export class AdminTerminePage {
  private readonly data = inject(DataService);
  private readonly sel = inject(SelectorsService);
  private readonly router = inject(Router);

  readonly ansicht = signal<'liste' | 'kalender'>('liste');

  readonly termine = computed(() =>
    [...this.data.termine()].sort((a, b) => +new Date(a.start) - +new Date(b.start)),
  );

  oeffne(id: string): void {
    this.router.navigate(['/admin/termine', id]);
  }

  zusatz(schuleId: string, tandemId: string): string {
    const schule = this.data.schulen().find((s) => s.id === schuleId)?.name ?? '';
    return `${schule} · ${this.sel.tandemName(tandemId)}`;
  }
}

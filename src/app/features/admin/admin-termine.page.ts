import { Component, computed, inject } from '@angular/core';
import { DataService } from '../../core/data/data.service';
import { SelectorsService } from '../../core/services/selectors.service';
import { PageHeaderComponent } from '../../shared/ui/page-header';
import { TerminItemComponent } from '../../shared/ui/termin-item';

@Component({
  selector: 'bt-admin-termine',
  standalone: true,
  imports: [PageHeaderComponent, TerminItemComponent],
  template: `
    <bt-page-header titel="Alle Termine" untertitel="Schulübergreifend" />

    <div class="bt-stack">
      @for (t of termine(); track t.id) {
        <bt-termin-item [termin]="t" [zusatz]="zusatz(t.schuleId, t.tandemId)" />
      }
    </div>
  `,
})
export class AdminTerminePage {
  private readonly data = inject(DataService);
  private readonly sel = inject(SelectorsService);

  readonly termine = computed(() =>
    [...this.data.termine()].sort((a, b) => +new Date(a.start) - +new Date(b.start)),
  );

  zusatz(schuleId: string, tandemId: string): string {
    const schule = this.data.schulen().find((s) => s.id === schuleId)?.name ?? '';
    return `${schule} · ${this.sel.tandemName(tandemId)}`;
  }
}

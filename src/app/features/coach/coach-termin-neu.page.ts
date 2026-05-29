import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService } from '../../core/data/data.service';
import { SelectorsService } from '../../core/services/selectors.service';
import { PageHeaderComponent } from '../../shared/ui/page-header';

@Component({
  selector: 'bt-coach-termin-neu',
  standalone: true,
  imports: [FormsModule, PageHeaderComponent],
  template: `
    <bt-page-header titel="Termin vorschlagen" [zurueck]="true" />

    @if (!tandem()) {
      <p class="bt-muted">Kein Tandem zugeordnet.</p>
    } @else {
      <form class="bt-stack" (ngSubmit)="speichern()">
        <div class="bt-field">
          <label for="titel">Titel</label>
          <input id="titel" name="titel" [(ngModel)]="titel" required placeholder="z. B. Tandem-Treffen: Spiele" />
        </div>

        <div class="bt-grid-2">
          <div class="bt-field">
            <label for="datum">Datum</label>
            <input id="datum" name="datum" type="date" [(ngModel)]="datum" required />
          </div>
          <div class="bt-field">
            <label for="zeit">Uhrzeit</label>
            <input id="zeit" name="zeit" type="time" [(ngModel)]="zeit" required />
          </div>
        </div>

        <div class="bt-field">
          <label for="ort">Ort</label>
          <input id="ort" name="ort" [(ngModel)]="ort" required placeholder="z. B. Raum 102" />
        </div>

        <div class="bt-field">
          <label for="dauer">Dauer (Minuten)</label>
          <input id="dauer" name="dauer" type="number" min="15" step="15" [(ngModel)]="dauer" />
        </div>

        <div class="bt-field">
          <label for="beschreibung">Beschreibung (optional)</label>
          <textarea id="beschreibung" name="beschreibung" [(ngModel)]="beschreibung"></textarea>
        </div>

        <label class="check">
          <input type="checkbox" name="erinnerung" [(ngModel)]="erinnerung" />
          <span>Mich an diesen Termin erinnern</span>
        </label>

        <button type="submit" class="bt-btn bt-btn--primary bt-btn--block bt-btn--lg" [disabled]="!gueltig()">
          Vorschlagen
        </button>
        <p class="hinweis">Deine Lehrkraft bestätigt den Termin anschließend.</p>
      </form>
    }
  `,
  styles: [
    `
      .check {
        display: flex;
        align-items: center;
        gap: var(--bt-sp-2);
        font-weight: 600;
        font-size: var(--bt-fs-sm);
      }
      .check input {
        width: 20px;
        height: 20px;
      }
      .hinweis {
        text-align: center;
        font-size: var(--bt-fs-xs);
        color: var(--bt-text-soft);
      }
    `,
  ],
})
export class CoachTerminNeuPage {
  private readonly data = inject(DataService);
  private readonly sel = inject(SelectorsService);
  private readonly router = inject(Router);

  readonly tandem = this.sel.meinTandem;

  titel = '';
  datum = '';
  zeit = '14:00';
  ort = '';
  dauer = 60;
  beschreibung = '';
  erinnerung = true;

  gueltig(): boolean {
    return !!(this.titel && this.datum && this.zeit && this.ort);
  }

  speichern(): void {
    const tandem = this.tandem();
    if (!tandem || !this.gueltig()) return;
    const start = new Date(`${this.datum}T${this.zeit}`).toISOString();
    this.data.terminVorschlagen({
      titel: this.titel,
      beschreibung: this.beschreibung || undefined,
      start,
      dauerMin: Number(this.dauer) || 60,
      ort: this.ort,
      tandemId: tandem.id,
      schuleId: tandem.schuleId,
      erinnerung: this.erinnerung,
    });
    this.router.navigate(['/coach/termine']);
  }
}

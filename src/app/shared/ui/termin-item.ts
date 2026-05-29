import { Component, computed, input, output } from '@angular/core';
import { BadgeComponent, BadgeTon } from './badge';
import { DatumPipe } from '../pipes/datum.pipe';
import { Termin, TerminStatus } from '../../core/models/models';

const STATUS_TON: Record<TerminStatus, BadgeTon> = {
  geplant: 'erfolg',
  vorgeschlagen: 'akzent',
  abgesagt: 'gefahr',
  erledigt: 'neutral',
};
const STATUS_LABEL: Record<TerminStatus, string> = {
  geplant: 'Geplant',
  vorgeschlagen: 'Vorgeschlagen',
  abgesagt: 'Abgesagt',
  erledigt: 'Erledigt',
};

/** Karte für einen einzelnen Termin – rollenübergreifend nutzbar. */
@Component({
  selector: 'bt-termin-item',
  standalone: true,
  imports: [BadgeComponent, DatumPipe],
  template: `
    <article
      class="ti"
      [class.ti--abgesagt]="termin().status === 'abgesagt'"
      [class.ti--klick]="klickbar()"
      (click)="klickbar() && oeffnen.emit(termin().id)"
    >
      <div class="head">
        <h3>{{ termin().titel }}</h3>
        <bt-badge [ton]="ton()">{{ label() }}</bt-badge>
      </div>
      <p class="zeit">📅 {{ termin().start | datum: 'tag' }} · {{ termin().start | datum: 'zeit' }}</p>
      <p class="ort">📍 {{ termin().ort }}</p>
      @if (termin().teilnahmeZugesagt) {
        <p class="teilnahme">✓ Du nimmst teil</p>
      }
      @if (zusatz()) {
        <p class="zusatz">{{ zusatz() }}</p>
      }

      @if (zeigeErinnerung()) {
        <button
          class="erinnerung"
          type="button"
          (click)="$event.stopPropagation(); erinnerungUmschalten.emit(termin().id)"
        >
          {{ termin().erinnerung ? '🔔 Erinnerung an' : '🔕 Erinnerung aus' }}
        </button>
      }
    </article>
  `,
  styles: [
    `
      .ti {
        background: var(--bt-surface);
        border: 1px solid var(--bt-border);
        border-left: 4px solid var(--bt-primary);
        border-radius: var(--bt-radius);
        padding: var(--bt-sp-4);
        box-shadow: var(--bt-shadow-sm);
      }
      .ti--abgesagt {
        border-left-color: var(--bt-danger);
        opacity: 0.75;
      }
      .ti--klick {
        cursor: pointer;
      }
      .ti--klick:active {
        transform: scale(0.995);
      }
      .teilnahme {
        margin: 0 0 4px;
        font-size: var(--bt-fs-xs);
        font-weight: 800;
        color: var(--bt-success);
      }
      .head {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: var(--bt-sp-2);
      }
      h3 {
        font-size: var(--bt-fs-md);
        margin: 0 0 var(--bt-sp-2);
      }
      .zeit,
      .ort {
        margin: 0 0 4px;
        font-size: var(--bt-fs-sm);
        color: var(--bt-text-muted);
        font-weight: 600;
      }
      .zusatz {
        margin: var(--bt-sp-2) 0 0;
        font-size: var(--bt-fs-sm);
      }
      .erinnerung {
        margin-top: var(--bt-sp-3);
        border: 1px solid var(--bt-border);
        background: var(--bt-surface-alt);
        border-radius: var(--bt-radius-pill);
        padding: 0.35rem 0.8rem;
        font-size: var(--bt-fs-xs);
        font-weight: 700;
        color: var(--bt-text-muted);
      }
    `,
  ],
})
export class TerminItemComponent {
  termin = input.required<Termin>();
  zeigeErinnerung = input(false);
  klickbar = input(false);
  zusatz = input<string>('');
  erinnerungUmschalten = output<string>();
  oeffnen = output<string>();

  ton = computed(() => STATUS_TON[this.termin().status]);
  label = computed(() => STATUS_LABEL[this.termin().status]);
}

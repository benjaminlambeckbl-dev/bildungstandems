import { Component, computed } from '@angular/core';
import { PageHeaderComponent } from '../../shared/ui/page-header';
import { DatumPipe } from '../../shared/pipes/datum.pipe';
import { PROGRAMM_PHASEN } from '../../core/data/mock-seed';

type PhasenZustand = 'erledigt' | 'aktuell' | 'kommend';

@Component({
  selector: 'bt-programm',
  standalone: true,
  imports: [PageHeaderComponent, DatumPipe],
  template: `
    <bt-page-header titel="Programm-Jahr" untertitel="Von Auftakt bis Abschlussfeier" />

    <ol class="timeline">
      @for (p of phasen(); track p.id) {
        <li class="phase" [attr.data-zustand]="p.zustand">
          <div class="marker">
            <span class="punkt">{{ p.zustand === 'erledigt' ? '✓' : p.symbol }}</span>
          </div>
          <div class="inhalt">
            <div class="kopf">
              <strong>{{ p.titel }}</strong>
              @if (p.zustand === 'aktuell') { <span class="jetzt">Jetzt</span> }
            </div>
            <p class="datum">{{ p.start | datum: 'tag' }}</p>
            <p class="text">{{ p.beschreibung }}</p>
          </div>
        </li>
      }
    </ol>
  `,
  styles: [
    `
      .timeline {
        position: relative;
        margin: 0;
        padding: 0 0 0 8px;
      }
      .phase {
        display: flex;
        gap: var(--bt-sp-3);
        padding-bottom: var(--bt-sp-4);
        position: relative;
      }
      /* Verbindungslinie */
      .phase::before {
        content: '';
        position: absolute;
        left: 19px;
        top: 36px;
        bottom: -4px;
        width: 2px;
        background: var(--bt-border);
      }
      .phase:last-child::before {
        display: none;
      }
      .marker {
        flex-shrink: 0;
        z-index: 1;
      }
      .punkt {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: grid;
        place-items: center;
        font-size: 1.1rem;
        background: var(--bt-surface);
        border: 2px solid var(--bt-border);
      }
      .inhalt {
        flex: 1;
        background: var(--bt-surface);
        border: 1px solid var(--bt-border);
        border-radius: var(--bt-radius);
        padding: var(--bt-sp-3) var(--bt-sp-4);
        box-shadow: var(--bt-shadow-sm);
      }
      .kopf {
        display: flex;
        align-items: center;
        gap: var(--bt-sp-2);
      }
      .kopf strong {
        font-size: var(--bt-fs-md);
      }
      .jetzt {
        background: var(--bt-accent);
        color: #3a2a05;
        font-size: 0.65rem;
        font-weight: 900;
        padding: 1px 8px;
        border-radius: var(--bt-radius-pill);
      }
      .datum {
        margin: 2px 0 var(--bt-sp-2);
        font-size: var(--bt-fs-xs);
        font-weight: 700;
        color: var(--bt-text-soft);
      }
      .text {
        margin: 0;
        font-size: var(--bt-fs-sm);
        color: var(--bt-text-muted);
      }
      /* Zustände */
      .phase[data-zustand='erledigt'] .punkt {
        background: var(--bt-success);
        border-color: var(--bt-success);
        color: #fff;
      }
      .phase[data-zustand='aktuell'] .punkt {
        background: var(--bt-primary);
        border-color: var(--bt-primary);
        color: #fff;
        transform: scale(1.1);
      }
      .phase[data-zustand='aktuell'] .inhalt {
        border-color: var(--bt-primary-400);
        box-shadow: var(--bt-shadow);
      }
      .phase[data-zustand='kommend'] {
        opacity: 0.7;
      }
    `,
  ],
})
export class ProgrammPage {
  readonly phasen = computed(() => {
    const jetzt = Date.now();
    // aktuelle Phase = letzte, die bereits begonnen hat
    let aktuellIndex = -1;
    PROGRAMM_PHASEN.forEach((p, i) => {
      if (+new Date(p.start) <= jetzt) aktuellIndex = i;
    });
    return PROGRAMM_PHASEN.map((p, i) => {
      let zustand: PhasenZustand = 'kommend';
      if (i < aktuellIndex) zustand = 'erledigt';
      else if (i === aktuellIndex) zustand = 'aktuell';
      return { ...p, zustand };
    });
  });
}

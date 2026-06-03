import { Component, computed, input } from '@angular/core';

export interface BalkenDaten {
  label: string;
  wert: number;
  /** optionaler Zusatztext rechts (sonst Wert) */
  anzeige?: string;
  farbe?: string;
}

/** Einfaches horizontales Balkendiagramm (CSS-only, ohne Chart-Lib). */
@Component({
  selector: 'bt-balken-chart',
  standalone: true,
  template: `
    <div class="chart">
      @for (d of daten(); track d.label) {
        <div class="zeile">
          <span class="label" [title]="d.label">{{ d.label }}</span>
          <span class="track">
            <span class="bar" [style.width.%]="breite(d.wert)" [style.background]="d.farbe || 'var(--bt-primary)'"></span>
          </span>
          <span class="wert">{{ d.anzeige ?? d.wert }}</span>
        </div>
      } @empty {
        <p class="leer">Keine Daten im gewählten Zeitraum.</p>
      }
    </div>
  `,
  styles: [
    `
      .chart { display: flex; flex-direction: column; gap: var(--bt-sp-2); }
      .zeile { display: flex; align-items: center; gap: var(--bt-sp-2); }
      .label { width: 33%; font-size: var(--bt-fs-xs); font-weight: 700; color: var(--bt-text-muted);
        white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .track { flex: 1; height: 14px; background: var(--bt-surface-alt);
        border-radius: var(--bt-radius-pill); overflow: hidden; }
      .bar { display: block; height: 100%; border-radius: var(--bt-radius-pill); min-width: 2px;
        transition: width 0.4s ease; }
      .wert { width: 2.5rem; text-align: right; font-size: var(--bt-fs-xs); font-weight: 800; }
      .leer { color: var(--bt-text-soft); font-size: var(--bt-fs-sm); margin: 0; }
    `,
  ],
})
export class BalkenChartComponent {
  daten = input.required<BalkenDaten[]>();
  /** Maximalwert für die Skala; default = größter Wert. */
  max = input<number>(0);

  private readonly maxWert = computed(() => {
    const m = this.max() || Math.max(0, ...this.daten().map((d) => d.wert));
    return m > 0 ? m : 1;
  });

  breite(wert: number): number {
    return Math.round((wert / this.maxWert()) * 100);
  }
}

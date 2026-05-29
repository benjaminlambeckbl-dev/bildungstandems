import { Component, computed, input } from '@angular/core';

export type BadgeTon = 'neutral' | 'info' | 'erfolg' | 'warnung' | 'gefahr' | 'akzent';

/** Status-Pille, z. B. für Terminstatus oder Nachrichtentyp. */
@Component({
  selector: 'bt-badge',
  standalone: true,
  template: `<span class="badge" [style.background]="bg()" [style.color]="fg()"
    ><ng-content
  /></span>`,
  styles: [
    `
      .badge {
        display: inline-flex;
        align-items: center;
        gap: 0.3rem;
        padding: 0.2rem 0.6rem;
        border-radius: var(--bt-radius-pill);
        font-size: var(--bt-fs-xs);
        font-weight: 800;
        white-space: nowrap;
      }
    `,
  ],
})
export class BadgeComponent {
  ton = input<BadgeTon>('neutral');

  private readonly map: Record<BadgeTon, [string, string]> = {
    neutral: ['var(--bt-surface-alt)', 'var(--bt-text-muted)'],
    info: ['var(--bt-primary-100)', 'var(--bt-primary)'],
    erfolg: ['var(--bt-success-100)', 'var(--bt-success)'],
    warnung: ['var(--bt-warning-100)', 'var(--bt-warning)'],
    gefahr: ['var(--bt-danger-100)', 'var(--bt-danger)'],
    akzent: ['var(--bt-accent-100)', 'var(--bt-accent-600)'],
  };

  bg = computed(() => this.map[this.ton()][0]);
  fg = computed(() => this.map[this.ton()][1]);
}

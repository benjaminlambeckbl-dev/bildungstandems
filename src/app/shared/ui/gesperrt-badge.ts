import { Component, computed, input } from '@angular/core';
import { DatumPipe } from '../pipes/datum.pipe';

/** Hinweis-Badge für zeitgesteuert freigeschaltete Inhalte. */
@Component({
  selector: 'bt-gesperrt-badge',
  standalone: true,
  imports: [DatumPipe],
  template: `<span class="lock">🔒 ab {{ freigabeAb() | datum: 'kurz' }} verfügbar</span>`,
  styles: [
    `
      .lock {
        display: inline-flex;
        align-items: center;
        gap: 0.3rem;
        font-size: var(--bt-fs-xs);
        font-weight: 800;
        color: var(--bt-text-soft);
        background: var(--bt-surface-alt);
        border: 1px dashed var(--bt-border);
        padding: 2px 8px;
        border-radius: var(--bt-radius-pill);
      }
    `,
  ],
})
export class GesperrtBadgeComponent {
  freigabeAb = input.required<string>();
}

/** Reine Hilfsfunktion: ist der Inhalt (noch) gesperrt? */
export function istGesperrt(freigabeAb?: string): boolean {
  if (!freigabeAb) return false;
  return +new Date(freigabeAb) > Date.now();
}

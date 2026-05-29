import { Component, computed, input } from '@angular/core';

/** Fortschrittsbalken 0–100 % mit Beschriftung. */
@Component({
  selector: 'bt-progress',
  standalone: true,
  template: `
    <div class="wrap">
      <div class="track"><div class="fill" [style.width.%]="prozent()"></div></div>
      @if (label()) {
        <span class="label">{{ erledigt() }}/{{ gesamt() }}</span>
      }
    </div>
  `,
  styles: [
    `
      .wrap {
        display: flex;
        align-items: center;
        gap: var(--bt-sp-2);
      }
      .track {
        flex: 1;
        height: 8px;
        background: var(--bt-primary-100);
        border-radius: var(--bt-radius-pill);
        overflow: hidden;
      }
      .fill {
        height: 100%;
        background: var(--bt-accent);
        border-radius: var(--bt-radius-pill);
        transition: width 0.3s ease;
      }
      .label {
        font-size: var(--bt-fs-xs);
        font-weight: 800;
        color: var(--bt-text-muted);
        min-width: 2.5rem;
        text-align: right;
      }
    `,
  ],
})
export class ProgressBarComponent {
  erledigt = input(0);
  gesamt = input(1);
  label = input(true);

  prozent = computed(() =>
    this.gesamt() > 0 ? Math.round((this.erledigt() / this.gesamt()) * 100) : 0,
  );
}

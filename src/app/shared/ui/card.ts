import { Component, booleanAttribute, input } from '@angular/core';

/** Schlichte Karte mit optionalem Akzentstreifen links. */
@Component({
  selector: 'bt-card',
  standalone: true,
  template: `<div class="card" [class.card--accent]="accent()" [style.--accent]="accentColor()">
    <ng-content />
  </div>`,
  styles: [
    `
      .card {
        background: var(--bt-surface);
        border-radius: var(--bt-radius);
        box-shadow: var(--bt-shadow-sm);
        border: 1px solid var(--bt-border);
        padding: var(--bt-sp-4);
      }
      .card--accent {
        border-left: 4px solid var(--accent, var(--bt-primary));
      }
    `,
  ],
})
export class CardComponent {
  accent = input(false, { transform: booleanAttribute });
  accentColor = input<string>('var(--bt-primary)');
}

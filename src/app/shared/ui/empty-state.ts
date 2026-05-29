import { Component, input } from '@angular/core';

/** Freundlicher Platzhalter für leere Listen. */
@Component({
  selector: 'bt-empty',
  standalone: true,
  template: `
    <div class="empty">
      <div class="icon">{{ symbol() }}</div>
      <p class="titel">{{ titel() }}</p>
      @if (text()) {
        <p class="text">{{ text() }}</p>
      }
      <ng-content />
    </div>
  `,
  styles: [
    `
      .empty {
        text-align: center;
        padding: var(--bt-sp-6) var(--bt-sp-4);
        color: var(--bt-text-muted);
      }
      .icon {
        font-size: 2.5rem;
        margin-bottom: var(--bt-sp-2);
      }
      .titel {
        font-weight: 800;
        color: var(--bt-text);
        margin: 0 0 var(--bt-sp-1);
      }
      .text {
        margin: 0 0 var(--bt-sp-3);
        font-size: var(--bt-fs-sm);
      }
    `,
  ],
})
export class EmptyStateComponent {
  symbol = input('📭');
  titel = input('Nichts hier');
  text = input('');
}

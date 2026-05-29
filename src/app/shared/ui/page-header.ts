import { Location } from '@angular/common';
import { Component, inject, input } from '@angular/core';

/** Seitenkopf mit Titel, optionalem Untertitel und Zurück-Button. */
@Component({
  selector: 'bt-page-header',
  standalone: true,
  template: `
    <header class="ph">
      @if (zurueck()) {
        <button class="back" type="button" (click)="loc.back()" aria-label="Zurück">←</button>
      }
      <div class="texts">
        <h1>{{ titel() }}</h1>
        @if (untertitel()) {
          <p class="sub">{{ untertitel() }}</p>
        }
      </div>
      <ng-content select="[aktion]" />
    </header>
  `,
  styles: [
    `
      .ph {
        display: flex;
        align-items: center;
        gap: var(--bt-sp-3);
        margin-bottom: var(--bt-sp-4);
      }
      .back {
        border: none;
        background: var(--bt-surface);
        box-shadow: var(--bt-shadow-sm);
        width: 40px;
        height: 40px;
        border-radius: 50%;
        font-size: 1.3rem;
        color: var(--bt-primary);
        flex-shrink: 0;
      }
      .texts {
        flex: 1;
        min-width: 0;
      }
      h1 {
        font-size: var(--bt-fs-2xl);
        margin: 0;
      }
      .sub {
        margin: 2px 0 0;
        color: var(--bt-text-muted);
        font-size: var(--bt-fs-sm);
        font-weight: 600;
      }
    `,
  ],
})
export class PageHeaderComponent {
  protected readonly loc = inject(Location);
  titel = input.required<string>();
  untertitel = input<string>('');
  zurueck = input(false);
}

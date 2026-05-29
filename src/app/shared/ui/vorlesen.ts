import { Component, OnDestroy, input, signal } from '@angular/core';

/**
 * „Vorlesen"-Knopf (Barrierearmut). Liest den übergebenen Text per
 * Web-Speech-API auf Deutsch vor. Tippen stoppt die Wiedergabe wieder.
 */
@Component({
  selector: 'bt-vorlesen',
  standalone: true,
  template: `
    @if (verfuegbar) {
      <button type="button" class="vl" [class.aktiv]="spricht()" (click)="umschalten()">
        {{ spricht() ? '⏸ Stopp' : '🔊 Vorlesen' }}
      </button>
    }
  `,
  styles: [
    `
      .vl {
        display: inline-flex;
        align-items: center;
        gap: 0.3rem;
        border: 1.5px solid var(--bt-border);
        background: var(--bt-surface);
        color: var(--bt-primary);
        border-radius: var(--bt-radius-pill);
        padding: 0.3rem 0.8rem;
        font-size: var(--bt-fs-xs);
        font-weight: 800;
      }
      .vl.aktiv {
        background: var(--bt-primary-100);
        border-color: var(--bt-primary-400);
      }
    `,
  ],
})
export class VorlesenComponent implements OnDestroy {
  text = input<string>('');

  readonly spricht = signal(false);
  readonly verfuegbar =
    typeof window !== 'undefined' && 'speechSynthesis' in window;

  umschalten(): void {
    if (!this.verfuegbar) return;
    if (this.spricht()) {
      window.speechSynthesis.cancel();
      this.spricht.set(false);
      return;
    }
    const aeusserung = new SpeechSynthesisUtterance(this.text());
    aeusserung.lang = 'de-DE';
    aeusserung.rate = 0.95;
    aeusserung.onend = () => this.spricht.set(false);
    aeusserung.onerror = () => this.spricht.set(false);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(aeusserung);
    this.spricht.set(true);
  }

  ngOnDestroy(): void {
    if (this.verfuegbar) window.speechSynthesis.cancel();
  }
}

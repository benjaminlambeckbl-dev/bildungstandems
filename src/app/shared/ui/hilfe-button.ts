import { Component, computed, inject, input, signal } from '@angular/core';
import { AuthService } from '../../core/auth/auth.service';
import { DataService } from '../../core/data/data.service';

/**
 * „Hilfe nötig?"-Knopf für Coaches. Schickt eine Bedarfsmeldung an die
 * Schulkoordination (Lehrkraft der eigenen Schule). Selbstständig nutzbar
 * auf Dashboard und Termin-Detail.
 */
@Component({
  selector: 'bt-hilfe-button',
  standalone: true,
  template: `
    @if (!gesendet()) {
      <button type="button" class="hilfe" (click)="anfordern()">
        🆘 Hilfe nötig?
      </button>
    } @else {
      <p class="ok">✅ Deine Koordination wurde informiert und meldet sich.</p>
    }
  `,
  styles: [
    `
      .hilfe {
        width: 100%;
        min-height: 44px;
        border: 1.5px solid var(--bt-warning);
        background: var(--bt-warning-100);
        color: var(--bt-warning);
        font-weight: 800;
        border-radius: var(--bt-radius);
        padding: 0.7rem 1rem;
      }
      .ok { margin: 0; text-align: center; font-weight: 700; color: var(--bt-success);
        font-size: var(--bt-fs-sm); }
    `,
  ],
})
export class HilfeButtonComponent {
  private readonly auth = inject(AuthService);
  private readonly data = inject(DataService);

  /** optionaler Kontext (z. B. Termin), fließt in den Meldetext ein. */
  kontext = input<string>('');

  readonly gesendet = signal(false);

  private readonly koordination = computed(() => {
    const u = this.auth.currentUser();
    if (!u) return undefined;
    return this.data.nutzer().find((n) => n.rolle === 'lehrer' && n.schuleId === u.schuleId);
  });

  anfordern(): void {
    const u = this.auth.currentUser();
    const koord = this.koordination();
    if (!u || !koord) {
      this.gesendet.set(true); // im Prototyp trotzdem bestätigen
      return;
    }
    const zusatz = this.kontext() ? ` (${this.kontext()})` : '';
    this.data.nachrichtSenden({
      typ: 'bedarf',
      titel: `Hilfe nötig: ${u.vorname} ${u.nachname}`,
      text: `${u.vorname} bittet um Unterstützung${zusatz}.`,
      vonName: `${u.vorname} ${u.nachname}`,
      anNutzerId: koord.id,
    });
    this.gesendet.set(true);
  }
}

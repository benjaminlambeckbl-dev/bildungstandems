import { Component, effect, inject, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/auth/auth.service';
import { DataService } from '../../core/data/data.service';
import { SelectorsService } from '../../core/services/selectors.service';
import { NotificationService } from '../../core/services/notification.service';
import { PageHeaderComponent } from '../../shared/ui/page-header';
import { NachrichtTyp } from '../../core/models/models';

const TYPEN: { wert: NachrichtTyp; label: string; icon: string }[] = [
  { wert: 'info', label: 'Info', icon: 'ℹ️' },
  { wert: 'absage', label: 'Absage', icon: '⚠️' },
  { wert: 'erinnerung', label: 'Erinnerung', icon: '🔔' },
  { wert: 'lob', label: 'Lob', icon: '🌟' },
];

@Component({
  selector: 'bt-teacher-nachricht',
  standalone: true,
  imports: [FormsModule, PageHeaderComponent],
  template: `
    <bt-page-header titel="Info senden" untertitel="Nachricht an einen Coach" [zurueck]="true" />

    <form class="bt-stack" (ngSubmit)="senden()">
      <div class="bt-field">
        <label for="an">An</label>
        <select id="an" name="an" [(ngModel)]="empfaenger" required>
          <option value="" disabled>Coach wählen …</option>
          @for (c of coachs(); track c.id) {
            <option [value]="c.id">{{ c.vorname }} {{ c.nachname }}</option>
          }
        </select>
      </div>

      <div class="bt-field">
        <label>Art der Nachricht</label>
        <div class="typen">
          @for (t of typen; track t.wert) {
            <button
              type="button"
              class="typ"
              [class.aktiv]="typ() === t.wert"
              (click)="typ.set(t.wert)"
            >
              <span>{{ t.icon }}</span>{{ t.label }}
            </button>
          }
        </div>
      </div>

      <div class="bt-field">
        <label for="titel">Betreff</label>
        <input id="titel" name="titel" [(ngModel)]="titel" required placeholder="z. B. Treffen am Freitag fällt aus" />
      </div>

      <div class="bt-field">
        <label for="text">Nachricht</label>
        <textarea id="text" name="text" [(ngModel)]="text" required></textarea>
      </div>

      <button type="submit" class="bt-btn bt-btn--primary bt-btn--block bt-btn--lg" [disabled]="!gueltig()">
        Senden
      </button>
    </form>

    @if (gesendet()) {
      <div class="toast">✅ Nachricht an {{ gesendet() }} gesendet</div>
    }
  `,
  styles: [
    `
      .typen {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: var(--bt-sp-2);
      }
      .typ {
        display: flex;
        align-items: center;
        gap: var(--bt-sp-2);
        padding: 0.6rem 0.8rem;
        border: 2px solid var(--bt-border);
        border-radius: var(--bt-radius-sm);
        background: var(--bt-surface);
        font-weight: 700;
        font-size: var(--bt-fs-sm);
      }
      .typ.aktiv {
        border-color: var(--bt-primary);
        background: var(--bt-primary-100);
        color: var(--bt-primary);
      }
      .toast {
        position: fixed;
        left: 50%;
        bottom: calc(var(--bt-nav-h) + 16px);
        transform: translateX(-50%);
        background: var(--bt-success);
        color: #fff;
        padding: 0.6rem 1.1rem;
        border-radius: var(--bt-radius-pill);
        font-weight: 700;
        box-shadow: var(--bt-shadow-lg);
        z-index: 50;
      }
    `,
  ],
})
export class TeacherNachrichtPage {
  private readonly auth = inject(AuthService);
  private readonly data = inject(DataService);
  private readonly sel = inject(SelectorsService);
  private readonly notify = inject(NotificationService);

  /** Optionaler Query-Parameter „an" (vorausgewählter Coach). */
  an = input<string>('');

  readonly coachs = this.sel.meineCoachs;
  readonly typ = signal<NachrichtTyp>('info');
  readonly gesendet = signal<string | null>(null);
  readonly typen = TYPEN;

  empfaenger = '';
  titel = '';
  text = '';

  constructor() {
    effect(() => {
      const vorauswahl = this.an();
      if (vorauswahl) this.empfaenger = vorauswahl;
    });
  }

  gueltig(): boolean {
    return !!(this.empfaenger && this.titel && this.text);
  }

  senden(): void {
    const lehrer = this.auth.currentUser();
    if (!lehrer || !this.gueltig()) return;
    this.data.nachrichtSenden({
      typ: this.typ(),
      titel: this.titel,
      text: this.text,
      vonName: `${lehrer.vorname} ${lehrer.nachname}`,
      anNutzerId: this.empfaenger,
    });
    // Demo für echtes Push: lokale Browser-Benachrichtigung
    void this.notify.zeigen(this.titel, this.text);

    const coach = this.coachs().find((c) => c.id === this.empfaenger);
    this.gesendet.set(coach ? coach.vorname : 'Coach');
    this.titel = '';
    this.text = '';
    this.empfaenger = '';
  }
}

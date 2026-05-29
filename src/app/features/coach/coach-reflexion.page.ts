import { Component, computed, inject, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/auth/auth.service';
import { DataService } from '../../core/data/data.service';
import { SelectorsService } from '../../core/services/selectors.service';
import { PageHeaderComponent } from '../../shared/ui/page-header';
import { CardComponent } from '../../shared/ui/card';
import { EmptyStateComponent } from '../../shared/ui/empty-state';
import { DatumPipe } from '../../shared/pipes/datum.pipe';

const STIMMUNGEN = ['😟', '🙁', '😐', '🙂', '😄'];

@Component({
  selector: 'bt-coach-reflexion',
  standalone: true,
  imports: [FormsModule, PageHeaderComponent, CardComponent, EmptyStateComponent, DatumPipe],
  template: `
    <bt-page-header titel="Reflexion" untertitel="Wie war dein Treffen?" />

    <div class="bt-stack">
      <bt-card>
        <form class="bt-stack" (ngSubmit)="speichern()">
          <div class="bt-field">
            <label>Wie fühlst du dich nach dem Treffen?</label>
            <div class="smileys">
              @for (s of stimmungen; track $index) {
                <button
                  type="button"
                  class="smiley"
                  [class.aktiv]="stimmung() === $index + 1"
                  (click)="stimmung.set($index + 1)"
                >
                  {{ s }}
                </button>
              }
            </div>
          </div>

          <div class="bt-field">
            <label for="gut">Was lief gut?</label>
            <textarea id="gut" name="gut" [(ngModel)]="gelungen" placeholder="z. B. Alle haben mitgemacht …"></textarea>
          </div>

          <div class="bt-field">
            <label for="hard">Was war herausfordernd?</label>
            <textarea id="hard" name="hard" [(ngModel)]="herausforderung" placeholder="z. B. Es war etwas laut …"></textarea>
          </div>

          <button type="submit" class="bt-btn bt-btn--primary bt-btn--block" [disabled]="!gelungen && !herausforderung">
            Reflexion speichern
          </button>
          @if (gespeichert()) {
            <p class="ok">✅ Danke! Deine Reflexion wurde gespeichert.</p>
          }
        </form>
      </bt-card>

      <h2 class="bt-section-title">Dein Verlauf</h2>
      @if (verlauf().length) {
        @for (r of verlauf(); track r.id) {
          <bt-card>
            <div class="r-kopf">
              <span class="r-smiley">{{ stimmungen[r.stimmung - 1] }}</span>
              <span class="bt-soft">{{ r.datum | datum: 'tag' }}</span>
            </div>
            @if (r.gelungen) { <p><strong>Gut:</strong> {{ r.gelungen }}</p> }
            @if (r.herausforderung) { <p><strong>Schwierig:</strong> {{ r.herausforderung }}</p> }
          </bt-card>
        }
      } @else {
        <bt-empty symbol="📝" titel="Noch keine Reflexion" text="Deine gespeicherten Reflexionen erscheinen hier." />
      }
    </div>
  `,
  styles: [
    `
      .smileys {
        display: flex;
        justify-content: space-between;
        gap: var(--bt-sp-2);
      }
      .smiley {
        flex: 1;
        font-size: 1.7rem;
        padding: 0.5rem 0;
        border: 2px solid var(--bt-border);
        border-radius: var(--bt-radius);
        background: var(--bt-surface);
        filter: grayscale(0.6);
        opacity: 0.7;
      }
      .smiley.aktiv {
        border-color: var(--bt-accent);
        background: var(--bt-accent-100);
        filter: none;
        opacity: 1;
        transform: scale(1.08);
      }
      .ok {
        text-align: center;
        color: var(--bt-success);
        font-weight: 700;
        font-size: var(--bt-fs-sm);
      }
      .r-kopf {
        display: flex;
        align-items: center;
        gap: var(--bt-sp-2);
        margin-bottom: var(--bt-sp-2);
      }
      .r-smiley {
        font-size: 1.5rem;
      }
      p {
        margin: 0 0 var(--bt-sp-2);
        font-size: var(--bt-fs-sm);
      }
    `,
  ],
})
export class CoachReflexionPage {
  private readonly auth = inject(AuthService);
  private readonly data = inject(DataService);
  private readonly sel = inject(SelectorsService);

  /** Optionaler Termin-Bezug via Query-Param ?termin=... */
  termin = input<string>('');

  readonly stimmungen = STIMMUNGEN;
  readonly stimmung = signal(4);
  readonly gespeichert = signal(false);

  gelungen = '';
  herausforderung = '';

  readonly verlauf = computed(() => {
    const user = this.auth.currentUser();
    if (!user) return [];
    return this.data.reflexionen().filter((r) => r.nutzerId === user.id);
  });

  speichern(): void {
    const user = this.auth.currentUser();
    const tandem = this.sel.meinTandem();
    if (!user || !tandem) return;
    if (!this.gelungen && !this.herausforderung) return;

    this.data.reflexionSpeichern({
      nutzerId: user.id,
      tandemId: tandem.id,
      terminId: this.termin() || undefined,
      stimmung: this.stimmung(),
      gelungen: this.gelungen,
      herausforderung: this.herausforderung,
    });
    this.gelungen = '';
    this.herausforderung = '';
    this.stimmung.set(4);
    this.gespeichert.set(true);
  }
}

import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { DataService } from '../../core/data/data.service';
import { PageHeaderComponent } from '../../shared/ui/page-header';
import { ProgressBarComponent } from '../../shared/ui/progress-bar';
import { VorlesenComponent } from '../../shared/ui/vorlesen';
import { istGesperrt } from '../../shared/ui/gesperrt-badge';

@Component({
  selector: 'bt-lernpfad-detail',
  standalone: true,
  imports: [PageHeaderComponent, ProgressBarComponent, VorlesenComponent],
  template: `
    @if (pfad(); as p) {
      <bt-page-header [titel]="p.titel" [zurueck]="true" />

      @if (gesperrt()) {
        <div class="gesperrt-box">
          <span class="lock">🔒</span>
          <h2>Noch nicht verfügbar</h2>
          <p class="bt-muted">Dieser Lernpfad wird erst später im Schuljahr freigeschaltet.</p>
        </div>
      } @else {
      <div class="kopf">
        <span class="symbol">{{ p.symbol }}</span>
        <bt-progress [erledigt]="erledigtAnzahl()" [gesamt]="p.schritte.length" />
      </div>

      @if (!fertig()) {
        @if (schritt(); as s) {
          <div class="stepper">
            <p class="zaehler">Schritt {{ idx() + 1 }} von {{ p.schritte.length }}</p>
            <div class="karte">
              <div class="karte-kopf">
                <h2>{{ s.titel }}</h2>
                <bt-vorlesen [text]="s.titel + '. ' + s.inhalt" />
              </div>
              <p class="inhalt">{{ s.inhalt }}</p>

              @if (s.quiz; as q) {
                <div class="quiz">
                  <p class="frage">❓ {{ q.frage }}</p>
                  @for (opt of q.optionen; track $index) {
                    <button
                      type="button"
                      class="option"
                      [class.gewaehlt]="antwort() === $index"
                      [class.richtig]="antwort() === $index && $index === q.richtigeOption"
                      [class.falsch]="antwort() === $index && $index !== q.richtigeOption"
                      (click)="antwort.set($index)"
                    >
                      {{ opt }}
                    </button>
                  }
                  @if (antwort() !== null && !quizRichtig()) {
                    <p class="quiz-hinweis">Fast! Versuch es nochmal. 🙂</p>
                  }
                  @if (quizRichtig()) {
                    <p class="quiz-ok">✅ Richtig!</p>
                  }
                </div>
              }

              <button
                class="bt-btn bt-btn--primary bt-btn--block bt-btn--lg"
                type="button"
                [disabled]="!quizRichtig()"
                (click)="weiter()"
              >
                {{ letzterSchritt() ? 'Abschließen ✓' : 'Verstanden – weiter' }}
              </button>
            </div>

            @if (idx() > 0) {
              <button class="bt-btn bt-btn--ghost bt-btn--block" type="button" (click)="zurueck()">
                ← vorheriger Schritt
              </button>
            }
          </div>
        }
      } @else {
        <div class="fertig-box">
          <span class="confetti">🎉</span>
          <h2>Geschafft!</h2>
          <p class="bt-muted">Du hast den Lernpfad „{{ p.titel }}" abgeschlossen.</p>
        </div>
      }
      }
    } @else {
      <bt-page-header titel="Lernpfad" [zurueck]="true" />
      <p class="bt-muted">Lernpfad nicht gefunden.</p>
    }
  `,
  styles: [
    `
      .kopf {
        display: flex;
        align-items: center;
        gap: var(--bt-sp-3);
        margin-bottom: var(--bt-sp-4);
      }
      .symbol {
        font-size: 2rem;
      }
      .zaehler {
        font-size: var(--bt-fs-xs);
        font-weight: 800;
        color: var(--bt-text-soft);
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      .karte {
        background: var(--bt-surface);
        border: 1px solid var(--bt-border);
        border-radius: var(--bt-radius);
        box-shadow: var(--bt-shadow);
        padding: var(--bt-sp-5);
        margin-bottom: var(--bt-sp-3);
      }
      .karte-kopf {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: var(--bt-sp-2);
      }
      .karte h2 {
        font-size: var(--bt-fs-xl);
      }
      .inhalt {
        font-size: var(--bt-fs-md);
        line-height: 1.6;
        margin-bottom: var(--bt-sp-4);
      }
      .quiz {
        background: var(--bt-primary-050);
        border-radius: var(--bt-radius);
        padding: var(--bt-sp-4);
        margin-bottom: var(--bt-sp-4);
      }
      .frage {
        font-weight: 800;
        margin-bottom: var(--bt-sp-3);
      }
      .option {
        display: block;
        width: 100%;
        text-align: left;
        padding: 0.75rem 1rem;
        margin-bottom: var(--bt-sp-2);
        border: 2px solid var(--bt-border);
        border-radius: var(--bt-radius-sm);
        background: var(--bt-surface);
        font-weight: 600;
      }
      .option.richtig {
        border-color: var(--bt-success);
        background: var(--bt-success-100);
      }
      .option.falsch {
        border-color: var(--bt-danger);
        background: var(--bt-danger-100);
      }
      .quiz-hinweis {
        color: var(--bt-danger);
        font-weight: 700;
        font-size: var(--bt-fs-sm);
        margin: 0;
      }
      .quiz-ok {
        color: var(--bt-success);
        font-weight: 800;
        font-size: var(--bt-fs-sm);
        margin: 0;
      }
      .fertig-box,
      .gesperrt-box {
        text-align: center;
        padding: var(--bt-sp-6) var(--bt-sp-4);
      }
      .gesperrt-box .lock {
        font-size: 3rem;
      }
      .confetti {
        font-size: 3.5rem;
      }
    `,
  ],
})
export class LernpfadDetailPage {
  private readonly data = inject(DataService);

  /** Route-Parameter via withComponentInputBinding. */
  id = input.required<string>();

  readonly idx = signal(0);
  readonly antwort = signal<number | null>(null);

  readonly pfad = computed(() => this.data.lernpfade().find((lp) => lp.id === this.id()));
  readonly gesperrt = computed(() => istGesperrt(this.pfad()?.freigabeAb));
  readonly schritt = computed(() => this.pfad()?.schritte[this.idx()]);
  readonly letzterSchritt = computed(
    () => !!this.pfad() && this.idx() === this.pfad()!.schritte.length - 1,
  );

  private readonly fortschritt = computed(() =>
    this.data.fortschritte().find((f) => f.pfadId === this.id()),
  );
  readonly erledigtAnzahl = computed(() => this.fortschritt()?.erledigteSchritte.length ?? 0);
  readonly fertig = computed(() => {
    const p = this.pfad();
    return !!p && this.erledigtAnzahl() >= p.schritte.length;
  });

  readonly quizRichtig = computed(() => {
    const s = this.schritt();
    if (!s?.quiz) return true; // ohne Quiz immer "ok"
    return this.antwort() === s.quiz.richtigeOption;
  });

  constructor() {
    // Beim ersten Laden zum ersten offenen Schritt springen.
    let initialisiert = false;
    effect(() => {
      const p = this.pfad();
      if (!p || initialisiert) return;
      const erledigt = this.fortschritt()?.erledigteSchritte ?? [];
      const ersterOffen = p.schritte.findIndex((s) => !erledigt.includes(s.id));
      this.idx.set(ersterOffen === -1 ? 0 : ersterOffen);
      initialisiert = true;
    });
  }

  weiter(): void {
    const p = this.pfad();
    const s = this.schritt();
    if (!p || !s) return;
    this.data.schrittErledigen(p.id, s.id);
    this.antwort.set(null);
    if (this.idx() < p.schritte.length - 1) {
      this.idx.update((i) => i + 1);
    }
  }

  zurueck(): void {
    this.antwort.set(null);
    this.idx.update((i) => Math.max(0, i - 1));
  }
}

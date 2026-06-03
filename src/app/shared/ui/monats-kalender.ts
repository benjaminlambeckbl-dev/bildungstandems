import { Component, computed, input, output, signal } from '@angular/core';
import { TerminItemComponent } from './termin-item';
import { Termin } from '../../core/models/models';

const MONATE = [
  'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
  'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember',
];
const WOCHENTAGE = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];

interface Zelle {
  tag: number;
  datum: Date;
  imMonat: boolean;
  heute: boolean;
  anzahl: number;
  abgesagt: boolean;
}

/** Monatskalender mit Tagesauswahl; zeigt Termine des gewählten Tages darunter. */
@Component({
  selector: 'bt-monats-kalender',
  standalone: true,
  imports: [TerminItemComponent],
  template: `
    <div class="kal">
      <div class="kopf">
        <button type="button" class="nav" (click)="blaettern(-1)" aria-label="Vorheriger Monat">‹</button>
        <strong>{{ monatLabel() }}</strong>
        <button type="button" class="nav" (click)="blaettern(1)" aria-label="Nächster Monat">›</button>
      </div>

      <div class="grid wochentage">
        @for (w of wochentage; track w) { <span class="wt">{{ w }}</span> }
      </div>

      <div class="grid tage">
        @for (z of zellen(); track z.datum.getTime()) {
          <button
            type="button"
            class="zelle"
            [class.fremd]="!z.imMonat"
            [class.heute]="z.heute"
            [class.gewaehlt]="istGewaehlt(z.datum)"
            [class.hat]="z.anzahl > 0"
            (click)="waehlen(z.datum)"
          >
            <span class="num">{{ z.tag }}</span>
            @if (z.anzahl > 0) {
              <span class="punkt" [class.ab]="z.abgesagt"></span>
            }
          </button>
        }
      </div>
    </div>

    <div class="auswahl">
      <h3>{{ gewaehltLabel() }}</h3>
      @if (termineGewaehlt().length) {
        <div class="liste">
          @for (t of termineGewaehlt(); track t.id) {
            <bt-termin-item [termin]="t" [klickbar]="true" (oeffnen)="oeffnen.emit($event)" />
          }
        </div>
      } @else {
        <p class="leer">Keine Termine an diesem Tag.</p>
      }
    </div>
  `,
  styles: [
    `
      .kal { background: var(--bt-surface); border: 1px solid var(--bt-border);
        border-radius: var(--bt-radius); box-shadow: var(--bt-shadow-sm); padding: var(--bt-sp-3); }
      .kopf { display: flex; align-items: center; justify-content: space-between; margin-bottom: var(--bt-sp-2); }
      .kopf strong { font-size: var(--bt-fs-md); }
      .nav { width: 36px; height: 36px; border: none; border-radius: 50%;
        background: var(--bt-surface-alt); font-size: 1.2rem; color: var(--bt-primary); font-weight: 900; }
      .grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 2px; }
      .wt { text-align: center; font-size: 0.65rem; font-weight: 800; color: var(--bt-text-soft); padding: 4px 0; }
      .zelle { position: relative; aspect-ratio: 1; border: none; background: transparent;
        border-radius: var(--bt-radius-sm); display: flex; align-items: center; justify-content: center;
        font-size: var(--bt-fs-sm); font-weight: 700; color: var(--bt-text); }
      .zelle.fremd { color: var(--bt-text-soft); opacity: 0.45; }
      .zelle.hat { background: var(--bt-primary-050); }
      .zelle.heute { outline: 2px solid var(--bt-primary-400); }
      .zelle.gewaehlt { background: var(--bt-primary); color: #fff; }
      .punkt { position: absolute; bottom: 5px; width: 5px; height: 5px; border-radius: 50%;
        background: var(--bt-accent); }
      .punkt.ab { background: var(--bt-danger); }
      .zelle.gewaehlt .punkt { background: #fff; }
      .auswahl { margin-top: var(--bt-sp-4); }
      .auswahl h3 { font-size: var(--bt-fs-md); margin: 0 0 var(--bt-sp-2); }
      .liste { display: flex; flex-direction: column; gap: var(--bt-sp-2); }
      .leer { color: var(--bt-text-soft); font-size: var(--bt-fs-sm); }
    `,
  ],
})
export class MonatsKalenderComponent {
  termine = input.required<Termin[]>();
  oeffnen = output<string>();

  readonly wochentage = WOCHENTAGE;

  private readonly heute = new Date();
  private readonly anker = signal(new Date(this.heute.getFullYear(), this.heute.getMonth(), 1));
  private readonly gewaehlt = signal(new Date(this.heute.getFullYear(), this.heute.getMonth(), this.heute.getDate()));

  readonly monatLabel = computed(() => `${MONATE[this.anker().getMonth()]} ${this.anker().getFullYear()}`);

  readonly zellen = computed<Zelle[]>(() => {
    const a = this.anker();
    const jahr = a.getFullYear();
    const monat = a.getMonth();
    const ersterWochentag = (new Date(jahr, monat, 1).getDay() + 6) % 7; // Mo=0
    const tageImMonat = new Date(jahr, monat + 1, 0).getDate();
    const gesamt = Math.ceil((ersterWochentag + tageImMonat) / 7) * 7;
    const heuteStr = this.heute.toDateString();
    const zellen: Zelle[] = [];
    for (let i = 0; i < gesamt; i++) {
      const tagNr = i - ersterWochentag + 1;
      const datum = new Date(jahr, monat, tagNr);
      const tagestermine = this.termineAm(datum);
      zellen.push({
        tag: datum.getDate(),
        datum,
        imMonat: tagNr >= 1 && tagNr <= tageImMonat,
        heute: datum.toDateString() === heuteStr,
        anzahl: tagestermine.length,
        abgesagt: tagestermine.some((t) => t.status === 'abgesagt'),
      });
    }
    return zellen;
  });

  readonly termineGewaehlt = computed(() => this.termineAm(this.gewaehlt()));

  readonly gewaehltLabel = computed(() => {
    const d = this.gewaehlt();
    return `${WOCHENTAGE[(d.getDay() + 6) % 7]}, ${d.getDate()}. ${MONATE[d.getMonth()]}`;
  });

  private termineAm(datum: Date): Termin[] {
    const s = datum.toDateString();
    return this.termine()
      .filter((t) => new Date(t.start).toDateString() === s)
      .sort((a, b) => +new Date(a.start) - +new Date(b.start));
  }

  istGewaehlt(d: Date): boolean {
    return d.toDateString() === this.gewaehlt().toDateString();
  }

  waehlen(d: Date): void {
    this.gewaehlt.set(d);
    if (d.getMonth() !== this.anker().getMonth()) {
      this.anker.set(new Date(d.getFullYear(), d.getMonth(), 1));
    }
  }

  blaettern(richtung: number): void {
    const a = this.anker();
    this.anker.set(new Date(a.getFullYear(), a.getMonth() + richtung, 1));
  }
}

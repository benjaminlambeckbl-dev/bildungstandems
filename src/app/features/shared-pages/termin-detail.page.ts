import { Component, computed, inject, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { DataService } from '../../core/data/data.service';
import { SelectorsService } from '../../core/services/selectors.service';
import { ReminderService } from '../../core/services/reminder.service';
import { PageHeaderComponent } from '../../shared/ui/page-header';
import { CardComponent } from '../../shared/ui/card';
import { BadgeComponent, BadgeTon } from '../../shared/ui/badge';
import { VorlesenComponent } from '../../shared/ui/vorlesen';
import { DatumPipe } from '../../shared/pipes/datum.pipe';
import { Termin, TerminStatus } from '../../core/models/models';

const STATUS_TON: Record<TerminStatus, BadgeTon> = {
  geplant: 'erfolg', vorgeschlagen: 'akzent', abgesagt: 'gefahr', erledigt: 'neutral',
};
const STATUS_LABEL: Record<TerminStatus, string> = {
  geplant: 'Geplant', vorgeschlagen: 'Vorgeschlagen', abgesagt: 'Abgesagt', erledigt: 'Erledigt',
};

@Component({
  selector: 'bt-termin-detail',
  standalone: true,
  imports: [
    FormsModule, RouterLink, PageHeaderComponent, CardComponent,
    BadgeComponent, VorlesenComponent, DatumPipe,
  ],
  template: `
    @if (termin(); as t) {
      <bt-page-header titel="Termin" [zurueck]="true" />

      <div class="bt-stack">
        <bt-card [accent]="true" [accentColor]="t.status === 'abgesagt' ? 'var(--bt-danger)' : 'var(--bt-primary)'">
          <div class="kopf">
            <h2>{{ t.titel }}</h2>
            <bt-badge [ton]="ton(t.status)">{{ label(t.status) }}</bt-badge>
          </div>
          <p class="zeile">📅 {{ t.start | datum: 'tag' }} · {{ t.start | datum: 'zeit' }}</p>
          <p class="zeile">📍 {{ t.ort }}</p>
          <p class="zeile">🤝 {{ tandemName(t.tandemId) }}</p>
          @if (t.beschreibung) {
            <div class="beschreibung">
              <p>{{ t.beschreibung }}</p>
              <bt-vorlesen [text]="t.titel + '. ' + t.beschreibung" />
            </div>
          }
        </bt-card>

        <!-- ============ Coach-Aktionen ============ -->
        @if (istCoach()) {
          @if (t.status === 'geplant' || t.status === 'vorgeschlagen') {
            <bt-card>
              <div class="row">
                <span><strong>Nimmst du teil?</strong></span>
                <div class="seg">
                  <button [class.an]="t.teilnahmeZugesagt === true" (click)="teilnahme(t.id, true)">✓ Ja</button>
                  <button [class.an]="t.teilnahmeZugesagt === false" (click)="teilnahme(t.id, false)">Nein</button>
                </div>
              </div>
              <hr class="bt-divider" />
              <div class="row">
                <span><strong>Erinnerung</strong></span>
                <button class="bt-btn bt-btn--ghost" (click)="erinnerungToggle(t.id)">
                  {{ t.erinnerung ? '🔔 An' : '🔕 Aus' }}
                </button>
              </div>
              <button class="bt-btn bt-btn--ghost bt-btn--block" (click)="erinnerungTesten(t)">
                Erinnerung jetzt testen
              </button>
            </bt-card>
          }

          <!-- Checkliste -->
          @if (t.checkliste?.length) {
            <bt-card>
              <h3 class="abschnitt">📋 Vorbereitung ({{ erledigtePunkte(t) }}/{{ t.checkliste!.length }})</h3>
              @for (p of t.checkliste!; track p.id) {
                <label class="check">
                  <input type="checkbox" [checked]="p.erledigt" (change)="punktUmschalten(t.id, p.id)" />
                  <span [class.durch]="p.erledigt">{{ p.text }}</span>
                </label>
              }
            </bt-card>
          }

          <!-- Treffen dokumentieren / Protokoll -->
          @if (t.protokoll) {
            <bt-card accent accentColor="var(--bt-success)">
              <h3 class="abschnitt">✅ Treffen dokumentiert</h3>
              <p class="zeile">{{ t.protokoll.durchgefuehrt ? 'Durchgeführt' : 'Nicht durchgeführt' }} ·
                {{ t.protokoll.anwesendeKinder }} Kinder dabei</p>
              @if (t.protokoll.notiz) { <p class="zeile">„{{ t.protokoll.notiz }}"</p> }
              <a class="bt-btn bt-btn--primary bt-btn--block" routerLink="/coach/reflexion" [queryParams]="{ termin: t.id }">
                📝 Reflexion schreiben
              </a>
            </bt-card>
          } @else if (t.status !== 'abgesagt') {
            <bt-card>
              <h3 class="abschnitt">Treffen dokumentieren</h3>
              <label class="check">
                <input type="checkbox" [(ngModel)]="durchgefuehrt" />
                <span>Treffen hat stattgefunden</span>
              </label>
              <div class="bt-field">
                <label for="kinder">Wie viele Kinder waren da?</label>
                <input id="kinder" type="number" min="0" [(ngModel)]="anwesendeKinder" />
              </div>
              <div class="bt-field">
                <label for="notiz">Kurze Notiz (optional)</label>
                <textarea id="notiz" [(ngModel)]="notiz"></textarea>
              </div>
              <button class="bt-btn bt-btn--primary bt-btn--block" (click)="dokumentieren(t.id)">
                Speichern
              </button>
            </bt-card>
          }
        }

        <!-- ============ Lehrer-Aktionen ============ -->
        @if (istLehrer()) {
          @if (t.status === 'vorgeschlagen') {
            <bt-card accent accentColor="var(--bt-accent)">
              <h3 class="abschnitt">Vom Coach vorgeschlagen</h3>
              <div class="aktionen">
                <button class="bt-btn bt-btn--primary" (click)="bestaetigen(t.id)">✓ Bestätigen</button>
                <button class="bt-btn bt-btn--ghost" (click)="absagen(t)">Absagen</button>
              </div>
            </bt-card>
          } @else if (t.status === 'geplant') {
            <bt-card>
              <button class="bt-btn bt-btn--danger bt-btn--block" (click)="absagen(t)">Treffen absagen</button>
              <p class="hinweis">Der Coach wird automatisch informiert.</p>
            </bt-card>
          }
          @if (t.protokoll) {
            <bt-card accent accentColor="var(--bt-success)">
              <h3 class="abschnitt">✅ Dokumentation des Coachs</h3>
              <p class="zeile">{{ t.protokoll.anwesendeKinder }} Kinder anwesend</p>
              @if (t.protokoll.notiz) { <p class="zeile">„{{ t.protokoll.notiz }}"</p> }
            </bt-card>
          }
        }

        @if (gespeichert()) {
          <p class="ok">✅ Gespeichert.</p>
        }
      </div>
    } @else {
      <bt-page-header titel="Termin" [zurueck]="true" />
      <p class="bt-muted">Termin nicht gefunden.</p>
    }
  `,
  styles: [
    `
      .kopf { display: flex; justify-content: space-between; align-items: flex-start; gap: var(--bt-sp-2); }
      .kopf h2 { font-size: var(--bt-fs-xl); margin: 0; }
      .zeile { margin: 0 0 6px; font-size: var(--bt-fs-sm); color: var(--bt-text-muted); font-weight: 600; }
      .beschreibung { margin-top: var(--bt-sp-3); }
      .beschreibung p { font-size: var(--bt-fs-md); color: var(--bt-text); }
      .row { display: flex; align-items: center; justify-content: space-between; gap: var(--bt-sp-2); }
      .abschnitt { font-size: var(--bt-fs-md); margin: 0 0 var(--bt-sp-3); }
      .seg { display: inline-flex; border: 1.5px solid var(--bt-border); border-radius: var(--bt-radius-pill); overflow: hidden; }
      .seg button { border: none; background: var(--bt-surface); padding: 0.4rem 0.9rem; font-weight: 700; color: var(--bt-text-muted); }
      .seg button.an { background: var(--bt-primary); color: #fff; }
      .check { display: flex; align-items: center; gap: var(--bt-sp-2); padding: 0.4rem 0; font-weight: 600; }
      .check input { width: 20px; height: 20px; }
      .check .durch { text-decoration: line-through; color: var(--bt-text-soft); }
      .aktionen { display: flex; gap: var(--bt-sp-2); }
      .aktionen .bt-btn { flex: 1; }
      .hinweis { text-align: center; font-size: var(--bt-fs-xs); color: var(--bt-text-soft); margin: var(--bt-sp-2) 0 0; }
      .ok { text-align: center; color: var(--bt-success); font-weight: 700; }
    `,
  ],
})
export class TerminDetailPage {
  private readonly auth = inject(AuthService);
  private readonly data = inject(DataService);
  private readonly sel = inject(SelectorsService);
  private readonly reminder = inject(ReminderService);

  id = input.required<string>();

  readonly termin = computed(() => this.data.termine().find((t) => t.id === this.id()));
  readonly istCoach = computed(() => this.auth.rolle() === 'coach');
  readonly istLehrer = computed(() => this.auth.rolle() === 'lehrer');
  readonly gespeichert = signal(false);

  durchgefuehrt = true;
  anwesendeKinder = 0;
  notiz = '';

  ton(s: TerminStatus): BadgeTon { return STATUS_TON[s]; }
  label(s: TerminStatus): string { return STATUS_LABEL[s]; }
  tandemName(id: string): string { return this.sel.tandemName(id); }
  erledigtePunkte(t: Termin): number {
    return t.checkliste?.filter((p) => p.erledigt).length ?? 0;
  }

  teilnahme(id: string, zusage: boolean): void { this.data.terminTeilnahmeSetzen(id, zusage); }
  erinnerungToggle(id: string): void { this.data.terminErinnerungUmschalten(id); }
  erinnerungTesten(t: Termin): void { this.reminder.jetztErinnern(t); }
  punktUmschalten(terminId: string, punktId: string): void {
    this.data.checklistePunktUmschalten(terminId, punktId);
  }

  dokumentieren(terminId: string): void {
    this.data.treffenDokumentieren(terminId, {
      durchgefuehrt: this.durchgefuehrt,
      anwesendeKinder: Number(this.anwesendeKinder) || 0,
      notiz: this.notiz || undefined,
    });
    this.gespeichert.set(true);
  }

  bestaetigen(id: string): void { this.data.terminStatusSetzen(id, 'geplant'); }

  absagen(t: Termin): void {
    this.data.terminStatusSetzen(t.id, 'abgesagt');
    const tandem = this.data.tandems().find((x) => x.id === t.tandemId);
    const lehrer = this.auth.currentUser();
    if (tandem && lehrer) {
      this.data.nachrichtSenden({
        typ: 'absage',
        titel: `Treffen abgesagt: ${t.titel}`,
        text: `Das Treffen „${t.titel}" muss leider entfallen. Wir finden einen Ersatztermin.`,
        vonName: `${lehrer.vorname} ${lehrer.nachname}`,
        anNutzerId: tandem.coachId,
        terminId: t.id,
      });
    }
    this.gespeichert.set(true);
  }
}

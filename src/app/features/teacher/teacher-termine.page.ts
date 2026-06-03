import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { DataService } from '../../core/data/data.service';
import { SelectorsService } from '../../core/services/selectors.service';
import { PageHeaderComponent } from '../../shared/ui/page-header';
import { TerminItemComponent } from '../../shared/ui/termin-item';
import { EmptyStateComponent } from '../../shared/ui/empty-state';
import { MonatsKalenderComponent } from '../../shared/ui/monats-kalender';
import { Termin } from '../../core/models/models';

@Component({
  selector: 'bt-teacher-termine',
  standalone: true,
  imports: [PageHeaderComponent, TerminItemComponent, EmptyStateComponent, MonatsKalenderComponent],
  template: `
    <bt-page-header titel="Termine" untertitel="Alle Treffen deiner Tandems" />

    <div class="ansicht-tabs">
      <button [class.an]="ansicht() === 'liste'" (click)="ansicht.set('liste')">Liste</button>
      <button [class.an]="ansicht() === 'kalender'" (click)="ansicht.set('kalender')">Kalender</button>
    </div>

    @if (ansicht() === 'kalender') {
      <bt-monats-kalender [termine]="termine()" (oeffnen)="oeffne($event)" />
    } @else if (termine().length) {
      <div class="bt-stack">
        @for (t of termine(); track t.id) {
          <div>
            <bt-termin-item [termin]="t" [zusatz]="tandemName(t.tandemId)" [klickbar]="true" (oeffnen)="oeffne($event)" />
            @if (t.status === 'vorgeschlagen') {
              <div class="aktionen">
                <button class="bt-btn bt-btn--primary" (click)="bestaetigen(t.id)">✓ Bestätigen</button>
                <button class="bt-btn bt-btn--ghost" (click)="absagen(t)">Absagen</button>
              </div>
            } @else if (t.status === 'geplant') {
              <div class="aktionen">
                <button class="bt-btn bt-btn--danger" (click)="absagen(t)">Treffen absagen</button>
              </div>
            }
          </div>
        }
      </div>
    } @else {
      <bt-empty symbol="📅" titel="Keine Termine" />
    }
  `,
  styles: [
    `
      .ansicht-tabs { display: flex; gap: var(--bt-sp-2); margin-bottom: var(--bt-sp-3); }
      .ansicht-tabs button { flex: 1; border: 1.5px solid var(--bt-border); background: var(--bt-surface);
        color: var(--bt-text-muted); border-radius: var(--bt-radius-pill); padding: 0.45rem; font-weight: 800; }
      .ansicht-tabs button.an { background: var(--bt-primary); color: #fff; border-color: var(--bt-primary); }
      .aktionen {
        display: flex;
        gap: var(--bt-sp-2);
        margin-top: var(--bt-sp-2);
      }
      .aktionen .bt-btn {
        flex: 1;
        font-size: var(--bt-fs-sm);
      }
    `,
  ],
})
export class TeacherTerminePage {
  private readonly auth = inject(AuthService);
  private readonly data = inject(DataService);
  private readonly sel = inject(SelectorsService);
  private readonly router = inject(Router);

  readonly ansicht = signal<'liste' | 'kalender'>('liste');
  readonly termine = this.sel.termineMeinerSchule;

  oeffne(id: string): void {
    this.router.navigate(['/lehrer/termine', id]);
  }

  tandemName(id: string): string {
    return this.sel.tandemName(id);
  }

  bestaetigen(id: string): void {
    this.data.terminStatusSetzen(id, 'geplant');
  }

  /** Absagen + den betroffenen Coach automatisch informieren. */
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
  }
}

import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { DataService } from '../../core/data/data.service';
import { PageHeaderComponent } from '../../shared/ui/page-header';
import { CardComponent } from '../../shared/ui/card';

@Component({
  selector: 'bt-teacher-schueler-neu',
  standalone: true,
  imports: [FormsModule, PageHeaderComponent, CardComponent],
  template: `
    <bt-page-header titel="Zugang gewähren" [zurueck]="true" />

    @if (!code()) {
      <form class="bt-stack" (ngSubmit)="anlegen()">
        <p class="bt-muted">
          Lege eine neue Coach-Schüler:in an. Sie erhält einen Einladungscode für die App.
        </p>

        <div class="bt-grid-2">
          <div class="bt-field">
            <label for="vn">Vorname</label>
            <input id="vn" name="vn" [(ngModel)]="vorname" required />
          </div>
          <div class="bt-field">
            <label for="nn">Nachname</label>
            <input id="nn" name="nn" [(ngModel)]="nachname" required />
          </div>
        </div>

        <div class="bt-field">
          <label for="tn">Name des Tandems</label>
          <input id="tn" name="tn" [(ngModel)]="tandemName" required placeholder="z. B. Tandem Regenbogen" />
        </div>

        <div class="bt-field">
          <label for="gs">Partner-Grundschule</label>
          <input id="gs" name="gs" [(ngModel)]="partnerGrundschule" required placeholder="z. B. Grundschule Am Park" />
        </div>

        <button type="submit" class="bt-btn bt-btn--primary bt-btn--block bt-btn--lg" [disabled]="!gueltig()">
          Zugang erstellen
        </button>
        <p class="hinweis">
          🔒 Im echten Betrieb erfolgt die Einladung DSGVO-konform per sicherem Link an die Schule.
        </p>
      </form>
    } @else {
      <bt-card accent accentColor="var(--bt-success)">
        <div class="erfolg">
          <span class="haken">✅</span>
          <h2>Zugang erstellt!</h2>
          <p class="bt-muted">{{ vorname }} {{ nachname }} kann sich jetzt mit diesem Code anmelden:</p>
          <div class="code">{{ code() }}</div>
          <button class="bt-btn bt-btn--primary bt-btn--block" (click)="fertig()">Fertig</button>
        </div>
      </bt-card>
    }
  `,
  styles: [
    `
      .hinweis {
        text-align: center;
        font-size: var(--bt-fs-xs);
        color: var(--bt-text-soft);
      }
      .erfolg {
        text-align: center;
      }
      .haken {
        font-size: 2.5rem;
      }
      .code {
        font-family: monospace;
        font-size: var(--bt-fs-xl);
        font-weight: 800;
        letter-spacing: 1px;
        background: var(--bt-surface-alt);
        border: 2px dashed var(--bt-border);
        border-radius: var(--bt-radius);
        padding: var(--bt-sp-4);
        margin: var(--bt-sp-3) 0;
        color: var(--bt-primary);
      }
    `,
  ],
})
export class TeacherSchuelerNeuPage {
  private readonly auth = inject(AuthService);
  private readonly data = inject(DataService);
  private readonly router = inject(Router);

  vorname = '';
  nachname = '';
  tandemName = '';
  partnerGrundschule = '';

  readonly code = signal<string | null>(null);

  gueltig(): boolean {
    return !!(this.vorname && this.nachname && this.tandemName && this.partnerGrundschule);
  }

  anlegen(): void {
    const user = this.auth.currentUser();
    if (!user || !this.gueltig()) return;
    const ergebnis = this.data.coachEinladen({
      vorname: this.vorname,
      nachname: this.nachname,
      schuleId: user.schuleId,
      tandemName: this.tandemName,
      partnerGrundschule: this.partnerGrundschule,
    });
    this.code.set(ergebnis.code);
  }

  fertig(): void {
    this.router.navigate(['/lehrer/schueler']);
  }
}

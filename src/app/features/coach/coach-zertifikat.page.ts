import { Component, computed, inject } from '@angular/core';
import { AuthService } from '../../core/auth/auth.service';
import { DataService } from '../../core/data/data.service';
import { SelectorsService } from '../../core/services/selectors.service';
import { PageHeaderComponent } from '../../shared/ui/page-header';
import { CardComponent } from '../../shared/ui/card';

@Component({
  selector: 'bt-coach-zertifikat',
  standalone: true,
  imports: [PageHeaderComponent, CardComponent],
  template: `
    <bt-page-header titel="Mein Zertifikat" untertitel="Für dein Engagement als Coach" [zurueck]="true" />

    <div class="bt-stack">
      <!-- Voraussetzungen -->
      <bt-card>
        <h3 class="abschnitt">Dein Fortschritt</h3>
        <div class="vorauss">
          <span class="haken" [class.ok]="lernpfadeOk()">{{ lernpfadeOk() ? '✓' : '○' }}</span>
          <span>Lernpfade abgeschlossen ({{ lernpfadeErledigt() }}/{{ lernpfadeGesamt() }})</span>
        </div>
        <div class="vorauss">
          <span class="haken" [class.ok]="treffenOk()">{{ treffenOk() ? '✓' : '○' }}</span>
          <span>Treffen dokumentiert ({{ treffenDok() }})</span>
        </div>
        <p class="status">
          @if (verfuegbar()) {
            🎉 Glückwunsch! Dein Zertifikat ist freigeschaltet.
          } @else {
            Noch ein bisschen – dann ist dein Zertifikat bereit. (Vorschau unten ist schon möglich.)
          }
        </p>
      </bt-card>

      <!-- Vorschau -->
      <div class="zertifikat">
        <div class="z-rand">
          <p class="z-klein">URKUNDE · BildungsTandems</p>
          <h2 class="z-titel">Coach-Zertifikat</h2>
          <p class="z-text">Dieses Zertifikat würdigt</p>
          <p class="z-name">{{ name() }}</p>
          <p class="z-text">
            für das engagierte Begleiten des Tandems
            <strong>„{{ tandemName() }}"</strong>
            an der {{ schule() }} im Programm BildungsTandems.
          </p>
          <p class="z-werte">Verantwortung · Solidarität · Respekt</p>
          <div class="z-fuss">
            <span>{{ heute() }}</span>
            <span>Zukunftsstiftung Bildung</span>
          </div>
        </div>
      </div>

      <button class="bt-btn bt-btn--primary bt-btn--block bt-btn--lg" (click)="drucken()">
        🖨️ Als PDF speichern / drucken
      </button>
    </div>
  `,
  styles: [
    `
      .abschnitt { font-size: var(--bt-fs-md); margin: 0 0 var(--bt-sp-3); }
      .vorauss {
        display: flex;
        align-items: center;
        gap: var(--bt-sp-2);
        font-size: var(--bt-fs-sm);
        font-weight: 600;
        margin-bottom: var(--bt-sp-2);
      }
      .haken {
        width: 26px; height: 26px; flex-shrink: 0;
        border-radius: 50%;
        display: grid; place-items: center;
        background: var(--bt-surface-alt);
        color: var(--bt-text-soft);
        font-weight: 900;
      }
      .haken.ok { background: var(--bt-success); color: #fff; }
      .status { margin: var(--bt-sp-3) 0 0; font-size: var(--bt-fs-sm); font-weight: 700; }

      .zertifikat {
        background: linear-gradient(135deg, #fffdf7, #f4f7fb);
        border-radius: var(--bt-radius);
        padding: var(--bt-sp-3);
        box-shadow: var(--bt-shadow);
      }
      .z-rand {
        border: 3px double var(--bt-primary);
        border-radius: var(--bt-radius-sm);
        padding: var(--bt-sp-5) var(--bt-sp-4);
        text-align: center;
      }
      .z-klein {
        letter-spacing: 2px;
        font-size: var(--bt-fs-xs);
        font-weight: 800;
        color: var(--bt-primary);
        margin: 0;
      }
      .z-titel {
        font-size: var(--bt-fs-2xl);
        margin: var(--bt-sp-2) 0;
        color: var(--bt-primary);
      }
      .z-text { margin: var(--bt-sp-2) 0; font-size: var(--bt-fs-sm); color: var(--bt-text); }
      .z-name {
        font-size: var(--bt-fs-xl);
        font-weight: 900;
        margin: var(--bt-sp-2) 0;
      }
      .z-werte {
        margin: var(--bt-sp-4) 0 var(--bt-sp-3);
        font-weight: 700;
        color: var(--bt-accent-600);
      }
      .z-fuss {
        display: flex;
        justify-content: space-between;
        font-size: var(--bt-fs-xs);
        color: var(--bt-text-muted);
        border-top: 1px solid var(--bt-border);
        padding-top: var(--bt-sp-2);
        margin-top: var(--bt-sp-3);
      }
    `,
  ],
})
export class CoachZertifikatPage {
  private readonly auth = inject(AuthService);
  private readonly data = inject(DataService);
  private readonly sel = inject(SelectorsService);

  readonly name = computed(() => {
    const u = this.auth.currentUser();
    return u ? `${u.vorname} ${u.nachname}` : 'Coach';
  });
  readonly tandemName = computed(() => this.sel.meinTandem()?.name ?? 'Tandem');
  readonly schule = computed(
    () => this.data.schulen().find((s) => s.id === this.auth.currentUser()?.schuleId)?.name ?? '',
  );
  readonly heute = computed(() => new Date().toLocaleDateString('de-DE'));

  readonly lernpfadeGesamt = computed(
    () => this.data.lernpfade().filter((lp) => lp.fuer === 'coach').length,
  );
  readonly lernpfadeErledigt = computed(() =>
    this.data
      .lernpfade()
      .filter((lp) => lp.fuer === 'coach')
      .filter((lp) => {
        const f = this.data.fortschritte().find((x) => x.pfadId === lp.id);
        return f && f.erledigteSchritte.length >= lp.schritte.length;
      }).length,
  );
  readonly lernpfadeOk = computed(
    () => this.lernpfadeGesamt() > 0 && this.lernpfadeErledigt() === this.lernpfadeGesamt(),
  );

  readonly treffenDok = computed(() => {
    const t = this.sel.meinTandem();
    if (!t) return 0;
    return this.data.termine().filter((x) => x.tandemId === t.id && x.protokoll).length;
  });
  readonly treffenOk = computed(() => this.treffenDok() >= 1);
  readonly verfuegbar = computed(() => this.lernpfadeOk() && this.treffenOk());

  /** Öffnet eine druckfertige Ansicht in einem neuen Fenster (PDF via „Als PDF speichern"). */
  drucken(): void {
    const html = `<!doctype html><html lang="de"><head><meta charset="utf-8">
      <title>Coach-Zertifikat – ${this.name()}</title>
      <style>
        body{font-family:'Nunito',system-ui,sans-serif;display:grid;place-items:center;min-height:100vh;margin:0;background:#fff;}
        .rand{border:4px double #155a96;border-radius:12px;padding:64px 56px;text-align:center;max-width:640px;}
        .klein{letter-spacing:3px;font-size:12px;font-weight:800;color:#155a96;margin:0;}
        h1{color:#155a96;font-size:34px;margin:14px 0;}
        .name{font-size:26px;font-weight:900;margin:18px 0;}
        p{font-size:15px;color:#1c2733;margin:10px 0;}
        .werte{font-weight:700;color:#e08c0c;margin-top:28px;}
        .fuss{display:flex;justify-content:space-between;border-top:1px solid #e3e8ef;padding-top:12px;margin-top:24px;font-size:12px;color:#5c6b7a;}
      </style></head><body>
      <div class="rand">
        <p class="klein">URKUNDE · BILDUNGSTANDEMS</p>
        <h1>Coach-Zertifikat</h1>
        <p>Dieses Zertifikat würdigt</p>
        <p class="name">${this.name()}</p>
        <p>für das engagierte Begleiten des Tandems „${this.tandemName()}" an der
        ${this.schule()} im Programm BildungsTandems.</p>
        <p class="werte">Verantwortung · Solidarität · Respekt</p>
        <div class="fuss"><span>${this.heute()}</span><span>Zukunftsstiftung Bildung</span></div>
      </div>
      <script>window.onload=function(){window.print();}<\/script>
      </body></html>`;
    const w = window.open('', '_blank');
    if (w) {
      w.document.write(html);
      w.document.close();
    }
  }
}

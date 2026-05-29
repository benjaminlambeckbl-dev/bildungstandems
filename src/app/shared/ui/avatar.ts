import { Component, computed, input } from '@angular/core';

/** Runder Avatar mit Initialen und Farbe. */
@Component({
  selector: 'bt-avatar',
  standalone: true,
  template: `<span class="avatar" [style.background]="farbe()" [style.width.px]="groesse()"
    [style.height.px]="groesse()" [style.font-size.px]="groesse() * 0.4"
    >{{ initialen() }}</span
  >`,
  styles: [
    `
      .avatar {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        color: #fff;
        font-weight: 800;
        flex-shrink: 0;
        line-height: 1;
      }
    `,
  ],
})
export class AvatarComponent {
  vorname = input('');
  nachname = input('');
  farbe = input('var(--bt-primary)');
  groesse = input(40);

  initialen = computed(() => {
    const v = this.vorname().trim()[0] ?? '';
    const n = this.nachname().trim()[0] ?? '';
    return (v + n).toUpperCase() || '?';
  });
}

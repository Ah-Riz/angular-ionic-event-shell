import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { IonButton, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { logOutOutline } from 'ionicons/icons';
import { AuthService } from '../core/auth.service';

addIcons({ logOutOutline });

@Component({
  selector: 'app-logout-button',
  template: `
    <ion-button (click)="logout()" aria-label="Log out">
      <ion-icon slot="icon-only" name="log-out-outline"></ion-icon>
    </ion-button>
  `,
  imports: [IonButton, IonIcon],
})
export class LogoutButtonComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  logout(): void {
    this.auth.logout();
    void this.router.navigateByUrl('/login', { replaceUrl: true });
  }
}

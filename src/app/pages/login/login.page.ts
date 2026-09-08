import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonButton, IonContent, IonInput } from '@ionic/angular/standalone';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  imports: [FormsModule, IonContent, IonInput, IonButton],
})
export class LoginPage {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  email = '';
  password = '';

  constructor() {
    if (this.auth.isLoggedIn()) {
      void this.router.navigateByUrl('/tabs/agenda');
    }
  }

  submit(): void {
    const email = this.email.trim();
    if (!email) {
      return;
    }
    this.auth.login(email);
    void this.router.navigateByUrl('/tabs/agenda');
  }
}

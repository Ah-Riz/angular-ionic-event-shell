import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import {
  AlertController,
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  ToastController,
} from '@ionic/angular/standalone';
import { map, startWith } from 'rxjs';
import { ConferenceDataService } from '../../core/conference-data.service';
import { Attendee } from '../../models/conference';
import { LogoutButtonComponent } from '../../shared/logout-button.component';

@Component({
  selector: 'app-attendee-detail',
  templateUrl: './attendee-detail.page.html',
  styleUrls: ['./attendee-detail.page.scss'],
  imports: [
    RouterLink,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonBackButton,
    IonButton,
    IonContent,
    LogoutButtonComponent,
  ],
})
export class AttendeeDetailPage {
  private readonly route = inject(ActivatedRoute);
  private readonly data = inject(ConferenceDataService);
  private readonly alertCtrl = inject(AlertController);
  private readonly toastCtrl = inject(ToastController);

  private readonly attendeeId = toSignal(
    this.route.paramMap.pipe(map((p) => p.get('id') ?? '')),
    { initialValue: '' }
  );

  private readonly allAttendees = toSignal(
    this.data.getAttendees().pipe(startWith(null as Attendee[] | null)),
    { initialValue: null as Attendee[] | null }
  );

  readonly attendee = computed(() => {
    const list = this.allAttendees();
    if (!list) {
      return undefined;
    }
    return list.find((a) => a.id === this.attendeeId()) ?? null;
  });

  readonly initials = computed(() => {
    const name = this.attendee()?.name ?? '';
    return name
      .split(' ')
      .map((p) => p[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  });

  async requestMeeting(): Promise<void> {
    const person = this.attendee();
    if (!person) {
      return;
    }

    const alert = await this.alertCtrl.create({
      header: 'Request meeting',
      message: `Send a meeting request to ${person.name}? This prototype will not call a backend.`,
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Request meeting',
          role: 'confirm',
          handler: () => {
            void this.showPrototypeToast(person.name);
          },
        },
      ],
    });
    await alert.present();
  }

  private async showPrototypeToast(name: string): Promise<void> {
    const toast = await this.toastCtrl.create({
      message: `Prototype only — no backend. Meeting with ${name} was not sent.`,
      duration: 2800,
      color: 'primary',
      position: 'bottom',
    });
    await toast.present();
  }
}

import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonSearchbar,
  IonTitle,
  IonToolbar,
  ToastController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chevronDownOutline, chevronUpOutline, logOutOutline } from 'ionicons/icons';
import { AuthService } from '../../core/auth.service';
import { ConferenceDataService } from '../../core/conference-data.service';
import { Attendee } from '../../models/attendee';

addIcons({ chevronDownOutline, chevronUpOutline, logOutOutline });

@Component({
  selector: 'app-attendees',
  templateUrl: './attendees.page.html',
  styleUrls: ['./attendees.page.scss'],
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonIcon,
    IonContent,
    IonSearchbar,
  ],
})
export class AttendeesPage {
  private readonly data = inject(ConferenceDataService);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly toastCtrl = inject(ToastController);

  readonly attendees = toSignal(this.data.getAttendees(), {
    initialValue: [] as Attendee[],
  });

  readonly query = signal('');
  readonly industry = signal('all');
  readonly expandedId = signal<string | null>(null);

  readonly industries = computed(() => {
    const values = [...new Set(this.attendees().map((a) => a.industry))];
    return values.sort();
  });

  readonly filtered = computed(() => {
    const q = this.query().trim().toLowerCase();
    const industry = this.industry();

    return this.attendees().filter((a) => {
      const matchesIndustry = industry === 'all' || a.industry === industry;
      const matchesQuery =
        !q ||
        a.name.toLowerCase().includes(q) ||
        a.company.toLowerCase().includes(q) ||
        a.industry.toLowerCase().includes(q);
      return matchesIndustry && matchesQuery;
    });
  });

  onSearch(value: string | null | undefined): void {
    this.query.set(value ?? '');
  }

  onIndustry(value: string): void {
    this.industry.set(value);
  }

  toggleExpand(id: string): void {
    this.expandedId.set(this.expandedId() === id ? null : id);
  }

  async requestMeeting(attendee: Attendee): Promise<void> {
    const toast = await this.toastCtrl.create({
      message: `Prototype only — no backend. Meeting with ${attendee.name} was not sent.`,
      duration: 2800,
      color: 'primary',
      position: 'bottom',
    });
    await toast.present();
  }

  logout(): void {
    this.auth.logout();
    void this.router.navigateByUrl('/login');
  }
}

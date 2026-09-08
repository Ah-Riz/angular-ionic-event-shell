import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, shareReplay } from 'rxjs';
import { Attendee } from '../models/attendee';
import { Session } from '../models/session';

@Injectable({ providedIn: 'root' })
export class ConferenceDataService {
  private readonly http = inject(HttpClient);

  private readonly sessions$ = this.http
    .get<Session[]>('assets/data/sessions.json')
    .pipe(shareReplay(1));

  private readonly attendees$ = this.http
    .get<Attendee[]>('assets/data/attendees.json')
    .pipe(shareReplay(1));

  getSessions(): Observable<Session[]> {
    return this.sessions$;
  }

  getAttendees(): Observable<Attendee[]> {
    return this.attendees$;
  }
}

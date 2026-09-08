import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map, shareReplay } from 'rxjs';
import { Attendee, ConferenceEvent, Session } from '../models/conference';

@Injectable({ providedIn: 'root' })
export class ConferenceDataService {
  private readonly http = inject(HttpClient);

  private readonly event$ = this.http
    .get<ConferenceEvent>('assets/data/event.json')
    .pipe(shareReplay(1));

  private readonly sessions$ = this.http
    .get<Session[]>('assets/data/sessions.json')
    .pipe(shareReplay(1));

  private readonly attendees$ = this.http
    .get<Attendee[]>('assets/data/attendees.json')
    .pipe(shareReplay(1));

  getEvent(): Observable<ConferenceEvent> {
    return this.event$;
  }

  getSessions(): Observable<Session[]> {
    return this.sessions$;
  }

  getAttendees(): Observable<Attendee[]> {
    return this.attendees$;
  }

  getSession(id: string): Observable<Session | undefined> {
    return this.sessions$.pipe(map((list) => list.find((s) => s.id === id)));
  }

  getAttendee(id: string): Observable<Attendee | undefined> {
    return this.attendees$.pipe(map((list) => list.find((a) => a.id === id)));
  }

  getAttendeesByIds(ids: string[]): Observable<Attendee[]> {
    return this.attendees$.pipe(
      map((list) => ids.map((id) => list.find((a) => a.id === id)).filter(Boolean) as Attendee[])
    );
  }

  getRelatedSessions(session: Session, limit = 3): Observable<Session[]> {
    return this.sessions$.pipe(
      map((list) =>
        list
          .filter((s) => s.id !== session.id && s.track === session.track)
          .slice(0, limit)
      )
    );
  }
}

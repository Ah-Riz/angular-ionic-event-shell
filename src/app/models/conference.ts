export interface ConferenceEvent {
  name: string;
  tagline: string;
  venue: string;
  city: string;
  startDate: string;
  endDate: string;
}

export interface Session {
  id: string;
  day: string;
  startTime: string;
  endTime: string;
  title: string;
  track: string;
  room: string;
  description: string;
  level: 'All' | 'Intro' | 'Intermediate' | 'Advanced';
  tags: string[];
  speakerIds: string[];
}

export interface Attendee {
  id: string;
  name: string;
  title: string;
  company: string;
  industry: string;
  bio: string;
  avatarColor: string;
}

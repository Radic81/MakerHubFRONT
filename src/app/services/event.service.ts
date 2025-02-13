import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface CalendarEvent {
  id: number;
  title: string;
  start: string; // Format ISO, ex: "2022-05-11T10:00:00"
  end: string;   // Format ISO
  description?: string;
  location?: string;
  tag?: {
    color: string;
    name: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class EventService {
  // Stockage local des événements (à remplacer par des appels API si nécessaire)
  private events: CalendarEvent[] = [
    {
      id: 1,
      title: 'Réunion de lancement',
      start: '2022-05-11T10:00:00',
      end: '2022-05-11T12:00:00',
      description: 'Discussion du lancement du projet',
      location: 'Salle de réunion 1',
      tag: { color: '#1e90ff', name: 'Important' }
    },
    {
      id: 2,
      title: 'Consultation Client',
      start: '2022-05-12T14:00:00',
      end: '2022-05-12T15:00:00',
      description: 'Consultation pour le suivi du dossier',
      location: 'Bureau 3',
      tag: { color: '#f44336', name: 'Urgent' }
    }
  ];

  constructor() {}

  /**
   * Retourne la liste des événements sous forme d'Observable.
   */
  getEvents(): Observable<CalendarEvent[]> {
    return of(this.events);
  }

  /**
   * Ajoute un nouvel événement.
   * Génère un ID aléatoire pour l'événement.
   */
  addEvent(event: CalendarEvent): Observable<CalendarEvent> {
    event.id = Math.floor(Math.random() * 10000);
    this.events.push(event);
    return of(event);
  }

  /**
   * Met à jour un événement existant.
   */
  updateEvent(updatedEvent: CalendarEvent): Observable<CalendarEvent> {
    const index = this.events.findIndex(e => e.id === updatedEvent.id);
    if (index !== -1) {
      this.events[index] = updatedEvent;
    }
    return of(updatedEvent);
  }

  /**
   * Supprime un événement par son ID.
   */
  deleteEvent(eventId: number): Observable<boolean> {
    const index = this.events.findIndex(e => e.id === eventId);
    if (index !== -1) {
      this.events.splice(index, 1);
      return of(true);
    }
    return of(false);
  }
}

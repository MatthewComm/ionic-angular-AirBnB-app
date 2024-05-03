import { Injectable } from '@angular/core';
import { Place } from './places.models';
import { AuthService } from '../auth/auth.service';
import { BehaviorSubject, map, take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlacesService {

  private _places = new BehaviorSubject<Place[]>([
    new Place(
      'p1',
      'Manhattan Mansion',
      'In the heart of New York City.',
      'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      149.99,
      new Date('2019-01-01'),
      new Date('2019-12-31'),
      'abc'
    ),
    new Place(
      'p2',
      'L\'Amour Toujours',
      'A romantic place in Paris!',
      'https://images.unsplash.com/photo-1486572788966-cfd3df1f5b42?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
      189.99,
      new Date('2019-01-01'),
      new Date('2019-12-31'),
      'abc'
    ),
    new Place(
      'p3',
      'The Foggy Palace',
      'Not your average city trip!',
      'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
      99.99,
      new Date('2019-01-01'),
      new Date('2019-12-31'),
      'abc'
    )
  ]);

  private _offers: Place[] = [
    new Place
      (
        'p1',
        'Manhattan Mansion',
        'In the heart of New York City.',
        'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        149.99,
        new Date('2019-01-01'),
        new Date('2019-12-31'),
        'abc'
      ),
    new Place(
      'p2',
      'L\'Amour Toujours',
      'A romantic place in Paris!',
      'https://images.unsplash.com/photo-1486572788966-cfd3df1f5b42?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
      189.99,
      new Date('2019-01-01'),
      new Date('2019-12-31'),
      'abc'
    )
  ];

  get places() {
    return this._places.asObservable();
  }

  get offers() {
    return [...this._offers];
  }

  constructor(private authService: AuthService) { }

  getPlace(id: string) {
    return this.places.pipe(take(1), map((places) => {
      return { ...places.find((p) => p.id === id) };
    }));
  };

addPlace(title: string, description: string, price: number, dateFrom: Date, dateTo: Date) {
  const newPlace = new Place(
    Math.random().toString(),
    title,
    description,
    'https://images.unsplash.com/photo-1486572788966-cfd3df1f5b42?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
    price,
    dateFrom,
    dateTo,
    this.authService.userId
  );
  this.places.pipe(take(1)).subscribe((places) => {
    this._places.next(places.concat(newPlace));
  });
}
}
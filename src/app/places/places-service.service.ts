import { Injectable } from '@angular/core';
import { Place } from './places.models';
import { AuthService } from '../auth/auth.service';
import { BehaviorSubject, delay, map, switchMap, take, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';


// [
//   new Place(
//     'p1',
//     'Manhattan Mansion',
//     'In the heart of New York City.',
//     'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
//     149.99,
//     new Date('2019-01-01'),
//     new Date('2019-12-31'),
//     'abc'
//   ),
//   new Place(
//     'p2',
//     'L\'Amour Toujours',
//     'A romantic place in Paris!',
//     'https://images.unsplash.com/photo-1486572788966-cfd3df1f5b42?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
//     189.99,
//     new Date('2019-01-01'),
//     new Date('2019-12-31'),
//     'xyz'
//   ),
//   new Place(
//     'p3',
//     'The Foggy Palace',
//     'Not your average city trip!',
//     'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
//     99.99,
//     new Date('2019-01-01'),
//     new Date('2019-12-31'),
//     'xyz'
//   )
// ]

interface PlaceData {
  availableFrom: string
  availableTo: string
  description: string
  imageUrl: string
  price: number
  title: string,
  userID: string
}

@Injectable({
  providedIn: 'root'
})
export class PlacesService {

  private _places = new BehaviorSubject<Place[]>([]);

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

  constructor(
    private authService: AuthService,
    private http: HttpClient
  ) { }

  getPlace(id: string) {
    return this.places.pipe(take(1), map((places) => {
      return { ...places.find((p) => p.id === id) };
    }));
  };

  fetchPlaces() {
    return this.http.get<{ [key: string]: PlaceData }>('https://ionic-angular-airbnb-app-default-rtdb.europe-west1.firebasedatabase.app/offered-places.json')
      .pipe(
        map((resData: any) => {
          const places = [];
          for (const key in resData) {
            if (resData.hasOwnProperty(key)) {
              places.push(new Place(
                key,
                resData[key].title,
                resData[key].description,
                resData[key].imageUrl,
                resData[key].price,
                new Date(resData[key].availableFrom),
                new Date(resData[key].availableTo),
                resData[key].userID
              ));
            }
          }
          return places;
        }),
        tap(places => {
          this._places.next(places);
        })
      )
  }

  addPlace(title: string, description: string, price: number, dateFrom: Date, dateTo: Date) {

    let generatedId: string;

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
    return this.http.post<{ name: string }>('https://ionic-angular-airbnb-app-default-rtdb.europe-west1.firebasedatabase.app/offered-places.json', { ...newPlace, id: null })
      .pipe(
        switchMap((resData) => {
          generatedId = resData.name;
          return this.places;
        }),
        take(1),
        tap(places => {
          newPlace.id = generatedId;
          this._places.next(places.concat(newPlace));
        })
      );

    // return this.places.pipe(
    //   take(1),
    //   delay(1000),
    //   tap(places => {
    //     this._places.next(places.concat(newPlace));
    // }));
  }

  updatePlace(placeId: string, title: string, description: string) {
    let updatedPlaces: Place[];
    return this._places.pipe(
      take(1),
      switchMap(places => {
        const updatedPlaceIndex = places.findIndex(p => p.id === placeId);
        updatedPlaces = [...places];
        const oldPlace = updatedPlaces[updatedPlaceIndex];
        updatedPlaces[updatedPlaceIndex] = new Place(
          oldPlace.id,
          title,
          description,
          oldPlace.imageUrl,
          oldPlace.price,
          oldPlace.availableFrom,
          oldPlace.availableTo,
          oldPlace.userID
        );
        return this.http.put(`https://ionic-angular-airbnb-app-default-rtdb.europe-west1.firebasedatabase.app/offered-places/${placeId}.json`,
          { ...updatedPlaces[updatedPlaceIndex], id: null });
      }),
      tap(() => {
        this._places.next(updatedPlaces);
      })
    );
  }
}
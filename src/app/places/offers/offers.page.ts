import { Component, OnDestroy, OnInit } from '@angular/core';
import { Place } from '../places.models';
import { PlacesService } from '../places-service.service';
import { Subscription } from 'rxjs';
import { IonItemSliding } from '@ionic/angular';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.page.html',
  styleUrls: ['./offers.page.scss'],
})
export class OffersPage implements OnInit, OnDestroy {

  loadedOffers: Place[] = [];
  isLoading = false;
  private placesSub: Subscription = new Subscription();

  constructor(private placesService: PlacesService) { }

  ngOnInit() {
    this.placesSub = this.placesService.places.subscribe(places => {
      this.loadedOffers = places;
    });
  }

  ionViewWillEnter() {
    this.isLoading = true;
    this.placesService.fetchPlaces().subscribe(() => {
      this.isLoading = false;
    });
  }

  onEdit(offerId: string, slidingItem: IonItemSliding) {
    console.log('Editing item', offerId);
    slidingItem.close();
  }

  onDelete(offerId: string) {
    console.log('Deleting item', offerId);
  }

  ngOnDestroy() {
    if (this.placesSub) {
      this.placesSub.unsubscribe();
    }
  }

}

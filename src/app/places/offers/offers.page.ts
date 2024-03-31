import { Component, OnInit } from '@angular/core';
import { Place } from '../places.models';
import { PlacesService } from '../places-service.service';
import { of } from 'rxjs';
import { IonItemSliding } from '@ionic/angular';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.page.html',
  styleUrls: ['./offers.page.scss'],
})
export class OffersPage implements OnInit {

  loadedOffers: Place[] = [];

  constructor(private placesService: PlacesService) { }

  ngOnInit() {
    this.loadedOffers = this.placesService.offers;
  }

  onEdit(offerId: string, slidingItem: IonItemSliding) {
    console.log('Editing item', offerId);
    slidingItem.close();
  }

  onDelete(offerId: string) {
    console.log('Deleting item', offerId);
  }

}

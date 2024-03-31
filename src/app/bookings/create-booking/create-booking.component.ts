import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Place } from 'src/app/places/places.models';

@Component({
  selector: 'app-create-booking',
  templateUrl: './create-booking.component.html',
  styleUrls: ['./create-booking.component.scss'],
})
export class CreateBookingComponent  implements OnInit {

  @Input() selectedPlace: Place;

  constructor(
    private modalController: ModalController
  ) {
    this.selectedPlace = {} as Place;
  }

  ngOnInit() {}

  onBookPlace() {
    this.modalController.dismiss({message: 'This is a dummy message!'}, 'confirm');
  }

  onCancel() {
    this.modalController.dismiss(null, 'cancel');
  }

}

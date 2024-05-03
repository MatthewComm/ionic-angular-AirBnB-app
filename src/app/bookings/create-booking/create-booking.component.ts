import { Component, Input, OnInit } from '@angular/core';
import { Form, FormControl, FormGroup } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Place } from 'src/app/places/places.models';

@Component({
  selector: 'app-create-booking',
  templateUrl: './create-booking.component.html',
  styleUrls: ['./create-booking.component.scss'],
})
export class CreateBookingComponent  implements OnInit {

  @Input() selectedPlace: Place;
  @Input() selectedMode: 'select' | 'random';

  startDateCtrl = new FormControl(new Date());

  form: FormGroup;



  constructor(
    private modalController: ModalController
  ) {
    this.selectedPlace = {} as Place;
    this.selectedMode = 'select';
    this.form = {} as FormGroup;
  }

  ngOnInit() {
    const availableFrom = new Date(this.selectedPlace.availableFrom);
    const availableTo = new Date(this.selectedPlace.availableTo);

    console.log(availableFrom);
    console.log(availableTo);

    if (this.selectedMode === 'random') {
      this.startDateCtrl.setValue(new Date(
        availableFrom.getTime() +
        Math.random() *
        (availableTo.getTime() - 7 * 24 * 60 * 60 * 1000 - availableFrom.getTime())
      ));
    }
  }

  onBookPlace() {
    this.modalController.dismiss({message: 'This is a dummy message!'}, 'confirm');
  }

  onCancel() {
    this.modalController.dismiss(null, 'cancel');
  }

}

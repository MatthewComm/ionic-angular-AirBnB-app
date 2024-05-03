import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Form, FormControl, FormGroup, NgForm } from '@angular/forms';
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
  @ViewChild('f', {static: true}) form: NgForm;

  startDateCtrl = new FormControl(new Date());

  constructor(
    private modalController: ModalController
  ) {
    this.selectedPlace = {} as Place;
    this.selectedMode = 'select';
    this.form = {} as NgForm;
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
    if (!this.form.valid || !this.datesValid) {
      return;
    }

    this.modalController.dismiss({bookingData: {
      firstName: this.form.value['first-name'],
      lastName: this.form.value['last-name'],
      guestNumber: +this.form.value['guest-number'],
      startDate: new Date(this.form.value['from']),
      endDate: new Date(this.form.value['to'])

    }}, 'confirm');

  }

  onCancel() {
    this.modalController.dismiss(null, 'cancel');
  }

  datesValid() {
    const startDate = new Date(this.form.value['from']);
    const endDate = new Date(this.form.value['to']);

    return endDate > startDate;
  }

}

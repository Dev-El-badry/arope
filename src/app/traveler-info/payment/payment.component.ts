import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import {MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import { NgForm, NgModel } from '@angular/forms';
import { OdooService } from 'src/app/shared/odoo.service';
import { NgControl } from '@angular/forms';
import { TravelerService } from '../traveler.service';
import { PaymentModel } from  '../payment.model';
export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})
export class PaymentComponent implements OnInit {
  paymentForm: PaymentModel;
  @Output() paymentStatus = new EventEmitter();
  constructor(private odoo: OdooService, private travelerService: TravelerService) { }

  ngOnInit() {
    this.paymentForm =  this.travelerService.paymentForm;
    console.log('', this.paymentForm);
  }



  submitPayment(form: NgForm) {
    if (form.valid) {
      const formData = JSON.parse(localStorage.getItem('formData'));
      if (formData.type === 'individual') {
        const data = {paramlist: formData};
        this.odoo.call_odoo_function('travel_agency', 'demo', 'demo', 'travel.front',
        'create_policy', data).subscribe(res => {
     
        this.paymentStatus.emit(true);
        });
      } else {
        this.paymentStatus.emit(true);
      }
    }
  }



}

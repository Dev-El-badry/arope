import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { WelcomeService } from '../../welcome/welcome.service';
import { TravelerService } from '../traveler.service';
import { NgForm } from '@angular/forms';
import { OdooService } from '../../shared/odoo.service';

@Component({
  selector: "app-price-card-payment",
  templateUrl: "./price-card-payment.component.html",
  styleUrls: ["./price-card-payment.component.css"]
})
export class PriceCardPaymentComponent implements OnInit {
  totalPrice: number;
  formList;
  isDisabled = false;

  @Output() clickedDone = new EventEmitter();
  constructor(
    private welService: WelcomeService,
    private travelerService: TravelerService,
    private odoo: OdooService
  ) {}

  ngOnInit() {
    this.formList = this.travelerService.paymentForm;
    console.log("formList", this.formList.cardNumber);
    this.welService.priceLoad.subscribe(result => {
      this.totalPrice = result;
    });

    this.welService.getValuePrice();
  }

  submitFormPriceCard(form: NgForm) {
    if (form.valid) {
      const formData = JSON.parse(localStorage.getItem("formData"));
      if (formData.type === "individual") {
        const data = { paramlist: formData };
        this.odoo
          .call_odoo_function(
            "travel_agency",
            "demo",
            "demo",
            "travel.front",
            "create_policy",
            data
          )
          .subscribe(res => {
            this.whenSucceed()
          });
      } else {
        this.whenSucceed()
      }
     
     
      
    }
  }

  whenSucceed() {
    this.clickedDone.emit(true);
    this.isDisabled = true;
    window.scrollTo(0, 0);
  }
}

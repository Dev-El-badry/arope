import { WelcomeService } from './../../welcome/welcome.service';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import {ErrorStateMatcher} from '@angular/material/core';
import {FormControl, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import { SiteSettingsService } from 'src/app/shared/site_settings.service';
import { OdooService } from 'src/app/shared/odoo.service';
import { TravelerService } from '../traveler.service';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: "app-info",
  templateUrl: "./info.component.html",
  styleUrls: ["./info.component.css"]
})
export class InfoComponent implements OnInit {


  matcher = new MyErrorStateMatcher();
  numOfTravelers=[];
  types = [
    { value: "spouse", viewValue: "Spouse" },
    { value: "kid", viewValue: "Kid" }
  ];

  typesList;
  datesList;
  @Output() changeStatus = new EventEmitter();
  constructor(
    private setting: SiteSettingsService,
    private odoo: OdooService,
    private welService: WelcomeService,
    private travelerService: TravelerService
  ) {}


  ngOnInit() {
    const emptyArr = new Array(
      parseInt(localStorage.getItem("numOfTraveler"))
    );

    for(let i = 0; i < emptyArr.length; i++){

      console.log('count', i)
      this.numOfTravelers.push(i)

   
   }

    console.log('emptyArr', emptyArr);
    console.log('numOfTravelers', this.numOfTravelers);
    const fJson = JSON.parse(localStorage.getItem("typesDates"));
    const dataJson = JSON.parse(fJson);
    this.typesList = dataJson.types;
    this.datesList = dataJson.dates;
  }

  submitTravelerInfo(form: NgForm) {
    const age = this.setting.convertDate(form.value.dateBirth);
    const when = this.setting.convertDate(localStorage.getItem("when"));
    const till = this.setting.convertDate(localStorage.getItem("till"));
    if (localStorage.getItem("type") === "individual") {
      const formData = {
        type: localStorage.getItem("type"),
        insuredName: form.value.firstName + " " + form.value.lastName,
        address: form.value.address,
        passport: form.value.Passport,
        ages: age,
        zone: localStorage.getItem("zone"),
        whens: when,
        tills: till,
        family: []
      };
      localStorage.setItem("formData", JSON.stringify(formData));
    }
    if (form.valid) {
      const data = {
        paramlist: {
          types: localStorage.getItem("type"),
          ages: [age],
          whens: when,
          tills: till,
          zone: localStorage.getItem("zone")
        }
      };
      this.odoo
        .call_odoo_function(
          "travel_agency",
          "demo",
          "demo",
          "policy.travel",
          "get_quote",
          data
        )
        .subscribe(res => {
          this.welService.priceLoad.next(res);

          localStorage.setItem("total_price", res.toString());
          this.changeShowValue();
        });
      this.changeStatus.emit(true);
    }
  }

  changeShowValue() {
    this.travelerService.changeStatusShowValue();

  }
}

import { Component, OnInit, Output, EventEmitter, OnDestroy, Input } from '@angular/core';
import { MatDialog } from '@angular/material';
import { AgeTravelerComponent } from './ageTraveler.component';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { MatRadioChange } from '@angular/material';
import { WelcomeService } from '../welcome.service';
import { Subscription } from 'rxjs';
import { UIService } from '../../shared/ui.services';
import { OdooService } from '../../shared/odoo.service';
@Component({
  selector: 'app-get-quote',
  templateUrl: './get-quote.component.html',
  styleUrls: ['./get-quote.component.css']
})
export class GetQuoteComponent implements OnInit, OnDestroy {
  countries = [];
  isLoading = false;
  maxDate;
  minDate;
  breakpoint: number;
  isIndividual = true;
  agesString: string;
  ageLoadSubs: Subscription;
  loadingSubs: Subscription;
  familyDataString: string;
  @Output() change: EventEmitter<MatRadioChange>;
  constructor(
    public dialog: MatDialog,
    private router: Router,
    private welcomeService: WelcomeService,
    private uiService: UIService,
    private odoo: OdooService
  ) {}

  ngOnInit() {
    this.breakpoint = window.innerWidth <= 700 ? 1 : 2;
    this.maxDate = new Date();
    this.maxDate.setDate(this.maxDate.getDate() - 0);
    this.minDate = this.welcomeService.getMinDateBefore30Days();

    this.loadingSubs = this.uiService.loadingChangedStatus.subscribe(res => {
      this.isLoading = res;
    });

    this.countries = this.welcomeService.getAllCountries();
  }




  onResize(event) {
    console.log('yeah', event);
    this.breakpoint = event.target.innerWidth <= 700 ? 1 : 2;
  }

  showPopup() {
    console.log(this.familyDataString);
    const dialogRef = this.dialog.open(AgeTravelerComponent, {
      data : {
        datesList: this.familyDataString
      },


      width: '550px',

    });
    dialogRef.afterClosed().subscribe(result => {

      const arr = [];
      this.familyDataString = JSON.stringify(this.welcomeService.getListDates());
      if (this.familyDataString) {
        const new_json = JSON.parse(this.welcomeService.getListDates());
        for (const i in new_json.dates) {
          arr.push(new_json.dates[i]);
        }

        this.agesString = arr.join(', ');
      }

    });
  }

  showField(event) {
    const valueField = event.value;
    if (valueField === 'family') { this.isIndividual = false; } else { this.isIndividual = true; }
  }

  convertDate(dateAge) {
    let d = new Date(dateAge),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) {
        month = '0' + month;
    }
    if (day.length < 2) {
        day = '0' + day;
    }

    return [year, month, day].join('-');
  }

  submitForm(form: NgForm) {
    const when = this.convertDate(form.value.dateWhen);
    const till = this.convertDate(form.value.dateTill);
    const type = form.value.type;
    let ageArgs;

    // define function down
    if (type === 'individual') {
      ageArgs = form.value.indAge;
    } else {
      ageArgs = form.value.familyAges;
    }
    const age = this.typeAges(type, ageArgs);

    const data = {paramlist: {types: type, ages: age, whens: when, tills: till,
    zone: form.value.zone}};

    this.saveDataInLocalStorage(form);

    this.welcomeService.sendQuoteResult(data);
  }

  typeAges(type: string, ageArgs) {
    if (type === 'individual') {
      return [this.convertDate(ageArgs)];
   } else {
      return ageArgs.split(', ');
   }
  }

  saveDataInLocalStorage(form) {
    const zone = '';
    console.log(form);

    localStorage.setItem('zone', form.value.zone);
    let ageArgs;
    const type = form.value.type;
    let valArgLength = 0;
    if (type === 'individual') {
      ageArgs = form.value.indAge;
      valArgLength = this.typeAges(type, ageArgs).length ;
    } else {
      ageArgs = form.value.familyAges;
      valArgLength = this.typeAges(type, ageArgs).length;
      localStorage.setItem('typesDates', form.value.types);
    }
    const valArgs = this.typeAges(type, ageArgs);
    localStorage.setItem('type', type);

    const yearBirth = this.getAge(valArgs[0]);
    localStorage.setItem('age', yearBirth.toString());

    localStorage.setItem('numOfTraveler', valArgLength.toString());

    localStorage.setItem('when', form.value.dateWhen);
    localStorage.setItem('till', form.value.dateTill);
    console.log(yearBirth, localStorage.getItem('age'));
  }

  getAge(dateString) {
    const today = new Date();
    const birthDate = new Date(dateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  ngOnDestroy() {
    this.loadingSubs.unsubscribe();

  }
}


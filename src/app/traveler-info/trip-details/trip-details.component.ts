import { WelcomeService } from '../../welcome/welcome.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-trip-details',
  templateUrl: './trip-details.component.html',
  styleUrls: ['./trip-details.component.css']
})
export class TripDetailsComponent implements OnInit {
  zone;
  type;
  age;
  when;
  till;
  numOfTraveler;
  constructor(private welService: WelcomeService) { }

  ngOnInit() {

    const zoneValue = localStorage.getItem('zone');

    const countries = this.welService.getAllCountries();
    countries.forEach(x => {
      if (x.value === zoneValue) {
        this.zone = x.viewValue;
      }
    });

    this.type = localStorage.getItem('type');
    this.age = localStorage.getItem('age');
    this.when = localStorage.getItem('when');
    this.till = localStorage.getItem('till');
    this.numOfTraveler = localStorage.getItem('numOfTraveler');


  }

}


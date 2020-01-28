import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { NgForm } from '@angular/forms';
import { WelcomeService } from '../welcome.service';
import { SiteSettingsService } from '../../shared/site_settings.service';
@Component({
  selector: "app-stop-training",
  template: `
    <form #fDialog="ngForm" (ngSubmit)="submitFormAges(fDialog)" >
      <div mat-dialog-content>

        

          
          <div *ngFor="let element of elements; let i = index">



          <span id="field-{{ i }}">

           <div fxLayout="row" fxLayout.lt-sm="column"  fxLayoutGap="1%" >

           <div *ngIf=" i == 0 ; then thenBlock else elseBlock"></div>
            <ng-template #thenBlock>
            <div 
              style="color: #565656;     font-size:14px;
              margin-top: 11px !important;
              font-weight: normal;"
              fxFlex="21%"
              
              
              >
              
             Primary Traveler's Age:
              </div>
            </ng-template>
            <ng-template #elseBlock>
            <div 
              style="color: #565656;     font-size:14px;margin-top: 11px !important;font-weight: normal;"
              fxFlex="30%"
              >
              
              Additional Traveler's Age:
              </div>
            </ng-template>

           

             
              <div ngModelGroup="dates" fxFlex="20%"  class="margin-right-fix">


                <mat-form-field
                  class="form-age-traveler"
                  style="
                  width: 162px;"
                  
                
                >
                <input
                    type="text"
                    matInput
                    [matDatepicker]="picker"
                    placeholder="Age Of Travel"
                    [ngModel]="dataList.dates['date-'+i]"
                    name="date-{{ i }}"
                    #ages="ngModel"
                    [max]="minDate"
                    required

                  />
                  <mat-datepicker-toggle
                    matSuffix
                    [for]="picker"
                  ></mat-datepicker-toggle>
                  <mat-datepicker  #picker [startAt]="dataList.dates['date-'+i]" startView="multi-year" ></mat-datepicker>
                </mat-form-field>
               </div>
             

              <div *ngIf="!result; then thenBlock1 else elseBlock1;"></div>
              <ng-template #thenBlock1>
              <div ngModelGroup="types" fxFlex="20%"  class="margin-right-fix">
                <mat-form-field *ngIf="i!=0">
                  <mat-label>Type</mat-label>
                  <mat-select name="type-{{i}}" ngModel #type="ngModel" required>
                    <mat-option *ngFor="let type of types" [value]="type.value">
                      {{type.viewValue}}
                    </mat-option>
                  </mat-select>
                </mat-form-field>
              </div>
              </ng-template>
              <ng-template #elseBlock1>
              <div ngModelGroup="types" fxFlex="20%"  class="margin-right-fix">
                <mat-form-field *ngIf="i!=0">
                  <mat-label>Type</mat-label>
                  <mat-select name="type-{{i}}" [(ngModel)]="dataList.types['type-'+i]" #type="ngModel" required>
                    <mat-option *ngFor="let type of types" [value]="type.value">
                      {{type.viewValue}}
                    </mat-option>
                  </mat-select>
                </mat-form-field>
              </div>
              </ng-template>
             
              
            
              <div 
              fxFlex="10%"
              class="margin-right-fix"
              style="   cursor: pointer;"
            
              (click)="deleteElement(i)" 
              *ngIf="i != 0"
              
          
              type="button"
              color="warn"
              >
                <mat-icon style="    margin: 18px;
                    line-height: 10px;
                    padding: 2px;
                    border-radius: 5px;
                    background: salmon;
                }">minimize</mat-icon>
                </div>

             

            </div>



          </span>



          </div>

          


      



      </div>
      <div mat-dialog-actions>
      <div
          style="cursor: pointer; color: #565656"
          onMouseOver="this.style.color='#073e89'"
          onMouseOut="this.style.color='#565656'"
          (click)="this.clickMe()"
          fxLayout fxLayoutAlign="flex-start"
        >
          <span
            class="mdi mdi-plus"
            style="    font-size: 15px;"
            icon-margin
          ></span>
          Add Additional Traveler
        </div>
        <div fxFlex fxLayout fxLayoutAlign="flex-end">
          <button
            mat-button
            type="submit"
            style="background-color: #073E89;
            color: #E4EAF2;"
            [disabled]="fDialog.invalid"

          >
            Done
          </button>
        </div>
      </div>
    </form>
  `,
   styles: ['.margin-right-fix:not(:last-child) { margin-right: 70px !important }; button.margin-right-fix.mat-raised-button.mat-button-base.mat-warn.ng-star-inserted { max-width: 7% !important }'],
})
export class AgeTravelerComponent implements OnInit{
  elements = [];
  minDate;
  result;
  types = [
    {value: 'spouse', viewValue: 'Spouse'},
    {value: 'kid', viewValue: 'Kid'}
  ];
  dataList = {
    "dates": "",
    "types": ""
  }
  isShow:boolean;
  constructor(
    private dialogRef: MatDialogRef<AgeTravelerComponent>,
    @Inject(MAT_DIALOG_DATA) public passedData,
    private welcomeService: WelcomeService,
    private site_settings: SiteSettingsService
  ) {
  
    
  }

  ngOnInit() {
    this.minDate = this.welcomeService.getMinDateBefore30Days();
    let result = this.site_settings.isEmpty(this.passedData);
   
    if(result){
      console.log(this.passedData.datesList, 'newjson')
      let newJson = JSON.parse(this.passedData.datesList);  
      var genJson = JSON.parse(newJson);
    
      for (var dateItem in genJson.dates) {
        this.elements.push(this.elements.length);
      }
      
      this.dataList.dates = genJson.dates;
      this.dataList.types = genJson.types;

    } else {
      this.elements.push(this.elements.length);
    }
    this.result = result;
    console.log('result', result);
  }


  clickMe() {
    this.elements.push(this.elements.length);
  }

  submitFormAges(form: NgForm) {
    for (let age in form.value.dates) {
      form.value.dates[age] = this.site_settings.convertDate(form.value.dates[age]);
    }
    let listValue = {
      dates: form.value.dates,
      types: form.value.types
    };
    this.welcomeService.setListDates(listValue);
    this.dialogRef.close();
  }

  deleteElement(index: number) {
    const target_id = "field-"+index;
    const element_id = document.getElementById(target_id);
    element_id.parentNode.removeChild(element_id);
  }
}
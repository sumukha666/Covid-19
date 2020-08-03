import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatTableDataSource } from '@angular/material/table';
import { CovidApiService } from '../../services/covid-api.service'
import { Router } from '@angular/router';
@Component({
  selector: 'app-table-view',
  templateUrl: './table-view.component.html',
  styleUrls: ['./table-view.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class TableViewComponent implements OnInit {
  @Input() columnsToDisplay;
  rows = [];
  State = ""
  Confirmed = 0
  Recovered = 0
  Active = 0
  Deceased = 0
  description = ""
  dataSource
  expandedElement: StateCases | null;
  constructor(private _covidAPI: CovidApiService, private _router: Router) { }
  initilizeData(data) {
    this.dataSource = new MatTableDataSource(data);
  }
  getStateDetails() {
    this._covidAPI.getStates().subscribe(
      (res) => {
        Object.keys(res).forEach(key => {
          if (key !== "State Unassigned") {
            this.State = key
            Object.keys(res[key]).forEach(district => {
              if (district === "districtData") {
                Object.keys(res[key][district]).forEach(city => {
                  this.Active = this.Active + res[key][district][city]["active"];
                  this.Confirmed = this.Confirmed + res[key][district][city]["confirmed"];
                  this.Recovered = this.Recovered + res[key][district][city]["recovered"];
                  this.Deceased = this.Deceased + res[key][district][city]["deceased"]
                })
              }
            })
            this.rows.push(new Object({ State: this.State, Confirmed: this.Confirmed, Active: this.Active, Recovered: this.Recovered, Deceased: this.Deceased, description: "some" }));
          }
        })
        this.initilizeData(this.rows)
      })
  }
  ngOnInit() {
    this.getStateDetails()
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  openStateDetails(event,row){
    //console.log(row)
    //let urlLink = "states/"+ row.State;
    //event.push("/homepage")
    this._router.navigate(['/states/'+row.State])
  }

}

export interface StateCases {
  State: string;
  Confirmed: number;
  Active: number;
  Recovered: number;
  Deceased: number;
}

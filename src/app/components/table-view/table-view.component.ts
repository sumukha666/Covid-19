import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatTableDataSource } from '@angular/material/table';
import { CovidApiService } from '../../services/covid-api.service'
import { Router } from '@angular/router';
import {Sort} from '@angular/material/sort';
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
  @Input() stateNameToDisplay;
  @Input() disableRowClick;
  rows = [];
  delta = { "Confirmed": 0, "Recovered": 0, "Deceased": 0 }
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
        switch (this.columnsToDisplay[0]) {
          case "District":
            let districtsObj = res[this.stateNameToDisplay]["districtData"]
            this.rows = new Array([])
            this.delta = { "Confirmed": 0, "Recovered": 0, "Deceased": 0 }
            for (let i in districtsObj) {
              //console.log(districtsObj[i]["delta"])
              this.delta["Confirmed"] = districtsObj[i]["delta"]["confirmed"]
              //this.delta["Active"] = parseInt(this.delta["Active"] )+ parseInt(res[key][district][city]["delta"]["active"])
              this.delta["Recovered"] = (districtsObj[i]["delta"]["recovered"])
              this.delta["Deceased"] = (districtsObj[i]["delta"]["recovered"])
              this.rows.push({
                District: i, Confirmed: districtsObj[i]['confirmed'], Active: districtsObj[i]['active'], Recovered: districtsObj[i]['recovered'],
                Deceased: districtsObj[i]['deceased'], description: "some", "delta": this.delta
              })
            }

            this.rows.shift()
            //console.log(this.rows)
            this.rows.sort((a,b)=>a.Confiirmed-b.Confirmed);
            this.initilizeData(this.rows.reverse())
            break;
          case "State":
            Object.keys(res).forEach(key => {
              if (key !== "State Unassigned") {
                this.State = key
                this.Active = 0
                this.Confirmed = 0
                this.Recovered = 0
                this.Deceased = 0
                this.delta = { "Confirmed": 0, "Recovered": 0, "Deceased": 0 }
                Object.keys(res[key]).forEach(district => {

                  if (district === "districtData") {
                    Object.keys(res[key][district]).forEach(city => {
                      //console.log(res[key][district][city]);
                      this.Active = this.Active + res[key][district][city]["active"];
                      this.Confirmed = this.Confirmed + res[key][district][city]["confirmed"];
                      this.Recovered = this.Recovered + res[key][district][city]["recovered"];
                      this.Deceased = this.Deceased + res[key][district][city]["deceased"]
                      //console.log(this.delta["Confirmed"])
                      //console.log(res[key][district][city]["delta"])
                      this.delta["Confirmed"] = this.delta["Confirmed"] + parseInt(res[key][district][city]["delta"]["confirmed"])
                      //this.delta["Active"] = parseInt(this.delta["Active"] )+ parseInt(res[key][district][city]["delta"]["active"])
                      this.delta["Recovered"] = (this.delta["Recovered"]) + parseInt(res[key][district][city]["delta"]["recovered"])
                      this.delta["Deceased"] = (this.delta["Deceased"]) + parseInt(res[key][district][city]["delta"]["deceased"])
                    })
                  }
                })
                this.rows.push(new Object({
                  State: this.State, Confirmed: (this.Confirmed), Active: (this.Active),
                  Recovered: (this.Recovered), Deceased: (this.Deceased), description: "some",
                  delta: { Confirmed: this.delta["Confirmed"], Recovered: this.delta["Recovered"], Deceased: this.delta["Deceased"] }
                }));
              }
            })
            this.rows.sort((a,b)=>a.Confirmed-b.Confirmed);
            this.initilizeData(this.rows.reverse())
            break;

        }
      })
  }
  ngOnInit() {
    this.rows.splice(0, this.rows.length)
    this.getStateDetails()
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  openStateDetails(event, row) {
    this._router.navigate(['/states/' + row.State])
  }
  convertNumberIntoK(value) {
    if (value >= 1000000) {
      value = Math.round(value / 1000000) + "M"
    }
    else if (value >= 1000) {
      value = Math.round(value / 1000) + "K";
    }
    return value;
  }

  sortData(sort: Sort) {
    const data = this.rows.slice();
    if (!sort.active || sort.direction === '') {
      this.initilizeData(this.rows);
      return;
    }

    this.rows = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'State': return compare(a.State, b.State, isAsc);
        case 'District': return compare(a.District, b.District, isAsc);
        case 'Confirmed': return compare(a.Confirmed, b.Confirmed, isAsc);
        case 'Active': return compare(a.Active, b.Active, isAsc);
        case 'Recovered': return compare(a.Recovered, b.Recovered, isAsc);
        case 'Deceased': return compare(a.Deceased, b.Deceased, isAsc);
        default: return 0;
      }
    });
    this.initilizeData(this.rows)
  }

}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}

export interface StateCases {
  State: string;
  Confirmed: number;
  Active: number;
  Recovered: number;
  Deceased: number;
}

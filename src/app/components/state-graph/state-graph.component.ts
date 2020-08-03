import { Component, OnInit } from '@angular/core';
import { CovidApiService } from '../../services/covid-api.service'
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-state-graph',
  templateUrl: './state-graph.component.html',
  styleUrls: ['./state-graph.component.scss']
})

export class StateGraphComponent implements OnInit {
  chart = []
  constructor(private _covidAPI: CovidApiService, private router: ActivatedRoute) { }

  width = 550;
  height = 400;

  districtTitle = "COVID-19 information in"
  districtType = 'BarChart';
  districtData = []
  districtGraphOptions = {};

  districtActiveCases = 0;
  districtName = "";
  districtConfirmed = 0
  districtRecovered = 0
  districtDeceased = 0
  districtObject = {}
  stateName = ""

  myControl = new FormControl();
  stateoptions: string[] = [];
  filteredOptions: Observable<string[]>;

  ngOnInit(): void {

    this.stateName = this.router.snapshot.params.name;

    this._covidAPI.getStates().subscribe(
      (res) => {

        let districtsObj = res[this.stateName]["districtData"]
        this.districtObject = districtsObj
        this.stateoptions = Object.keys(districtsObj)
        this.districtData = [
          ["Active", districtsObj[this.stateoptions[0]].active],
          ["Confirmed", districtsObj[this.stateoptions[0]].confirmed],
          ["Recovered", districtsObj[this.stateoptions[0]].recovered],
          ["Deceased", districtsObj[this.stateoptions[0]].deceased]
        ]
        this.districtTitle = "COVID-19 information in " + this.stateoptions[0];
        });

      this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.stateoptions.filter(option => option.toLowerCase().includes(filterValue));
  }

  onStateChange(event) {
    // console.log(event.source["_element"]["nativeElement"]["outerText"])
    // console.log(this.districtObject)
    this.districtData = [
      ["Active", this.districtObject[event.source["_element"]["nativeElement"]["outerText"]].active],
      ["Confirmed", this.districtObject[event.source["_element"]["nativeElement"]["outerText"]].confirmed],
      ["Recovered", this.districtObject[event.source["_element"]["nativeElement"]["outerText"]].recovered],
      ["Deceased", this.districtObject[event.source["_element"]["nativeElement"]["outerText"]].deceased]
    ]
    this.districtTitle = "COVID-19 information in " + event.source["_element"]["nativeElement"]["outerText"] + " District"
  }
}

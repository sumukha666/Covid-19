import { Component, OnInit } from "@angular/core";
import { CovidApiService } from "../../services/covid-api.service";
import { FormControl } from "@angular/forms";
import { Observable } from "rxjs";
import { map, startWith } from "rxjs/operators";
@Component({
  selector: "app-graphs",
  templateUrl: "./graphs.component.html",
  styleUrls: ["./graphs.component.scss"],
})
export class GraphsComponent implements OnInit {
  chart = [];
  constructor(private _covidAPI: CovidApiService) {}

  title = "Number of COVID-19 confirmed cases";
  type = "LineChart";
  recoveredData = [];
  confirmData = [];
  deceasedData = [];
  data = [];
  //columnNames = ['Browser', 'Percentage'];
  options = {
    colors: ["#e0440e", "#e6693e", "#ec8f6e", "#f3b49f", "#f6c7b6"],
    is3D: true,
    hAxis: {
      title: "Date",
    },
    // vAxis: {
    //   title: 'Number of COVID-19 confirmed cases'
    // },
    pointSize: 5,
    crosshair: {
      color: "#000000",
      trigger: "selection",
    },
  };
  width =
    window.innerWidth > 1279
      ? window.innerWidth * 0.3
      : window.innerWidth * 0.8;
  height =
    window.innerWidth > 1279
      ? window.innerHeight * 0.4
      : window.innerHeight * 0.35;

  stateTitle = "COVID-19 information in";
  stateType = "BarChart";
  stateData = [];
  stateGraphOptions = {};

  stateActiveCases = 0;
  stateName = "";
  stateConfirmed = 0;
  stateRecovered = 0;
  stateDeceased = 0;
  stateObject = {};

  myControl = new FormControl();
  stateoptions: string[] = [];
  filteredOptions: Observable<string[]>;

  isGraphError = false;
  isStateGraphError = false;
  ngOnInit(): void {
    this._covidAPI.getCasesByDate().subscribe(
      (res) => {
        res["cases_time_series"].forEach((element) => {
          this.confirmData.push([element["date"], +element["totalconfirmed"]]);
          this.data.push([element["date"], +element["totalconfirmed"]]);
          this.deceasedData.push([element["date"], +element["totaldeceased"]]);
          this.recoveredData.push([
            element["date"],
            +element["totalrecovered"],
          ]);
        });
        this.initilizeDailyGraphData(this.confirmData);
      },
      (err) => {
        this.isGraphError = true;
      }
    );

    this._covidAPI.getStates().subscribe(
      (res) => {
        Object.keys(res).forEach((key) => {
          if (key !== "State Unassigned") {
            this.stateName = key;
            Object.keys(res[key]).forEach((district) => {
              if (district === "districtData") {
                Object.keys(res[key][district]).forEach((city) => {
                  this.stateActiveCases =
                    this.stateActiveCases + res[key][district][city]["active"];
                  this.stateConfirmed =
                    this.stateConfirmed + res[key][district][city]["confirmed"];
                  this.stateRecovered =
                    this.stateRecovered + res[key][district][city]["recovered"];
                  this.stateDeceased =
                    this.stateDeceased + res[key][district][city]["deceased"];
                });
              }
            });
            this.stateTitle = "COVID-19 information in Karnataka State";
            this.stateObject[this.stateName] = {
              active: this.stateActiveCases,
              recovered: this.stateRecovered,
              deceased: this.stateDeceased,
              confirmed: this.stateConfirmed,
            };
          }
        });
        this.stateData = [
          ["Active", this.stateObject["Karnataka"].active],
          ["Confirmed", this.stateObject["Karnataka"].confirmed],
          ["Recovered", this.stateObject["Karnataka"].recovered],
          ["Deceased", this.stateObject["Karnataka"].deceased],
        ];
        //console.log(this.stateObject)
        this.stateoptions = Object.keys(this.stateObject);
      },
      (err) => {
        this.isStateGraphError = true;
      }
    );

    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(""),
      map((value) => this._filter(value))
    );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.stateoptions.filter((option) =>
      option.toLowerCase().includes(filterValue)
    );
  }

  onOptionSelect(event) {
    let words = event.split(" ");
    this.data = this[words[0]];
    this.title = `Number of COVID-19 ${words[1]} ${words[2]}`;
  }
  last15Days(event) {
    this.data = this.data.slice(this.data.length - 15, this.data.length);
    this.title = this.title.includes(" in last 15 days")
      ? this.title
      : this.title + " in last 15 days";
  }
  initilizeDailyGraphData(data) {
    this.data = data;
  }

  onStateChange(event) {
    this.stateData = [
      ["Active", this.stateObject[event.option.value].active],
      ["Confirmed", this.stateObject[event.option.value].confirmed],
      ["Recovered", this.stateObject[event.option.value].recovered],
      ["Deceased", this.stateObject[event.option.value].deceased],
    ];
    this.stateTitle =
      "COVID-19 information in " + event.option.value + " State";
  }
}

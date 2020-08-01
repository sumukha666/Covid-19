import { Component, OnInit } from '@angular/core';
import { CovidApiService } from '../../services/covid-api.service';

@Component({
  selector: 'app-page-layout',
  templateUrl: './page-layout.component.html',
  styleUrls: ['./page-layout.component.scss']
})
export class PageLayoutComponent implements OnInit {

  constructor(private _covidAPI: CovidApiService) { }

  ngOnInit(): void {
    this.getStates()
  }
  getStates(){
    // this._covidAPI.getStates().subscribe(
    //   res => console.log(res),
    //   err => console.log(err)
    // )
    this._covidAPI.getStates().subscribe(
      res=> console.log(res)
    )
  }

}

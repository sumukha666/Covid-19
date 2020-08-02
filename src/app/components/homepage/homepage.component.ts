import { map } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { CovidApiService } from '../../services/covid-api.service'
@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit {

  constructor(private _covidAPI: CovidApiService) { }
  columnsToDisplay = ["State", "Confirmed", "Active", "Recovered", "Deceased"];
  ngOnInit(): void {

    }

}

import { Component, OnInit } from '@angular/core';
import { CovidApiService } from '../../services/covid-api.service'
@Component({
  selector: 'app-graphs',
  templateUrl: './graphs.component.html',
  styleUrls: ['./graphs.component.scss']
})
export class GraphsComponent implements OnInit {
  chart = []
  constructor(private _covidAPI: CovidApiService) { }

  title = 'Number of COVID-19 confirmed cases';
   type = 'LineChart';
   recoveredData=[]
   confirmData=[]
   deceasedData=[]
   data = [
   ];
   //columnNames = ['Browser', 'Percentage'];
   options = {    
    colors: ['#e0440e', '#e6693e', '#ec8f6e', '#f3b49f', '#f6c7b6'], 
    is3D: true,
    hAxis: {
      title: 'Date'
   },
   vAxis:{
      title: 'Number of COVID-19 confirmed cases'
   },
 pointSize:5,
 crosshair:{
  color:'#000000',
  trigger:'selection'  
 }
   };
   width = 550;
   height = 400;

  ngOnInit(): void {
    this._covidAPI.getCasesByDate().subscribe(
      (res)=>{
        res["cases_time_series"].forEach(element => {
          console.log(element)
          this.confirmData.push([element["date"], +element["totaldeceased"]])
          this.data.push([element["date"], +element["totalconfirmed"]]);
          this.deceasedData.push([element["date"], +element["totaldeceased"]])
          this.recoveredData.push([element["date"], +element["totalrecovered"]])
        })
      }
    )
  }

  onClickConfimButton(event){
    this.data=this.confirmData;
    this.title ='Number of COVID-19 Confirmed cases'
  }
  onClickRecoveredButton(event){
    this.data=this.recoveredData;
    this.title ='Number of COVID-19 Recovered cases'
  }
  onClickDeceasedButton(event){
    this.data=this.deceasedData;
    this.title ='Number of COVID-19 Deceased cases'
  }
  last15Days(event){

    this.data=this.data.slice( this.data.length-15,this.data.length);
    this.title= this.title+" in last 15 days"
  }
}

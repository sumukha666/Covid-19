import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class CovidApiService {
  private _registerUrl = "https://api.covid19india.org"; 
  constructor(private http: HttpClient) { }
  getStates() {
    return this.http.get<any>(this._registerUrl+"/state_district_wise.json");
  }
  getCasesByDate(){
    return this.http.get<any>(this._registerUrl+"/data.json");
  }
}

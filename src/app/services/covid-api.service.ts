import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class CovidApiService {
  private _registerUrl = "https://api.covid19india.org/state_district_wise.json"
  constructor(private http: HttpClient) { }
  getStates() {
    return this.http.get<any>(this._registerUrl);
  }
}

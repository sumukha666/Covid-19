import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router'
@Component({
  selector: 'app-states',
  templateUrl: './states.component.html',
  styleUrls: ['./states.component.scss']
})
export class StatesComponent implements OnInit {

  constructor(private router: ActivatedRoute) { }
  stateName
  columnsToDisplay = ["District", "Confirmed", "Active", "Recovered", "Deceased"];
  ngOnInit(): void {
    console.log(this.router.snapshot.params)
    this.stateName = this.router.snapshot.params.name
  }

}

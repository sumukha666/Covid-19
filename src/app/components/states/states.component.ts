import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router'
@Component({
  selector: 'app-states',
  templateUrl: './states.component.html',
  styleUrls: ['./states.component.scss']
})
export class StatesComponent implements OnInit {

  constructor(private router: ActivatedRoute) { }
  gotoRoute
  ngOnInit(): void {
    console.log(this.router.snapshot.params)
    this.gotoRoute = this.router.snapshot.params.name
  }

}

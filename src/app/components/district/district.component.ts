import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router'
@Component({
  selector: 'app-district',
  templateUrl: './district.component.html',
  styleUrls: ['./district.component.scss']
})
export class DistrictComponent implements OnInit {

  constructor(private router: ActivatedRoute) { }

  ngOnInit(): void {
    console.log(this.router.snapshot.params)
  }

}

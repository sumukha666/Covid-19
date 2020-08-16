import { Component, Input, OnInit, Output, EventEmitter } from "@angular/core";
import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import { Observable } from "rxjs";
import { map, shareReplay } from "rxjs/operators";
import { Router } from "@angular/router";

@Component({
  selector: "app-header-nav",
  templateUrl: "./header-nav.component.html",
  styleUrls: ["./header-nav.component.scss"],
})
export class HeaderNavComponent implements OnInit {
  @Input() columnsToDisplay;
  @Input() stateNameToDisplay;
  @Input() showStateGraph;
  @Input() displayBackButton;
  @Input() backToUrl;
  ngOnInit() {}
  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareReplay()
    );

  constructor(
    private breakpointObserver: BreakpointObserver,
    private route: Router
  ) {}

  onClickBackButton() {
    this.route.navigate([this.backToUrl]);
  }
}

import { Component, OnInit, EventEmitter, Output } from "@angular/core";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  @Output() toggleSideNav = new EventEmitter<void>();
  constructor() { }

  ngOnInit() {
  }

  onToggleSideNav() {
    this.toggleSideNav.emit();
  }

}

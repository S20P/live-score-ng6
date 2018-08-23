import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/timer';
@Component({
  selector: 'app-our-apps',
  templateUrl: './our-apps.component.html',
  styleUrls: ['./our-apps.component.css']
})
export class OurAppsComponent implements OnInit {

  public showloader: boolean = false;
  private timer: Observable<any>;
  constructor() { }
  ngOnInit() {
    this.setTimer();
  }
  public setTimer() {
    this.showloader = true;
    this.timer = Observable.timer(2000); // 5000 millisecond means 5 seconds
    this.timer.subscribe(() => {
      this.showloader = false;
    });
  }

}

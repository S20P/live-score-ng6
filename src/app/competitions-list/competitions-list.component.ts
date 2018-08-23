
import { Component, OnInit, Pipe, PipeTransform } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { MatchService } from '../service/match.service';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/timer';
import { OrderPipe } from 'ngx-order-pipe';

@Component({
  selector: 'app-competitions-list',
  templateUrl: './competitions-list.component.html',
  styleUrls: ['./competitions-list.component.css']
})
export class CompetitionsListComponent implements OnInit {

  public Competition_list = [];
  public Competition_flag: any;

  public showloader: boolean = false;
  private subscription: Subscription;
  private timer: Observable<any>;
  public array_length: any;


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private matchService: MatchService,
    private orderPipe: OrderPipe
  ) {
    this.Competition_flag = "assets/img/avt_flag.png";
    this.array_length = 1;
  }

  ngOnInit() {
    this.setTimer();
    this.Competition_list = [];
    this.GetAllCompetitions_list();
  }

  GetAllCompetitions_list() {
    this.showloader = true;
    this.Competition_list = [];
    this.matchService.GetAllLeague().subscribe(data => {
      console.log("GetAllCompetitions_list", data);
      var result = data['data'];
      if (result !== undefined) {
        for (let item of result) {
          this.Competition_list.push(item);
        }
        this.array_length = this.Competition_list.length;
        this.showloader = false;
      }
      else {
        this.array_length = 0;
        console.log("array_length is 0");
        this.showloader = false;
      }
    });
    console.log("ALL Competition_list***", this.Competition_list);
  }

  CompetitionDetails(comp_id) {
    console.log("going to CompetitionDetails page...", comp_id);
    this.router.navigate(['/competition', comp_id]);
  }

  public setTimer() {
    this.showloader = true;
    this.timer = Observable.timer(2000); // 5000 millisecond means 5 seconds
    this.subscription = this.timer.subscribe(() => {
      this.showloader = false;
    });
  }

}

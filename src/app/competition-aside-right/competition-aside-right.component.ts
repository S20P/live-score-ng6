
import { Component, OnInit, Pipe, PipeTransform } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { MatchService } from '../service/match.service';
import 'rxjs/add/observable/timer';
import { OrderPipe } from 'ngx-order-pipe';
import { JsCustomeFunScriptService } from '../service/jsCustomeFun/jsCustomeFunScript.service';
import { MatchesApiService } from '../service/live_match/matches-api.service';

@Component({
  selector: 'app-competition-aside-right',
  templateUrl: './competition-aside-right.component.html',
  styleUrls: ['./competition-aside-right.component.css']
})
export class CompetitionAsideRightComponent implements OnInit {

  match_ground_details = [];
  public comp_id: any;
  public competition_name: any;
  public currentdaydate: any;
  public localtimezone: any;
  public array_length: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private matchService: MatchService,
    private orderPipe: OrderPipe,
    private jsCustomeFun: JsCustomeFunScriptService,
    private liveMatchesApiService: MatchesApiService,

  ) {
    // this.flage_baseUrl = "/assets/img/TeamFlage/";
    this.localtimezone = this.jsCustomeFun.LocalTimeZone();
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.comp_id = parseInt(params.get("id"));
    });

    this.liveMatchesApiService.liveMatches().subscribe(data => {
      this.GetMatchesByCompetition_ById_live();
    });
    this.array_length = 1;

  }

  ngOnInit() {
    console.log("-------------------aside-----------------");
    var dateofday = Date();
    var currentdaydate = this.jsCustomeFun.ChangeDateFormat(dateofday);
    this.currentdaydate = currentdaydate;
    console.log("Todays Date is ", this.currentdaydate);
    this.GetAllCompetitions(this.currentdaydate);


    this.matchService.GetAllLeague().subscribe(data => {
      console.log("GetAllCompetitions_list", data);
      var result = data['data'];
      if (result !== undefined) {
        for (let item of result) {
          if (item.id == this.comp_id) {
            this.competition_name = item.name;
          }
        }
      }
    });
  }


  GetAllCompetitions(selected) {

    this.match_ground_details = [];
    for (let i = 0; i < this.match_ground_details['length']; i++) {
      this.match_ground_details.splice(i, 1);
    }


    var param = {
      "date": selected,
      "localtimezone": this.localtimezone
    }
    this.matchService.GetAllCompetitionMatchesByDate(param).subscribe(record => {
      console.log("record by selected Date", record);
      var result: any = record['data'];
      var self = this;
      if (result !== undefined) {
        var array = result,
          groups = Object.create(null),
          grouped = [];

        array.forEach(function (item) {
          var collection: any = self.jsCustomeFun.HandleDataofAPI(item);
          var competitions = collection['competitions'];
          if (competitions !== "") {
            if (competitions.id == self.comp_id) {
              if (!groups[competitions.id]) {
                groups[competitions.id] = [];
                grouped.push({ competitions: competitions, group: groups[competitions.id] });
              }
              if (groups[competitions.id].length <= 10) {
                groups[competitions.id].push({
                  "id": collection['id'],
                  "comp_id": collection['league_id'],
                  "week": collection['week'],
                  "venue_id": collection['venue_id'],
                  "venue": collection["venue"],
                  "venue_city": collection["venue_city"],
                  "localteam_id": collection['localteam_id'],
                  "localteam_name": collection['localteam_name'],
                  "localteam_image": collection['localteam_image'],
                  "localteam_score": collection["localteam_score"],
                  "ltScore_highest": collection["ltScore_highest"],
                  "lats_score_local": collection["lats_score_local"],
                  "penalty_local": collection["penalty_local"],
                  "visitorteam_id": collection['visitorteam_id'],
                  "visitorteam_name": collection['visitorteam_name'],
                  "visitorteam_image": collection['visitorteam_image'],
                  "visitorteam_score": collection["visitorteam_score"],
                  "vtScore_highest": collection["vtScore_highest"],
                  "lats_score_vist": collection["lats_score_vist"],
                  "penalty_visitor": collection["penalty_visitor"],
                  "penalty_localvist": collection["penalty_localvist"],
                  "agg_localvist": collection['agg_localvist'],
                  "status": collection["status"],
                  "time": collection["match_time"],
                  "formatted_date": collection["match_time"],
                  "competitions": competitions,
                  "live_status": collection["live_status"],
                  "score_status_flage": collection["score_status_flage"]
                });
              }
            }
          }
        });
        console.log("grouped", grouped);
        this.match_ground_details = grouped;
        this.array_length = this.match_ground_details.length;
      }
      else {
        this.array_length = 0;
        console.log("array_length is 0");
      }

    })
    console.log("All Tops Matches by week are", this.match_ground_details);
  }



  GetMatchesByCompetition_ById_live() {

    let current_matchId;
    this.liveMatchesApiService.liveMatches().subscribe(record => {
      // console.log("Live-Matches-data", data);
      var result = record['data'];
      console.log("live data", result['events']);
      var result_events = result.events;
      if (result_events !== undefined) {

        current_matchId = result_events['id'];
        var item = result_events;
        for (let j = 0; j < this.match_ground_details['length']; j++) {
          console.log("**", this.match_ground_details[j]);
          var group = this.match_ground_details[j].group;

          for (let i = 0; i < group['length']; i++) {
            if (group[i].id == current_matchId) {
              var collection: any = this.jsCustomeFun.HandleDataofAPI(item);
              group[i]['id'] = collection['id'];
              group[i]['status'] = collection["status"];
              group[i]['live_status'] = collection["live_status"];
              group[i]['localteam_score'] = collection["localteam_score"];
              group[i]['visitorteam_score'] = collection["visitorteam_score"];
              group[i]['score_status_flage'] = collection["score_status_flage"];
              group[i]['ltScore_highest'] = collection["ltScore_highest"];
              group[i]['vtScore_highest'] = collection["vtScore_highest"];
              //agg---
              group[i]['lats_score_local'] = collection["lats_score_local"];
              group[i]['lats_score_vist'] = collection["lats_score_vist"];
              group[i]['agg_localvist'] = collection['agg_localvist'];
              //end egg           
            }
          }
        }
      }
    });

    console.log("match_ground_details", this.match_ground_details);

  }


  matchdetails(id) {
    this.router.navigate(['/matches', id]);
  }
  AllMatchList() {
    this.router.navigate(['/matches']);
  }


}

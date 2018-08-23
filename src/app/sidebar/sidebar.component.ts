import {
  Component,
  OnInit
} from '@angular/core';
import { MatchesApiService } from '../service/live_match/matches-api.service';
import { MatchService } from '../service/match.service';
import { Router, ActivatedRoute } from '@angular/router';
import 'rxjs/add/observable/timer';
declare var $: any;
import { DatePipe } from '@angular/common';
import { JsCustomeFunScriptService } from '../service/jsCustomeFun/jsCustomeFunScript.service';


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  public match_ground_details = [];
  public currentdaydate: any;
  public localtimezone: any;
  public comp_id: any;
  public array_length: any;

  public show_btn: boolean;
  // public flage_baseUrl: any;
  constructor(private matchesApiService: MatchesApiService,
    private matchService: MatchService,
    private router: Router,
    private route: ActivatedRoute,
    public datepipe: DatePipe,
    private liveMatchesApiService: MatchesApiService,
    private jsCustomeFun: JsCustomeFunScriptService

  ) {
    // this.flage_baseUrl = "/assets/img/TeamFlage/";
    this.localtimezone = this.jsCustomeFun.LocalTimeZone();
    this.array_length = 1;
    this.show_btn = false;
  }

  ngOnInit() {
    console.log("sidebar ini");
    this.match_ground_details = [];
    var dateofday = Date();
    var currentdaydate = this.jsCustomeFun.ChangeDateFormat(dateofday);
    this.liveMatchesApiService.liveMatches().subscribe(data => {
      this.GetMatchesByCompetition_ById_live();
    });
    //console.log("today side bar", currentdaydate);
    this.GetMatchesByDate(currentdaydate);
    this.currentdaydate = currentdaydate;
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



  GetMatchesByDate(selected) {
    this.match_ground_details = [];
    for (let i = 0; i < this.match_ground_details['length']; i++) {
      this.match_ground_details.splice(i, 1);
    }

    var param = {
      "date": selected,
      "localtimezone": this.localtimezone
    }

    this.matchService.GetAllCompetitionMatchesByDate(param).subscribe(record => {
      //console.log("record by selected Date", record);
      var result: any = record['data'];
      var self = this;
      if (result !== undefined) {
        var array = result,
          groups = Object.create(null),
          grouped = [];

        array.forEach(function (item, index) {

          var collection: any = self.jsCustomeFun.HandleDataofAPI(item);
          var competitions = collection['competitions'];
          self.comp_id = collection['league_id'];
          if (competitions !== "") {
            console.log("competitions.id", competitions.id);
            if (!groups[competitions.id]) {
              groups[competitions.id] = [];
              if (grouped.length < 6) {
                grouped.push({ competitions: competitions, group: groups[competitions.id] });
                console.log("grouped -", grouped);
              }
            }
            console.log("groups--", groups[competitions.id]);
            if (groups[competitions.id].length < 1) {
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
        });
        //console.log("grouped", grouped);
        var sortedArrayOfleague: any = this.jsCustomeFun.ordereLeaguebylist(grouped);
        this.match_ground_details = sortedArrayOfleague;
        this.array_length = this.match_ground_details.length;
        if (this.array_length > 0) {
          this.show_btn = true;
        }
      }
      else {
        this.array_length = 0;
      }
    })
    //console.log("filter-date_data", this.match_ground_details);
  }

  CompetitionDetails(comp_id) {
    this.router.navigate(['/competition', comp_id]);
  }

  matchdetails_go(id) {
    this.router.navigate(['/matches', id]);
  }

  AllMatchList() {
    this.router.navigate(['/matches']);
  }


}

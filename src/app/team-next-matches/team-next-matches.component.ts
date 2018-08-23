import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { MatchService } from '../service/match.service';
import 'rxjs/add/observable/timer';
import { DatePipe } from '@angular/common';
import { MatchesApiService } from '../service/live_match/matches-api.service';
import { JsCustomeFunScriptService } from '../service/jsCustomeFun/jsCustomeFunScript.service';

@Component({
  selector: 'app-team-next-matches',
  templateUrl: './team-next-matches.component.html',
  styleUrls: ['./team-next-matches.component.css']
})
export class TeamNextMatchesComponent implements OnInit {

  public NextMatchesTeam = [];
  public team_id: any;
  public team_name: any;
  public team_flage: any;
  public flage_baseUrl: any;
  public array_length: any;

  // pagination-----
  public pages_Total: any;
  public page_length: any;
  public selected_page: any;
  p: number = 1;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private matchService: MatchService,
    public datepipe: DatePipe,
    private liveMatchesApiService: MatchesApiService,
    private jsCustomeFun: JsCustomeFunScriptService

  ) {

    this.flage_baseUrl = "/assets/img/TeamFlage/";
    this.route.paramMap.subscribe((params: ParamMap) => {
      let id = parseInt(params.get("id"));
      this.team_id = id;
      let team_name = params.get("team_name");
      this.team_name = team_name;
    });

    this.liveMatchesApiService.liveMatches().subscribe(data => {
      this.GetMatchesByCompetition_ById_live();
    });
    this.array_length = 1;
    this.page_length = 0;
  }


  ngOnInit() {
    this.team_flage = this.flage_baseUrl + this.team_id + ".png";
    this.NextMatchesTeam = [];
    var pageNo = 1;
    this.GetNextMatches(pageNo);
  }

  GetNextMatches(pageNo) {
    this.selected_page = pageNo;
    console.log("selected page no is", pageNo);
    this.NextMatchesTeam = [];

    for (let i = 0; i < this.NextMatchesTeam['length']; i++) {
      this.NextMatchesTeam.splice(i, 1);
    }
    this.matchService.GetNextMatchesTeamById(this.team_id, pageNo).subscribe(record => {
      console.log("record by selected page", record);
      var self = this;
      self.page_length = record['pages'];

      self.pages_Total = self.jsCustomeFun.range(1, self.page_length);
      console.log("total page is", self.pages_Total);
      var result: any = record['data'];

      if (result !== undefined) {
        var array = result,
          groups = Object.create(null),
          grouped = [];

        array.forEach(function (item) {
          var collection: any = self.jsCustomeFun.HandleDataofAPI(item);
          var competitions = collection['competitions'];
          if (competitions !== "") {
            if (!groups[competitions.id]) {
              groups[competitions.id] = [];
              grouped.push({ competitions: competitions, group: groups[competitions.id] });
            }
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
        });
        console.log("grouped", grouped);
        var sortedArrayOfleague: any = this.jsCustomeFun.ordereLeaguebylist(grouped);
        this.NextMatchesTeam = sortedArrayOfleague;
        this.array_length = this.NextMatchesTeam.length;
      }
      else {
        this.array_length = 0;
      }

    })

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
        for (let j = 0; j < this.NextMatchesTeam['length']; j++) {
          console.log("**", this.NextMatchesTeam[j]);
          var group = this.NextMatchesTeam[j].group;

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

    console.log("NextMatchesTeam", this.NextMatchesTeam);

  }

  CompetitionDetails(comp_id) {
    console.log("going to CompetitionDetails page...", comp_id);
    this.router.navigate(['/competition', comp_id]);
  }

  matchdetails(id) {
    this.router.navigate(['/matches', id]);
  }


}

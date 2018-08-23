import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { MatchService } from '../service/match.service';
import 'rxjs/add/observable/timer';
import { DatePipe } from '@angular/common';
import { JsCustomeFunScriptService } from '../service/jsCustomeFun/jsCustomeFunScript.service';
@Component({
  selector: 'app-team-previous-matches',
  templateUrl: './team-previous-matches.component.html',
  styleUrls: ['./team-previous-matches.component.css']
})
export class TeamPreviousMatchesComponent implements OnInit {
  public PreviousMatchesTeam = [];
  public team_id: any;
  public team_name: any;
  public team_flage: any;
  public flage_baseUrl: any;
  public array_length: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private matchService: MatchService,
    public datepipe: DatePipe,
    private jsCustomeFun: JsCustomeFunScriptService

  ) {
    this.flage_baseUrl = "/assets/img/TeamFlage/";
    this.route.paramMap.subscribe((params: ParamMap) => {
      let id = parseInt(params.get("id"));
      this.team_id = id;
      let team_name = params.get("team_name");
      this.team_name = team_name;
    });
    this.array_length = 1;

  }


  ngOnInit() {

    this.team_flage = this.flage_baseUrl + this.team_id + ".png";
    this.PreviousMatchesTeam = [];
    this.GetPreviousMatches();

  }


  GetPreviousMatches() {
    this.PreviousMatchesTeam = [];

    for (let i = 0; i < this.PreviousMatchesTeam['length']; i++) {
      this.PreviousMatchesTeam.splice(i, 1);
    }

    let team_id = this.team_id;
    this.matchService.GetPreviousMatchesTeamById(team_id).subscribe(record => {
      console.log("record GetPreviousMatchesTeamById", record);
      var result: any = record['data'];
      var self = this;
      if (result !== undefined) {
        var array = result,
          groups = Object.create(null),
          grouped = [];

        array.forEach(function (item) {
          var collection: any = self.jsCustomeFun.HandleDataofAPI(item);
          //LocalTeam Data---------------------------------------------------------
          var localteam_id: any = collection['localteam_id'];
          //visitorTeam Data--------------------------------------------------------
          var visitorteam_id: any = collection['visitorteam_id'];
          //scores----------------------------------------------------------------------
          var localteam_score: any = collection["localteam_score"];
          var visitorteam_score: any = collection["visitorteam_score"];

          var competitions = collection['competitions'];


          var team_w = false;
          var team_l = false;
          var team_d = false;

          if (team_id == localteam_id) {
            if (localteam_score > visitorteam_score) {
              team_w = true;
              team_l = false;
            }
            if (localteam_score < visitorteam_score) {
              team_l = true;
              team_w = false;
            }
            if (localteam_score == visitorteam_score) {
              team_d = true;
            }
          }

          if (team_id == visitorteam_id) {
            if (visitorteam_score > localteam_score) {
              team_w = true;
              team_l = false;
            }
            if (visitorteam_score < localteam_score) {
              team_l = true;
              team_w = false;
            }
            if (localteam_score == visitorteam_score) {
              team_d = true;
            }
          }


          //end Win and loss----------------------------------------------------------

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
              "score_status_flage": collection["score_status_flage"],
              "team_w": team_w,
              "team_l": team_l,
              "team_d": team_d,
            });
          }
        });
        console.log("grouped", grouped);
        var sortedArrayOfleague: any = this.jsCustomeFun.ordereLeaguebylist(grouped);
        this.PreviousMatchesTeam = sortedArrayOfleague;
        this.array_length = this.PreviousMatchesTeam.length;
      }
      else {
        this.array_length = 0;
      }

    })
  }

  matchdetails(id) {
    this.router.navigate(['/matches', id]);
  }
  CompetitionDetails(comp_id) {
    console.log("going to CompetitionDetails page...", comp_id);
    this.router.navigate(['/competition', comp_id]);
  }

}

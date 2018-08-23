
import { Component, OnInit, Pipe, PipeTransform, Input } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { MatchService } from '../service/match.service';
import 'rxjs/add/observable/timer';
import { OrderPipe } from 'ngx-order-pipe';
import { JsCustomeFunScriptService } from '../service/jsCustomeFun/jsCustomeFunScript.service';
@Component({
  selector: 'app-competition-teams',
  templateUrl: './competition-teams.component.html',
  styleUrls: ['./competition-teams.component.css']
})
export class CompetitionTeamsComponent implements OnInit {
  public teams_collection = [];
  public comp_id: any;
  public competition_name: any;
  public season: any;
  public array_length: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private matchService: MatchService,
    private orderPipe: OrderPipe,
    private jsCustomeFun: JsCustomeFunScriptService
  ) {
    this.array_length = 1;
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.comp_id = parseInt(params.get("id"));
    });
  }
  @Input()
  set SelectedSeason(message: number) {
    this.filterData(message);
  }

  ngOnInit() {

  }

  filterData(season_id) {
    if (season_id) {
      this.GetAllTopTeamByLeagueId(season_id);
    }
  }

  GetAllTopTeamByLeagueId(season_id) {
    var season_id = season_id;
    this.teams_collection = [];
    var self = this;
    this.matchService.GetAllTopTeamByLeagueId(this.comp_id, season_id).subscribe(data => {
      console.log("GetAllTopTeamByCompId", data);
      var result = data['data'];
      if (result !== undefined) {
        console.log("topteam-data-length", result.length);

        var array = result,
          groups = Object.create(null),
          grouped = [];
        array.forEach(function (item) {
          var type = item.type;

          if (type == "goal") {
            type = "Goal";
          }
          else if (type == "yellowcard") {
            type = "Yellowcard";
          }
          else if (type == "redcard") {
            type = "Redcard";
          }
          else if (type == "yellowred") {
            type = "Yellowred";
          }
          else if (type == "missed_penalty") {
            type = "Penalty missed";
          }
          else if (type == "substitution") {
            type = "Substitution";
          }
          else if (type == "own-goal") {
            type = "Own goal";
          }
          else {
            type = item.type;
          }

          var detailsOfTeam = item.data;


          if (!groups[type]) {
            groups[type] = [];
            grouped.push({ type: type, group: groups[type] });
          }
          for (let teams of detailsOfTeam) {

            groups[type].push({
              "team_id": teams['team_id'],
              "team_name": teams['team_name'],
              "count": teams['count'],
              "team_flag": teams['logo_path']
            });
          }
        });

        var sortedArrayOfevents: any = this.jsCustomeFun.orderEventsbylist(grouped);

        this.teams_collection = sortedArrayOfevents;
        this.array_length = this.teams_collection.length;
      }
      else {
        this.array_length = 0;
        console.log("array_length is 0");
      }

    });
  }
  teamdetails(team_id) {
    this.router.navigate(['/team', team_id]);
  }
}

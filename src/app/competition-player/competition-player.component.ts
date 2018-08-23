
import { Component, OnInit, Pipe, PipeTransform, Input } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { MatchService } from '../service/match.service';
import 'rxjs/add/observable/timer';
import { OrderPipe } from 'ngx-order-pipe';
import { JsCustomeFunScriptService } from '../service/jsCustomeFun/jsCustomeFunScript.service';
@Component({
  selector: 'app-competition-player',
  templateUrl: './competition-player.component.html',
  styleUrls: ['./competition-player.component.css']
})
export class CompetitionPlayerComponent implements OnInit {

  public player_collection = [];
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
      this.GetAllTopPlayerByLeagueId(season_id);
    }
  }
  GetAllTopPlayerByLeagueId(season_id) {
    var season_id = season_id;
    console.log("season_id", season_id);
    var self = this;
    this.player_collection = [];
    this.matchService.GetAllTopPlayerByLeagueId(this.comp_id, season_id).subscribe(data => {
      console.log("GetAllTopTeamByCompId", data);
      var result = data['data'];

      if (result !== undefined) {

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
            if (teams['player_name'] !== null && teams['player_name'] !== "" && teams['player_id'] !== null && teams['player_id'] !== "") {
              groups[type].push({
                "player_id": teams['player_id'],
                "player_name": teams['player_name'],
                "count": teams['count'],
              });
            }
          }
        });

        var sortedArrayOfevents: any = this.jsCustomeFun.orderEventsbylist(grouped);
        this.player_collection = sortedArrayOfevents;


        console.log("player_group", grouped);
        this.array_length = this.player_collection.length;
      }
      else {
        this.array_length = 0;
        console.log("array_length is 0");
      }

    });

    console.log("All Tops Player are", this.player_collection);
  }
  Playerdetails(player_id) {
    this.router.navigate(['/player', player_id]);
  }
}


import { Component, OnInit, Pipe, PipeTransform, Input } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { MatchService } from '../service/match.service';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/timer';
declare var $: any;
import { OrderPipe } from 'ngx-order-pipe';

import * as moment from 'moment-timezone';
import "moment-timezone";
import { JsCustomeFunScriptService } from '../service/jsCustomeFun/jsCustomeFunScript.service';
import { MatchesApiService } from '../service/live_match/matches-api.service';

@Component({
  selector: 'app-competition-matches',
  templateUrl: './competition-matches.component.html',
  styleUrls: ['./competition-matches.component.css']
})
export class CompetitionMatchesComponent implements OnInit {

  public match_ground_details = [];
  public MatchDropdownList = [];

  public showloader: boolean = false;
  private subscription: Subscription;
  private timer: Observable<any>;
  public list_matches = [];
  public selectedposition: any;
  public array_length: any;
  public season_id: any;
  @Input()
  set SelectedSeason(message: number) {
    this.filterData(message);
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private matchService: MatchService,
    private orderPipe: OrderPipe,
    private jsCustomeFun: JsCustomeFunScriptService,
    private liveMatchesApiService: MatchesApiService,

  ) {
    this.liveMatchesApiService.liveMatches().subscribe(data => {
      this.GetMatchesByCompetition_ById_live();
    });
    this.array_length = 1;
  }

  ngOnInit() {

  }

  filterData(season_id) {
    if (season_id) {
      this.season_id = season_id;
      this.Dropdown_ini(season_id);
      // this.GetAllMatchesBySeasonId(season_id);
    }
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

  Dropdown_ini(season_id) {
    this.MatchDropdownList = [];
    var myarray = [];
    this.matchService.GetAllGroupsBySeasonId(season_id).subscribe(record => {
      console.log("GetAllGroupsBySeasonId---dropdown", record);
      var result: any = record['data'];

      var self = this;
      if (result !== undefined) {
        var newRoundResult = [];
        var index = [];
        for (let i = 0; i < result['length']; i++) {
          if (result[i].sub_round) {
            if (result[i].sub_round['length'] > 0) {
              for (let j = 0; j < result[i].sub_round['length']; j++) {
                var newRound = {};
                newRound['round'] = result[i].sub_round[j];
                newRound['_id'] = result[i].sub_round[j].data.id;
                newRound['round_id'] = result[i].sub_round[j].data.id;
                newRoundResult.push(newRound);

              }
              index.push(i);
            }
          }
        }
        for (let i = 0; i < index['length']; i++) {
          result.splice(index[i], 1);
        }
        for (let i = 0; i < newRoundResult['length']; i++) {
          result.push(newRoundResult[i]);
        }

        for (let item of result) {
          var dt: any;
          var Id: any;
          var islistType: any;
          var week: any = "";
          var stage: any = item['stage'];
          var stage_id: any = item['stage_id'];
          var round_id: any = item['round_id'];
          var round: any = item['round'];
          var time = item['time'];
          var sub_round: any = item['sub_round'];

          if (round) {
            console.log("round list");

            var round_data = round['data'];


            var date_time = round_data.end; //YYYY-MM-DD H:MM:SS
            var match_time = this.jsCustomeFun.ChangeTimeZone(date_time);
            dt = moment(new Date(match_time)).format('YYYY-MM-DD');

            if (round_data !== undefined || round_data['length'] !== 0 || round_data !== null) {
              week = round_data.name;
              var checkstr = $.isNumeric(week);
              islistType = "round";
              if (checkstr == true) {
                week = "Week " + week;
              } else {
                week = week;
              }
              if (week == "") {
                week = "Week all";
              } else {
                week = week;
              }
              console.log("round week", week);
              console.log("round date", dt);
              console.log("round_id", round_id);
            }
          }
          else {
            if (stage) {

              if (time) {
                var st = time.starting_at;
                //    dt = st.date;
                var date_time = st.date; //YYYY-MM-DD H:MM:SS
                var match_time = this.jsCustomeFun.ChangeTimeZone(date_time);
                dt = moment(new Date(match_time)).format('YYYY-MM-DD');
              }
              var stage_data = stage['data'];
              if (stage_data !== undefined || stage_data['length'] !== 0 || stage_data !== null) {
                week = stage_data.name;
                islistType = "stage";
                console.log("round week", week);
                console.log("stage date", dt);
                console.log("stage_id", stage_id);
              }
            }
          }

          if (round_id) {
            if (round_id !== undefined || round_id !== "" || round_id !== null) {
              Id = round_id;
            }
          }
          if (stage_id) {
            if (stage_id !== undefined || stage_id !== "" || stage_id !== null) {
              Id = stage_id;
            }
          }
          myarray.push({
            "Id": Id,
            "date": dt,
            "week": week,
            "islistType": islistType,
          });
        }

        //arraysort by ascending using id number order-----------------
        var sort_array = myarray.sort(function (a, b) {
          var date1 = moment(new Date(a.date + " 00:00:00")).format('YYYY-MM-DD HH:mm:ss');
          var date2 = moment(new Date(b.date + " 00:00:00")).format('YYYY-MM-DD HH:mm:ss');
          var d1 = moment(date1).valueOf();
          var d2 = moment(date2).valueOf();
          return d1 - d2
        });
        //end sort array--------------
        this.MatchDropdownList = sort_array;
        console.log("dropdown-list-short-by asc", sort_array);

        var pos = getTodayWeekPosition(sort_array);
        self.selectedposition = pos;
        console.log("position in dropdown", pos);
        console.log("current selected data is", this.MatchDropdownList[pos]);
        var row = this.MatchDropdownList[pos];
        var paramobject = {
          "islistType": row['islistType'],
          "id": row['Id'],
          "season_id": this.season_id
        }
        this.GetAllMatchesByDropdown(paramobject);
      }
    });

    function getTodayWeekPosition(array) {
      console.log("array in short", array);
      console.log("array in short length", array.length);

      for (let p = 0; p < array['length']; p++) {
        console.log("position is", p);
        console.log("position item is", array[p]);

        console.log("date", array[p].date);
        var dl = array[p].date;
        var date1 = moment(new Date(dl + " 00:00:00")).format('YYYY-MM-DD HH:mm:ss');
        var todays1 = moment(new Date()).format('YYYY-MM-DD');
        var todays = moment(new Date(todays1 + " 00:00:00")).format('YYYY-MM-DD HH:mm:ss');
        console.log("dt1", date1);
        console.log("dt2", todays);
        var d1 = moment(date1).valueOf();
        var d2 = moment(todays).valueOf();
        console.log("d1", d1);
        console.log("d2", d2);

        if (d1 >= d2) {
          return p;
        }
      }
      return array.length > 1 ? array.length - 1 : 0;
    }
  }

  //old api
  GetAllMatchesBySeasonId(season_id) {
    this.showloader = true;

    console.log("sesion_id for mathes", season_id);
    var season_id = season_id;
    var list = [];
    this.match_ground_details = [];

    //old api
    this.matchService.GetAllGroupsBySeasonId(season_id).subscribe(record => {
      console.log("GetAllMatchesByWeek", record);
      if (record['success'] == false) {
        this.array_length = 0;
        console.log("status is false");
      }

      var result: any = record['data'];
      var self = this;
      if (result !== undefined) {
        var array = result.reduce((r, { week, formatted_date }, index, arr) => {
          var data = arr[index];
          var last = r[r.length - 1];

          var collection: any = self.jsCustomeFun.HandleDataofAPI(data);
          var week: any = collection['week'];
          var match_time: any = collection["match_time"];
          var competitions = collection['competitions'];
          var date = moment(new Date(match_time)).format('YYYY-MM-DD');
          var obj = {
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
            "date": date
          };

          if (last && last.week.week === week) {
            last.group.push(obj);
          } else {
            r.push({ week: { week, date }, group: [obj] });
          }
          return r;
        }, []);
        console.log("testest", array);
        var pos = getTodayWeekPosition(array);
        self.selectedposition = pos;
        console.log("pos", pos);
        self.match_ground_details = array;
        self.array_length = array.length;
        console.log("comp_matches_length", self.array_length);
        self.showloader = false;
      }
    });

    function getTodayWeekPosition(array) {
      for (let p = 0; p < array['length']; p++) {
        console.log("item_week", array[p].week);
        var dl = array[p].week.date;
        var date1 = moment(new Date(dl + " 00:00:00")).format('YYYY-MM-DD HH:mm:ss');
        var todays = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
        console.log("GetCurrentPos todays", todays);
        console.log("GetCurrentPos date-from", date1);
        var d1 = moment(date1).valueOf();
        var d2 = moment(todays).valueOf();
        console.log("d1", d1);
        console.log("d2", d2);
        if (p !== 0 && d1 > d2) {
          return p - 1;
        }
      }
      return array.length > 1 ? array.length - 1 : 0;
    }
    console.log("All Tops Matches by week are", this.match_ground_details);

  }


  teamdetails(team_id) {
    this.router.navigate(['/team', team_id]);
  }
  matchdetails(id) {
    this.router.navigate(['/matches', id]);
  }

  onchangefillter_matches(id, islistType, pos) {
    console.log("filter is change", pos);
    this.selectedposition = pos;
    console.log("islistType", islistType);
    console.log("selected list id is", id);
    console.log("current season id is", this.season_id);
    var paramobject = {
      "islistType": islistType,
      "id": id,
      "season_id": this.season_id
    }
    this.GetAllMatchesByDropdown(paramobject);
  }

  GetAllMatchesByDropdown(paramobject) {
    console.log("paramobject to pass", paramobject);
    this.showloader = true;

    var list = [];
    this.match_ground_details = [];

    this.matchService.GetAllMatchesByWeek(paramobject).subscribe(record => {
      console.log("GetAllMatchesByWeek", record);
      if (record['success'] == false) {
        this.array_length = 0;
        console.log("status is false");
      }

      var result: any = record['data'];
      var self = this;
      if (result !== undefined) {
        var array = result,
          groups = Object.create(null),
          grouped = [];

        array.forEach(function (item) {
          var collection: any = self.jsCustomeFun.HandleDataofAPI(item);
          console.log("collection", collection);
          var match_time: any = collection["match_time"];
          var competitions = collection['competitions'];
          var date = moment(new Date(match_time)).format('YYYY-MM-DD');

          console.log("competitions", competitions);
          if (date !== "") {
            if (!groups[date]) {
              groups[date] = [];
              grouped.push({ date: date, group: groups[date] });
            }
            groups[date].push({
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
              "date": date
            });
          }
        });
        console.log("grouped", grouped);
        this.match_ground_details = grouped;
        console.log("length", this.match_ground_details.length);
        this.array_length = this.match_ground_details.length;
        this.showloader = false;
      }
      else {
        this.array_length = 0;
        console.log("array_length is 0");
        this.showloader = false;
      }
    });
    console.log("All Tops Matches by week are", this.match_ground_details);
  }
}

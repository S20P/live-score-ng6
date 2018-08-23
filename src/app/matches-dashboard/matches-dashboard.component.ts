import {
  Component,
  OnInit
} from '@angular/core';
import { MatchesApiService } from '../service/live_match/matches-api.service';
import { MatchService } from '../service/match.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/timer';
declare var $: any;
import { DatePipe } from '@angular/common';
import * as moment from 'moment-timezone';
import "moment-timezone";
import { JsCustomeFunScriptService } from '../service/jsCustomeFun/jsCustomeFunScript.service';

@Component({
  selector: 'app-matches-dashboard',
  templateUrl: './matches-dashboard.component.html',
  styleUrls: ['./matches-dashboard.component.css'],
})

export class MatchesDashboardComponent implements OnInit {
  public paramDate: any;
  public message: string;
  public messages = [];
  public alldaymatch_list = [];
  public comp_id: any;
  public timezone: any;
  public todays_Matches_title: any;
  public localtimezone: any;
  public firstDay_Month: any;
  public lastDay_Month: any;
  public match_ground_details = [];
  public showloader: boolean = false;
  private subscription: Subscription;
  private timer: Observable<any>;
  public array_length: any;
  // public flage_baseUrl: any;

  constructor(
    private matchService: MatchService,
    private router: Router,
    private route: ActivatedRoute,
    public datepipe: DatePipe,
    private liveMatchesApiService: MatchesApiService,
    private jsCustomeFun: JsCustomeFunScriptService,
  ) {
    this.localtimezone = this.jsCustomeFun.LocalTimeZone();
    this.firstDay_Month = this.jsCustomeFun.firstDay_Month();
    this.lastDay_Month = this.jsCustomeFun.lastDay_Month();
    this.array_length = 1;
  }

  ngOnInit() {
    this.match_ground_details = [];
    this.setTimer();
    this.dateSchedule_ini();

    $('#datepicker').datepicker('setDate', 'today');
    var today = $('#datepicker').val();
    this.paramDate = today;

    console.log("today", this.paramDate);
    this.todays_Matches_title = today;

    var dateofday = Date();
    var currentdaydate = this.jsCustomeFun.ChangeDateFormat(dateofday);
    this.GetMatchesByDate(this.paramDate);
    let self = this;
    $("#datepicker").on("change", function () {
      var selected = $(this).val();
      console.log("date is one", selected);
      self.paramDate = selected;
      self.todays_Matches_title = selected;
      console.log("date is currentdaydate", currentdaydate);
      self.GetMatchesByDate(self.paramDate);
    });
    this.liveMatchesApiService.liveMatches().subscribe(data => {
      console.log("APP is now live //socket starting");
      this.GetMatchesByCompetition_ById_live();
    });
    var param = {
      "firstDay": this.firstDay_Month,
      "lastDay": this.lastDay_Month,
      "localtimezone": this.localtimezone
    }
    this.GetAllCompetitionMatchesByMonth(param);
  }

  //Render date in datepicker
  dateSchedule_ini() {
    var self = this;
    var array = this.alldaymatch_list;

    $('#datepicker').datepicker({
      inline: true,
      showOtherMonths: true,
      dateFormat: 'yy-mm-dd',
      dayNamesMin: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      beforeShowDay: function (date) {
        var string = $.datepicker.formatDate('yy-mm-dd', date);
        if (array.indexOf(string) != -1) {
          return [true];
        }
        return [true, "highlight", string];
      },

      onChangeMonthYear: function (dateText, inst, dateob) {

        var navidatedMonth = new Date(dateob.selectedYear, dateob.selectedMonth, dateob.selectedDay)
        var firstDay = new Date(navidatedMonth.getFullYear(), navidatedMonth.getMonth(), 1);
        var lastDay = new Date(navidatedMonth.getFullYear(), navidatedMonth.getMonth() + 1, 0);
        var firstDay_formate = moment(firstDay).format("YYYY-MM-DD");
        var lastDay_formate = moment(lastDay).format("YYYY-MM-DD");
        var param = {
          "firstDay": firstDay_formate,
          "lastDay": lastDay_formate,
          "localtimezone": self.localtimezone
        };
        self.GetAllCompetitionMatchesByMonth(param);
      }
    });
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

  //API GetAllCompetitionMatchesByMonth---

  GetAllCompetitionMatchesByMonth(param) {

    this.matchService.GetAllCompetitionMatchesByMonth(param).subscribe(record => {
      var result: any = record['data'];
      console.log("Date array by month", result);
      if (result !== undefined) {
        for (var k = 0; k < result.length; k++) {
          var fulldate: any = result[k];
          //I have a simple case of pushing unique values into array.
          if (this.alldaymatch_list.indexOf(fulldate) == -1) {
            this.alldaymatch_list.push(fulldate);
          }

        }
        this.loadjquery();
      }
    });

    console.log("short List of Date by Month", this.alldaymatch_list);
  }

  GetMatchesByDate(paramDate) {
    this.showloader = true;
    console.log("selected date is***", paramDate);

    var todays = moment(new Date()).format('YYYY-MM-DD');

    var date1 = moment(new Date(todays + " 00:00:00")).format('YYYY-MM-DD HH:mm:ss');
    var date2 = moment(new Date(paramDate + " 00:00:00")).format('YYYY-MM-DD HH:mm:ss');

    console.log("date1", date1);
    console.log("date2", date2);

    var d1 = moment(date1).valueOf();
    var d2 = moment(date2).valueOf();

    var tosdate_title: any;

    if (d1 == d2) {
      console.log("current date is todays date", paramDate);
      tosdate_title = "Today's Matches";
    } else {
      console.log("current date is not todays date", paramDate);

      tosdate_title = moment(date2, 'YYYY-MM-DD HH:mm:ss').format('MMM DD, YYYY');
    }

    this.todays_Matches_title = tosdate_title;
    this.match_ground_details = [];
    console.log("Selected short date is", paramDate);
    var param = {
      "date": paramDate,
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
          self.comp_id = collection['league_id'];
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
        this.match_ground_details = sortedArrayOfleague;
        console.log("sortedArrayOfMaps_team", sortedArrayOfleague);
        console.log("length", this.match_ground_details.length);
        this.array_length = this.match_ground_details.length;
        this.showloader = false;
      }
      else {
        this.array_length = 0;
        console.log("array_length is 0");
        this.showloader = false;
      }
    })
  }

  CompetitionDetails(comp_id) {
    console.log("going to CompetitionDetails page...", comp_id);
    this.router.navigate(['/competition', comp_id]);
  }

  matchdetails(id) {
    this.router.navigate(['/matches', id]);
    //  this.router.navigate(['/matches',id], { queryParams: comp_id, skipLocationChange: true});
  }

  loadjquery() {
    setTimeout(function () {
      $("#datepicker").datepicker("refresh");
    }, 1);
  }
  public setTimer() {
    this.showloader = true;
    this.timer = Observable.timer(2000); // 5000 millisecond means 5 seconds
    this.subscription = this.timer.subscribe(() => {
      this.showloader = false;
    });
  }
}

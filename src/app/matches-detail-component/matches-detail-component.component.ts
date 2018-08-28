import { Component, OnInit, Pipe, PipeTransform } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { MatchService } from '../service/match.service';
import { MatchesApiService } from '../service/live_match/matches-api.service';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/timer';
import { DatePipe } from '@angular/common';

import { JsCustomeFunScriptService } from '../service/jsCustomeFun/jsCustomeFunScript.service';
import * as moment from 'moment-timezone';
import "moment-timezone";
import { Meta } from '@angular/platform-browser';

@Component(
    {
        selector: 'app-matches-detail-component',
        templateUrl: './matches-detail-component.component.html',
        styleUrls: ['./matches-detail-component.component.css'],

    }
)
export class MatchesDetailComponentComponent implements OnInit {


    public match_detailcollection = [];
    public events_collection = [];
    public localteam_player_lineup = [];
    public visitorteam_player_lineup = [];
    public localteam_player_subs = [];
    public visitorteam_player_subs = [];
    public Commentary_collection = [];
    public match_stats_collection = [];
    public id: any;
    public comp_id: any;
    public ic_event_penalty_scored: any;
    public ic_event_own_goal: any;
    public ic_event_goal: any;

    public status: any;
    public live_matches: boolean;
    public showloader: boolean = false;
    private subscription: Subscription;
    private timer: Observable<any>;

    public season: any;

    public events_collection_length: any;
    public localteam_player_lineup_length: any;
    public visitorteam_player_lineup_length: any;
    public localteam_player_subs_length: any;
    public visitorteam_player_subs_length: any;
    public match_stats_collection_length: any;
    public Commentary_collection_length: any;
    public match_ground_details = [];
    public currentdaydate: any;
    public localtimezone: any;
    public array_length: any;
    public show_btn: boolean;
    showMoreComments = 10;


    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private matchService: MatchService,
        public datepipe: DatePipe,
        private liveMatchesApiService: MatchesApiService,
        private jsCustomeFun: JsCustomeFunScriptService,
        private meta: Meta,

    ) {
        var dateofday = Date();
        this.currentdaydate = this.jsCustomeFun.ChangeDateFormat(dateofday);
        this.ic_event_penalty_scored = false;
        this.ic_event_own_goal = false;
        this.ic_event_goal = false;
        this.live_matches = false;
        this.route.paramMap.subscribe((params: ParamMap) => {
            let id = parseInt(params.get("id"));
            this.id = id;
            this.GetMatchDeatilByMatchId(this.id);
        });
        this.events_collection_length = 1;
        this.localteam_player_lineup_length = 1;
        this.visitorteam_player_lineup_length = 1;
        this.localteam_player_subs_length = 1;
        this.visitorteam_player_subs_length = 1;
        this.match_stats_collection_length = 1;
        this.Commentary_collection_length = 1;
        this.array_length = 1;
        this.localtimezone = this.jsCustomeFun.LocalTimeZone();
        this.show_btn = false;
        this.currentdaydate = this.currentdaydate;

        //HTTP GET for product in catalogue
        // let href = 'https://footzyscore.com' + this.router.url;
        // this.meta.addTags([
        //     { name: 'description', content: 'Title and Meta tags examples' },
        //     { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        //     { name: 'robots', content: 'INDEX, FOLLOW' },
        //     { name: 'author', content: 'ABCD' },
        //     { name: 'keywords', content: 'TypeScript, Angular' },
        //     { name: 'date', content: '2018-06-02', scheme: 'YYYY-MM-DD' },
        //     { httpEquiv: 'Content-Type', content: 'text/html' },
        //     { property: 'og:title', content: "My Text" },
        //     { property: 'og:type', content: "website" },
        //     { property: 'og:url', content: href },
        //     { property: 'og:image', content: "https://footzyscore.com/assets/img/score_bg2.jpg" },
        //     { charset: 'UTF-8' }
        // ]);
        //     console.log("href", href);
    }

    ngOnInit() {

        this.match_detailcollection = [];
        this.events_collection = [];

        this.liveMatchesApiService.liveMatches().subscribe(data => {
            this.GetMatchesByCompetition_ById_live();
            this.GetCommentariesByMatchId_live();
        });

        this.setTimer();
        this.match_ground_details = [];

        this.liveMatchesApiService.liveMatches().subscribe(data => {
            this.GetMatchesByCompetition_ById_live();
        });
        //console.log("today side bar", currentdaydate);

        this.GetMatchesByDate(this.currentdaydate);
        this.currentdaydate = this.currentdaydate;


    }
    public setTimer() {
        this.showloader = true;
        this.timer = Observable.timer(2000);
        this.subscription = this.timer.subscribe(() => {
            this.showloader = false;
        });
    }


    GetMatchesByCompetition_ById_live() {
        let current_matchId;
        this.liveMatchesApiService.liveMatches().subscribe(record => {

            var result = record['data'];
            var result_events = result.events;
            if (result.events !== undefined) {
                current_matchId = result_events['id'];
                var item = result_events;
                for (let i = 0; i < this.match_detailcollection['length']; i++) {
                    if (this.match_detailcollection[i].id == current_matchId) {
                        this.localteam_player_lineup = [];
                        this.visitorteam_player_lineup = [];
                        this.localteam_player_subs = [];
                        this.visitorteam_player_subs = [];
                        this.match_stats_collection = [];
                        this.events_collection = [];
                        var collection: any = this.jsCustomeFun.HandleDataofAPI(item);

                        var id: any = collection['id'];
                        //time---------------------------------------------------------------------
                        var live_status: any = collection["live_status"];
                        var status: any = collection["status"];

                        var visitorteam_id: any = collection['visitorteam_id'];
                        var localteam_id: any = collection['localteam_id'];

                        //scores----------------------------------------------------------------------
                        var localteam_score: any = collection["localteam_score"];
                        var visitorteam_score: any = collection["visitorteam_score"];
                        var score_status_flage: any = collection["score_status_flage"];

                        //Which team is high scores------------------------------------------
                        //*apply class for text-bold=>font-wight:bold if team run is highest
                        var ltScore_highest: any = collection["ltScore_highest"];
                        var vtScore_highest: any = collection["vtScore_highest"];
                        //end scores------------------------------------------

                        this.match_detailcollection[i]['id'] = item.id;
                        this.match_detailcollection[i]['status'] = status;
                        this.match_detailcollection[i]['live_status'] = live_status;
                        this.match_detailcollection[i]['localteam_score'] = localteam_score;
                        this.match_detailcollection[i]['visitorteam_score'] = visitorteam_score;
                        this.match_detailcollection[i]['score_status_flage'] = score_status_flage;

                        //  console.log("start live events======================================================");

                        var events_data: any = item['events'].data;

                        if (events_data !== undefined || events_data['length'] !== 0 || events_data !== null) {
                            for (var e = 0; e < events_data['length']; e++) {
                                var team;
                                if (events_data[e].team_id == localteam_id) {
                                    team = "localteam";
                                }
                                if (events_data[e].team_id == visitorteam_id) {
                                    team = "visitorteam";
                                }

                                var event_result: any;
                                if (events_data[e].result !== null) {
                                    event_result = events_data[e].result
                                }

                                let ic_event_penalty = false;
                                let ic_event_own_goal = false;
                                let ic_event_goal = false;
                                let ic_event_yellow_card = false;
                                let ic_event_substitution = false;
                                let ic_event_yellowred = false;
                                let ic_event_missed_penalty = false;
                                let ic_event_pen_shootout_goal = false;
                                let ic_event_pen_shootout_miss = false;
                                let ic_event_redcard = false;

                                var type: any = events_data[e].type;

                                if (type == "goal") {
                                    ic_event_goal = true;
                                }
                                if (type == "penalty") {
                                    ic_event_penalty = true;
                                }
                                if (type == "missed_penalty") {
                                    ic_event_missed_penalty = true;
                                }
                                if (type == "own-goal") {
                                    ic_event_own_goal = true;
                                }
                                if (type == "substitution") {
                                    ic_event_substitution = true;
                                }
                                if (type == "yellowcard") {
                                    ic_event_yellow_card = true;
                                }
                                if (type == "yellowred") {
                                    ic_event_yellowred = true;
                                }
                                if (type == "redcard") {
                                    ic_event_redcard = true;
                                }
                                if (type == "pen_shootout_goal") {
                                    ic_event_pen_shootout_goal = true;
                                }
                                if (type == "pen_shootout_miss") {
                                    ic_event_pen_shootout_miss = true;
                                }
                                this.events_collection
                                    .push({
                                        "id": events_data[e].id,
                                        "type": events_data[e].type,
                                        "minute": events_data[e].minute,
                                        "extra_min": events_data[e].extra_min,
                                        "team": team,
                                        "assist": events_data[e].related_player_name,
                                        "assist_id": events_data[e].related_player_id,
                                        "player": events_data[e].player_name,
                                        "player_id": events_data[e].player_id,
                                        "result": event_result,
                                        "ic_event_goal": ic_event_goal,
                                        "ic_event_penalty": ic_event_penalty,
                                        "ic_event_missed_penalty": ic_event_missed_penalty,
                                        "ic_event_own_goal": ic_event_own_goal,
                                        "ic_event_substitution": ic_event_substitution,
                                        "ic_event_yellow_card": ic_event_yellow_card,
                                        "ic_event_yellowred": ic_event_yellowred,
                                        "ic_event_redcard": ic_event_redcard,
                                        "ic_event_pen_shootout_goal": ic_event_pen_shootout_goal,
                                        "ic_event_pen_shootout_miss": ic_event_pen_shootout_miss
                                    });
                            }
                            this.events_collection.reverse();
                            this.events_collection_length = this.events_collection.length;
                        }
                        else {
                            this.events_collection_length = 0;
                        }
                        //console.log("end live events======================================================");

                        //match_stats---------------------------------------------------------------
                        if (item['stats']) {
                            let match_stats = item['stats'].data;
                            if (match_stats) {
                                var match_stats_lt = [];
                                var match_stats_vt = [];
                                if (match_stats !== undefined || match_stats['length'] !== 0 || match_stats !== null) {
                                    for (var st = 0; st < match_stats['length']; st++) {

                                        var corners: any = match_stats[st].corners;
                                        var offsides: any = match_stats[st].offsides;
                                        var fouls: any = match_stats[st].fouls;
                                        var possessiontime: any = match_stats[st].possessiontime;
                                        var redcards: any = match_stats[st].redcards;
                                        var saves: any = match_stats[st].saves;
                                        var yellowcards: any = match_stats[st].yellowcards;

                                        var shots = match_stats[st].shots;
                                        var ongoal: any = shots.ongoal;
                                        var total: any = shots.total;

                                        if (corners == null) {
                                            corners = 0;
                                        }
                                        if (fouls == null) {
                                            fouls = 0;
                                        }
                                        if (offsides == null) {
                                            offsides = 0;
                                        }
                                        if (possessiontime == null) {
                                            possessiontime = 0;
                                        }
                                        if (redcards == null) {
                                            redcards = 0;
                                        } if (saves == null) {
                                            saves = 0;
                                        }
                                        if (ongoal == null) {
                                            ongoal = 0;
                                        }
                                        if (total == null) {
                                            total = 0;
                                        }
                                        if (yellowcards == null) {
                                            yellowcards = 0;
                                        }

                                        if (match_stats[st].team_id == localteam_id) {
                                            match_stats_lt.push({
                                                "lt_corners": corners,
                                                "lt_fouls": fouls,
                                                "lt_offsides": offsides,
                                                "lt_possesiontime": possessiontime,
                                                "lt_redcards": redcards,
                                                "lt_saves": saves,
                                                "lt_shots_ongoal": ongoal,
                                                "lt_shots_total": total,
                                                "lt_yellowcards": yellowcards,
                                            });
                                        }
                                        if (match_stats[st].team_id == visitorteam_id) {
                                            match_stats_vt.push({
                                                "vt_corners": corners,
                                                "vt_fouls": fouls,
                                                "vt_offsides": offsides,
                                                "vt_possesiontime": possessiontime,
                                                "vt_redcards": redcards,
                                                "vt_saves": saves,
                                                "vt_shots_ongoal": ongoal,
                                                "vt_shots_total": total,
                                                "vt_yellowcards": yellowcards
                                            });
                                        }
                                    }

                                    console.log("l-status", match_stats_lt);
                                    console.log("v-status", match_stats_vt);
                                    if (match_stats_vt['length'] > 0 || match_stats_vt['length'] > 0) {
                                        this.match_stats_collection.push(Object.assign(match_stats_lt[0], match_stats_vt[0]));
                                    }

                                    this.match_stats_collection_length = this.match_stats_collection.length;
                                }
                                else {
                                    this.match_stats_collection_length = 0;
                                }
                            }
                        }
                        //end match_stats----------------------------------------------------------

                        // lineup------------------------------------------------------------------

                        let lineup = item['lineup'].data;
                        if (lineup !== undefined || lineup['length'] !== 0 || lineup !== null) {

                            for (var lp = 0; lp < lineup['length']; lp++) {
                                if (lineup[lp].player_name !== null && lineup[lp].player_name !== "" && lineup[lp].player_id !== null && lineup[lp].player_id !== "") {
                                    var number = lineup[lp].number;
                                    var number_sort = number;
                                    if (number == null) {
                                        number_sort = lp + 1;
                                        number = "-";
                                    }
                                    // localteam_lineup-------------------------------------------------------------
                                    if (lineup[lp].team_id == localteam_id) {
                                        this.localteam_player_lineup.push({
                                            "id": lineup[lp].player_id,
                                            "name": lineup[lp].player_name,
                                            "number": lineup[lp].number,
                                            "number_sort": number_sort,
                                            "pos": lineup[lp].position,
                                        });
                                    }
                                    //end localteam_lineup--------------------------------------------------------

                                    //visitorteam_lineup-----------------------------------------------------------
                                    if (lineup[lp].team_id == visitorteam_id) {
                                        this.visitorteam_player_lineup.push({
                                            "id": lineup[lp].player_id,
                                            "name": lineup[lp].player_name,
                                            "number": lineup[lp].number,
                                            "number_sort": number_sort,
                                            "pos": lineup[lp].position,
                                        });
                                    }
                                }
                                //end visitorteam_lineup---------------------------------------------------------
                            }

                            this.localteam_player_lineup_length = this.localteam_player_lineup.length;
                            this.visitorteam_player_lineup_length = this.visitorteam_player_lineup.length;
                        }
                        else {
                            this.localteam_player_lineup_length = 0;
                            this.visitorteam_player_lineup_length = 0;
                        }
                        //Substitutes(bench)-------------------------------------------------------------

                        let Substitutes = item['bench'].data;
                        if (Substitutes !== undefined || Substitutes['length'] !== 0 || Substitutes !== null) {

                            for (var lp = 0; lp < Substitutes['length']; lp++) {
                                if (Substitutes[lp].player_name !== null && lineup[lp].player_name !== "" && Substitutes[lp].player_id !== null && Substitutes[lp].player_id !== "") {
                                    var number = Substitutes[lp].number;
                                    var number_sort = number;
                                    if (number == null) {
                                        number_sort = lp + 1;
                                        number = "-";
                                    }
                                    // localteam_lineup------------------------------------------------------------------------------------
                                    if (Substitutes[lp].team_id == localteam_id) {
                                        this.localteam_player_subs.push({
                                            "id": Substitutes[lp].player_id,
                                            "name": Substitutes[lp].player_name,
                                            "number": number,
                                            "number_sort": number_sort,
                                            "pos": Substitutes[lp].position,
                                        });
                                    }
                                    //end localteam_Substitutes--------------------------------------------

                                    //visitorteam_Substitutes----------------------------------------------
                                    if (Substitutes[lp].team_id == visitorteam_id) {
                                        this.visitorteam_player_subs.push({
                                            "id": Substitutes[lp].player_id,
                                            "name": Substitutes[lp].player_name,
                                            "number": number,
                                            "number_sort": number_sort,
                                            "pos": Substitutes[lp].position,
                                        });
                                    }
                                }
                                //end visitorteam_Substitutes---------------------------------------------
                            }
                            this.localteam_player_subs_length = this.localteam_player_subs.length;
                            this.visitorteam_player_subs_length = this.visitorteam_player_subs.length;
                        }
                        else {
                            this.localteam_player_subs_length = 0;
                            this.visitorteam_player_subs_length = 0;
                        }
                        //end Substitutes(bench)-----------------------------------------------------
                    }
                }
                for (let j = 0; j < this.match_ground_details['length']; j++) {
                    console.log("**", this.match_ground_details[j]);
                    var group = this.match_ground_details[j].group;

                    for (let i = 0; i < group['length']; i++) {
                        if (group[i].id == current_matchId) {

                            var collection: any = this.jsCustomeFun.HandleDataofAPI(item);

                            var id: any = collection['id'];
                            //time---------------------------------------------------------------------
                            var live_status: any = collection["live_status"];
                            var status: any = collection["status"];

                            //scores----------------------------------------------------------------------
                            var localteam_score: any = collection["localteam_score"];
                            var visitorteam_score: any = collection["visitorteam_score"];
                            var score_status_flage: any = collection["score_status_flage"];
                            var penalty_visitor: any = collection["penalty_visitor"];
                            var penalty_local: any = collection["penalty_local"];
                            //Which team is high scores------------------------------------------
                            //*apply class for text-bold=>font-wight:bold if team run is highest
                            var ltScore_highest: any = collection["ltScore_highest"];
                            var vtScore_highest: any = collection["vtScore_highest"];
                            //end scores------------------------------------------
                            // AGG (0-0)--------------------------------------------
                            var lats_score_local: any = collection["lats_score_local"];
                            var lats_score_vist: any = collection["lats_score_vist"];
                            var agg_localvist: any = collection['agg_localvist'];
                            // end AGG (0-0)-------------------------------------------

                            group[i]['id'] = id;
                            group[i]['status'] = status;
                            group[i]['live_status'] = live_status;
                            group[i]['localteam_score'] = localteam_score;
                            group[i]['visitorteam_score'] = visitorteam_score;
                            group[i]['score_status_flage'] = score_status_flage;
                            group[i]['ltScore_highest'] = ltScore_highest;
                            group[i]['vtScore_highest'] = vtScore_highest;
                            //agg---
                            group[i]['lats_score_local'] = lats_score_local;
                            group[i]['lats_score_vist'] = lats_score_vist;
                            group[i]['agg_localvist'] = agg_localvist;
                            //end egg     

                        }
                    }
                }
            }
        });
    }

    GetCommentariesByMatchId_live() {
        this.liveMatchesApiService.liveMatches().subscribe(record => {
            console.log("record", record);
            var result = record['data'];
            console.log("Matches is Live comments", result);
            if (result.commentaries !== undefined) {
                var result_comments = result.commentaries;
                if (this.id == result_comments['fixture_id']) {

                    console.log("comments for this fixture_id", result_comments['fixture_id']);

                    this.Commentary_collection = [];
                    //  comments-----------------------------------------------------------------
                    let comments = result_comments['comments'].data;
                    if (comments !== undefined || comments['length'] !== 0 || comments !== null) {

                        for (var c = 0; c < comments['length']; c++) {
                            var GoalType: boolean = false;
                            var isAssist: boolean = false;
                            var isSubstitution: boolean = false;
                            var downSubstitution: boolean = false;
                            var yellowcard: boolean = false;
                            var redcard: boolean = false;

                            var UpName: any = "";
                            var DownName: any = "";
                            var comment_icon: any = "";

                            var comment = comments[c].comment;
                            var minute = comments[c].minute

                            var important = comments[c].important;
                            var goal = comments[c].goal;


                            if (important == true && goal == true) {
                                GoalType = true;

                                let Substring1 = comment.split(".", 2);
                                if (Substring1) {
                                    if (comment.includes("Own Goal")) {
                                        console.log("Own Goal  found in comments");

                                        comment_icon = "assets/img/ic_event_own_goal.png";
                                        let Substring2 = Substring1[0].split("by", 2);
                                        if (Substring2) {
                                            console.log("comments are splite using=>by", Substring2);
                                            console.log("Substring2[1]", Substring2[1]);
                                            let str3 = Substring2[1].split(",");
                                            console.log("Upname", str3);
                                            if (str3) {
                                                UpName = str3[0];
                                                DownName = Substring2[0];
                                            } else {
                                                DownName = "Own Goal";
                                            }
                                        }
                                    } else {
                                        comment_icon = "assets/img/ic_event_goal.png";
                                        let Substring2 = Substring1[1].split("-", 2);
                                        if (Substring2) {
                                            UpName = Substring2[0];
                                            DownName = "Goal";
                                        }
                                    }
                                }

                                //check 'Assist' is or not in given comment 
                                if (comment.includes("Assist")) {
                                    isAssist = true;
                                    let SubstringAssist = comment.split("Assist -", 2);
                                    if (SubstringAssist) {
                                        let assistName = SubstringAssist[1].split("with", 2);
                                        DownName = assistName[0];
                                    }
                                    else {
                                        DownName = "Assist";
                                    }
                                }
                                //check 'Assist' is or not in given comment 
                                if (comment.includes("penalty")) {
                                    DownName = "Penalty Goal";
                                }

                            } else {

                                //check 'Substitution' is or not in given comment
                                if (comment.includes("Substitution")) {
                                    console.log("Substitution  found in comments");
                                    isSubstitution = true;
                                    comment_icon = "assets/img/ic_event_substitution.png";

                                    let String1 = comment.split(".", 2);
                                    console.log("String1", String1);
                                    if (String1[1]) {
                                        let String2 = String1[1].split("for", 2);
                                        UpName = String2[0];
                                        console.log("String2", String2);
                                        if (String2[1]) {
                                            let String3 = String2[1].split("-", 2);
                                            console.log("String3", String3);
                                            DownName = String3[0];
                                        }
                                    }
                                }
                                if (comment.includes("yellow card")) {
                                    yellowcard = true;
                                    comment_icon = "assets/img/ic_event_yellow_card.png";
                                    let String1_yc = comment.split("-", 2);
                                    if (String1_yc) {
                                        UpName = String1_yc[0];
                                        DownName = "yellow card";
                                    }
                                }
                                if (comment.includes("red card")) {
                                    redcard = true;
                                    comment_icon = "assets/img/ic_event_redcard.png";

                                    let String1_rc = comment.split("-", 2);
                                    if (String1_rc) {
                                        UpName = String1_rc[0];
                                        DownName = "red card";
                                    }
                                }
                            }

                            this.Commentary_collection.push({
                                "GoalType": GoalType,
                                "isAssist": isAssist,
                                "isSubstitution": isSubstitution,
                                "downSubstitution": downSubstitution,
                                "yellowcard": yellowcard,
                                "redcard": redcard,
                                "upName": UpName,
                                "downName": DownName,
                                "comment": comment,
                                "minute": minute,
                                "icon": comment_icon
                            });
                        }
                        this.Commentary_collection_length = this.Commentary_collection.length;
                    }
                    else {
                        this.Commentary_collection_length = 0;
                    }
                    // end comments------------------------------------------------------------
                }
            }
        });
    }


    //NEW 

    GetMatchDeatilByMatchId(match_id) {
        this.match_detailcollection = [];
        this.events_collection = [];
        this.localteam_player_lineup = [];
        this.visitorteam_player_lineup = [];
        this.localteam_player_subs = [];
        this.visitorteam_player_subs = [];
        this.match_stats_collection = [];
        this.Commentary_collection = [];
        this.matchService.GetMatchDeatilByMatchId(match_id).subscribe(record => {
            console.log("GetMatchDeatilByMatchId", record);
            // var result = data['data'];
            var self = this;
            var res: any = record['data'];
            for (let result of res) {
                var collection: any = self.jsCustomeFun.HandleDataofAPI(result);
                var id: any = collection['id'];
                var league_id = collection['league_id'];
                //LocalTeam Data---------------------------------------------------------
                var localteam_id: any = collection['localteam_id'];
                var localteam_name: any = collection['localteam_name'];
                //visitorTeam Data--------------------------------------------------------
                var visitorteam_id: any = collection['visitorteam_id'];
                var visitorteam_name: any = collection['visitorteam_name'];
                var match_time: any = collection["match_time"];
                //scores----------------------------------------------------------------------
                var localteam_score: any = collection["localteam_score"];
                var visitorteam_score: any = collection["visitorteam_score"];
                var season_name = collection['season_name'];
                //end season---------------------------------------------------------
                var competitions = collection['competitions'];
                //self gloab variable----------------
                self.comp_id = league_id;
                self.season = season_name;
                console.log("comp_id in details", self.comp_id);
                //end self gloab variable----------------
                //  var time = moment(match_time, 'YYYY-MM-DD HH:mm:ss a').format('DD MMM YYYY');
                var meta_date = moment(match_time, 'YYYY-MM-DD HH:mm:ss a').format('DD MMM YYYY');
                self.meta.addTag({ name: 'title', content: 'Match ' + localteam_name + " vs " + visitorteam_name + " (" + localteam_score + ":" + visitorteam_score + ") - " + competitions.name + " on the " + meta_date + " | FootzyScore" });
                self.meta.addTag({ name: 'description', content: "All info to the " + competitions.name + " " + localteam_name + " vs " + visitorteam_name + "  on the " + meta_date + " - latest news, live scores and statistics. >>> MORE" });

                self.match_detailcollection.push({
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
                    "season": collection['season_name']
                });


                console.log("NEW ARRAY ------", self.match_detailcollection);
                this.GetMatchesByDate(this.currentdaydate);

                //  match_Events-------------------------------------------------------------


                if (result['events']) {
                    var events_data: any = result['events'].data;
                    if (events_data !== undefined || events_data['length'] !== 0 || events_data !== null) {
                        for (var e = 0; e < events_data['length']; e++) {
                            var team;
                            if (events_data[e].team_id == localteam_id) {
                                team = "localteam";
                            }
                            if (events_data[e].team_id == visitorteam_id) {
                                team = "visitorteam";
                            }

                            var event_result: any;
                            if (events_data[e].result !== null) {
                                event_result = events_data[e].result
                            }

                            let ic_event_penalty = false;
                            let ic_event_own_goal = false;
                            let ic_event_goal = false;
                            let ic_event_yellow_card = false;
                            let ic_event_substitution = false;
                            let ic_event_yellowred = false;
                            let ic_event_missed_penalty = false;
                            let ic_event_pen_shootout_goal = false;
                            let ic_event_pen_shootout_miss = false;
                            let ic_event_redcard = false;

                            var type: any = events_data[e].type;

                            if (type == "goal") {
                                ic_event_goal = true;
                            }
                            if (type == "penalty") {
                                ic_event_penalty = true;
                            }
                            if (type == "missed_penalty") {
                                ic_event_missed_penalty = true;
                            }
                            if (type == "own-goal") {
                                ic_event_own_goal = true;
                            }
                            if (type == "substitution") {
                                ic_event_substitution = true;
                            }
                            if (type == "yellowcard") {
                                ic_event_yellow_card = true;
                            }
                            if (type == "yellowred") {
                                ic_event_yellowred = true;
                            }
                            if (type == "redcard") {
                                ic_event_redcard = true;
                            }
                            if (type == "pen_shootout_goal") {
                                ic_event_pen_shootout_goal = true;
                            }
                            if (type == "pen_shootout_miss") {
                                ic_event_pen_shootout_miss = true;
                            }

                            self.events_collection
                                .push({
                                    "id": events_data[e].id,
                                    "type": events_data[e].type,
                                    "minute": events_data[e].minute,
                                    "extra_min": events_data[e].extra_min,
                                    "team": team,
                                    "assist": events_data[e].related_player_name,
                                    "assist_id": events_data[e].related_player_id,
                                    "player": events_data[e].player_name,
                                    "player_id": events_data[e].player_id,
                                    "result": event_result,
                                    "ic_event_goal": ic_event_goal,
                                    "ic_event_penalty": ic_event_penalty,
                                    "ic_event_missed_penalty": ic_event_missed_penalty,
                                    "ic_event_own_goal": ic_event_own_goal,
                                    "ic_event_substitution": ic_event_substitution,
                                    "ic_event_yellow_card": ic_event_yellow_card,
                                    "ic_event_yellowred": ic_event_yellowred,
                                    "ic_event_redcard": ic_event_redcard,
                                    "ic_event_pen_shootout_goal": ic_event_pen_shootout_goal,
                                    "ic_event_pen_shootout_miss": ic_event_pen_shootout_miss
                                });
                        }
                        self.events_collection.reverse();
                        self.events_collection_length = self.events_collection.length;
                    }
                    else {
                        self.events_collection_length = 0;
                    }
                }

                // end match_Events---------------------------------------------------------

                //match_stats---------------------------------------------------------------
                if (result['stats']) {
                    let match_stats = result['stats'].data;
                    if (match_stats) {
                        var match_stats_lt = [];
                        var match_stats_vt = [];
                        if (match_stats !== undefined || match_stats['length'] !== 0 || match_stats !== null) {
                            for (var st = 0; st < match_stats['length']; st++) {

                                var corners: any = match_stats[st].corners;
                                var offsides: any = match_stats[st].offsides;
                                var fouls: any = match_stats[st].fouls;
                                var possessiontime: any = match_stats[st].possessiontime;
                                var redcards: any = match_stats[st].redcards;
                                var saves: any = match_stats[st].saves;
                                var yellowcards: any = match_stats[st].yellowcards;

                                var shots = match_stats[st].shots;
                                var ongoal: any = shots.ongoal;
                                var total: any = shots.total;

                                if (corners == null) {
                                    corners = 0;
                                }
                                if (fouls == null) {
                                    fouls = 0;
                                }
                                if (offsides == null) {
                                    offsides = 0;
                                }
                                if (possessiontime == null) {
                                    possessiontime = 0;
                                }
                                if (redcards == null) {
                                    redcards = 0;
                                } if (saves == null) {
                                    saves = 0;
                                }
                                if (ongoal == null) {
                                    ongoal = 0;
                                }
                                if (total == null) {
                                    total = 0;
                                }
                                if (yellowcards == null) {
                                    yellowcards = 0;
                                }

                                if (match_stats[st].team_id == localteam_id) {
                                    match_stats_lt.push({
                                        "lt_corners": corners,
                                        "lt_fouls": fouls,
                                        "lt_offsides": offsides,
                                        "lt_possesiontime": possessiontime,
                                        "lt_redcards": redcards,
                                        "lt_saves": saves,
                                        "lt_shots_ongoal": ongoal,
                                        "lt_shots_total": total,
                                        "lt_yellowcards": yellowcards,
                                    });
                                }
                                if (match_stats[st].team_id == visitorteam_id) {
                                    match_stats_vt.push({
                                        "vt_corners": corners,
                                        "vt_fouls": fouls,
                                        "vt_offsides": offsides,
                                        "vt_possesiontime": possessiontime,
                                        "vt_redcards": redcards,
                                        "vt_saves": saves,
                                        "vt_shots_ongoal": ongoal,
                                        "vt_shots_total": total,
                                        "vt_yellowcards": yellowcards
                                    });
                                }
                            }

                            console.log("l-status", match_stats_lt);
                            console.log("v-status", match_stats_vt);
                            if (match_stats_vt['length'] > 0 || match_stats_vt['length'] > 0) {
                                self.match_stats_collection.push(Object.assign(match_stats_lt[0], match_stats_vt[0]));
                            }
                            self.match_stats_collection_length = self.match_stats_collection.length;
                        }
                        else {
                            self.match_stats_collection_length = 0;
                        }
                    }
                }
                //end match_stats----------------------------------------------------------

                // lineup------------------------------------------------------------------
                let lineup = result['lineup'].data;
                if (lineup !== undefined || lineup['length'] !== 0 || lineup !== null) {

                    for (var lp = 0; lp < lineup['length']; lp++) {
                        if (lineup[lp].player_name !== null && lineup[lp].player_name !== "" && lineup[lp].player_id !== null && lineup[lp].player_id !== "") {
                            // localteam_lineup-------------------------------------------------------------
                            console.log("number", lineup[lp].number);
                            var number = lineup[lp].number;
                            var number_sort = number;
                            if (number == null) {
                                number_sort = lp + 1;
                                number = "-";
                            }

                            if (lineup[lp].team_id == localteam_id) {
                                self.localteam_player_lineup.push({
                                    "id": lineup[lp].player_id,
                                    "name": lineup[lp].player_name,
                                    "number": number,
                                    "number_sort": number_sort,
                                    "pos": lineup[lp].position,
                                });
                            }
                            //end localteam_lineup--------------------------------------------------------

                            //visitorteam_lineup-----------------------------------------------------------
                            if (lineup[lp].team_id == visitorteam_id) {
                                self.visitorteam_player_lineup.push({
                                    "id": lineup[lp].player_id,
                                    "name": lineup[lp].player_name,
                                    "number": number,
                                    "number_sort": number_sort,
                                    "pos": lineup[lp].position,
                                });
                            }
                        }
                    }
                    //end visitorteam_lineup---------------------------------------------------------
                    console.log("lp", self.localteam_player_lineup);
                    console.log("vp", self.visitorteam_player_lineup);

                    self.localteam_player_lineup_length = self.localteam_player_lineup.length;
                    self.visitorteam_player_lineup_length = self.visitorteam_player_lineup.length;
                }
                else {
                    self.localteam_player_lineup_length = 0;
                    self.visitorteam_player_lineup_length = 0;
                }



                //Substitutes(bench)-------------------------------------------------------------

                let Substitutes = result['bench'].data;
                if (Substitutes !== undefined || Substitutes['length'] !== 0 || Substitutes !== null) {

                    for (var lp = 0; lp < Substitutes['length']; lp++) {
                        if (Substitutes[lp].player_name !== null && Substitutes[lp].player_name !== "" && Substitutes[lp].player_id !== null && Substitutes[lp].player_id !== "") {
                            // localteam_lineup------------------------------------------------------------------------------------
                            var number = Substitutes[lp].number;
                            var number_sort = number;
                            if (number == null) {
                                number_sort = lp + 1;
                                number = "-";
                            }
                            console.log("player_id is", Substitutes[lp].player_id);

                            if (Substitutes[lp].team_id == localteam_id) {
                                self.localteam_player_subs.push({
                                    "id": Substitutes[lp].player_id,
                                    "name": Substitutes[lp].player_name,
                                    "number": number,
                                    "number_sort": number_sort,
                                    "pos": Substitutes[lp].position,
                                });
                            }
                            //end localteam_Substitutes--------------------------------------------

                            //visitorteam_Substitutes----------------------------------------------
                            if (Substitutes[lp].team_id == visitorteam_id) {
                                self.visitorteam_player_subs.push({
                                    "id": Substitutes[lp].player_id,
                                    "name": Substitutes[lp].player_name,
                                    "number": number,
                                    "number_sort": number_sort,
                                    "pos": Substitutes[lp].position,
                                });
                            }
                        }
                        //end visitorteam_Substitutes---------------------------------------------
                    }
                    console.log("ls", self.localteam_player_subs);
                    console.log("vs", self.visitorteam_player_subs);
                    self.localteam_player_subs_length = self.localteam_player_subs.length;
                    self.visitorteam_player_subs_length = self.visitorteam_player_subs.length;

                }
                else {
                    self.localteam_player_subs_length = 0;
                    self.visitorteam_player_subs_length = 0;
                }


                //end Substitutes(bench)-----------------------------------------------------

                //  comments-----------------------------------------------------------------

                let commentaries_status = result['commentaries'];

                if (commentaries_status == true) {
                    self.matchService.GetCommentariesByMatchId(id).subscribe(data => {
                        console.log("comments", data);
                        var comments: any = data['data'];
                        if (comments) {
                            if (comments !== undefined || comments['length'] !== 0 || comments !== null) {

                                for (var c = 0; c < comments['length']; c++) {
                                    var GoalType: boolean = false;
                                    var isAssist: boolean = false;
                                    var isSubstitution: boolean = false;
                                    var downSubstitution: boolean = false;
                                    var yellowcard: boolean = false;
                                    var redcard: boolean = false;

                                    var UpName: any = "";
                                    var DownName: any = "";
                                    var comment_icon: any = "";

                                    var comment = comments[c].comment;
                                    var minute = comments[c].minute

                                    var important = comments[c].important;
                                    var goal = comments[c].goal;


                                    if (important == true && goal == true) {
                                        GoalType = true;

                                        let Substring1 = comment.split(".", 2);
                                        if (Substring1) {
                                            if (comment.includes("Own Goal")) {
                                                console.log("Own Goal  found in comments");

                                                comment_icon = "assets/img/ic_event_own_goal.png";
                                                let Substring2 = Substring1[0].split("by", 2);
                                                if (Substring2) {
                                                    console.log("comments are splite using=>by", Substring2);
                                                    console.log("Substring2[1]", Substring2[1]);
                                                    let str3 = Substring2[1].split(",");
                                                    console.log("Upname", str3);
                                                    if (str3) {
                                                        UpName = str3[0];
                                                        DownName = Substring2[0];
                                                    } else {
                                                        DownName = "Own Goal";
                                                    }
                                                }
                                            } else {
                                                comment_icon = "assets/img/ic_event_goal.png";
                                                let Substring2 = Substring1[1].split("-", 2);
                                                if (Substring2) {
                                                    UpName = Substring2[0];
                                                    DownName = "Goal";
                                                }
                                            }
                                        }

                                        //check 'Assist' is or not in given comment 
                                        if (comment.includes("Assist")) {
                                            isAssist = true;
                                            let SubstringAssist = comment.split("Assist -", 2);
                                            if (SubstringAssist) {
                                                if (SubstringAssist[1]) {
                                                    let assistName = SubstringAssist[1].split("with", 2);
                                                    DownName = assistName[0];
                                                }
                                            }
                                            else {
                                                DownName = "Assist";
                                            }
                                        }
                                        //check 'Assist' is or not in given comment 
                                        if (comment.includes("penalty")) {
                                            DownName = "Penalty Goal";
                                        }

                                    } else {

                                        //check 'Substitution' is or not in given comment
                                        if (comment.includes("Substitution")) {
                                            console.log("Substitution  found in comments");
                                            isSubstitution = true;
                                            comment_icon = "assets/img/ic_event_substitution.png";

                                            let String1 = comment.split(".", 2);
                                            console.log("String1", String1);
                                            if (String1[1]) {
                                                let String2 = String1[1].split("for", 2);
                                                UpName = String2[0];
                                                console.log("String2", String2);
                                                if (String2[1]) {
                                                    let String3 = String2[1].split("-", 2);
                                                    console.log("String3", String3);
                                                    DownName = String3[0];
                                                }
                                            }
                                        }
                                        if (comment.includes("yellow card")) {
                                            yellowcard = true;
                                            comment_icon = "assets/img/ic_event_yellow_card.png";
                                            let String1_yc = comment.split("-", 2);
                                            if (String1_yc) {
                                                UpName = String1_yc[0];
                                                DownName = "yellow card";
                                            }
                                        }
                                        if (comment.includes("red card")) {
                                            redcard = true;
                                            comment_icon = "assets/img/ic_event_redcard.png";

                                            let String1_rc = comment.split("-", 2);
                                            if (String1_rc) {
                                                UpName = String1_rc[0];
                                                DownName = "red card";
                                            }
                                        }
                                    }

                                    self.Commentary_collection.push({
                                        "GoalType": GoalType,
                                        "isAssist": isAssist,
                                        "isSubstitution": isSubstitution,
                                        "downSubstitution": downSubstitution,
                                        "yellowcard": yellowcard,
                                        "redcard": redcard,
                                        "upName": UpName,
                                        "downName": DownName,
                                        "comment": comment,
                                        "minute": minute,
                                        "icon": comment_icon
                                    });
                                }
                            }
                            self.Commentary_collection_length = self.Commentary_collection.length;
                        }
                        else {
                            self.Commentary_collection_length = 0;
                        }
                    });
                }
                else {
                    self.Commentary_collection_length = 0;

                }
                // end comments------------------------------------------------------------


            }
        });
    }
    GetMatchesByDate(selected) {
        console.log("GetMatchesByDate fun is call....");
        this.match_ground_details = [];
        var param = {
            "date": selected,
            "localtimezone": this.localtimezone
        }
        console.log("paramr is", param);
        this.matchService.GetAllCompetitionMatchesByDate(param).subscribe(record => {
            console.log("record by selected Date", record);
            var result: any = record['data'];
            var self = this;
            if (result !== undefined) {
                var array = result,
                    groups = Object.create(null),
                    grouped = [];

                array.forEach(function (item) {
                    console.log("array", item);
                    var collection: any = self.jsCustomeFun.HandleDataofAPI(item);
                    //end season------------------------------------------------------
                    var competitions = collection['competitions'];
                    console.log("comp_id in date", self.comp_id);

                    if (competitions !== "") {
                        if (competitions.id == self.comp_id) {
                            console.log("competitions.id", competitions.id);
                            if (!groups[competitions.id]) {
                                groups[competitions.id] = [];

                                grouped.push({ competitions: competitions, group: groups[competitions.id] });
                                console.log("grouped -", grouped);

                            }
                            console.log("groups--", groups[competitions.id]);
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
                if (this.array_length > 0) {
                    this.show_btn = true;
                }
                console.log(" this.array_length", grouped.length);
            }
            else {
                this.array_length = 0;
            }
        })
        //console.log("filter-date_data", this.match_ground_details);
    }
    Playerdetails(player_id) {
        this.router.navigate(['/player', player_id]);
    }

    gotomatch() {
        let selectedId = this.id ? this.id : null;
        this.router.navigate(['../', { id: selectedId }], { relativeTo: this.route })
    }
    matchdetails_go(id) {
        this.router.navigate(['/matches', id]);
    }

    teamdetails(team_id) {
        this.router.navigate(['/team', team_id]);
    }
    AllMatchList() {
        this.router.navigate(['/matches']);
    }

    CompetitionDetails(comp_id) {
        this.router.navigate(['/competition', comp_id]);
    }

}

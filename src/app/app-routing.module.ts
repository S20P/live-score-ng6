import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MatchesDetailComponentComponent } from './matches-detail-component/matches-detail-component.component';
import { MatchesDashboardComponent } from './matches-dashboard/matches-dashboard.component';

import { TeamDetailComponent } from './team-detail/team-detail.component';
import { PlayerDetailComponent } from './player-detail/player-detail.component';
import { CompetitionComponent } from './competition/competition.component';

import { CompetitionGroupComponent } from './competition-group/competition-group.component';
import { CompetitionTeamsComponent } from './competition-teams/competition-teams.component';
import { CompetitionPlayerComponent } from './competition-player/competition-player.component';
import { CompetitionMatchesComponent } from './competition-matches/competition-matches.component';
import { TeamSquadComponent } from './team-squad/team-squad.component';
import { TeamNextMatchesComponent } from './team-next-matches/team-next-matches.component';
import { TeamPreviousMatchesComponent } from './team-previous-matches/team-previous-matches.component';
import { CompetitionsListComponent } from './competitions-list/competitions-list.component';

//Page----
import { AboutUsComponent } from './page/About-us/about-us.component';
import { ContactUsComponent } from './page/Contact-us/contact-us.component';
import { PrivacyPolicyComponent } from './page/Privacy-Policy/privacy-policy.component';
import { TermsConditionsComponent } from './page/Terms-Conditions/terms-conditions.component';

const routes: Routes = [
  { path: '', redirectTo: 'matches', pathMatch: 'full' },
  { path: 'matches', component: MatchesDashboardComponent },  //All Matches
  {
    path: 'matches/:id',
    component: MatchesDetailComponentComponent,
  },//Matche details

  { path: 'team/:id', component: TeamDetailComponent },  //Team details
  { path: 'player/:id', component: PlayerDetailComponent },  //Team details
  { path: 'competition/:id', component: CompetitionComponent },  //Team details
  { path: 'competition', component: CompetitionsListComponent },  //Team details

  //page
  { path: 'about', component: AboutUsComponent },  //About-us
  { path: 'contact', component: ContactUsComponent },  //Contact-us
  { path: 'privacy-policy', component: PrivacyPolicyComponent },  //Privacy-Policy
  { path: 'terms-conditions', component: TermsConditionsComponent },  //Our-Apps


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const AppRoutingComponents = [
  MatchesDetailComponentComponent,
  MatchesDashboardComponent,
  TeamDetailComponent,
  PlayerDetailComponent,
  CompetitionComponent,
  CompetitionGroupComponent,
  CompetitionTeamsComponent,
  CompetitionPlayerComponent,
  CompetitionMatchesComponent,
  TeamSquadComponent,
  TeamNextMatchesComponent,
  TeamPreviousMatchesComponent,
  CompetitionsListComponent,
  AboutUsComponent,
  ContactUsComponent,
  PrivacyPolicyComponent,
  TermsConditionsComponent
];
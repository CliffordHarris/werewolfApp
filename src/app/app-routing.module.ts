import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BingoComponent } from './bingo/bingo.component';
import { GameComponent } from './game/game.component';
import { LandingComponent } from './landing/landing.component';

const routes: Routes = [
  {
    path: 'game', component: GameComponent
  },
  {
    path: 'landing', component: LandingComponent
  },
  {
    path: 'bingo', component: BingoComponent
  },
  {
    path: '**',
    component: GameComponent
  }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

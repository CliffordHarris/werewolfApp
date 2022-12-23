import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormComponent } from './form/form.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from './shared/material/material.module';
import { GameComponent } from './game/game.component';
import { LandingComponent } from './landing/landing.component';
import { BingoComponent } from './bingo/bingo.component';
import { LocalStorageService } from './local-storage.service';
import { WerewolfPipe } from './werewolf.pipe';
import { AlivePipe } from './alive.pipe';

@NgModule({
  declarations: [
    AppComponent,
    FormComponent,
    GameComponent,
    LandingComponent,
    BingoComponent,
    WerewolfPipe,
    AlivePipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MaterialModule,
    FormsModule
    // NgbModule.forRoot()
  ],
  providers: [LocalStorageService],
  bootstrap: [AppComponent]
})
export class AppModule { }

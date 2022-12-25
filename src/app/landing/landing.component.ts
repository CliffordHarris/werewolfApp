import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import {COMMA, ENTER} from '@angular/cdk/keycodes';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})

export class LandingComponent implements OnInit {
  newName: string = '';
  players: string[] = [];
  @ViewChild('name') nameEl: ElementRef | undefined;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  addOnBlur = true;

  constructor(private router: Router) {
    console.log(this.router.url)
  }

  savePlayerToLocalStorage = (players: any) => {
    localStorage.setItem("players", JSON.stringify(players));
  };

  ngOnInit() {
    const storedPlayers = localStorage.getItem("players");
    if (storedPlayers) {
      this.players = JSON.parse(storedPlayers) as string[];
    }
  }

  addName() {
    if (!this.newName) return;
    if (this.players.find(p => p === this.newName)) {
      this.newName = '';
      return;
    }
    this.players.push(this.newName);
    this.newName = '';
    this.savePlayerToLocalStorage(this.players);
  }

  removeName(idx: number) {
    console.log('idx', idx)
    this.players.splice(idx, 1);
    this.savePlayerToLocalStorage(this.players);
    this.nameEl?.nativeElement.focus();
  }

  startGame() {
    this.router.navigate(['game']);
  }

}

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
  players: Array<{name: string, color: string}> = [];
  @ViewChild('name') nameEl: ElementRef | undefined;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  addOnBlur = true;

  constructor(private router: Router) {
    console.log(this.router.url)
  }

  savePlayerToLocalStorage = (players:any) => {
    localStorage.setItem("players", JSON.stringify(players));
  };

  ngOnInit() {
    const storedPlayers = localStorage.getItem("players");

    if (storedPlayers) {
      this.players = JSON.parse(storedPlayers);
    }
  }

  playerColor() {
    const colors = [
      '#8C6985',
      '#442E5A',
      '#150929',
      '#03010C',
      '#427274',
      '#192B38',
      '#2E5458',
      '#4E7367',
      '#8C0059',
    ];

    const randomColor = Math.floor(Math.random() * colors.length);
    return colors[randomColor];
  }

  addName() {
    const isDupePlayer = this.players.some(player => player.name === this.newName);
    if (!this.newName || isDupePlayer) return;

    // All is well, carry on.
    const newPlayer = {
      name: this.newName,
      color: this.playerColor()
    }
    this.players.push(newPlayer);
    this.newName = '';
    this.savePlayerToLocalStorage(this.players);
  }

  removeName(idx: number) {
    console.log('1 this players: ', this.players);
    this.players.splice(idx, 1);
    console.log('2 this players: ', this.players);
    this.savePlayerToLocalStorage(this.players);
    this.nameEl?.nativeElement.focus();
  }

  startGame() {
    this.router.navigate(['game']);
  }

  deleteAllPlayers() {
    this.players = [];
    localStorage.removeItem("players");
  }

  getPlayerColor(i: number) {
    return this.players[i]['color'];
  }

}

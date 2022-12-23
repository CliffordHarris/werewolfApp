import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {
  newName: string = '';
  players: string[] = [];
  @ViewChild('name') nameEl: ElementRef | undefined;

  constructor(private router: Router) {
    console.log(this.router.url)
  }

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
    localStorage.setItem("players", JSON.stringify(this.players));
  }

  removeName(idx: number) {
    this.players.splice(idx, 1);
    this.nameEl?.nativeElement.focus();
  }

  startGame() {
    this.router.navigate(['game']);
  }

}

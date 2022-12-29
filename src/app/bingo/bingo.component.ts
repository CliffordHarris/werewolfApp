import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from '../local-storage.service';

@Component({
  selector: 'app-bingo',
  templateUrl: './bingo.component.html',
  styleUrls: ['./bingo.component.css']
})
export class BingoComponent {
  // bingoWords = [
  //   "Bag of Toys",
  //   "Snowflake",
  //   "Star",
  //   "Peppermint Candy",
  //   "Rudolph",
  //   "Santa Hat",
  //   "Frosty The Snowman",
  //   "Gingerbread Man",
  //   "Bells",
  //   "Christmas Tree",
  //   "Boy Elf",
  //   "Gingerbread House",
  //   "Santa Claus",
  //   "Girl Elf",
  //   "Mistletoe",
  //   "Santa's Sleigh",
  //   "Penguin",
  //   "Stocking",
  //   "Candy Cane",
  //   "Ornament",
  //   "Christmas Lights",
  //   "Sweater",
  //   "Hot Cocoa",
  //   "Fireplace"
  // ]
  bingoWords = [
    'dan',
    'khou',

    'hue',
    'sandy',
    
    'joe & pakou',

    'shmoe',
    'sheng',

    'alex',
    'iz',

    'lia',
    'sheng',
    'wendy',
    'sher',
  ]

  boardSpots: string[] = [];
  history: string[] = [];
  readyForNextWord: boolean = true;

  constructor(
    private router: Router,
    private localStorage: LocalStorageService
  ) {
    // console.log(this.router.url)
    console.log(this.bingoWords);
    const currRemainingWords = this.localStorage.get('words');
    if (currRemainingWords) {
      this.boardSpots = currRemainingWords as [];
    } else {
      this.shuffleBingoWords();
    }
  }

  shuffleBingoWords() {
    const shuffled = [...this.bingoWords].sort(() => 0.5 - Math.random());
    console.log("Shuffled!", shuffled);
    this.boardSpots = shuffled as [];
    this.localStorage.set('words', this.boardSpots);
  }

  getWord() {
    if (!this.readyForNextWord) return;

    const oneWord = this.boardSpots.splice(0, 1) as any;
    this.history.push(oneWord as string);
    console.log("🚀 ", oneWord)

    // this.setDelay();
  }

  makeNewList() {
    this.shuffleBingoWords();
    this.history = [];
  }

  setDelay() {
    this.readyForNextWord = false;
    console.log("Starting timeout");
    setTimeout(() => {
      console.log("Ending timeout");
      this.readyForNextWord = true;
    }, 5000)
  }
}

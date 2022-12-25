import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Character } from '../interface/character';
import { LocalStorageService } from '../local-storage.service';
import { allCharacters, allEvents, EventObj, werewolfLookup, TimeOfDay, AttackedResult, ActionWordsLookup } from './GameConstants';
import { OpenAIService } from '../open-ai.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})

export class GameComponent implements OnInit {
  allCharacters: Character[] = allCharacters
  werewolfLookup: any = werewolfLookup

  names: string[] = [];
  players: any[] = [];
  playingCards: any[] = [];
  events: EventObj[] = [];
  loggings: any = [];
  connectedPeopleList: any[] = [];

  // allGameEvents: any = {};

  rolesAreHidden: boolean = true; // until after everyones has been told their roles
  gameIsOver: boolean = false;
  dayTime: boolean = false;
  loadingStory = false;
  madeConnection = false;

  timeStartedGame: number = 0;
  STARTING_DAY: number = 0;
  currentDay: number = this.STARTING_DAY;
  countOfDays: number = this.STARTING_DAY;
  idx: number = 1000;

  timeString: string = '';
  story: string = '';
  themes: string = '';
  W = "Werewolf";
  lynchedSoNowRoundIsOver: boolean = false;

  constructor(private router: Router, private local: LocalStorageService, private openAIService: OpenAIService) {
    console.log(this.router.url)
    this.getNames();
    this.setupCards();
  }

  ngOnInit() {
    // this.setupGame();
    // this.events = [...allEvents[this.STARTING_DAY]];
    // this.allGameEvents = {...allEvents};
    this.events = [...allEvents[this.STARTING_DAY]];
    console.log(allEvents[0]);
  }

  getLatestProtector(targetedPlayer: any){
    const allProtectors = targetedPlayer.actionFrom.filter((pl: any) => pl.action === AttackedResult.Protect);
    const protectorOfTargetedPlayer = this.players.filter((p1: any) =>
      allProtectors.map((pr: any) => pr.name)
        .includes(p1.name))
        .sort((a,b) => a.card.isOneTimeUsePower - b.card.isOneTimeUsePower)[0];
    return protectorOfTargetedPlayer;
  }

  kill(player: any, method: string) {
    // player.isDead = true;
    // const protectors = player.actionFrom.filter((p: any) => p.action === AttackedResult.Protect);
    // const protectorOfPlayer = this.players.filter((p1: any) => protectors.map((pr: any) => pr.name)
    //                                                                   .includes(p1.name))
    //                                                                   .sort((a,b) => a.card.isOneTimeUsePower - b.card.isOneTimeUsePower)[0];

    const protectorOfPlayer = this.getLatestProtector(player);
    if(protectorOfPlayer){
      console.log(player.name, "has a Protector:", protectorOfPlayer.name, "... SO BLOCKED BITCH! Muahahaha");
      player.isDead = false;
      player.actionFrom = player.actionFrom.filter((x: any) => x.name !== protectorOfPlayer.name);
    } else {
      player.isDead = true;
      const connected = player.actionFrom.find((x: any) => x.action === AttackedResult.CollateralDamage);
      if(connected){
        const connectedPlayerObj = this.players.find((p: any) => !p.isDead && p.name === connected.name);
        if(connectedPlayerObj) this.kill(connectedPlayerObj, AttackedResult.CollateralDamage);
      }
    }


    this.lynchedSoNowRoundIsOver = this.players.find(player => player.isDead && method === 'Lynching')
    for (let i = 0; i < this.events.length - 1; i++) {
      this.events[i].done = true;
    }
    this.log(`${player.name} killed by ${method}`);
  }

  action(action: string, attacker: any, targetedPlayer: any) {
    attacker.completedAction = true;
    if(attacker?.card?.isWerewolf && attacker?.card?.action === 'Eat'){

      // TODO SORT by weakest protection first like the nightly one from the bodyguard
      // const protectorsOfP1 = targetedPlayer.actionFrom.filter((pl: any) => pl.action === AttackedResult.Protect);
      // const protectorOfP1 = this.players.filter((p1: any) => protectorsOfP1.map((pr: any) => pr.name).includes(p1.name)).sort((a,b) => a.card.isOneTimeUsePower - b.card.isOneTimeUsePower)[0];
      const protectorOfP1 = this.getLatestProtector(targetedPlayer);
      if(protectorOfP1){
        console.log(targetedPlayer.name, "has a Protector:", protectorOfP1);
        targetedPlayer.isDead = false;
        targetedPlayer.actionFrom = targetedPlayer.actionFrom.filter((x: any) => x.name !== protectorOfP1.name);
      } else {
        targetedPlayer.isDead = true;
        const connected = targetedPlayer.actionFrom.find((x: any) => x.action === "CollateralDamage");
        if(connected){
          const connectedPlayerObj = this.players.find((p: any) => p.name === connected.name);
          this.action("", attacker, connectedPlayerObj);
        }
      }
    }

    // this forces 1 kill by all werewolves per round
    if (attacker?.card?.isWerewolf) this.players.filter(werewolf => werewolf.role === this.W).forEach(player => player.completedAction = true);

    // seer
    const actionObjForP1 = {
      name: targetedPlayer.name,
      action: attacker?.card?.effectWhenProctectedIsAttacked,
      text: ActionWordsLookup[attacker.role]?.To,
      extra: attacker.role === "Seer" ? targetedPlayer.card.isWerewolf ? "🐺" : "(V)" : "",
      display: `${attacker.name} ${ActionWordsLookup[attacker.role]?.To} ${targetedPlayer.name} ${attacker?.role === "Seer" ? targetedPlayer.card.isWerewolf ? "🐺" : "(V)" : ""}`
    }
    const actionObjForP2 = {
      name: attacker.name,
      action: attacker?.card?.effectWhenProctectedIsAttacked,
      text: ActionWordsLookup[attacker?.role]?.From,
      display: `${targetedPlayer.name} ${ActionWordsLookup[attacker.role]?.From} ${attacker.name}`
    }
    attacker?.actionTo?.push(actionObjForP1);
    targetedPlayer.actionFrom.push(actionObjForP2);

    // *** bodyguard
    // remove the name when day starts
    // player1.actionTo.push(player2.name);
    // player2.actionFrom.push(player1.name);

    // *** Hunter requires different logic


    // const verb = actionObjForP1.text || action;
    // this.log(`${player1.name} ${verb} ${player2.name}`);
    this.log(actionObjForP1.display);
  }

  addToConnectedList(){
    this.connectedPeopleList = this.players.filter(x => x.connected);
  }

  connect2People(){
    const list = this.connectedPeopleList.map(x => {return {
      name: x.name,
      role: x.role
    }});

    let firstPlayer = this.players.find(x => list[0].name === x.name && list[0].role === x.role);
    let secondPlayer = this.players.find(x => list[1].name === x.name && list[1].role === x.role);
    let cupidPlayer = this.players.find(x => x.card.action === "Connect");

    const actionObjForP1 = {
      name: secondPlayer.name,
      action: AttackedResult.CollateralDamage,
      text: ActionWordsLookup["Cupid"]?.To,
      display: `${firstPlayer.name} ${ActionWordsLookup["Cupid"]?.To} ${secondPlayer.name}`
    };
    const actionObjForP2 = {
      name: firstPlayer.name,
      action: AttackedResult.CollateralDamage,
      text: ActionWordsLookup["Cupid"]?.To,
      display: `${secondPlayer.name} ${ActionWordsLookup["Cupid"]?.To} ${firstPlayer.name}`
    };
    const actionObjForCupid = {
      name: cupidPlayer.name,
      action: AttackedResult.Nothing,
      text: ActionWordsLookup["Cupid"]?.From,
      display: `You ${ActionWordsLookup["Cupid"]?.From} ${firstPlayer.name} to ${secondPlayer.name} `
    };
    firstPlayer.actionFrom.push(actionObjForP1);
    secondPlayer.actionFrom.push(actionObjForP2);
    cupidPlayer.actionTo.push(actionObjForCupid);

    this.madeConnection = true;
    cupidPlayer.completedAction = this.madeConnection;
    // firstPlayer.actionFrom.push(cupid);
    // secondPlayer.actionFrom.push(cupid);

  }

  updateTime() {
    const oneSec = 1000;
    this.timeStartedGame = Date.now();
    setInterval(() => {
      let timeDiff = (Date.now() - this.timeStartedGame)/1000;
      let seconds = Math.floor(timeDiff % 60);
      let secondsAsString = seconds < 10 ? "0" + seconds : seconds;
      timeDiff = Math.floor(timeDiff / 60);
      let minutes = Math.floor(timeDiff % 60)
      let minutesAsString = minutes < 10 ? "0" + minutes : minutes;
      this.timeString = `${minutesAsString}:${secondsAsString}`;
    }, oneSec);
  }

  markDone(idx: number, skip = false) {
    let allEvts = [...allEvents[this.currentDay]];
    if(this.countOfDays > 1){
      allEvts = [...allEvts.filter((x: EventObj) => x.happensDaily)];
    }

    const currentEvent = allEvts[idx];
    if (currentEvent.msg === "Accuse" && skip) {
      allEvts.filter(a => a.group === currentEvent.msg).forEach((x: EventObj) => {
        x.done = true;
      });
    }

    const allWithPowers = this.players.filter(a => a.card.action && !a.completedAction);
    const listOfRolesWithPowers = [...new Set(this.players.filter(a => !a.isDead && a.card.action && !a.completedAction && !a.card.isPassivePower).map(a => a.role))];
    if(currentEvent.checkForSpecialPowers && listOfRolesWithPowers.length > 1){
      if(allWithPowers.length > 1){
        console.log(`${listOfRolesWithPowers.length} people let to do their tasks`);
      }
      return;
    }

    currentEvent.done = true;
    let message = currentEvent.msg;
    if(message === "You show everyone their roles") this.hideRoles();
    if(message === "Start the day") this.updateTime();
    if(message === "Accuse" && skip) message = `Skip ${message}`;

    // TODO Turn this on later
    // this.getStoryLine(message);

    this.log(message);

    const remaining = allEvts.filter(x => !x.done).length;
    console.log("Remaining", remaining);
    if (remaining === 0) {
      if (this.isGameOver()) {
        // Show end of game template
        // Announce winners
        this.gameIsOver = true;
        console.log("Game Over. Werewolves win.");
      } else {
        this.beginNextEvent();
      }
    }
  }

  isGameOver() {
    const werewolfCount = this.players.filter(x => x.card.isWerewolf && !x.isDead);
    const villagerCount = this.players.filter(x => !x.card.isWerewolf && !x.isDead);
    if (werewolfCount.length > 0 && villagerCount.length > 0) {
      const wereWolfScore = werewolfCount.map(x => x.card.gameValue).reduce((a, c) => a + c);
      const villagerScore = villagerCount.map(x => x.card.gameValue).reduce((a, c) => a + c);
      return wereWolfScore >= villagerScore;
    }
    return false;
  }

  beginNextEvent() {
    this.countOfDays++;
    this.changeDay();
    let events = [...allEvents[this.currentDay]];
    this.lynchedSoNowRoundIsOver = false;
    // Reset events and players' completed actions
    events.forEach(event => event.done = false);
    if (!this.dayTime) {
      this.players.forEach(p => {
        p.completedAction = false;
        if (p.card.isOneTimeUsePower) {
          p.completedAction = this.madeConnection;
        }
      });
    }
    if (this.countOfDays > 1) {
      events = [...events.filter((x: EventObj) => x.happensDaily)];
    }
    this.events = [...events];
    console.log("Keep Playing Game");
  }

  changeDay() {
    this.dayTime = !this.dayTime;
    if(this.currentDay === 0) {
      this.currentDay = 1;
    } else {
      this.currentDay = this.dayTime ? TimeOfDay.Day : TimeOfDay.Night;
    }
  }

  getStoryLine(msg: string){
    if(msg === "Everyone Wake Up!") {
      let prompt = "generate an intro to ultimate werewolf game";
      prompt = "generate an short dramatic intro to ultimate werewolf game in 2nd person";

      this.loadingStory = true;
      this.openAIService.generateText(prompt).then(resp => {
        this.getThemes();
        console.log(resp);
        this.story = resp;
        this.loadingStory = false;
      })
    }
  }

  getThemes(){
    let prompt = "short list of 5 awesome places to set the story line of ultimate werewolf";
    this.openAIService.generateText(prompt).then(resp => {
      console.log(resp);
      const someThemes = resp.replace(/^\n*/, '');
      this.themes = someThemes;
    })
  }
  getEventsForTimeOfDay(day: boolean = true) {
    if (day) {
      // Lynch
      // Vote
      // Defend

      // return []
    } else {
      // First Time Powers
      // Nightly Powers
      // Maybe check on other powers
      // Werewolves

      // return []
    }
  }

  goTo(route: string) {
    this.router.navigate([route]);
  }

  usePower(power: string) {
    console.log(power);
  }

  showOne(i: number) {
    // if (!this.rolesAreHidden) this.hideRoles();
    this.idx = this.idx === i ? 100 : i;
  }

  hideRoles() {
    console.log("Toggle roles");
    this.rolesAreHidden = !this.rolesAreHidden;
    this.idx = 1000;
  }

  setupGame(): void {
    this.players = [];
    this.events = [];
    this.events = [...allEvents[this.STARTING_DAY]];
    const names = this.getMultipleRandom(this.names, this.names.length);
    this.setRole(names)
    this.log("Started game");
  }

  loadGame() {
    const loaded = this.local.get(this.W);
    console.log(loaded);
    this.players = loaded;
  }

  setRole(arr: any[]): void {
    arr.forEach((n, i) => {
      this.players.push({
        name: n,
        role: this.playingCards[i].name,
        card: this.playingCards[i],
        actionTo: [], // TODO maybe remove
        actionFrom: [] // TODO maybe remove
      })
    }
    );
    this.local.set(this.W, this.players);
    console.table(this.players);
  }

  setupCards() {
    const numOfWerewolves = this.werewolfLookup[this.names.length];

    for (let i = 0; i < numOfWerewolves; i++) {
      const werewolf = this.allCharacters.find(character => character.isWerewolf);
      this.playingCards.push(werewolf);
    }
    const nonWerewolvesCount = this.names.length - numOfWerewolves;
    const special = this.allCharacters.filter(character => character.oneOnly);
    if (special.length < nonWerewolvesCount) {
      this.playingCards.unshift(...special);
      const villagerCount = nonWerewolvesCount - special.length;
      for (let i = 0; i < villagerCount; i++) {
        this.playingCards.unshift(this.allCharacters.find(character => character.name === 'Villager'));
      }
    } else {
      this.playingCards.unshift(...this.getMultipleRandom(special, nonWerewolvesCount));
    }
    console.table(this.playingCards);
  }

  getMultipleRandom(arr: any[], num: number) {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, num);
  }

  getNames(): void {
    const names = localStorage.getItem('players');
    if (names) {
      this.names = JSON.parse(names);
    }
  }

  log(val: any) {
    this.loggings.unshift({
      msg: val,
      time: new Date().toISOString()
    });
    console.log("%c Logged:", "background: yellow", new Date().toISOString(), val);
  }
  // Enter number of names ✅
  // Enter player names ✅
  // Narrator ✅
  // Randomly assign Characters to Players ✅
  // Manage state so players don't get reassigned ✅
  // Show role to players ✅
  // Use OpenAI to generate story ✅
  // Let werewolves know each other ✅
  // Suggest several settings ✅
  // Timer for Day time ✅
  // Add night timer
  // Vote and Defense Timers
  // Skip accuse ✅

  // Loop per round for all special players

  // Log events from each round and summarize ✅
  // Determine winner and predict winner based on decisions
  //
}

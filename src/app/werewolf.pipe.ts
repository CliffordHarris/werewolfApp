import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'werewolf'
})
export class WerewolfPipe implements PipeTransform {

  transform(allPlayers: any[], prop = 'isWerewolf', exclude = true): any[] {
    return allPlayers.filter(p => p.card[prop] === exclude);
  }

}

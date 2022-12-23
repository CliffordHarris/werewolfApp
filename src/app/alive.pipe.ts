import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'alive',
  pure: false
})
export class AlivePipe implements PipeTransform {
  transform(allPlayers: any[], actual = true): any[] {
    return allPlayers.filter(p => !p.isDead === actual);
  }
}
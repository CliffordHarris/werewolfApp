import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  public get(key: string): any {
    const str = localStorage.getItem(key);
    if(str){
      return JSON.parse(str);
    } else {
      return;
    }
    return null;
  }

  public set(key: string, value: any): void {
    const obj = JSON.stringify(value);
    localStorage.setItem(key, obj);
  }
}

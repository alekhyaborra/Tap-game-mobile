import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(private storage: Storage) {
    this.init();
  }

   init() {
     this.storage.create();
  }

  set(key: string, value: any) {
     this.storage.set(key, value);
  }

  get(key: string) {
    const value = this.storage.get(key);
    return value;
  }

  remove(key: string) {
   this.storage.remove(key);
  }

  async clear() {
    await this.storage.clear();
  }
}

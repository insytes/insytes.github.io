const DB_NAME = 'shootoutdb';
const DB_VERSION = 1;
let DB: IDBDatabase;

const settings = {
  state:{
  limitedTime: 5,
  gameDuration: {
    hour: 0,
    minute: 10,
    second: 0,
  },
  shotDuration: {
    hour: 0,
    minute: 0,
    second: 15,
  },
  shotDurationLimited: {
    hour: 0,
    minute: 0,
    second: 10,
  },
  sounds: {
    playBeep: true,
    playShotClockBuzzer: true,
    playLimitedShotClockVoice: true,
    playFinalMinuteVoice: true,
    playGameOverVoice: true,
    playGameOverBuzzer: true,
  }
}
} as Record<string, any>

export default class Settings {
  static init() {
    return new Promise((resolve, reject) => {
      const request = window.indexedDB.open(DB_NAME, DB_VERSION);
      let install = false;
      request.onerror = e => {
        reject('Error');
      };

      request.onsuccess = e => {
        console.log(e);
        DB = request.result;
        const trans = DB.transaction(['settings'], 'readwrite');
        const store = trans.objectStore('settings');
        trans.oncomplete = resolve;
        if (install) {
          store.put({ id: 1, ...settings.state });
          install = false;
        } else {
          const objectStoreRequest = store.get(1);
          objectStoreRequest.onsuccess = (event) => {
            settings.state = objectStoreRequest.result
            resolve(DB);
          };
        }
      };

      request.onupgradeneeded = e => {
        const db = request.result;
        db.createObjectStore("settings", { autoIncrement: true, keyPath: 'id' });
        install = true;
      };

    });
  }

  static reset() {
    return new Promise<void>((resolve, reject) => {
      const DBDeleteRequest = window.indexedDB.deleteDatabase(DB_NAME);
      DBDeleteRequest.onerror = () => {
        console.log('Could not deelte DB');
        reject();
      }
      DBDeleteRequest.onsuccess = () => {
        console.log('DB deleted')
        resolve();
      };
      DBDeleteRequest.onblocked = () => {
        console.log('DB delete blocked');
        reject();
      }
    });
  }

  static get db() {
    return DB;
  }

  static get settings() {
    return settings.state
  }

  static save() {
    return new Promise<void>(resolve => {
      const trans = Settings.db.transaction(['settings'], 'readwrite');
      trans.oncomplete = () => {
        resolve();
      }
      const store = trans.objectStore('settings');
      store.put({ id: 1, ...settings.state });
    });
  }
}

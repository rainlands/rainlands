import { extendObservable } from 'mobx'


export default class WorldStore {
  constructor() {
    extendObservable(this, {
      settings: {
        ...this.restoreSettingsFromLocalStorage(),
      },
    })
  }

  restoreSettingsFromLocalStorage = () => {}
}

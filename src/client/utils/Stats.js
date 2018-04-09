import Statsjs from 'stats.js'


export default class Stats {
  constructor() {
    const stats = new Statsjs()

    stats.showPanel(0)

    document.body.appendChild(stats.dom)

    this.stats = stats
  }

  begin = () => this.stats.begin()

  end = () => this.stats.end()
}

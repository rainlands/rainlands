import Statsjs from 'stats-js';

export default class Stats {
  constructor() {
    const stats = new Statsjs();

    stats.setMode(0);

    stats.domElement.style.position = 'absolute';
    stats.domElement.style.right = '0px';
    stats.domElement.style.top = '0px';
    stats.domElement.style.zIndex = '5';

    document.body.appendChild(stats.domElement);

    this.stats = stats;
  }

  begin = () => this.stats.begin();

  end = () => this.stats.end();
}

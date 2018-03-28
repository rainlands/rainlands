import Stats from 'stats-js';
import { GAME_ROOT } from '@root/constants';

export default () => {
  const stats = new Stats();
  stats.setMode(0);

  // Align top-left
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.left = '0px';
  stats.domElement.style.top = '0px';

  GAME_ROOT.appendChild(stats.domElement);

  return stats;
};

import Renderer from '@core/renderer';
import Scene from '@core/scene';
import Player from '@core/player';

import { stats, createRandomMap, renderMap, controls, lights } from '@utils';
import blocks from '@resources/blocks';

// constants
import { GAME_ROOT } from '!constants';

export default class Game {
  constructor() {
    this.blocks = blocks;

    this.stats = stats();

    this.renderer = Renderer();
    this.scene = Scene();
    this.player = Player(0, 20, 0);
  }

  // /////////////
  // INTERNALS //
  // /////////////

  _tick = () => {
    this.stats.begin();

    requestAnimationFrame(this._tick);

    controls.animateMovementTick(this.player);

    this.renderer.render(this.scene, this.player);

    this.stats.end();
  };

  // //////////////////
  // PUBLIC METHODS //
  // //////////////////

  addElementsToScene = (elementsArray) => {
    elementsArray.forEach(e => this.scene.add(e));
  };

  generateMap = () => {
    this.map = createRandomMap({
      seed: Math.floor(Math.random() * (65536 - 1 + 1) + 1), // 1 - 65536
      size: 8,
      depth: 20,
    });

    this.addElementsToScene(renderMap(this.map, this.blocks));
  };
  start = () => {
    controls.initializeControls(this.player);
    this.addElementsToScene(lights.createLights());

    GAME_ROOT.appendChild(this.renderer.domElement);

    this._tick();
  };
}

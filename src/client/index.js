import GameClient from './Client'
import './ui'


const gameClient = new GameClient({
  container: document.querySelector('#game_root'),
})

gameClient.animate()

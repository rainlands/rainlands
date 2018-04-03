import GameClient from './Client'
import './interface'


const gameClient = new GameClient({
  container: document.querySelector('#game_root'),
})

gameClient.animate()

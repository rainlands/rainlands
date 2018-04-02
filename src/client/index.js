import Client from './Client';

const client = new Client({
  container: document.querySelector('#game_root'),
});

client.animate();

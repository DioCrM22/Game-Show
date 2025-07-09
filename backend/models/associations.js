// backend/models/associations.js
import Player from './Player.js';
import Hero from './Hero.js';
import Battle from './Battle.js';

export default function setupAssociations() {
  Player.associate({ Hero, Battle });
  Hero.associate({ Player });
  Battle.associate({ Player });
}
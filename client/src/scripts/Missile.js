import { game } from './Game';
import { media } from './Media';
import { SHIP_INIT_OFFSET_Y, SHIP_WIDTH } from './Ship';
import { Sprite } from './Sprite';

const MISSILE_HEIGHT = 25;
const MISSILE_INIT_OFFSET_Y = SHIP_INIT_OFFSET_Y - MISSILE_HEIGHT;
const MISSILE_INIT_SPRITE_NUMBER = 0;
const MISSILE_WIDTH = 13;

export class Missile extends Sprite {
  constructor() {
    super(media.missileImg, MISSILE_WIDTH, MISSILE_HEIGHT, MISSILE_INIT_SPRITE_NUMBER, {
      x: game.ship.offset.x + SHIP_WIDTH / 2 - MISSILE_WIDTH / 2,
      y: MISSILE_INIT_OFFSET_Y,
    });
  }

  draw() {
    super.draw();
  }

  animate() {
    this.offset = { ...this.offset, y: this.offset.y - 5 };
  }

  static generateMissiles() {
    const missile = new Missile();
    game.missiles.push(missile);
  }
}
